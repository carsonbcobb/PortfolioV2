// Writes hosting/amplify-rules.json: the fixed redirects below, then one 301 per built page from "/page/" to "/page".
// Amplify itself adds a slash to any path it can't find, so a sitewide "strip the slash" rule would loop on missing
// pages. Listing real pages only avoids that. Run after `npm run build` whenever pages are added, then apply the rules
// (see hosting/README.md).
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const OLD = [
  ['/tools/store-check', '/ai-visibility-check'],
  ['/gap-report', '/ai-visibility-check'],
  ['/guides/why-chatgpt-doesnt-recommend-my-shopify-store', '/guides/why-chatgpt-recommends-my-competitor'],
  ['/reports/product-data-depth-answer-first-content', '/reports/shopify-product-data-depth-2026'],
  ['/recharge-vs-skio', '/recharge-vs-skio-vs-loop'],
  ['/recharge-vs-loop', '/recharge-vs-skio-vs-loop'],
  ['/skio-vs-loop', '/recharge-vs-skio-vs-loop'],
  // November 25, 2026: the fractional page is retired, and five benchmark reports merged into one. Amplify targets
  // carry no #anchor; the Astro fallback pages (astro.config.mjs redirects) jump to the right section.
  ['/fractional-head-of-ecommerce', '/pricing'],
  ['/reports/shopify-shipping-policy-benchmarks-2026', '/reports/shopify-store-benchmarks-2026'],
  ['/reports/shopify-return-policy-benchmarks-2026', '/reports/shopify-store-benchmarks-2026'],
  ['/reports/shopify-contact-options-benchmarks-2026', '/reports/shopify-store-benchmarks-2026'],
  ['/reports/shopify-back-in-stock-benchmarks-2026', '/reports/shopify-store-benchmarks-2026'],
  ['/reports/shopify-announcement-bar-benchmarks-2026', '/reports/shopify-store-benchmarks-2026'],
];
// Built pages that are only Astro redirect fallbacks: they get no slash rule of their own (OLD covers them).
const OLD_PATHS = new Set(OLD.map(([a]) => a));
const r301 = (source, target) => ({ source, target, status: '301' });

const pages = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return pages(p);
    return d.name.endsWith('.html') ? ['/' + path.relative(DIST, p).replace(/\.html$/, '')] : [];
  });
const built = pages(DIST).filter((p) => p !== '/index' && p !== '/404' && !OLD_PATHS.has(p)).sort();

const rules = [
  r301('https://carsoncobb.com', 'https://www.carsoncobb.com'),
  r301('/blog', '/guides'),
  r301('/blog/', '/guides'),
  r301('/blog/<*>', '/guides'),
  ...OLD.flatMap(([a, b]) => [r301(a, b), r301(a + '/', b)]),
  ...built.map((p) => r301(p + '/', p)),
  { source: '/<*>', target: '/404.html', status: '404-200' },
];
fs.writeFileSync('hosting/amplify-rules.json', JSON.stringify(rules, null, 2) + '\n');
console.log(`Wrote ${rules.length} rules (${built.length} page slash redirects).`);
