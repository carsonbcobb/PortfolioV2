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
  /** Used for the last retry when the primary model keeps failing. Empty means no fallback. */
  FALLBACK_MODEL?: string;
  OPENAI_BASE_URL: string;
  OPENAI_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
}

export type SectionKey = "visibility" | "accuracy" | "crawlers" | "readiness";
export type ProgressStep = "setup" | SectionKey;

export interface SectionError {
  error: string;
  /** True while the section is still finishing after the first results were sent. */
  pending?: boolean;
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
  /** The store product this question was built from. */
  product?: string;
  mentioned: boolean;
  position: number | null;
  cited: boolean;
  brands: string[];
  answer: string;
  sources: CitedSource[];
  /** True when the question was rewritten with more product detail after a first answer named no brands. */
  retried?: boolean;
  /** True when ChatGPT still asked a clarifying question or named no brands. Left out of the score. */
  excluded?: boolean;
}

export interface VisibilitySection {
  score: number;
  mentioned: number;
  /** Questions scored: the ones where ChatGPT named brands. 0 means this section is left out of the overall score. */
  total: number;
  /** Questions asked, including any left out of the score. */
  asked?: number;
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

/** One product detail and how many of the checked product pages give it to AI. */
export interface ReadinessRow {
  key: string;
  label: string;
  on: number;
  of: number;
  status: "good" | "partial" | "missing";
}

/** One checked product page and the details it gives AI. */
export interface ReadinessProduct {
  title: string;
  url: string;
  has: Record<string, boolean>;
}

export interface ReadinessSection {
  score: number;
  /** Product pages read for this section. */
  checked: number;
  rows: ReadinessRow[];
  products: ReadinessProduct[];
  /** Product detail fields on the first product page, for the competitor side by side. */
  productDetails: ProductDetails | null;
}

export interface Report {
  domain: string;
  url: string;
  brand: string;
  /** The store's top products the buyer questions were built from. */
  products?: string[];
  checkedAt: string;
  overall: {
    score: number;
    verdict: string;
    findings: string[];
    /** Written by SMALL_MODEL from all results. Absent when that call failed; the page then builds its own. */
    top?: TopFinding[];
    /** Set when some checks couldn't run, so the score covers only the ones that did. */
    note?: string;
    /** The sections left out of the score. */
    unscored?: SectionKey[];
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
  cost: {
    usd: number;
    calls: number;
    searches: number;
    tokens: { input: number; output: number };
    log?: { step: string; model: string; input: number; cached: number; output: number; reasoning: number; searches: number; actions?: string[]; usd: number }[];
  };
  ms: number;
}

/** Shared data gathered in the setup step and used by every section. */
export interface StoreContext {
  url: URL; // normalized homepage URL (origin + "/")
  origin: string;
  domain: string;
  brand: string;
  homepageHtml: string | null;
  homepageStatus: number | null;
  homepageFinalUrl: string | null;
  /** The product feed (up to 250), read once per run and reused by every section. May be empty. */
  products: ShopifyProduct[];
  /** The store's featured or best selling products, best first (up to 8). */
  top: ShopifyProduct[];
  /** True when the homepage looks like an online store (Shopify, cart, Product schema). */
  storeSignals?: boolean;
}

export interface ShopifyProduct {
  id?: number;
  title?: string;
  handle?: string;
  body_html?: string | null;
  product_type?: string;
  vendor?: string;
  tags?: string[] | string;
  images?: unknown[];
  variants?: { sku?: string | null; price?: string | null; available?: boolean; requires_shipping?: boolean }[];
}

/** Where the visitor first came from, saved by the site on their first visit. Only sent in the owner email. */
export interface VisitSource {
  referrer: string;
  landing: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

/** Why a check stopped before any AI calls. */
export type StopReason = "not_store" | "no_products" | "unreadable";

export type Emit = (obj: Record<string, unknown>) => void;
