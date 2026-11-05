/** Structured data extraction: JSON-LD (tolerant) and microdata itemtypes. */

export type Node = Record<string, unknown>;

export interface Extracted {
  /** Top level nodes (arrays and @graph flattened). */
  nodes: Node[];
  /** schema.org types declared with microdata itemtype (top level itemscopes only). */
  microdata: string[];
  /** itemprop names seen in microdata, for rough completeness checks. */
  microdataProps: Set<string>;
}

export function extractSchema(html: string): Extracted {
  const nodes: Node[] = [];
  const re = /<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const parsed = tolerantParse(m[1]);
    if (parsed !== undefined) flatten(parsed, nodes, 0);
  }

  const microdata: string[] = [];
  const itemRe = /<[a-z0-9]+\b[^>]*\bitemtype\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while ((m = itemRe.exec(html))) {
    // Skip nested itemscopes that are a property of a parent (they carry itemprop).
    if (/\bitemprop\s*=/.test(m[0])) continue;
    for (const t of m[1].split(/\s+/)) {
      const name = typeName(t);
      if (name) microdata.push(name);
    }
  }
  const microdataProps = new Set<string>();
  const propRe = /\bitemprop\s*=\s*["']([^"']+)["']/gi;
  while ((m = propRe.exec(html))) for (const p of m[1].split(/\s+/)) microdataProps.add(p.toLowerCase());

  return { nodes, microdata, microdataProps };
}

function tolerantParse(raw: string): unknown {
  let s = raw.trim().replace(/^<!\[CDATA\[|\]\]>$/g, "").replace(/^<!--|-->$/g, "").trim();
  if (!s) return undefined;
  try {
    return JSON.parse(s);
  } catch {
    /* try repairs */
  }
  try {
    s = s
      .replace(/[\u0000-\u001f]+/g, " ") // raw newlines/tabs inside strings
      .replace(/,\s*([}\]])/g, "$1"); // trailing commas
    return JSON.parse(s);
  } catch {
    /* try splitting concatenated objects */
  }
  try {
    return JSON.parse("[" + s.replace(/}\s*{/g, "},{") + "]");
  } catch {
    return undefined;
  }
}

function flatten(v: unknown, out: Node[], depth: number) {
  if (depth > 5 || v === null || typeof v !== "object") return;
  if (Array.isArray(v)) {
    for (const x of v) flatten(x, out, depth + 1);
    return;
  }
  const o = v as Node;
  if (Array.isArray(o["@graph"])) {
    for (const x of o["@graph"] as unknown[]) flatten(x, out, depth + 1);
    if (!o["@type"]) return;
  }
  out.push(o);
}

/** "https://schema.org/Product" or "schema:Product" -> "Product". */
export function typeName(t: string): string {
  return t.replace(/^https?:\/\/(www\.)?schema\.org\//i, "").replace(/^schema:/i, "").trim();
}

export function typesOf(node: Node): string[] {
  const t = node["@type"];
  const arr = Array.isArray(t) ? t : t ? [t] : [];
  return arr.map((x) => typeName(String(x)));
}

export function has(node: Node, key: string): boolean {
  const v = node[key];
  if (v === undefined || v === null || v === "") return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

/** Product details AI looks for in Product schema, in display order, with plain labels. */
export const PRODUCT_DETAIL_LABELS: Record<string, string> = {
  name: "Product name",
  description: "Description",
  image: "Images",
  brand: "Brand",
  price: "Price",
  availability: "In stock or not",
  identifier: "SKU or barcode",
  rating: "Star rating",
  reviews: "Review text",
  shipping: "Shipping details",
  returns: "Return policy",
  attributes: "Size, color or material",
};

const IDENT = ["sku", "mpn", "gtin", "gtin8", "gtin12", "gtin13", "gtin14", "productID"];
const ATTRS = ["color", "size", "material", "weight", "pattern", "additionalProperty"];

function asNodes(v: unknown): Node[] {
  const arr = Array.isArray(v) ? v : v ? [v] : [];
  return arr.filter((x): x is Node => !!x && typeof x === "object");
}

/**
 * Which product details a page's schema gives AI. Reads every Product or ProductGroup node and
 * their variants and offers, the same JSON-LD and microdata the readiness scan uses.
 */
export function productDetailFields(ex: Extracted): Record<string, boolean> {
  const out = Object.fromEntries(Object.keys(PRODUCT_DETAIL_LABELS).map((k) => [k, false])) as Record<string, boolean>;
  const products = ex.nodes.filter((n) => typesOf(n).some((t) => t === "Product" || t === "ProductGroup" || t === "IndividualProduct"));
  const all: Node[] = [];
  for (const p of products) {
    all.push(p);
    for (const v of asNodes(p.hasVariant)) all.push(v);
  }
  const offers: Node[] = [];
  for (const n of all) {
    for (const o of asNodes(n.offers)) {
      offers.push(o);
      for (const inner of asNodes(o.offers)) offers.push(inner); // AggregateOffer.offers
    }
  }
  const any = (nodes: Node[], keys: string[]) => nodes.some((n) => keys.some((k) => has(n, k)));
  out.name = any(all, ["name"]);
  out.description = any(all, ["description"]);
  out.image = any(all, ["image"]);
  out.brand = any(all, ["brand"]);
  out.price = any(offers, ["price", "lowPrice", "priceSpecification"]);
  out.availability = any(offers, ["availability"]);
  out.identifier = any(all, IDENT) || any(offers, IDENT);
  out.rating = any(all, ["aggregateRating"]);
  out.reviews = any(all, ["review", "reviews"]);
  out.shipping = any(offers, ["shippingDetails"]);
  out.returns = any(offers, ["hasMerchantReturnPolicy"]) || any(all, ["hasMerchantReturnPolicy"]);
  out.attributes = any(all, ATTRS);

  // Microdata Product markup counts too.
  if (ex.microdata.includes("Product")) {
    const p = ex.microdataProps;
    const m = (keys: string[]) => keys.some((k) => p.has(k.toLowerCase()));
    out.name ||= m(["name"]);
    out.description ||= m(["description"]);
    out.image ||= m(["image"]);
    out.brand ||= m(["brand"]);
    out.price ||= m(["price", "lowPrice"]);
    out.availability ||= m(["availability"]);
    out.identifier ||= m(IDENT);
    out.rating ||= m(["aggregateRating"]);
    out.reviews ||= m(["review"]);
    out.shipping ||= m(["shippingDetails"]);
    out.returns ||= m(["hasMerchantReturnPolicy"]);
    out.attributes ||= m(ATTRS);
  }
  return out;
}

export function countFields(fields: Record<string, boolean>): number {
  return Object.values(fields).filter(Boolean).length;
}
