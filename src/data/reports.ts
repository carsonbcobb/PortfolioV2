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
  faq?: { question: string; answer: string }[];
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

/** The date the data was checked: a full "Data checked" date in the copy, else the last update */
export function checkedDate(page: MarkdownPage) {
  const m = page.rawContent().match(/Data checked ([A-Z][a-z]+ \d{1,2}, \d{4})/);
  const fm = page.frontmatter;
  if (m) return isoDate(new Date(`${m[1]} UTC`));
  return isoDate(fm.dateModified ?? fm.datePublished ?? new Date());
}

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

/** The first sentence of a piece of plain text */
export const firstSentence = (text: string) => text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;

/** The reports listed under "## AI search research" on the hub, in hub order */
export const AI_RESEARCH = (() => {
  const section = REPORT_HUB.rawContent().split(/^## AI search research\s*$/m)[1]?.split(/^## /m)[0] ?? '';
  return [...section.matchAll(/\]\((\/[^)#]+)\)/g)].map((m) => {
    const report = REPORTS.find((r) => slugOf(r) === m[1].slice(1));
    if (!report) throw new Error(`AI search research links to ${m[1]}, which is not a report`);
    return report;
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
