import { htmlToText, sameSiteLinks, stripLocale } from "../html";
import { safeFetch, safeFetchJson } from "../safefetch";
import { countFields, extractSchema, has, productDetailFields, typesOf, type Extracted, type Node } from "../schema";
import type {
  CellValue,
  Emit,
  PageType,
  ProductDetails,
  ProductStats,
  ReadinessPage,
  ReadinessSection,
  SchemaColumn,
  ShopifyProduct,
  StoreContext,
} from "../types";

export const COLUMNS: SchemaColumn[] = [
  "Organization",
  "WebSite",
  "Product",
  "BreadcrumbList",
  "ItemList",
  "FAQPage",
  "Article",
];

const EXPECTED: Record<PageType, SchemaColumn[]> = {
  Homepage: ["Organization", "WebSite"],
  Collection: ["BreadcrumbList", "ItemList"],
  Product: ["Product", "BreadcrumbList"],
  FAQ: ["FAQPage"],
  Blog: ["ItemList", "BreadcrumbList"],
  Article: ["Article", "BreadcrumbList"],
  About: ["Organization"],
};

const ORG_TYPES = new Set([
  "Organization",
  "Corporation",
  "OnlineStore",
  "OnlineBusiness",
  "LocalBusiness",
  "Store",
  "ClothingStore",
  "NGO",
]);

/** Types that satisfy a column, per page type where it differs. */
function acceptedTypes(col: SchemaColumn, page: PageType): Set<string> {
  switch (col) {
    case "Organization":
      return ORG_TYPES;
    case "Product":
      return new Set(["Product", "ProductGroup", "IndividualProduct"]);
    case "ItemList":
      return page === "Blog" ? new Set(["ItemList", "Blog", "CollectionPage"]) : new Set(["ItemList", "CollectionPage"]);
    case "Article":
      return new Set(["Article", "BlogPosting", "NewsArticle"]);
    default:
      return new Set([col]);
  }
}

const ID_KEYS = ["sku", "mpn", "gtin", "gtin8", "gtin12", "gtin13", "gtin14", "productID"];

function productComplete(n: Node): boolean {
  const variants = (Array.isArray(n.hasVariant) ? n.hasVariant : []) as Node[];
  const anyHas = (k: string) => has(n, k) || variants.some((v) => v && typeof v === "object" && has(v, k));
  return anyHas("offers") && has(n, "aggregateRating") && has(n, "brand") && ID_KEYS.some(anyHas);
}

function completeness(col: SchemaColumn, n: Node): boolean {
  if (col === "Product") return productComplete(n);
  if (col === "Organization") return has(n, "name") && has(n, "url") && has(n, "logo");
  if (col === "Article") return has(n, "headline") && has(n, "datePublished") && has(n, "author");
  return true;
}

function microComplete(col: SchemaColumn, props: Set<string>): boolean {
  if (col === "Product")
    return (
      props.has("offers") && props.has("aggregaterating") && props.has("brand") && ID_KEYS.some((k) => props.has(k.toLowerCase()))
    );
  if (col === "Organization") return props.has("name") && props.has("url") && props.has("logo");
  if (col === "Article") return props.has("headline") && props.has("datepublished") && props.has("author");
  return true;
}

function cellFor(col: SchemaColumn, page: PageType, ex: Extracted): CellValue {
  const accepted = acceptedTypes(col, page);
  const nodes = ex.nodes.filter((n) => typesOf(n).some((t) => accepted.has(t)));
  if (nodes.length) return nodes.some((n) => completeness(col, n)) ? "present" : "incomplete";
  if (ex.microdata.some((t) => accepted.has(t))) return microComplete(col, ex.microdataProps) ? "present" : "incomplete";
  return "missing";
}

function emptyCells(): Record<SchemaColumn, CellValue> {
  return Object.fromEntries(COLUMNS.map((c) => [c, null])) as Record<SchemaColumn, CellValue>;
}

interface Fetched {
  url: string;
  html: string;
}

/** GET a store page; returns null when it is missing or redirected away (e.g. to the homepage). */
async function getPage(url: string, signal?: AbortSignal): Promise<Fetched | null> {
  try {
    const r = await safeFetch(url, { signal });
    if (r.status !== 200) return null;
    const asked = stripLocale(new URL(url).pathname).replace(/\/$/, "");
    const got = stripLocale(new URL(r.finalUrl).pathname).replace(/\/$/, "");
    if (asked && !got) return null; // redirected to homepage
    if (!/<html|<body|<head/i.test(r.body.slice(0, 5000))) return null;
    return { url: r.finalUrl, html: r.body };
  } catch {
    return null;
  }
}

async function firstFound(urls: string[], signal?: AbortSignal): Promise<Fetched | null> {
  for (const u of urls) {
    const p = await getPage(u, signal);
    if (p) return p;
  }
  return null;
}

export async function runReadiness(ctx: StoreContext, emit: Emit, signal?: AbortSignal): Promise<ReadinessSection> {
  emit({ type: "progress", step: "readiness", message: "Scanning schema on 7 page types" });
  const o = ctx.origin;
  const homeHtml = ctx.homepageHtml;
  const homeLinks = homeHtml ? sameSiteLinks(homeHtml, ctx.homepageFinalUrl ?? o + "/") : [];
  const paths = homeLinks.map((u) => ({ u, p: stripLocale(u.pathname).replace(/\/$/, "") }));

  // Collection: first homepage link that is not /collections/all, then collections.json, then /collections/all.
  const collectionPromise = (async () => {
    const links = paths.filter((x) => /^\/collections\/[^/]+$/.test(x.p));
    const notAll = links.find((x) => x.p !== "/collections/all");
    const candidates: string[] = [];
    if (notAll) candidates.push(notAll.u.toString());
    else {
      const cj = await safeFetchJson<{ collections?: { handle?: string }[] }>(o + "/collections.json?limit=1", { signal });
      const h = cj?.collections?.[0]?.handle;
      if (h && h !== "all") candidates.push(`${o}/collections/${encodeURIComponent(h)}`);
    }
    candidates.push(`${o}/collections/all`);
    return firstFound(candidates, signal);
  })();

  // Product: from the products.json handle (setup), else a homepage product link.
  const productPromise = (async () => {
    // Skip gift cards: they are rarely marked up like real products and say little about the catalog.
    const isGiftCard = (p: ShopifyProduct) => /gift[\s_-]?card/i.test(`${p.handle ?? ""} ${p.product_type ?? ""} ${p.title ?? ""}`);
    const handle = (ctx.products.find((p) => p.handle && !isGiftCard(p)) ?? ctx.products.find((p) => p.handle))?.handle;
    const candidates: string[] = [];
    if (handle) candidates.push(`${o}/products/${encodeURIComponent(handle)}`);
    const link = paths.find((x) => /^\/(collections\/[^/]+\/)?products\/[^/]+$/.test(x.p));
    if (link) candidates.push(link.u.toString());
    return firstFound(candidates, signal);
  })();

  const faqPromise = firstFound([`${o}/pages/faq`, `${o}/pages/faqs`], signal);
  const aboutPromise = firstFound([`${o}/pages/about`, `${o}/pages/about-us`, `${o}/pages/our-story`], signal);

  // Blog index: first /blogs/x link (or the blog of a /blogs/x/y link), else /blogs/news. Then its first article.
  const blogPromise = (async () => {
    const blogLink = paths.find((x) => /^\/blogs\/[^/]+$/.test(x.p));
    const articleLink = paths.find((x) => /^\/blogs\/[^/]+\/[^/]+$/.test(x.p) && !/\/tagged\//.test(x.p));
    const candidates: string[] = [];
    if (blogLink) candidates.push(blogLink.u.toString());
    else if (articleLink) candidates.push(`${o}${articleLink.p.split("/").slice(0, 3).join("/")}`);
    if (!candidates.includes(`${o}/blogs/news`)) candidates.push(`${o}/blogs/news`);
    const blog = await firstFound(candidates, signal);
    let article: Fetched | null = null;
    if (blog) {
      const blogPath = stripLocale(new URL(blog.url).pathname).replace(/\/$/, "");
      const link = sameSiteLinks(blog.html, blog.url).find((u) => {
        const p = stripLocale(u.pathname).replace(/\/$/, "");
        return p.startsWith(blogPath + "/") && /^\/blogs\/[^/]+\/[^/]+$/.test(p) && !p.includes("/tagged");
      });
      if (link) article = await getPage(link.toString(), signal);
    }
    if (!article && articleLink) article = await getPage(articleLink.u.toString(), signal);
    return { blog, article };
  })();

  const feedPromise = (async () => {
    emit({ type: "progress", step: "readiness", message: "Checking your product data" });
    // The 250 product feed is often larger than the 2 MB page cap, so it gets a 10 MB cap.
    return safeFetchJson<{ products?: ShopifyProduct[] }>(o + "/products.json?limit=250", {
      signal,
      maxBytes: 10 * 1024 * 1024,
      timeoutMs: 15_000,
    });
  })();

  const [collection, product, faq, about, blogs, feed] = await Promise.all([
    collectionPromise,
    productPromise,
    faqPromise,
    aboutPromise,
    blogPromise,
    feedPromise,
  ]);

  const found: { type: PageType; page: Fetched | null }[] = [
    { type: "Homepage", page: homeHtml ? { url: ctx.homepageFinalUrl ?? o + "/", html: homeHtml } : null },
    { type: "Collection", page: collection },
    { type: "Product", page: product },
    { type: "FAQ", page: faq },
    { type: "Blog", page: blogs.blog },
    { type: "Article", page: blogs.article },
    { type: "About", page: about },
  ];

  const duplicates: string[] = [];
  let productDetails: ProductDetails | null = null;
  let have = 0;
  let possible = 0;
  const pages: ReadinessPage[] = found.map(({ type, page }) => {
    const cells = emptyCells();
    if (!page) return { type, url: null, found: false, cells };
    const ex = extractSchema(page.html);
    for (const col of EXPECTED[type]) {
      const v = cellFor(col, type, ex);
      cells[col] = v;
      possible++;
      have += v === "present" ? 1 : v === "incomplete" ? 0.5 : 0;
    }
    if (type === "Product") {
      const fields = productDetailFields(ex);
      productDetails = { url: page.url, fields, count: countFields(fields) };
      const productNodes = ex.nodes.filter((n) => typesOf(n).some((t) => t === "Product" || t === "ProductGroup")).length;
      const micro = ex.microdata.filter((t) => t === "Product").length;
      const count = productNodes + micro;
      if (count > 1) {
        duplicates.push(
          `Your product page has ${count} separate Product schema blocks. AI tools can read conflicting prices, ratings or names. This often comes from a review app adding its own block.`,
        );
      }
    }
    return { type, url: page.url, found: true, cells };
  });

  const products = productStats(feed?.products ?? ctx.products);
  // Nothing readable at all usually means the store blocked or rate limited the check, not that it has
  // no schema. Report it as an error so it doesn't score 0 and drag the overall score down.
  if (!pages.some((pg) => pg.found) && !products.total) {
    throw new Error("we couldn't read your store's pages. It may be limiting automated visits, so try again later.");
  }
  const grid = possible ? have / possible : 0;
  // Schema is 70% and product data 30%. Without a product feed, the schema grid carries the whole score.
  const schemaWeight = products.total ? 70 : 100;
  const schemaPart = Math.max(0, grid * schemaWeight - 10 * duplicates.length);
  const feedPart = products.total ? 30 * (1 - products.incomplete / products.total) : 0;
  const score = Math.max(0, Math.min(100, Math.round(schemaPart + feedPart)));

  return { score, columns: COLUMNS, pages, duplicates, products, productDetails };
}

export function productStats(list: ShopifyProduct[]): ProductStats {
  let thin = 0;
  let missingImages = 0;
  let missingSku = 0;
  let incomplete = 0;
  for (const p of list) {
    const isThin = htmlToText(p.body_html ?? "").length < 300;
    const noImg = !Array.isArray(p.images) || p.images.length === 0;
    const variants = Array.isArray(p.variants) ? p.variants : [];
    const noSku = variants.length === 0 || variants.some((v) => !v?.sku || !String(v.sku).trim());
    if (isThin) thin++;
    if (noImg) missingImages++;
    if (noSku) missingSku++;
    if (isThin || noImg || noSku) incomplete++;
  }
  return { total: list.length, thin, missingImages, missingSku, incomplete };
}
