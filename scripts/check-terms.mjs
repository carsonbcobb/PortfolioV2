// Fails the build if any banned term appears anywhere in the built site.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const BANNED = [
  /AI search/i,
  /\bAEO\b/i,
  /answer engine/i,
  /ChatGPT/i,
  /\bLLMs?\b/i,
  // No client brand names, no standalone audit offer, no old audit price.
  // "Audited" (a verb in Recent Work), the agencies page's "audit recommendations", and the Store Sprint's
  // "audit of conversion" bullet are allowed.
  /\bGEM\b/i,
  /\baudits?\b(?! recommendations| of conversion)/i,
  /\$2,000/,
  // Retired plans, hourly terms, and positioning (Round 3).
  /Essentials/,
  /Full Ownership/,
  /\$1,500\/mo/,
  /\$2,500/,
  /\$4,500/,
  /hours per month/i,
  /whole team/i,
  /Store Operator/i,
];
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
