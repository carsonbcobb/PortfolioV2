export interface Env {
  CHECKS: KVNamespace;
  DAILY_CHECK_LIMIT: string;
  ALLOWED_ORIGINS: string;
  BOOKING_URL: string;
  FROM_EMAIL: string;
  NOTIFY_EMAIL: string;
  SMALL_MODEL: string;
  SEARCH_MODEL: string;
  /** Optional model for the buyer questions only; empty means SEARCH_MODEL. */
  BUYER_MODEL?: string;
  OPENAI_BASE_URL: string;
  OPENAI_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
}

export type SectionKey = "visibility" | "accuracy" | "crawlers" | "readiness";
export type ProgressStep = "setup" | SectionKey;

export interface SectionError {
  error: string;
}

export interface Source {
  title: string;
  url: string;
}

/**
 * A source ChatGPT cited, and whether the visitor shows up on it.
 * yours: the visitor's own site. listed: the page names the brand or links to the store.
 * absent: the page was read and the brand is not on it. unread: the page could not be read.
 */
export type SourcePresence = "yours" | "listed" | "absent" | "unread";

export interface CitedSource extends Source {
  host: string;
  presence: SourcePresence;
}

export interface SourcesSummary {
  /** Unique sources cited across all buyer questions. */
  total: number;
  /** Of those, how many are the visitor's site or list the brand. */
  on: number;
  /** How many could not be read (counted as not on). */
  unread: number;
}

export interface VisibilityQuestion {
  question: string;
  mentioned: boolean;
  position: number | null;
  cited: boolean;
  brands: string[];
  answer: string;
  sources: CitedSource[];
}

export interface VisibilitySection {
  score: number;
  mentioned: number;
  total: number;
  questions: VisibilityQuestion[];
  sources: SourcesSummary;
}

/** Product details AI can read from a product page's schema, by field. */
export interface ProductDetails {
  url: string;
  fields: Record<string, boolean>;
  count: number;
}

/** Side by side of the visitor's product page schema and the most recommended competitor's. */
export interface CompetitorCompare {
  name: string;
  domain: string;
  /** Number of buyer questions that recommended this competitor. */
  mentions: number;
  /** null when no product page could be read on the competitor's site. */
  theirs: ProductDetails | null;
  /** null when the visitor's product page could not be read. */
  yours: ProductDetails | null;
  labels: Record<string, string>;
}

/** One of the 3 findings on the score step: the problem and what it costs in sales. */
export interface TopFinding {
  text: string;
  cost: string;
}

export type AccuracyGrade = "accurate" | "partly accurate" | "wrong" | "unknown";

export interface AccuracySection {
  score: number;
  grade: AccuracyGrade;
  answer: string;
  missing: string[];
  wrong: string[];
}

export type RobotsResult = "allowed" | "blocked";
export type FetchResult = "ok" | "blocked" | "challenge" | "error";

export interface BotResult {
  name: string;
  robots: RobotsResult;
  fetch: FetchResult;
  status: number | null;
}

export interface CrawlersSection {
  score: number;
  bots: BotResult[];
  llmsTxt: boolean;
}

export type SchemaColumn =
  | "Organization"
  | "WebSite"
  | "Product"
  | "BreadcrumbList"
  | "ItemList"
  | "FAQPage"
  | "Article";

export type CellValue = "present" | "incomplete" | "missing" | null;
export type PageType = "Homepage" | "Collection" | "Product" | "FAQ" | "Blog" | "Article" | "About";

export interface ReadinessPage {
  type: PageType;
  url: string | null;
  found: boolean;
  cells: Record<SchemaColumn, CellValue>;
}

export interface ProductStats {
  total: number;
  thin: number;
  missingImages: number;
  missingSku: number;
  incomplete: number;
}

export interface ReadinessSection {
  score: number;
  columns: SchemaColumn[];
  pages: ReadinessPage[];
  duplicates: string[];
  products: ProductStats;
  /** Schema product details on the product page that was scanned, or null if none was found. */
  productDetails: ProductDetails | null;
}

export interface Report {
  domain: string;
  url: string;
  category: string;
  brand: string;
  checkedAt: string;
  overall: {
    score: number;
    verdict: string;
    findings: string[];
    /** Written by SMALL_MODEL from all results. Absent when that call failed; the page then builds its own. */
    top?: TopFinding[];
  };
  sections: {
    visibility: VisibilitySection | SectionError;
    accuracy: AccuracySection | SectionError;
    crawlers: CrawlersSection | SectionError;
    readiness: ReadinessSection | SectionError;
  };
  /** Absent or null when no competitor came up or its site could not be read. */
  competitor?: CompetitorCompare | null;
  weights: Record<SectionKey, number>;
  cost: { usd: number; calls: number; searches: number; tokens: { input: number; output: number } };
  ms: number;
}

/** Shared data gathered in the setup step and used by every section. */
export interface StoreContext {
  url: URL; // normalized homepage URL (origin + "/")
  origin: string;
  domain: string;
  category: string;
  brand: string;
  homepageHtml: string | null;
  homepageStatus: number | null;
  homepageFinalUrl: string | null;
  products: ShopifyProduct[]; // first ~10 from products.json, may be empty
}

export interface ShopifyProduct {
  id?: number;
  title?: string;
  handle?: string;
  body_html?: string | null;
  product_type?: string;
  vendor?: string;
  images?: unknown[];
  variants?: { sku?: string | null }[];
}

export type Emit = (obj: Record<string, unknown>) => void;
