import type { OpenAI } from "../openai";
import { hostOf } from "../openai";
import { QUESTION_COUNT } from "../config";
import { noDashes } from "../scoring";
import { htmlToText } from "../html";
import type { Emit, Source, StoreContext, VisibilityQuestion, VisibilitySection } from "../types";
import { checkSources } from "./sources";
import { isNonBrand } from "../nonbrands";

const N = QUESTION_COUNT;

/** A question's result before its sources are checked. */
type Asked = Omit<VisibilityQuestion, "sources"> & { sources: Source[] };

const QUESTIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          product: { type: "integer", description: "1 based number of the product the question is about." },
          question: { type: "string" },
        },
        required: ["product", "question"],
      },
    },
  },
  required: ["questions"],
};

const PARSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    answers: {
      type: "array",
      description: "One entry per answer, in the order given.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          brands: {
            type: "array",
            description: "Every brand, store or site the answer names as a place or product to buy, in the order they appear.",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                kind: {
                  type: "string",
                  enum: ["brand", "retailer", "publisher"],
                  description:
                    "brand: a company that makes and sells its own products. retailer: a store or marketplace that sells " +
                    "other brands' products (Amazon, Target, Etsy, Sephora). publisher: media, a magazine or a review site " +
                    "(Wirecutter, Good Housekeeping, Consumer Reports).",
                },
              },
              required: ["name", "kind"],
            },
          },
          mentioned: { type: "boolean", description: "True if the target brand is recommended or named." },
          position: { type: ["integer", "null"], description: "1 based position of the target brand among the brands of kind brand, or null if absent." },
          clarifying: {
            type: "boolean",
            description: "True if the answer asks the shopper for more details instead of recommending specific products or brands.",
          },
        },
        required: ["brands", "mentioned", "position", "clarifying"],
      },
    },
  },
  required: ["answers"],
};

const REWRITE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: { question: { type: "string" } },
  required: ["question"],
};

type Named = string | { name?: string; kind?: string };
type Parsed = { brands: Named[]; mentioned: boolean; position: number | null; clarifying: boolean };

/**
 * Only real competing product brands: the parser's kind must be brand (a plain string counts as one),
 * and the name must not be a retailer, marketplace, publisher or review site on the deny list.
 * The store's own brand always stays.
 */
export function productBrands(list: Named[] | undefined, ctx: StoreContext): string[] {
  const out: string[] = [];
  for (const b of list ?? []) {
    const name = String(typeof b === "string" ? b : (b?.name ?? "")).trim();
    const kind = typeof b === "string" ? "brand" : (b?.kind ?? "brand");
    if (!name) continue;
    const own = sameBrand(name, ctx.brand, ctx.domain);
    if (!own && (kind !== "brand" || isNonBrand(name))) continue;
    if (!out.some((x) => norm(x) === norm(name))) out.push(name);
  }
  return out;
}

/** Questions are shown on the page: no dashes, and hyphenated words ("plant-based") become two words. */
const plainQuestion = (q: string) => noDashes(q).replace(/([A-Za-z0-9])-(?=[A-Za-z0-9])/g, "$1 ");

const clip = (s: string | null | undefined, n: number) => (s ?? "").replace(/\s+/g, " ").trim().slice(0, n);

/**
 * Plain facts about each top product for the question writer, from the store's own product data.
 * `descLen` is longer for a rewrite. Questions are never written without products.
 */
function productBrief(ctx: StoreContext, n: number, descLen = 240): { title: string; line: string }[] {
  return ctx.top.slice(0, n).map((p) => {
    const price = p.variants?.find((v) => v?.price)?.price;
    const desc = clip(htmlToText(p.body_html ?? ""), descLen);
    return {
      title: clip(p.title, 120),
      line: [clip(p.title, 120), p.product_type ? `type: ${clip(p.product_type, 60)}` : "", price ? `price: ${price}` : "", desc]
        .filter(Boolean)
        .join(" | "),
    };
  });
}

/** One SMALL_MODEL call that lists the brands each answer recommends. Null when the call failed. */
export async function parseAnswers(ai: OpenAI, ctx: StoreContext, answers: (string | null)[]): Promise<Parsed[] | null> {
  try {
    const res = await ai.structured<{ answers: Parsed[] }>({
      name: "brand_parse",
      schema: PARSE_SCHEMA,
      maxOutputTokens: 800,
      system:
        "You extract product recommendations from ChatGPT answers. For each answer, list every brand, store or site it " +
        "names as a product or place to buy, in order of first appearance, without duplicates, and label each one: " +
        "brand (makes its own products), retailer (a store or marketplace selling other brands) or publisher (media or " +
        "a review site). Use the brand name only, not product names. Then say whether the target brand appears and its " +
        "1 based position among the brands, and whether the answer asks the shopper for more details instead of " +
        "recommending anything. Return one entry per answer, in order.",
      user:
        `Target brand: ${ctx.brand} (website ${ctx.domain})\n\n` +
        answers.map((a, i) => `ANSWER ${i + 1}:\n${a ? a.slice(0, 4000) : "(no answer)"}`).join("\n\n"),
    });
    return res.answers ?? [];
  } catch (e) {
    console.error("brand parse failed, using text match only", e instanceof Error ? e.message : String(e));
    return null;
  }
}

/**
 * A usable answer recommends something: it names at least one brand (or the store) and isn't a
 * clarifying question. When the parse call failed, any answer counts, as before.
 */
function usable(answer: string | null, p: Parsed | undefined, parseFailed: boolean, ctx: StoreContext): boolean {
  if (!answer) return false;
  if (parseFailed) return true;
  if (!p || p.clarifying) return false;
  // An answer that only names retailers or review sites doesn't say which brand to buy.
  return productBrands(p.brands, ctx).length > 0 || !!p.mentioned || textMentions(answer, ctx.brand, ctx.domain);
}

export async function runVisibility(
  ctx: StoreContext,
  ai: OpenAI,
  emit: Emit,
  signal?: AbortSignal,
): Promise<VisibilitySection> {
  emit({ type: "progress", step: "visibility", message: "Writing buyer questions from your top products" });
  const brief = productBrief(ctx, N);
  if (!brief.length) throw new Error("we couldn't read your products to build questions from. The store may be limiting automated visits.");
  const detail = productBrief(ctx, N, 700);
  const { questions: raw } = await ai.structured<{ questions: { product: number; question: string }[] }>({
    name: "buyer_questions",
    schema: QUESTIONS_SCHEMA,
    maxOutputTokens: 600,
    system:
      "You write the questions real shoppers type into ChatGPT when they want to buy a product like one of these. " +
      "Each question describes the need, use or problem the product solves, the way a person talks: casual, specific, " +
      "often with a personal detail or constraint (budget, skin type, use case, size). Each question must ask what to buy, " +
      "so the answer names products or brands. Never name any brand, store or product name. Do not use dashes.",
    user:
      `Products:\n${brief.map((b, i) => `${i + 1}. ${b.line}`).join("\n")}\n\n` +
      `Do not mention "${ctx.brand}" or ${ctx.domain}.\n` +
      `Example style: "I have sensitive skin and fragrance makes it worse, what's a good natural moisturizer?"\n` +
      `Write exactly ${N} questions, ` +
      (brief.length >= N ? "one for each product." : `covering every product, with different angles where a product gets more than one.`),
  });
  // Questions are shown on the page, so dashes become commas to match the site's copy rules.
  const qs = (raw ?? [])
    .map((q) => {
      const idx = Math.min(Math.max((Number(q?.product) || 1) - 1, 0), brief.length - 1);
      return { question: plainQuestion(String(q?.question ?? "")), product: brief[idx].title, idx };
    })
    .filter((q) => q.question)
    .slice(0, N);
  if (qs.length < N) throw new Error(`question writing returned fewer than ${N} questions`);

  // One progress line per question, each ticked off (by id) as its answer comes back.
  qs.forEach((q, i) => emit({ type: "progress", step: "visibility", id: `q${i}`, message: `Asking ChatGPT: ${q.question}` }));
  const searched = await Promise.allSettled(
    qs.map((q, i) => ai.search(q.question, "buyer").finally(() => emit({ type: "tick", id: `q${i}` }))),
  );
  if (!searched.some((r) => r.status === "fulfilled")) throw new Error("all search calls failed");

  // One call reads every answer and lists the brands each one recommends.
  const answers = searched.map((r) => (r.status === "fulfilled" ? r.value : null));
  const first = await parseAnswers(ai, ctx, answers.map((a) => a?.answer ?? null));
  const parsed: (Parsed | undefined)[] = qs.map((_, i) => first?.[i]);

  // A clarifying question or an answer with no brands says nothing about who ChatGPT recommends.
  // Each gets one rewrite with more product detail; if that still fails, it is left out of the score.
  const retry = qs.map((_, i) => i).filter((i) => !usable(answers[i]?.answer ?? null, parsed[i], first === null, ctx));
  const retried = new Set<number>();
  if (retry.length && !signal?.aborted) {
    retry.forEach((i) => emit({ type: "progress", step: "visibility", id: `r${i}`, message: "Asking again with more product detail" }));
    const rewrites = await Promise.allSettled(
      retry.map(async (i) => {
        const { question } = await ai.structured<{ question: string }>({
          name: "rewrite_question",
          schema: REWRITE_SCHEMA,
          maxOutputTokens: 200,
          system:
            "A shopper asked ChatGPT this question, but the answer asked for more details or named no products. Rewrite " +
            "it as one question that includes the details ChatGPT needs to recommend specific products: what the product " +
            "is, who it's for, key features and a price range. Keep it casual, the way a person types. It must ask what to " +
            "buy. Never name any brand, store or product name. Do not use dashes.",
          user:
            `Original question: ${qs[i].question}\n` +
            `Product it is about: ${detail[qs[i].idx]?.line ?? brief[qs[i].idx].line}\n` +
            `Do not mention "${ctx.brand}" or ${ctx.domain}.`,
        });
        const q = plainQuestion(String(question ?? ""));
        if (!q) throw new Error("empty rewrite");
        return { i, q, a: await ai.search(q, "buyer") };
      }),
    );
    const done = rewrites.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
    retry.forEach((i) => emit({ type: "tick", id: `r${i}` }));
    if (done.length) {
      const again = await parseAnswers(ai, ctx, done.map((d) => d.a.answer));
      done.forEach((d, j) => {
        qs[d.i].question = d.q;
        answers[d.i] = d.a;
        parsed[d.i] = again?.[j];
        retried.add(d.i);
        // A rewrite whose parse failed can't be checked, so it stays out of the score.
        if (again === null) parsed[d.i] = { brands: [], mentioned: false, position: null, clarifying: true };
      });
    }
  }
  const excluded = new Set(retry.filter((i) => !retried.has(i) || !usable(answers[i]?.answer ?? null, parsed[i], false, ctx)));

  const asked: Asked[] = qs.map(({ idx: _idx, ...q }, i) => {
    const a = answers[i];
    const flags = { ...(retried.has(i) ? { retried: true } : {}), ...(excluded.has(i) ? { excluded: true } : {}) };
    if (!a) return { ...q, mentioned: false, position: null, cited: false, brands: [], answer: "", sources: [], ...flags };
    return { ...q, ...resolve(a.answer, a.sources, parsed[i], ctx), ...flags };
  });

  emit({ type: "progress", step: "visibility", id: "src", message: "Checking whether you appear in the sources AI cited" });
  const checked = await checkSources(
    asked.map((q) => q.sources),
    ctx,
    signal,
  ).finally(() => emit({ type: "tick", id: "src" }));
  const out: VisibilityQuestion[] = asked.map((q, i) => ({ ...q, sources: checked.perQuestion[i] }));
  const scored = out.filter((q) => !q.excluded);
  const per = scored.map((q) => {
    if (!q.mentioned) return 0;
    let s = q.position === 1 ? 1 : q.position !== null && q.position <= 3 ? 0.8 : 0.6;
    if (q.cited) s = Math.min(1, s + 0.1);
    return s;
  });
  // With nothing scored, total is 0 and the overall score leaves this section out.
  const score = scored.length ? Math.round((per.reduce((a, b) => a + b, 0) / scored.length) * 100) : 0;
  return { score, mentioned: scored.filter((q) => q.mentioned).length, total: scored.length, asked: out.length, questions: out, sources: checked.summary };
}

/** Combines the model's brand list with a text match backstop. */
function resolve(
  answer: string,
  sources: Source[],
  parsed: Parsed | undefined,
  ctx: StoreContext,
): Omit<Asked, "question" | "product"> {
  const cited = sources.some((s) => {
    const h = hostOf(s.url).toLowerCase();
    return h === ctx.domain || h.endsWith("." + ctx.domain);
  });
  let brands = productBrands(parsed?.brands, ctx).slice(0, 15);
  let mentioned = !!parsed?.mentioned;
  let position = parsed && Number.isInteger(parsed.position) && parsed.position! > 0 ? parsed.position : null;

  // Backstop: case insensitive name or domain match in the answer text and brand list.
  const idx = brands.findIndex((b) => sameBrand(b, ctx.brand, ctx.domain));
  if (idx >= 0) {
    mentioned = true;
    position = idx + 1;
  } else if (textMentions(answer, ctx.brand, ctx.domain)) {
    mentioned = true;
    if (position === null) position = positionInText(answer, brands, ctx.brand, ctx.domain);
  }
  if (!mentioned) position = null;
  if (mentioned && position === null) position = brands.length + 1;
  brands = brands.slice(0, 15);
  return { mentioned, position, cited, brands, answer: trimAnswer(answer), sources: sources.slice(0, 8) };
}

export function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function sameBrand(candidate: string, brand: string, domain: string): boolean {
  const c = norm(candidate);
  const b = norm(brand);
  const d = norm(domain.split(".")[0]);
  return !!c && (c === b || c === d || (b.length >= 4 && c.includes(b)) || (d.length >= 4 && c.includes(d)));
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function textMentions(answer: string, brand: string, domain: string): boolean {
  const a = answer.toLowerCase();
  if (a.includes(domain.toLowerCase())) return true;
  if (brand.length < 3) return false;
  return new RegExp(`(^|[^a-z0-9])${escapeRe(brand.toLowerCase())}([^a-z0-9]|$)`).test(a);
}

/** Position of the brand among listed brands by first appearance in the text. */
function positionInText(answer: string, brands: string[], brand: string, domain: string): number {
  const a = answer.toLowerCase();
  const own = Math.min(
    ...[brand.toLowerCase(), domain.toLowerCase()].map((x) => (a.indexOf(x) >= 0 ? a.indexOf(x) : Infinity)),
  );
  const before = brands.filter((b) => {
    const i = a.indexOf(b.toLowerCase());
    return i >= 0 && i < own;
  }).length;
  return before + 1;
}

function trimAnswer(s: string): string {
  if (s.length <= 1200) return s;
  const cut = s.slice(0, 1200);
  const sp = cut.lastIndexOf(" ");
  return (sp > 1000 ? cut.slice(0, sp) : cut) + "...";
}
