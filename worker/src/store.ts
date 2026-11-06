import { safeFetch, safeFetchJson } from "./safefetch";
import { metaContent, sameSiteLinks, stripLocale, titleOf } from "./html";
import { extractSchema, typesOf } from "./schema";
import type { ShopifyProduct, StopReason, StoreContext } from "./types";

// Gift cards, and products a store has marked internal (DNU, do not use, test), are never top products.
const isGiftCard = (p: ShopifyProduct) =>
  /gift[\s_-]?card|e-?gift/i.test(`${p.handle ?? ""} ${p.product_type ?? ""} ${p.title ?? ""}`) ||
  /^\s*(dnu|do not use|test product)\b/i.test(p.title ?? "");

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
    light ? null : politeFetch(origin + "/collections/all?sort_by=best-selling", { signal }),
  ]);
  const html = home && home.status >= 200 && home.status < 300 ? home.body : null;
  // Follow the store's own canonical host (e.g. apex to www) so later fetches skip a redirect hop.
  let finalOrigin = origin;
  if (home) {
    const f = new URL(home.finalUrl);
    if (f.hostname.toLowerCase().replace(/^www\./, "") === domain) finalOrigin = f.origin;
  }
  let products = Array.isArray(productsJson?.products) ? productsJson!.products! : [];
  const bestHtml = best && best.status === 200 ? best.body : null;
  const handleLists = [bestHtml ? productHandles(bestHtml, best!.finalUrl) : [], html ? productHandles(html, home!.finalUrl) : []];
  let top = topProducts(products, handleLists);
  // No product feed: look again before giving up, so questions are never written without products.
  if (!light && !products.length) {
    const found = await discoverProducts(finalOrigin, domain, handleLists.flat(), signal);
    products = found.feed;
    top = found.feed.length ? topProducts(found.feed, handleLists) : found.top;
  }
  return {
    url: new URL(finalOrigin + "/"),
    origin: finalOrigin,
    domain,
    brand: brandFrom(html, domain),
    homepageHtml: html,
    homepageStatus: home?.status ?? null,
    homepageFinalUrl: home?.finalUrl ?? null,
    products,
    top,
    storeSignals: looksLikeStore(html),
  };
}

/** Signs on the homepage that the site is an online store, even when its products can't be read. */
export function looksLikeStore(html: string | null): boolean {
  if (!html) return false;
  if (/cdn\.shopify\.com|Shopify\.theme|\.myshopify\.com|woocommerce|bigcommerce/i.test(html)) return true;
  if (/href=["'][^"']*\/cart\/?["']|add[\s_-]?to[\s_-]?(cart|bag)/i.test(html)) return true;
  return extractSchema(html).nodes.some((n) => typesOf(n).some((t) => t === "Product" || t === "Offer"));
}

/** Every product in the feed is digital (no variant needs shipping), so it is not a physical product store. */
function digitalOnly(feed: ShopifyProduct[]): boolean {
  const variants = feed.flatMap((p) => p.variants ?? []);
  return variants.length > 0 && variants.every((v) => v?.requires_shipping === false);
}

/**
 * Why the check can't run on this site, or null when it can. Runs before any AI call.
 * not_store: no products and nothing that looks like a store. no_products: a store whose products
 * couldn't be read. unreadable: the homepage itself couldn't be loaded.
 */
export function stopReason(ctx: StoreContext): StopReason | null {
  if (ctx.top.length) return digitalOnly(ctx.products) ? "not_store" : null;
  if (!ctx.homepageHtml) return "unreadable";
  return ctx.storeSignals ? "no_products" : "not_store";
}

export const STOP_MESSAGES: Record<StopReason, string> = {
  not_store: "This check is built for stores that sell products. We couldn't find products on this site.",
  no_products: "We found your store but couldn't read its products, so there's no score this time. The store may be limiting automated visits.",
  unreadable: "We couldn't read this site, so there's no score this time. It may be limiting automated visits.",
};

/**
 * Second look for products when the first product feed read failed: the feed again (smaller), the
 * collection pages, then the sitemap. Handles found without a feed are read one by one, so every
 * product has real details. Products that can't be read are dropped.
 */
async function discoverProducts(
  origin: string,
  domain: string,
  known: string[],
  signal?: AbortSignal,
): Promise<{ feed: ShopifyProduct[]; top: ShopifyProduct[] }> {
  for (const path of ["/products.json?limit=50", "/collections/all/products.json?limit=50"]) {
    const r = await politeFetch(origin + path, { signal, timeoutMs: 12_000, maxBytes: 5 * 1024 * 1024, accept: "application/json" });
    const feed = r ? (parseFeed(r.body) ?? []) : [];
    if (feed.length) return { feed, top: [] };
  }
  const handles = [...known];
  const add = (list: string[]) => list.forEach((h) => !handles.includes(h) && handles.push(h));
  if (handles.length < 6) {
    const pages = await Promise.all(["/collections/all", "/collections"].map((p) => politeFetch(origin + p, { signal })));
    for (const r of pages) if (r) add(productHandles(r.body, r.finalUrl));
  }
  // Small batches, so a store that rate limits isn't hit with every request at once.
  const readAll = async (list: string[]) => {
    const out: (ShopifyProduct | null)[] = [];
    for (let i = 0; i < list.length; i += 3) out.push(...(await Promise.all(list.slice(i, i + 3).map((h) => productByHandle(origin, h, signal)))));
    return out;
  };
  let list = handles.slice(0, 8);
  let read = await readAll(list);
  // Too few products read: the product sitemap lists more, with each product's title, which is used
  // when a product's own page can't be read.
  const titles = new Map<string, string>();
  const distinct = () => topProducts(read.filter((p): p is ShopifyProduct => !!p), []).length;
  if (distinct() < 3) {
    const listed = (await sitemapProducts(origin, domain, signal)).filter((p) => !/gift[\s_-]?card/i.test(`${p.handle} ${p.title ?? ""}`));
    for (const p of listed) if (p.title) titles.set(p.handle, p.title);
    const more = listed.map((p) => p.handle).filter((h) => !list.includes(h)).slice(0, Math.max(0, 8 - distinct()));
    if (more.length) {
      const extra = await readAll(more.slice(0, 3));
      list = [...list, ...more];
      read = [...read, ...extra];
    }
  }
  const top = list
    .map((h, i) => read[i] ?? (titles.has(h) ? ({ handle: h, title: titles.get(h) } as ShopifyProduct) : null))
    .filter((p): p is ShopifyProduct => !!p && !isGiftCard(p));
  return { feed: [], top: topProducts(top, []) };
}

function parseFeed(body: string): ShopifyProduct[] | null {
  try {
    const j = JSON.parse(body) as { products?: ShopifyProduct[] };
    return Array.isArray(j?.products) ? j.products.filter((p) => p && p.title) : null;
  } catch {
    return null;
  }
}

/** A 200 response, or null. A rate limited (429) request waits briefly and tries once more. */
async function politeFetch(url: string, opts: Parameters<typeof safeFetch>[1] = {}): Promise<Awaited<ReturnType<typeof safeFetch>> | null> {
  for (let i = 0; i < 2; i++) {
    const r = await safeFetch(url, opts).catch(() => null);
    // A cut off HTML page still has its head and schema; cut off JSON can't be parsed.
    if (r && r.status === 200 && !(r.truncated && /json/i.test(opts.accept ?? ""))) return r;
    if (!r || r.status !== 429 || i === 1 || opts.signal?.aborted) return null;
    const wait = Math.min(Number(r.headers.get("retry-after")) || 2, 3) * 1000;
    await new Promise((res) => setTimeout(res, wait + Math.random() * 500));
  }
  return null;
}

const xmlText = (s: string) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').trim();

/** Products listed in the sitemap, with titles where given (Shopify: sitemap_products_1.xml, image:title). */
async function sitemapProducts(origin: string, domain: string, signal?: AbortSignal): Promise<{ handle: string; title?: string }[]> {
  const read = async (url: string) => (await politeFetch(url, { signal, accept: "application/xml,text/xml" }))?.body ?? "";
  const out: { handle: string; title?: string }[] = [];
  const take = (xml: string) => {
    for (const block of xml.match(/<url>[\s\S]*?<\/url>/gi) ?? []) {
      const loc = block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/i)?.[1];
      if (!loc) continue;
      try {
        const u = new URL(xmlText(loc));
        // Some stores list products on their own subdomain (us.checkout.example.com); the handle is the same.
        const host = u.hostname.replace(/^www\./, "");
        if (host !== domain && !host.endsWith("." + domain)) continue;
        const m = stripLocale(u.pathname).match(/^\/products\/([^/?#]+)\/?$/);
        if (!m) continue;
        const handle = decodeURIComponent(m[1]).toLowerCase();
        if (out.some((p) => p.handle === handle)) continue;
        const title = block.match(/<image:title>([\s\S]*?)<\/image:title>/i)?.[1];
        out.push({ handle, ...(title ? { title: xmlText(title).slice(0, 120) } : {}) });
      } catch {
        /* skip bad URLs */
      }
    }
  };
  const root = await read(origin + "/sitemap.xml");
  take(root);
  const children = [...root.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)]
    .map((m) => xmlText(m[1]))
    .filter((l) => /product/i.test(l) && /\.xml/i.test(l))
    .slice(0, 2);
  for (const c of children) take(await read(c));
  return out.slice(0, 20);
}

/** One product's details: Shopify's product JSON first, else the Product schema on its page. */
async function productByHandle(origin: string, handle: string, signal?: AbortSignal): Promise<ShopifyProduct | null> {
  const path = `/products/${encodeURIComponent(handle)}`;
  const jr = await politeFetch(origin + path + ".json", { signal, accept: "application/json" });
  try {
    const j = jr ? (JSON.parse(jr.body) as { product?: ShopifyProduct }) : null;
    if (j?.product?.title) return j.product;
  } catch {
    /* not JSON: read the page instead */
  }
  const r = await politeFetch(origin + path, { signal, maxBytes: 4 * 1024 * 1024 });
  if (!r || !/\/products\//.test(new URL(r.finalUrl).pathname)) return null;
  const node = extractSchema(r.body).nodes.find((n) => typesOf(n).some((t) => t === "Product" || t === "ProductGroup") && n.name);
  if (!node) return null;
  const offers = Array.isArray(node.offers) ? node.offers[0] : node.offers;
  const price = offers && typeof offers === "object" ? (offers as Record<string, unknown>).price : undefined;
  return {
    handle,
    title: String(node.name),
    body_html: typeof node.description === "string" ? node.description : null,
    product_type: typeof node.category === "string" ? node.category : undefined,
    variants: price !== undefined ? [{ price: String(price) }] : [],
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

// Products that aren't what a store is known for: accessories, samples, add ons, protection plans.
const MINOR =
  /\b(accessor(y|ies)|samples?|sampler|trial size|travel size|swatch(es)?|add[\s_-]?ons?|addons?|gift (wrap|box|bag)|shipping protection|package protection|route protection|insurance|warranty|protection plan|stickers?|keychains?|patch(es)?|collar stays?|collar bones?|replacement (parts?|laces|insoles?)|spare parts?|shoelaces?|laces|hangers?|garment bags?|dust bags?|care kit|cleaning kit)\b/i;

function minPrice(p: ShopifyProduct): number | null {
  const prices = (p.variants ?? []).map((v) => Number(v?.price)).filter((n) => Number.isFinite(n) && n > 0);
  return prices.length ? Math.min(...prices) : null;
}

/**
 * Drops products a shopper wouldn't ask AI about: gift cards, accessories, samples, add ons, and
 * anything under 30% of the store's median price. Falls back to the full list if that leaves nothing.
 */
export function mainProducts(feed: ShopifyProduct[]): ShopifyProduct[] {
  const priced = feed.map(minPrice).filter((n): n is number => n !== null).sort((a, b) => a - b);
  const median = priced.length ? priced[Math.floor((priced.length - 1) / 2)] : null;
  const keep = feed.filter((p) => {
    if (isGiftCard(p)) return false;
    const tags = Array.isArray(p.tags) ? p.tags.join(" ") : (p.tags ?? "");
    if (MINOR.test(`${p.title ?? ""} ${p.product_type ?? ""} ${p.handle ?? ""} ${tags}`)) return false;
    const price = minPrice(p);
    return !(median !== null && price !== null && price < median * 0.3);
  });
  return keep.length ? keep : feed.filter((p) => !isGiftCard(p));
}

/**
 * Up to 8 top products. Best sellers (`handleLists[0]`, from /collections/all?sort_by=best-selling)
 * come first as the store ranks them. Without them, homepage features and then the feed are used,
 * minus minor products (see mainProducts), with the feed ordered by most variants.
 */
export function topProducts(feed: ShopifyProduct[], handleLists: string[][]): ShopifyProduct[] {
  const [best = [], ...featured] = handleLists;
  const main = new Set(mainProducts(feed));
  // Feed fallback: products with more variants (sizes, colors) are usually the core line.
  const ranked = [...main].map((p, i) => ({ p, i, n: (p.variants ?? []).length })).sort((a, b) => b.n - a.n || a.i - b.i).map((x) => x.p);
  const byHandle = new Map(feed.filter((p) => p.handle).map((p) => [p.handle!.toLowerCase(), p]));
  const out: ShopifyProduct[] = [];
  // Products with the same title (sizes or packs listed separately) count once.
  // Colors and variants listed as their own products ("Runner - Blue", "Runner - Grey") count once too.
  const key = (p: ShopifyProduct) =>
    (p.title ?? p.handle ?? "").split(/\s+[-|–]\s+/)[0].toLowerCase().replace(/[^a-z0-9]+/g, "");
  const add = (p: ShopifyProduct | undefined) => {
    if (p && !isGiftCard(p) && !out.some((x) => x === p || key(x) === key(p)) && out.length < 8) out.push(p);
  };
  const fromHandle = (h: string) => byHandle.get(h) ?? (feed.length ? undefined : { handle: h, title: h.replace(/-/g, " ") });
  for (const h of best) add(fromHandle(h));
  // Only when the best sellers page gave too few: curated homepage products, then the ranked feed.
  if (out.length < 3) {
    for (const list of featured) for (const h of list) {
      const p = fromHandle(h);
      if (p && (!feed.length || main.has(p))) add(p);
    }
    for (const p of ranked) add(p);
  }
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
  // No name on the homepage: "gymshark.com" reads as "Gymshark".
  const label = domain.split(".")[0];
  return label.charAt(0).toUpperCase() + label.slice(1);
}
