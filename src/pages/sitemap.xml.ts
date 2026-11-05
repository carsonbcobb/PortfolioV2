import { execFileSync } from 'node:child_process';
import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/site';
import { CONTENT_PAGES, TOOLS } from '../data/pages';
import { REPORTS, DESIGNED_PAGES, slugOf } from '../data/reports';

// Each page with the files its content comes from. lastmod is the last commit touching any of them.
const pages: [string, string[]][] = [
  ['/', ['src/pages/index.astro', 'src/data/site.ts', 'src/data/schema.ts']],
  ['/agencies', ['src/pages/agencies.astro', 'src/data/site.ts', 'src/data/schema.ts']],
  ['/pricing', ['src/pages/pricing.astro', 'src/data/site.ts', 'src/data/schema.ts']],
  ['/ai-visibility-check', ['src/pages/ai-visibility-check.astro', 'src/data/site.ts', 'src/data/schema.ts']],
  ['/results', ['src/content/results.md', 'src/pages/results.astro', 'src/data/results.ts']],
  // Designed pages (ai-search, shopify-conversion-optimization) also render from their own route file.
  ...CONTENT_PAGES.map((p): [string, string[]] => [
    `/${p.slug}`,
    [`src/content/pages/${p.slug}.md`, 'src/data/pages.ts', ...(DESIGNED_PAGES.includes(p.slug) ? [`src/pages/${p.slug}.astro`] : [])],
  ]),
  ['/reports', ['src/content/reports/index.md', 'src/pages/reports/index.astro', 'src/data/reports.ts']],
  ...REPORTS.map(slugOf)
    .filter((s) => s.startsWith('reports/'))
    .map((s): [string, string[]] => [`/${s}`, [`src/content/${s}.md`, 'src/data/reports.ts']]),
  ['/tools', ['src/pages/tools/index.astro', 'src/data/pages.ts']],
  ...TOOLS.map((t): [string, string[]] => [`/tools/${t.slug}`, [`src/pages/tools/${t.slug}.astro`, 'src/data/pages.ts']]),
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

export const GET: APIRoute = () => {
  const urls = pages
    .map(
      ([p, files]) =>
        `  <url>\n    <loc>${new URL(p, SITE_URL).href}</loc>\n    <lastmod>${lastCommit(files)}</lastmod>\n  </url>`,
    )
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
