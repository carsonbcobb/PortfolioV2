import { safeFetch, safeFetchJson } from "./safefetch";
import { metaContent, sameSiteLinks, stripLocale, titleOf } from "./html";
import type { ShopifyProduct, StoreContext } from "./types";

const isGiftCard = (p: ShopifyProduct) => /gift[\s_-]?card|e-?gift/i.test(`${p.handle ?? ""} ${p.product_type ?? ""} ${p.title ?? ""}`);

/**
 * Setup step: fetch the homepage and the product feed once, work out the brand name, and find the
 * store's top products (best sellers, then products featured on the homepage). `light` reads only
 * the first 10 products and skips the best sellers page, for the quick brand lookup before a run.
 */
export async function loadStore(url: URL, domain: string, signal?: AbortSignal, light = false): Promise<StoreContext> {
  const origin = url.origin;
  const [home, productsJson, best] = await Promise.all([
    safeFetch(origin + "/", { signal }).catch(() => null),
    light
      ? safeFetchJson<{ products?: ShopifyProduct[] }>(origin + "/products.json?limit=10", { signal })
      : // The 250 product feed is often larger than the 2 MB page cap, so it gets a 10 MB cap.
        safeFetchJson<{ products?: ShopifyProduct[] }>(origin + "/products.json?limit=250", {
          signal,
          maxBytes: 10 * 1024 * 1024,
          timeoutMs: 15_000,
        }),
    light ? null : safeFetch(origin + "/collections/all?sort_by=best-selling", { signal }).catch(() => null),
  ]);
  const html = home && home.status >= 200 && home.status < 300 ? home.body : null;
  // Follow the store's own canonical host (e.g. apex to www) so later fetches skip a redirect hop.
  let finalOrigin = origin;
  if (home) {
    const f = new URL(home.finalUrl);
    if (f.hostname.toLowerCase().replace(/^www\./, "") === domain) finalOrigin = f.origin;
  }
  const products = Array.isArray(productsJson?.products) ? productsJson!.products! : [];
  const bestHtml = best && best.status === 200 ? best.body : null;
  return {
    url: new URL(finalOrigin + "/"),
    origin: finalOrigin,
    domain,
    brand: brandFrom(html, domain),
    homepageHtml: html,
    homepageStatus: home?.status ?? null,
    homepageFinalUrl: home?.finalUrl ?? null,
    products,
    top: topProducts(products, [
      bestHtml ? productHandles(bestHtml, best!.finalUrl) : [],
      html ? productHandles(html, home!.finalUrl) : [],
    ]),
  };
}

/** Product handles linked from a page, in page order, without repeats. */
export function productHandles(html: string, base: string): string[] {
  const out: string[] = [];
  for (const u of sameSiteLinks(html, base)) {
    const m = stripLocale(u.pathname).match(/^\/(?:collections\/[^/]+\/)?products\/([^/?#]+)\/?$/);
    if (!m) continue;
    const h = decodeURIComponent(m[1]).toLowerCase();
    if (!out.includes(h)) out.push(h);
  }
  return out;
}

/** Up to 8 top products: best sellers first, then homepage features, then the feed's own order. */
export function topProducts(feed: ShopifyProduct[], handleLists: string[][]): ShopifyProduct[] {
  const byHandle = new Map(feed.filter((p) => p.handle).map((p) => [p.handle!.toLowerCase(), p]));
  const out: ShopifyProduct[] = [];
  const add = (p: ShopifyProduct | undefined) => {
    if (p && !isGiftCard(p) && !out.includes(p) && out.length < 8) out.push(p);
  };
  for (const list of handleLists) for (const h of list) add(byHandle.get(h) ?? (feed.length ? undefined : { handle: h, title: h.replace(/-/g, " ") }));
  for (const p of feed) add(p);
  return out;
}

/** Brand = og:site_name, else the cleaned title, else the domain. */
export function brandFrom(html: string | null, domain: string): string {
  if (html) {
    const site = metaContent(html, "og:site_name");
    if (site && site.length <= 60) return site;
    const title = titleOf(html);
    if (title) {
      const first = title
        .split(/\s+[|:–—\-·•]\s+|\s*[|–—·•]\s*|:\s+/)[0]
        .replace(/^(home|welcome to|shop)\s*[:\-]?\s*/i, "")
        .trim();
      if (first && first.length <= 60) return first;
    }
  }
  return domain;
}
