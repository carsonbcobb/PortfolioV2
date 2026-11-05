import { WEIGHTS } from "./config";
import type { OpenAI } from "./openai";
import type {
  AccuracySection,
  CompetitorCompare,
  CrawlersSection,
  ReadinessSection,
  Report,
  SectionError,
  SectionKey,
  TopFinding,
  VisibilitySection,
} from "./types";

type Sections = Report["sections"];

export function isError(s: unknown): s is SectionError {
  return !!s && typeof s === "object" && "error" in s;
}

export function overallScore(sections: Sections): number {
  let sum = 0;
  let weight = 0;
  for (const key of Object.keys(WEIGHTS) as SectionKey[]) {
    const s = sections[key];
    if (isError(s)) continue;
    sum += (s as { score: number }).score * WEIGHTS[key];
    weight += WEIGHTS[key];
  }
  return weight ? Math.round(sum / weight) : 0;
}

export function verdictFor(score: number): string {
  if (score >= 80) return "AI can find, read and recommend your store. Keep it that way as answers shift.";
  if (score >= 60) return "AI knows your store, but gaps are costing you recommendations.";
  if (score >= 40) return "AI only sees part of your store, and competitors are showing up in your place.";
  return "AI barely sees your store right now, so buyers who ask ChatGPT are sent elsewhere.";
}

function listNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * Removes dashes used as punctuation so user facing strings follow the copy rules.
 * Hyphens inside names (OAI-SearchBot, a hyphenated brand) are proper nouns and stay.
 */
export function noDashes(s: string): string {
  return s
    .replace(/\s*[‒–—―]\s*/g, ", ")
    .replace(/\s+-+\s+/g, ", ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const hyphenated = (s: string) => s.match(/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+/g) ?? [];

function sentence(s: string): string {
  const t = s.trim().replace(/[.!]+$/, "");
  return t.charAt(0).toUpperCase() + t.slice(1) + ".";
}

interface Candidate {
  lead?: boolean;
  weight: number;
  text: string;
}

/** Builds the 3 most important findings deterministically from the results. */
export function buildFindings(brand: string, sections: Sections): string[] {
  const c: Candidate[] = [];

  const v = sections.visibility;
  if (!isError(v)) {
    const vs = v as VisibilitySection;
    const counts = new Map<string, { name: string; n: number }>();
    for (const q of vs.questions) {
      for (const b of q.brands) {
        const k = b.toLowerCase();
        if (k === brand.toLowerCase()) continue;
        const cur = counts.get(k) ?? { name: b, n: 0 };
        cur.n++;
        counts.set(k, cur);
      }
    }
    const top = [...counts.values()].sort((a, b) => b.n - a.n).slice(0, 2).map((x) => x.name);
    const others = top.length ? ` ${listNames(top)} came up most.` : "";
    if (vs.mentioned === 0) {
      c.push({ lead: true, weight: 100, text: `ChatGPT did not recommend you in any of ${vs.total} buyer questions.${others}` });
    } else {
      c.push({
        lead: true,
        weight: vs.mentioned <= 2 ? 90 : 50,
        text: `ChatGPT recommended you in ${vs.mentioned} of ${vs.total} buyer questions.${others}`,
      });
    }
  }

  const cr = sections.crawlers;
  if (!isError(cr)) {
    const cs = cr as CrawlersSection;
    const blocked = cs.bots.filter((b) => b.robots === "blocked").map((b) => b.name);
    const challenged = cs.bots.filter((b) => b.fetch === "challenge").map((b) => b.name);
    const refused = cs.bots.filter((b) => b.fetch === "blocked").map((b) => b.name);
    const searchBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot"];
    if (blocked.length) {
      const w = blocked.some((b) => searchBots.includes(b)) ? 95 : 60;
      c.push({ weight: w, text: `${listNames(blocked)} ${blocked.length === 1 ? "is" : "are"} blocked in robots.txt.` });
    }
    if (challenged.length) {
      c.push({
        weight: 85,
        text: `Your site shows a bot challenge to ${listNames(challenged)}, so ${challenged.length === 1 ? "it" : "they"} cannot read your pages.`,
      });
    }
    if (refused.length) {
      c.push({ weight: 80, text: `Your server turns away ${listNames(refused)} when ${refused.length === 1 ? "it visits" : "they visit"} your homepage.` });
    }
    if (!blocked.length && !challenged.length && !refused.length) {
      c.push({ weight: 10, text: `All ${cs.bots.length} AI crawlers we tested can reach your store.` });
    }
    if (!cs.llmsTxt) c.push({ weight: 15, text: "Your store has no llms.txt file to guide AI tools." });
  }

  const a = sections.accuracy;
  if (!isError(a)) {
    const as = a as AccuracySection;
    if (as.grade === "unknown") c.push({ weight: 88, text: `ChatGPT could not say what ${brand} is or what you sell.` });
    else if (as.grade === "wrong")
      c.push({
        weight: 92,
        text: as.wrong[0]
          ? `ChatGPT gets facts about ${brand} wrong. ${sentence(as.wrong[0])}`
          : `ChatGPT describes ${brand} incorrectly.`,
      });
    else if (as.grade === "partly accurate")
      c.push({
        weight: 55,
        text: as.missing[0]
          ? `ChatGPT's description of ${brand} leaves out key points. ${sentence(as.missing[0])}`
          : `ChatGPT's description of ${brand} is only partly right.`,
      });
    else c.push({ weight: 20, text: `ChatGPT describes ${brand} accurately.` });
  }

  const r = sections.readiness;
  if (!isError(r)) {
    const rs = r as ReadinessSection;
    const p = rs.products;
    if (p.total > 0 && p.incomplete > 0) {
      const share = p.incomplete / p.total;
      c.push({
        weight: share >= 0.5 ? 80 : share >= 0.2 ? 60 : 30,
        text: `${p.incomplete} of ${p.total} products are missing details AI uses to recommend them.`,
      });
    }
    if (rs.duplicates.length) {
      c.push({ weight: 70, text: "Your product page has duplicate Product schema, which can give AI conflicting data." });
    }
    const productPage = rs.pages.find((pg) => pg.type === "Product" && pg.found);
    if (productPage?.cells.Product === "missing") {
      c.push({ weight: 85, text: "Your product pages have no Product schema, so AI cannot read price or reviews reliably." });
    } else if (productPage?.cells.Product === "incomplete") {
      c.push({ weight: 58, text: "Your Product schema is missing fields like reviews, brand or SKU that AI looks for." });
    }
    const home = rs.pages.find((pg) => pg.type === "Homepage" && pg.found);
    if (home?.cells.Organization === "missing") {
      c.push({ weight: 50, text: "Your homepage has no Organization schema telling AI who you are." });
    }
    const faq = rs.pages.find((pg) => pg.type === "FAQ");
    if (faq && !faq.found) c.push({ weight: 25, text: "We found no FAQ page, a common source AI quotes when answering buyers." });
  }

  // The visibility result is the headline of this tool, so it always leads when it ran.
  return c
    .sort((x, y) => (x.lead ? -1 : y.lead ? 1 : y.weight - x.weight))
    .slice(0, 3)
    .map((x) => noDashes(x.text));
}

// Words that turn a finding into advice. The score step states problems and costs, never fixes.
const FIX_WORDS =
  /\b(fix|fixes|fixing|add|adding|install|implement|update|create|should|need to|needs to|make sure|consider|try|we recommend|you can|improve|optimi[sz]e|set up|switch|enable|unblock|remove)\b/i;

/** A compact, factual digest of the results for the findings write up. */
export function digest(
  brand: string,
  category: string,
  sections: Sections,
  competitor: CompetitorCompare | null | undefined,
): Record<string, unknown> {
  const d: Record<string, unknown> = { brand, category };
  const v = sections.visibility;
  if (!isError(v)) {
    const vs = v as VisibilitySection;
    d.visibility = {
      recommended_in: vs.mentioned,
      of_questions: vs.total,
      questions: vs.questions.map((q) => ({
        question: q.question,
        recommended: q.mentioned,
        position: q.position,
        brands_named: q.brands.slice(0, 6),
      })),
      cited_sources: vs.sources.total,
      sources_brand_is_on: vs.sources.on,
    };
  }
  const a = sections.accuracy;
  if (!isError(a)) {
    const as = a as AccuracySection;
    d.brand_accuracy = { grade: as.grade, missing: as.missing.slice(0, 3), wrong: as.wrong.slice(0, 3) };
  }
  const c = sections.crawlers;
  if (!isError(c)) {
    const cs = c as CrawlersSection;
    d.crawlers = {
      stopped: cs.bots.filter((b) => b.robots === "blocked" || b.fetch === "blocked" || b.fetch === "challenge").map((b) => b.name),
      tested: cs.bots.length,
    };
  }
  const r = sections.readiness;
  if (!isError(r)) {
    const rs = r as ReadinessSection;
    d.catalog = {
      products_in_feed: rs.products.total,
      products_with_thin_or_missing_details: rs.products.incomplete,
    };
    d.one_product_page = rs.productDetails
      ? {
          note: "Count of product detail types (price, reviews, stock and so on) one product page gives AI, not a count of products.",
          detail_types_given: rs.productDetails.count,
          detail_types_possible: Object.keys(rs.productDetails.fields).length,
          conflicting_product_data: rs.duplicates.length > 0,
        }
      : null;
  }
  if (competitor?.theirs) {
    d.top_competitor = {
      name: competitor.name,
      recommended_in_questions: competitor.mentions,
      their_product_page_detail_types: competitor.theirs.count,
      your_product_page_detail_types: competitor.yours?.count ?? null,
      detail_types_possible: Object.keys(competitor.labels).length,
    };
  }
  return d;
}

/**
 * One SMALL_MODEL call that reads the whole digest and writes the 3 findings for the score step,
 * each tied to lost sales. Returns null on any problem, and the page builds its own findings instead.
 */
export async function writeTopFindings(ai: OpenAI, data: Record<string, unknown>): Promise<TopFinding[] | null> {
  const input = JSON.stringify(data);
  try {
    const res = await ai.structured<{ findings: { text: string; cost: string }[] }>({
      name: "top_findings",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          findings: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                text: { type: "string", description: "The problem, one sentence, with the specific number or name." },
                cost: { type: "string", description: "What it costs in sales, one short sentence." },
              },
              required: ["text", "cost"],
            },
          },
        },
        required: ["findings"],
      },
      system:
        "You are an AI search and ecommerce expert writing the 3 most important findings from an AI visibility check " +
        "for a store owner. Pick the 3 results that cost the store the most sales, most costly first. For each, write " +
        "the problem in one plain sentence using the exact numbers and names from the data, then one short sentence on " +
        "what it costs in sales or customers. Write like a calm expert talking to a founder: plain words, no jargon " +
        "like schema, JSON or crawler tokens unless the data needs it. Never say how to fix anything, never give " +
        "advice or next steps, never promise rankings or results. Do not use dashes, em dashes or hyphenated words. " +
        "Use only facts in the data, and keep each number tied to what it counts: detail types on one product page are " +
        "not products. Keep each sentence short and name at most two specifics. If the store did well on something, you " +
        "may say so, but lead with the problems.",
      user: input,
    });
    const out = (res.findings ?? []).slice(0, 3).map((f) => ({ text: String(f.text ?? "").trim(), cost: String(f.cost ?? "").trim() }));
    if (out.length < 3) return null;
    for (const f of out) {
      for (const s of [f.text, f.cost]) {
        if (!s || s.length > 240) return null;
        if (/[‒–—―]|\s-+\s/.test(s)) return null;
        if (hyphenated(s).some((w) => !input.includes(w))) return null;
        if (FIX_WORDS.test(s)) return null;
        if (/\b(guarantee|rank #?1|top ranking)\b/i.test(s)) return null;
        // Every number must come from the data.
        if ((s.match(/\d+/g) ?? []).some((n) => !input.includes(n))) return null;
      }
    }
    return out;
  } catch {
    return null;
  }
}
