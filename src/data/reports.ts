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

/** "Nov 1, 2026" */
export const shortDate = (d: Date | string) =>
  new Date(isoDate(d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/** The date the data was checked: the "Data checked" line in the copy, else the last update */
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
