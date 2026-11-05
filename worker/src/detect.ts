import { metaContent, titleOf } from "./html";
import type { OpenAI } from "./openai";
import type { StoreContext } from "./types";

const CATEGORY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    category: {
      type: "string",
      description: "The store's main product category in 1 to 4 lowercase words, the way a shopper would say it.",
    },
  },
  required: ["category"],
};

/** Cleans a category so it fits the check's 80 character limit and reads like a shopper's words. */
export function cleanCategory(s: string): string {
  return s
    .replace(/[‒–—―]/g, " ")
    .replace(/[^\p{L}\p{N}&' ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .slice(0, 60);
}

/** Most common Shopify product_type among the sampled products, or "". */
export function categoryFromProducts(store: StoreContext): string {
  const counts = new Map<string, number>();
  for (const p of store.products) {
    const t = cleanCategory(p.product_type ?? "");
    if (t) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  let best = "";
  let n = 0;
  for (const [t, c] of counts) if (c > n) [best, n] = [t, c];
  return best;
}

/**
 * Main product category for the check's buyer questions. Uses SMALL_MODEL when a key is set,
 * with the products' own product_type as the fallback. Returns "" when nothing usable is found,
 * and the visitor types it instead.
 */
export async function detectCategory(store: StoreContext, ai: OpenAI | null): Promise<string> {
  const fallback = categoryFromProducts(store);
  if (!ai) return fallback;
  const html = store.homepageHtml ?? "";
  const titles = store.products.map((p) => p.title).filter(Boolean).slice(0, 10).join("; ");
  const types = store.products.map((p) => p.product_type).filter(Boolean).slice(0, 10).join("; ");
  if (!html && !titles) return fallback;
  try {
    const { category } = await ai.structured<{ category: string }>({
      name: "category_detect",
      schema: CATEGORY_SCHEMA,
      system:
        "You name an online store's main product category in 1 to 4 lowercase words, the way a shopper would " +
        'describe what they want to buy, for example "natural skincare", "protein bars" or "dog supplements". ' +
        "Never include the brand name.",
      user:
        `Brand: ${store.brand}\n` +
        `Homepage title: ${titleOf(html) ?? ""}\n` +
        `Homepage description: ${metaContent(html, "description") ?? metaContent(html, "og:description") ?? ""}\n` +
        `Product titles: ${titles}\n` +
        `Product types: ${types}`,
    });
    const c = cleanCategory(String(category ?? ""));
    if (!c || c.includes(store.brand.toLowerCase())) return fallback;
    return c;
  } catch {
    return fallback;
  }
}
