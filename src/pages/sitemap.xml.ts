import { execFileSync } from 'node:child_process';
import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/site';
import { CONTENT_PAGES, TOOLS } from '../data/pages';
import { REPORTS, DESIGNED_PAGES, slugOf } from '../data/reports';
import { GUIDES } from '../data/guides';

// Each page with the files its own content lives in. lastmod is the last commit touching any of them.
// Shared code (site.ts, schema.ts, reports.ts, pages.ts) is left out on purpose: a change to it
// is not a change to every page's content. Amplify fetches full history first (see amplify.yml),
// because a shallow clone would date every file to the oldest commit it has.
const pages: [string, string[]][] = [
  ['/', ['src/pages/index.astro']],
  ['/agencies', ['src/pages/agencies.astro']],
  ['/pricing', ['src/pages/pricing.astro']],
  ['/ai-visibility-check', ['src/pages/ai-visibility-check.astro']],
  ['/results', ['src/content/results.md', 'src/pages/results.astro', 'src/data/results.ts']],
  // Designed pages (ai-search, shopify-conversion-optimization) also render from their own route file.
  ...CONTENT_PAGES.map((p): [string, string[]] => [
    `/${p.slug}`,
    [`src/content/pages/${p.slug}.md`, ...(DESIGNED_PAGES.includes(p.slug) ? [`src/pages/${p.slug}.astro`] : [])],
  ]),
  ['/reports', ['src/content/reports/index.md', 'src/pages/reports/index.astro']],
  ...REPORTS.map(slugOf)
    .filter((s) => s.startsWith('reports/'))
    .map((s): [string, string[]] => [`/${s}`, [`src/content/${s}.md`]]),
  // The hub shows each guide's heading and description, so it changes when they do.
  ['/guides', ['src/pages/guides/index.astro', 'src/content/guides']],
  ...GUIDES.map(slugOf).map((s): [string, string[]] => [`/${s}`, [`src/content/${s}.md`]]),
  ['/tools', ['src/pages/tools/index.astro']],
  ...TOOLS.map((t): [string, string[]] => [`/tools/${t.slug}`, [`src/pages/tools/${t.slug}.astro`]]),
];

const today = new Date().toISOString().slice(0, 10);

// Files with uncommitted changes count as changed today.
const lastCommit = (files: string[]) => {
  try {
    if (execFileSync('git', ['status', '--porcelain', '--', ...files], { encoding: 'utf8' }).trim()) return today;
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', ...files], { encoding: 'utf8' }).trim() || today;
  } catch {
    return today;
  }
};

export const lastmods = pages.map(([p, files]) => [p, lastCommit(files)] as const);

export const GET: APIRoute = () => {
  const urls = lastmods
    .map(([p, d]) => `  <url>\n    <loc>${new URL(p, SITE_URL).href}</loc>\n    <lastmod>${d}</lastmod>\n  </url>`)
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
