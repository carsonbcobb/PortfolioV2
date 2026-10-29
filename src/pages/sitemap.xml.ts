import { execFileSync } from 'node:child_process';
import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/site';

// Each page with the files its content comes from. lastmod is the last commit touching any of them.
const pages: [string, string[]][] = [
  ['/', ['src/pages/index.astro', 'src/data/site.ts', 'src/data/schema.ts']],
  ['/agencies', ['src/pages/agencies.astro', 'src/data/site.ts', 'src/data/schema.ts']],
];

const today = new Date().toISOString().slice(0, 10);

const lastCommit = (files: string[]) => {
  try {
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
