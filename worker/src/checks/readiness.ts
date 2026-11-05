import { safeFetch } from "../safefetch";
import { countFields, extractSchema, productDetailFields, typesOf } from "../schema";
import type { Emit, ProductDetails, ReadinessProduct, ReadinessRow, ReadinessSection, StoreContext } from "../types";

/** Product pages read per check: the store's top products, best sellers first. All parsed in code, no AI. */
const PAGES = 8;

/**
 * Details every product page should give AI, each as one row. `test` reads the parsed product data
 * of one page; `single` is true when the page has exactly one product record.
 */
const ROWS: { key: string; label: string; test: (f: Record<string, boolean>, single: boolean) => boolean }[] = [
  { key: "basics", label: "Name, description and images", test: (f) => f.name && f.description && f.image },
  { key: "price", label: "Price and availability", test: (f) => f.price && f.availability },
  { key: "rating", label: "Ratings", test: (f) => f.rating },
  { key: "reviews", label: "Review text", test: (f) => f.reviews },
  { key: "brand", label: "Brand name", test: (f) => f.brand },
  { key: "identifier", label: "SKU or barcode", test: (f) => f.identifier },
  { key: "attributes", label: "Size, color or material", test: (f) => f.attributes },
  { key: "shipping", label: "Shipping details", test: (f) => f.shipping },
  { key: "returns", label: "Return policy", test: (f) => f.returns },
  { key: "single", label: "One consistent product record", test: (_f, single) => single },
];

interface Page {
  title: string;
  url: string;
  fields: Record<string, boolean>;
  single: boolean;
}

async function readPage(url: string, title: string, signal?: AbortSignal): Promise<Page | null> {
  try {
    const r = await safeFetch(url, { signal, timeoutMs: 8000 });
    if (r.status !== 200 || !/<html|<body|<head/i.test(r.body.slice(0, 5000))) return null;
    if (!/\/products\//.test(new URL(r.finalUrl).pathname)) return null; // redirected away
    const ex = extractSchema(r.body);
    const records =
      ex.nodes.filter((n) => typesOf(n).some((t) => t === "Product" || t === "ProductGroup")).length +
      ex.microdata.filter((t) => t === "Product").length;
    return { title, url: r.finalUrl, fields: productDetailFields(ex), single: records === 1 };
  } catch {
    return null;
  }
}

export async function runReadiness(ctx: StoreContext, emit: Emit, signal?: AbortSignal): Promise<ReadinessSection> {
  emit({ type: "progress", step: "readiness", message: "Reading your top product pages" });
  const o = ctx.origin;
  const targets = ctx.top
    .filter((p) => p.handle)
    .slice(0, PAGES)
    .map((p) => ({ url: `${o}/products/${encodeURIComponent(p.handle!)}`, title: (p.title ?? p.handle!).slice(0, 120) }));
  const pages = (await Promise.all(targets.map((t) => readPage(t.url, t.title, signal)))).filter((p): p is Page => !!p);

  // Nothing readable usually means the store blocked or rate limited the check, not that it has
  // no product data. Report it as an error so it doesn't score 0 and drag the overall score down.
  if (!pages.length) {
    throw new Error("we couldn't read your product pages. The store may be limiting automated visits.");
  }

  const n = pages.length;
  const rows: ReadinessRow[] = ROWS.map((r) => {
    const on = pages.filter((p) => r.test(p.fields, p.single)).length;
    return { key: r.key, label: r.label, on, of: n, status: on === n ? "good" : on === 0 ? "missing" : "partial" };
  });
  const products: ReadinessProduct[] = pages.map((p) => ({
    title: p.title,
    url: p.url,
    has: Object.fromEntries(ROWS.map((r) => [r.key, r.test(p.fields, p.single)])),
  }));
  // The score is the average share of product pages that give AI each detail.
  const score = Math.round((rows.reduce((a, r) => a + r.on / r.of, 0) / rows.length) * 100);
  const first = pages[0];
  const productDetails: ProductDetails = { url: first.url, fields: first.fields, count: countFields(first.fields) };
  return { score, checked: n, rows, products, productDetails };
}
