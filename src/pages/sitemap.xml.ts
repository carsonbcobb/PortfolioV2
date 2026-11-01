import { execFileSync } from 'node:child_process';
import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/site';
import { CONTENT_PAGES, TOOLS } from '../data/pages';

// Each page with the files its content comes from. lastmod is the last commit touching any of them.
const pages: [string, string[]][] = [
  ['/', ['src/pages/index.astro', 'src/data/site.ts', 'src/data/schema.ts']],
  ['/agencies', ['src/pages/agencies.astro', 'src/data/site.ts', 'src/data/schema.ts']],
  ...CONTENT_PAGES.map((p): [string, string[]] => [`/${p.slug}`, [`src/content/pages/${p.slug}.md`, 'src/data/pages.ts']]),
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
