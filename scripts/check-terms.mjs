// Fails the build if any banned term appears anywhere in the built site.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const BANNED = [
  // AEO, AI search, LLM and AI platform names are allowed since the AI search and CRO repositioning (Nov 2026).
  // No client brand names and no old audit price. Audits themselves are now offered (Ways to work together).
  /\bGEM\b/i,
  /\$2,000/,
  // Retired plans, hourly terms, and positioning (Round 3).
  /Essentials/,
  /Full Ownership/,
  /\$1,500\/mo/,
  // $2,500 is allowed: it is the Close the Gap Focus price.
  // Retired offers (Close the Gap repositioning, Nov 18, 2026): the audit, the Build and the retainers.
  /\$1,500\b/,
  /\$1,250\b/,
  /AI Search and Conversion Audit/i,
  /AI Search and Visibility Audit/i,
  /\$4,500/,
  /\$7,500\/mo/,
  /\b(Core|Growth|Full|Dedicated) retainer/,
  /Builds? a month/,
  /\bfree (AI Visibility )?check\b/i,
  /free AI Visibility Check/i,
  /hours per month/i,
  /whole team/i,
  /Store Operator/i,
  // No hourly pricing anywhere (AI search and CRO repositioning).
  /\$125\b/,
  /hour block/i,
  /\bhourly\b/i,
  /per hour/i,
  /\/hr\b/,
  // No calls (close without calls, Nov 19, 2026): buyers go from the gap report to a video to paying online.
  /intro call/i,
  /book a call/i,
  /book an intro/i,
  /book the audit/i,
  /20 minute/i,
  /calendar\.app\.google/,
  /calendar\.google\.com\/calendar\/appointments/,
  /AI search audits/i,
];
// Pages where one banned term is allowed on purpose. /about names Carson's in house roles, Gem among them,
// as he asked on November 14, 2026. Everywhere else it stays banned.
// $1,500 and $2,000 are allowed only in the AI search help report, where they are ranges ChatGPT and Google AI Mode quoted
// for other providers. Never on /pricing (removed November 24, 2026, since ChatGPT repeats an old $1,500 price).
const ALLOWED = new Map([
  [/\bGEM\b/i.source, ['about.html']],
  [/\$1,500\b/.source, ['reports/who-ai-recommends-ai-search-agencies-shopify-2026.html']],
  [/\$2,000/.source, ['reports/who-ai-recommends-ai-search-agencies-shopify-2026.html']],
]);
const TEXT_EXT = new Set(['.html', '.xml', '.txt', '.json', '.js', '.css', '.svg', '.webmanifest']);

const files = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? files(p) : [p];
  });

let hits = 0;
for (const file of files(DIST)) {
  if (!TEXT_EXT.has(path.extname(file))) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const re of BANNED) {
    if (ALLOWED.get(re.source)?.includes(path.relative(DIST, file))) continue;
    const m = text.match(new RegExp(re.source, re.flags + 'g'));
    if (m) {
      hits += m.length;
      console.error(`${path.relative(DIST, file)}: ${m.length} × "${m[0]}"`);
    }
  }
}

if (hits) {
  console.error(`\nFound ${hits} banned term(s) in dist/.`);
  process.exit(1);
}
console.log('Banned-term check passed: 0 results in dist/.');
