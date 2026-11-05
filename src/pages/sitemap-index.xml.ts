import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/site';

// Some crawlers look for /sitemap-index.xml (Astro's default name). It points to the one sitemap.
export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${SITE_URL}/sitemap.xml</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n  </sitemap>\n</sitemapindex>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
