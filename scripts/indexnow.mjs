// IndexNow: tells Bing (and the other IndexNow engines) which URLs changed in this deploy, so changes are
// picked up in hours instead of weeks. Runs in the Amplify build after `npm run build`.
//
// How "changed" is decided: every page in dist/sitemap.xml is hashed, and the hashes are compared with
// /indexnow-manifest.json from the live site (written by the previous deploy). New or changed pages are
// sent, plus pages the last deploy had that are gone now, so their removal is picked up too. The new
// manifest ships in dist/ for the next deploy to compare against.
//
// Only runs on the production branch (AWS_BRANCH=master), never fails the build, and never sends
// anything from a local build. The key file is public/<key>.txt.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://www.carsoncobb.com';
const HOST = 'www.carsoncobb.com';
const DIST = 'dist';
const BRANCH = process.env.AWS_BRANCH;
const PRODUCTION = 'master';

const log = (...a) => console.log('[indexnow]', ...a);

const key = readdirSync('public')
  .map((f) => f.match(/^([a-f0-9]{32})\.txt$/)?.[1])
  .find(Boolean);
if (!key) {
  log('no key file in public/, skipping');
  process.exit(0);
}

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const fileFor = (url) => {
  const path = new URL(url).pathname.replace(/\/$/, '');
  return join(DIST, path === '' ? 'index.html' : `${path}.html`);
};
const pages = {};
for (const url of urls) {
  const file = fileFor(url);
  if (existsSync(file)) pages[url] = createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 16);
}

async function fetchWithTimeout(url, opts = {}) {
  return fetch(url, { ...opts, signal: AbortSignal.timeout(15000) });
}

async function main() {
  if (BRANCH !== PRODUCTION) {
    // Ship a manifest anyway so a preview build looks like a normal one, but send nothing.
    writeFileSync(join(DIST, 'indexnow-manifest.json'), JSON.stringify({ pages }, null, 1));
    log(`branch ${BRANCH ?? '(local)'} is not ${PRODUCTION}, nothing sent`);
    return;
  }

  let previous = null;
  try {
    const r = await fetchWithTimeout(`${SITE}/indexnow-manifest.json`);
    if (r.ok) previous = (await r.json()).pages ?? null;
  } catch {}

  const changed = urls.filter((u) => pages[u] && previous?.[u] !== pages[u]);
  const removed = previous ? Object.keys(previous).filter((u) => !pages[u]) : [];
  const toSend = [...changed, ...removed];

  // The key file has to be live before IndexNow will accept a submission. On the very first deploy it
  // isn't yet, so that deploy only ships the key, and everything is sent on the next one.
  let keyLive = false;
  try {
    const r = await fetchWithTimeout(`${SITE}/${key}.txt`);
    keyLive = r.ok && (await r.text()).trim() === key;
  } catch {}

  let sent = false;
  if (!toSend.length) {
    log('no changed URLs');
    sent = true;
  } else if (!keyLive) {
    log(`key file not live yet, ${toSend.length} URLs will be sent on the next deploy`);
  } else {
    try {
      const r = await fetchWithTimeout('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'content-type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList: toSend }),
      });
      sent = r.status === 200 || r.status === 202;
      log(`sent ${toSend.length} URLs, status ${r.status}`);
      for (const u of toSend) log('  ', u);
    } catch (e) {
      log('request failed:', String(e));
    }
  }

  // If nothing went out, keep the old hashes for the changed pages so the next deploy sends them.
  const manifest = sent ? pages : Object.fromEntries(urls.map((u) => [u, previous?.[u] ?? 'unsent']));
  writeFileSync(join(DIST, 'indexnow-manifest.json'), JSON.stringify({ pages: manifest }, null, 1));
}

main().catch((e) => log('error:', String(e)));
