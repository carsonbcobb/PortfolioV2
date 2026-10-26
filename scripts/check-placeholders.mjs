// Fails the build if any "[" (placeholder text) is left in the built pages.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');

const files = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? files(p) : [p];
  });

let hits = 0;
for (const file of files(DIST)) {
  if (path.extname(file) !== '.html') continue;
  // JSON-LD and inline scripts legitimately contain brackets, so only check page text.
  const text = fs
    .readFileSync(file, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '');
  for (const m of text.match(/\[[^<\n]{0,60}/g) ?? []) {
    hits++;
    console.error(`${path.relative(DIST, file)}: ${m}`);
  }
}

if (hits) {
  console.error(`\nFound ${hits} "[" placeholder(s) in dist/. Replace them before launch.`);
  process.exit(1);
}
console.log('Placeholder check passed: no "[" in dist/.');
