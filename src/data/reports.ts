// Markdown pages (src/content/pages and src/content/reports) and the reports among them: their routes,
// check dates and table headers, for the routes, /reports, the JSON-LD, sitemap and llms.txt.
import type { MarkdownInstance } from 'astro';
import { pageBySlug } from './pages';

export interface PageFrontmatter {
  title: string;
  description: string;
  slug: string;
  h1: string;
  datePublished?: Date | string;
  dateModified?: Date | string;
  /** Reports: how many stores and products the data covers */
  reportStores?: number;
  reportProducts?: number;
  // link: an optional page link shown after the answer. It stays out of the FAQPage schema text.
  faq?: { question: string; answer: string; link?: { text: string; href: string } }[];
}

export type MarkdownPage = MarkdownInstance<PageFrontmatter>;

const pageFiles = Object.values(import.meta.glob<MarkdownPage>('../content/pages/*.md', { eager: true }));
const reportFiles = Object.values(import.meta.glob<MarkdownPage>('../content/reports/*.md', { eager: true }));

/** Path without the leading slash, as used in routes and CONTENT_PAGES */
export const slugOf = (page: MarkdownPage) => page.frontmatter.slug.replace(/^\//, '');

/** The /reports hub (src/content/reports/index.md) */
export const REPORT_HUB = reportFiles.find((p) => slugOf(p) === 'reports')!;

/** Every markdown page that gets its own route: the content pages and the reports */
export const MARKDOWN_PAGES = [...pageFiles, ...reportFiles.filter((p) => p !== REPORT_HUB)];

const isReport = (page: MarkdownPage) =>
  slugOf(page).startsWith('reports/') || pageBySlug(slugOf(page)).kind === 'report';

/** Every report, in the order the hub lists them */
export const REPORTS = (() => {
  const order = [...REPORT_HUB.rawContent().matchAll(/\]\((\/[^)#]+)\)/g)].map((m) => m[1].slice(1));
  const rank = (p: MarkdownPage) => (order.includes(slugOf(p)) ? order.indexOf(slugOf(p)) : order.length);
  return MARKDOWN_PAGES.filter(isReport).sort((a, b) => rank(a) - rank(b));
})();

export const isReportPage = (page: MarkdownPage) => REPORTS.includes(page);

// Frontmatter dates can arrive as Date objects or ISO strings.
export const isoDate = (d: Date | string) => new Date(d).toISOString().slice(0, 10);

/** "November 2026". Visible report dates show month and year only; full ISO dates stay in the data. */
export const monthYear = (d: Date | string) =>
  new Date(isoDate(d)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** True when two ISO dates fall in the same month */
export const sameMonth = (a: string, b: string) => a.slice(0, 7) === b.slice(0, 7);

/** "Data checked November 4, 2026", "Data collected November 4 and 5, 2026" or "November 4 to 17, 2026": month, last day, year */
const CHECKED = /Data (?:checked|collected) ([A-Z][a-z]+) (?:\d{1,2} (?:and|to) )?(\d{1,2}), (\d{4})/;

/** The date the data was checked: the last full day named in the copy, else the last update */
export function checkedDate(page: MarkdownPage) {
  const m = page.rawContent().match(CHECKED);
  const fm = page.frontmatter;
  if (m) return isoDate(new Date(`${m[1]} ${m[2]}, ${m[3]} UTC`));
  return isoDate(fm.dateModified ?? fm.datePublished ?? new Date());
}

/** Reports whose Dataset covers a single day. Every other Dataset covers the month it was collected in. */
const DAY_COVERAGE = new Set(['reports/google-rankings-vs-ai-mode-2026']);

/** Dataset temporalCoverage: the checked day for the reports above, else its month */
export function coverage(page: MarkdownPage) {
  const d = checkedDate(page);
  return DAY_COVERAGE.has(slugOf(page)) ? d : d.slice(0, 7);
}

/** Roundups of other people's figures: an Article with no Dataset of its own */
export const ROUNDUPS = [
  'reports/ai-search-statistics-2026',
  'reports/chatgpt-shopping-statistics-2026',
  'reports/google-ai-mode-statistics-2026',
  'reports/agentic-commerce-statistics-2026',
  'reports/ai-referral-traffic-statistics-2026',
  'reports/cart-abandonment-statistics-2026',
];

/** Unique column headers across the page's markdown tables */
export function tableHeaders(page: MarkdownPage) {
  const lines = page.rawContent().split('\n');
  const headers = lines.flatMap((line, i) =>
    /^\|( *:?-+:? *\|)+\s*$/.test(lines[i + 1] ?? '')
      ? line
          .split('|')
          .slice(1, -1)
          .map((h) => h.trim())
      : [],
  );
  return [...new Set(headers.filter(Boolean))];
}

/** The first bullet under "## The short version", as plain text without markdown emphasis */
export function shortVersion(page: MarkdownPage) {
  const raw = page.rawContent();
  const section = raw.split(/^## The short version\s*$/m)[1];
  const bullet = section?.match(/^- (.+)$/m)?.[1];
  if (!bullet) throw new Error(`${slugOf(page)} needs a bullet under "## The short version"`);
  return bullet.replace(/\*\*|__/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
}

/** True when the report has a "## The short version" list */
export const hasShortVersion = (page: MarkdownPage) => /^## The short version\s*$/m.test(page.rawContent());

/** The first sentence of a piece of plain text */
export const firstSentence = (text: string) => text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;

// Hub sections whose reports count as AI search research. "Start here" reports count too, unless they
// also sit in another section (the CRO checklist sits under Conversion benchmarks).
const AI_SECTIONS = ['AI search research', 'How AI picks products', 'Statistics', 'AI search by product area'];
const START_HERE = 'Start here';
/** Statistics reports about conversion, not AI search */
const NOT_AI = ['reports/cart-abandonment-statistics-2026'];

/** The reports listed in the hub's AI sections, in hub order */
export const AI_RESEARCH = (() => {
  const sections = REPORT_HUB.rawContent()
    .split(/^## /m)
    .slice(1)
    .map((part) => ({
      heading: part.split('\n')[0].trim(),
      slugs: [...part.matchAll(/\]\((\/[^)#]+)\)/g)].map((m) => m[1].slice(1)),
    }));
  for (const slug of sections.flatMap((s) => s.slugs)) {
    if (!REPORTS.some((r) => slugOf(r) === slug)) throw new Error(`The reports hub links to /${slug}, which is not a report`);
  }
  const inSection = (slug: string, test: (h: string) => boolean) =>
    sections.some((s) => test(s.heading) && s.slugs.includes(slug));
  return REPORTS.filter((r) => {
    const slug = slugOf(r);
    if (NOT_AI.includes(slug)) return false;
    if (inSection(slug, (h) => AI_SECTIONS.includes(h))) return true;
    return inSection(slug, (h) => h === START_HERE) && !inSection(slug, (h) => h !== START_HERE);
  });
})();

/** Pages with a designed layout in src/pages/{slug}.astro. Their markdown supplies the frontmatter and Read more sections. */
export const DESIGNED_PAGES = ['ai-search', 'shopify-conversion-optimization'];

/** A designed page's markdown, and its rendered h2 sections keyed by heading text */
export async function designedPage(slug: string) {
  const page = MARKDOWN_PAGES.find((p) => slugOf(p) === slug);
  if (!page) throw new Error(`No markdown page at /${slug}`);
  const html = await page.compiledContent();
  const sections = new Map<string, string>();
  for (const part of html.split(/(?=<h2[ >])/)) {
    const m = part.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/);
    if (m) sections.set(m[1].replace(/<[^>]+>/g, '').replace(/&#39;|&#x27;|’/g, "'").trim(), part.slice(m[0].length).trim());
  }
  /** The body of one section, by its heading. Throws if the heading is missing, so a rename can't silently drop copy. */
  const section = (heading: string) => {
    const body = sections.get(heading);
    if (body === undefined) throw new Error(`/${slug} has no "## ${heading}" section`);
    return body;
  };
  return { page, fm: page.frontmatter, section };
}
