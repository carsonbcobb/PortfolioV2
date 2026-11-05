import { collapse, firstH1, htmlToText, metaContent } from "../html";
import type { OpenAI } from "../openai";
import type { AccuracyGrade, AccuracySection, Emit, StoreContext } from "../types";

const GRADE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    grade: { type: "string", enum: ["accurate", "partly accurate", "wrong", "unknown"] },
    missing: { type: "array", items: { type: "string" } },
    wrong: { type: "array", items: { type: "string" } },
  },
  required: ["grade", "missing", "wrong"],
};

const SCORES: Record<AccuracyGrade, number> = { accurate: 100, "partly accurate": 60, wrong: 20, unknown: 0 };

export async function runAccuracy(ctx: StoreContext, ai: OpenAI, emit: Emit): Promise<AccuracySection> {
  emit({ type: "progress", step: "accuracy", message: `Checking what AI says about ${ctx.brand}` });
  const { answer } = await ai.search(`What is ${ctx.brand} and what do they sell?`);

  const html = ctx.homepageHtml ?? "";
  const description = metaContent(html, "description") ?? metaContent(html, "og:description") ?? "";
  const h1 = firstH1(html) ?? "";
  const text = html ? htmlToText(html).slice(0, 2000) : "";
  const titles = ctx.products.map((p) => p.title).filter(Boolean).slice(0, 10).join("; ");

  const graded = await ai.structured<{ grade: AccuracyGrade; missing: string[]; wrong: string[] }>({
    name: "accuracy_grade",
    schema: GRADE_SCHEMA,
    system:
      "You compare what ChatGPT says about a brand with the brand's own website. Grade it: " +
      "'accurate' if it correctly describes the brand and what it sells, 'partly accurate' if it is right " +
      "but misses important things or has small errors, 'wrong' if it describes the wrong company or gets " +
      "core facts wrong, 'unknown' if it says it does not know the brand or finds nothing. " +
      "List up to 5 important points from the website the answer missed (for example \"It does not mention " +
      "the refillable packaging.\"), and up to 5 claims in the answer that the website contradicts (for example " +
      "\"It says they sell candles, but the site only sells soap.\"). Write each point as one short plain " +
      "sentence a store owner would understand, without dashes. " +
      "Only flag something as wrong when the website clearly contradicts it.",
    user:
      `Brand: ${ctx.brand}\nWebsite: ${ctx.domain}\nCategory the owner gave: ${ctx.category}\n\n` +
      `WEBSITE\nMeta description: ${description}\nH1: ${h1}\nProduct titles: ${titles}\nPage text: ${text}\n\n` +
      `CHATGPT ANSWER\n${answer.slice(0, 6000)}`,
  });
  const grade: AccuracyGrade = graded.grade in SCORES ? graded.grade : "unknown";
  return {
    score: SCORES[grade],
    grade,
    answer: trim(answer),
    missing: (graded.missing ?? []).map((s) => collapse(String(s))).filter(Boolean).slice(0, 5),
    wrong: (graded.wrong ?? []).map((s) => collapse(String(s))).filter(Boolean).slice(0, 5),
  };
}

function trim(s: string): string {
  if (s.length <= 1200) return s;
  const cut = s.slice(0, 1200);
  const sp = cut.lastIndexOf(" ");
  return (sp > 1000 ? cut.slice(0, sp) : cut) + "...";
}
