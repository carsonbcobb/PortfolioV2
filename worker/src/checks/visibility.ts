import type { OpenAI } from "../openai";
import { hostOf } from "../openai";
import { QUESTION_COUNT } from "../config";
import { noDashes } from "../scoring";
import type { Emit, Source, StoreContext, VisibilityQuestion, VisibilitySection } from "../types";
import { checkSources } from "./sources";

const N = QUESTION_COUNT;
const WORDS = ["zero", "one", "two", "three", "four", "five"];

/** A question's result before its sources are checked. */
type Asked = Omit<VisibilityQuestion, "sources"> & { sources: Source[] };

const QUESTIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    questions: { type: "array", items: { type: "string" } },
  },
  required: ["questions"],
};

const PARSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    brands: {
      type: "array",
      items: { type: "string" },
      description: "Brand or store names the answer recommends, in the order they appear.",
    },
    mentioned: { type: "boolean", description: "True if the target brand is recommended or named." },
    position: {
      type: ["integer", "null"],
      description: "1 based position of the target brand in brands, or null if absent.",
    },
  },
  required: ["brands", "mentioned", "position"],
};

export async function runVisibility(
  ctx: StoreContext,
  ai: OpenAI,
  emit: Emit,
  signal?: AbortSignal,
): Promise<VisibilitySection> {
  emit({ type: "progress", step: "visibility", message: `Writing ${N} buyer questions for your category` });
  const productHints = ctx.products
    .map((p) => p.title)
    .filter(Boolean)
    .slice(0, 10)
    .join("; ");
  const { questions: raw } = await ai.structured<{ questions: string[] }>({
    name: "buyer_questions",
    schema: QUESTIONS_SCHEMA,
    system:
      "You write realistic questions that shoppers type into ChatGPT when they want a product recommendation. " +
      "Write them the way real people talk: casual, specific, often with a personal detail or constraint " +
      "(budget, skin type, use case, a problem they have). Each question must ask which product or brand to buy, " +
      `so the answer names brands. Do not use dashes. Never mention any specific brand or store. Vary the angle across the ${WORDS[N] ?? N} questions.`,
    user:
      `Product category: ${ctx.category}\n` +
      (productHints ? `Example products sold in this category (for context only): ${productHints}\n` : "") +
      `Do not mention "${ctx.brand}" or ${ctx.domain}.\n` +
      `Example style: "I have sensitive skin and fragrance makes it worse, what's a good natural moisturizer?"\n` +
      `Return exactly ${N} questions.`,
  });
  // Questions are shown on the page, so dashes become commas to match the site's copy rules.
  const questions = raw.map((q) => noDashes(String(q))).filter(Boolean).slice(0, N);
  if (questions.length < N) throw new Error(`question writing returned fewer than ${N} questions`);

  // One progress line per question, each ticked off (by id) as its answer comes back.
  questions.forEach((q, i) => emit({ type: "progress", step: "visibility", id: `q${i}`, message: `Asking ChatGPT: ${q}` }));
  const results = await Promise.allSettled(
    questions.map((q, i) => askOne(q, ctx, ai).finally(() => emit({ type: "tick", id: `q${i}` }))),
  );
  const ok = results.filter((r): r is PromiseFulfilledResult<Asked> => r.status === "fulfilled");
  if (ok.length === 0) throw new Error("all search calls failed");

  // Questions whose search failed are kept as not mentioned so the total stays the same.
  const asked: Asked[] = results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : { question: questions[i], mentioned: false, position: null, cited: false, brands: [], answer: "", sources: [] },
  );

  emit({ type: "progress", step: "visibility", id: "src", message: "Checking whether you appear in the sources AI cited" });
  const checked = await checkSources(
    asked.map((q) => q.sources),
    ctx,
    signal,
  ).finally(() => emit({ type: "tick", id: "src" }));
  const out: VisibilityQuestion[] = asked.map((q, i) => ({ ...q, sources: checked.perQuestion[i] }));
  const per = out.map((q) => {
    if (!q.mentioned) return 0;
    let s = q.position === 1 ? 1 : q.position !== null && q.position <= 3 ? 0.8 : 0.6;
    if (q.cited) s = Math.min(1, s + 0.1);
    return s;
  });
  const score = Math.round((per.reduce((a, b) => a + b, 0) / out.length) * 100);
  return { score, mentioned: out.filter((q) => q.mentioned).length, total: N, questions: out, sources: checked.summary };
}

async function askOne(question: string, ctx: StoreContext, ai: OpenAI): Promise<Asked> {
  const { answer, sources } = await ai.search(question, "buyer");
  const cited = sources.some((s) => {
    const h = hostOf(s.url).toLowerCase();
    return h === ctx.domain || h.endsWith("." + ctx.domain);
  });

  let brands: string[] = [];
  let mentioned = false;
  let position: number | null = null;
  try {
    const parsed = await ai.structured<{ brands: string[]; mentioned: boolean; position: number | null }>({
      name: "brand_parse",
      schema: PARSE_SCHEMA,
      system:
        "You extract product recommendations from a ChatGPT answer. List the brands or stores the answer " +
        "recommends, in order of first appearance, without duplicates. Use the brand name only, not product names. " +
        "Then say whether the target brand appears and its 1 based position in your list.",
      user: `Target brand: ${ctx.brand} (website ${ctx.domain})\n\nAnswer:\n${answer.slice(0, 6000)}`,
    });
    brands = (parsed.brands ?? []).map((b) => String(b).trim()).filter(Boolean).slice(0, 15);
    mentioned = !!parsed.mentioned;
    position = Number.isInteger(parsed.position) && parsed.position! > 0 ? parsed.position : null;
  } catch {
    /* fall through to the text backstop */
  }

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

  return {
    question,
    mentioned,
    position,
    cited,
    brands,
    answer: trimAnswer(answer),
    sources: sources.slice(0, 8),
  };
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
