import { safeFetch, safeFetchJson } from "./safefetch";
import { metaContent, titleOf } from "./html";
import type { ShopifyProduct, StoreContext } from "./types";

/** Setup step: fetch the homepage and the first products, and work out the brand name. */
export async function loadStore(url: URL, domain: string, category: string, signal?: AbortSignal): Promise<StoreContext> {
  const origin = url.origin;
  const [home, productsJson] = await Promise.all([
    safeFetch(origin + "/", { signal }).catch(() => null),
    safeFetchJson<{ products?: ShopifyProduct[] }>(origin + "/products.json?limit=10", { signal }),
  ]);
  const html = home && home.status >= 200 && home.status < 300 ? home.body : null;
  // Follow the store's own canonical host (e.g. apex to www) so later fetches skip a redirect hop.
  let finalOrigin = origin;
  if (home) {
    const f = new URL(home.finalUrl);
    if (f.hostname.toLowerCase().replace(/^www\./, "") === domain) finalOrigin = f.origin;
  }
  return {
    url: new URL(finalOrigin + "/"),
    origin: finalOrigin,
    domain,
    category,
    brand: brandFrom(html, domain),
    homepageHtml: html,
    homepageStatus: home?.status ?? null,
    homepageFinalUrl: home?.finalUrl ?? null,
    products: Array.isArray(productsJson?.products) ? productsJson!.products! : [],
  };
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
