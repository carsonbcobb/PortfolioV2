import { metaContent, sameSiteLinks, titleOf } from "../html";
import { hostOf } from "../openai";
import { safeFetch, safeFetchJson } from "../safefetch";
import { PRODUCT_DETAIL_LABELS, countFields, extractSchema, productDetailFields, typesOf } from "../schema";
import type { CompetitorCompare, ProductDetails, ReadinessSection, ShopifyProduct, StoreContext, VisibilitySection } from "../types";
import { norm, sameBrand } from "./visibility";
import { isNonBrand } from "../nonbrands";


/** Brands recommended in the buyer questions, most mentioned first, without the visitor's brand. */
export function rankCompetitors(v: VisibilitySection, ctx: StoreContext): { name: string; mentions: number }[] {
  const counts = new Map<string, { name: string; mentions: number }>();
  for (const q of v.questions) {
    const seen = new Set<string>();
    for (const b of q.brands) {
      const k = norm(b);
      if (!k || seen.has(k) || sameBrand(b, ctx.brand, ctx.domain) || isNonBrand(b)) continue;
      seen.add(k);
      const cur = counts.get(k) ?? { name: b, mentions: 0 };
      cur.mentions++;
      counts.set(k, cur);
    }
  }
  return [...counts.values()].sort((a, b) => b.mentions - a.mentions);
}

/** The competitor's domain: a cited host or a domain in the answers that matches the name, else name.com. */
function domainCandidates(name: string, v: VisibilitySection): string[] {
  const n = norm(name);
  const out: string[] = [];
  const add = (d: string) => {
    const h = d.toLowerCase().replace(/^www\./, "");
    if (!out.includes(h)) out.push(h);
  };
  const matches = (host: string) => {
    const label = norm(host.replace(/^www\./, "").split(".")[0]);
    return label.length >= 3 && (label === n || (n.length >= 4 && label.includes(n)) || (label.length >= 4 && n.includes(label)));
  };
  for (const q of v.questions) for (const s of q.sources) if (matches(s.host)) add(s.host);
  for (const q of v.questions)
    for (const m of q.answer.matchAll(/\b([a-z0-9][a-z0-9-]*\.(?:com|co|shop|store|us|net|co\.uk|com\.au|ca))\b/gi)) if (matches(m[1])) add(m[1]);
  if (n.length >= 3) add(`${n}.com`);
  return out.slice(0, 3);
}

async function readProduct(url: string, signal?: AbortSignal): Promise<ProductDetails | null> {
  try {
    const r = await safeFetch(url, { signal, timeoutMs: 7000 });
    if (r.status !== 200) return null;
    const ex = extractSchema(r.body);
    const hasProduct =
      ex.nodes.some((n) => typesOf(n).some((t) => t === "Product" || t === "ProductGroup")) || ex.microdata.includes("Product");
    const fields = productDetailFields(ex);
    // A page without any product markup still counts if it looks like a product page: it gives AI 0 details.
    if (!hasProduct && !/\/products?\//.test(new URL(r.finalUrl).pathname)) return null;
    return { url: r.finalUrl, fields, count: countFields(fields) };
  } catch {
    return null;
  }
}

/** Finds and reads one product page on a competitor's site. Same parser as site readiness, no AI. */
async function competitorProduct(domain: string, name: string, signal?: AbortSignal): Promise<{ domain: string; details: ProductDetails } | null> {
  let home;
  try {
    home = await safeFetch(`https://${domain}/`, { signal, timeoutMs: 7000 });
  } catch {
    return null;
  }
  if (home.status !== 200) return null;
  const finalHost = hostOf(home.finalUrl);
  // A guessed domain must actually belong to the brand.
  const label = `${metaContent(home.body, "og:site_name") ?? ""} ${titleOf(home.body) ?? ""} ${finalHost}`;
  if (!norm(label).includes(norm(name).slice(0, 12))) return null;
  const origin = new URL(home.finalUrl).origin;

  const candidates: string[] = [];
  const feed = await safeFetchJson<{ products?: ShopifyProduct[] }>(`${origin}/products.json?limit=5`, { signal, timeoutMs: 7000 });
  const handle = feed?.products?.find((p) => p.handle && !/gift[\s_-]?card/i.test(`${p.handle} ${p.title ?? ""}`))?.handle;
  if (handle) candidates.push(`${origin}/products/${encodeURIComponent(handle)}`);
  for (const u of sameSiteLinks(home.body, home.finalUrl)) {
    if (/\/(products?|p|shop)\/[^/]+\/?$/.test(u.pathname) && !candidates.includes(u.toString())) candidates.push(u.toString());
    if (candidates.length >= 3) break;
  }
  for (const c of candidates.slice(0, 3)) {
    const details = await readProduct(c, signal);
    if (details) return { domain: finalHost, details };
  }
  return null;
}

/** Side by side of product details: the visitor's product page and the most recommended competitor's. */
export async function compareCompetitor(
  v: VisibilitySection,
  r: ReadinessSection | null,
  ctx: StoreContext,
  signal?: AbortSignal,
): Promise<CompetitorCompare | null> {
  const ranked = rankCompetitors(v, ctx).slice(0, 3);
  for (const c of ranked) {
    for (const d of domainCandidates(c.name, v)) {
      if (d === ctx.domain) continue;
      const found = await competitorProduct(d, c.name, signal);
      if (found)
        return {
          name: c.name,
          domain: found.domain,
          mentions: c.mentions,
          theirs: found.details,
          yours: r?.productDetails ?? null,
          labels: PRODUCT_DETAIL_LABELS,
        };
    }
  }
  return null;
}
