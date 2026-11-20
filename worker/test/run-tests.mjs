// End to end tests for the AI Visibility Check worker.
// Starts the mock OpenAI server and `wrangler dev` (local mode, local KV) itself.
// Crawler and readiness checks hit the real stores; OpenAI calls hit the mock.
//
// Usage (Node 22+, wrangler needs it): node test/run-tests.mjs
// Needs worker/.dev.vars with OPENAI_API_KEY (any value), TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
// and OPENAI_BASE_URL=http://127.0.0.1:8790
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const out = path.join(here, "out");
fs.mkdirSync(out, { recursive: true });

const MOCK_PORT = 8790;
// The mock names Northvale in 1 of the 3 answers, Kestrel & Co in 2, Bramblewood and Ostra Goods in all 3,
// and the store itself in 2 (answers 1 and 3).
// The competitor is required now; Kestrel & Co is named in 2 answers.
const STORES = [
  { url: "https://www.allbirds.com", competitor: "Northvale", theirs: 1 },
  { url: "brooklinen.com", competitor: "Kestrel & Co", theirs: 2 },
];
const FAIL_STORE = { url: "https://www.deathwishcoffee.com" };
const IP_A = "198.51.100.10";
const IP_B = "198.51.100.20";
const IP_C = "198.51.100.30";
const ORIGIN = "http://localhost:4321";

const results = [];
const procs = [];
let base = "";
let logFile = "";

/** Owner email subjects the worker logged (RESEND_API_KEY is blank in tests, so it logs instead of sending). */
async function ownerSubjects() {
  await new Promise((r) => setTimeout(r, 800));
  const log = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8") : "";
  return [...log.matchAll(/emails skipped: RESEND_API_KEY is not set \{"owner":"((?:[^"\\]|\\.)*)"\}/g)].map((m) => JSON.parse(`"${m[1]}"`));
}

function record(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
}

function start(cmd, args, logName) {
  // Server logs go under .wrangler/ (gitignored), not test/out.
  fs.mkdirSync(path.join(root, ".wrangler"), { recursive: true });
  const log = fs.createWriteStream(path.join(root, ".wrangler", logName));
  const p = spawn(cmd, args, { cwd: root, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  p.stdout.pipe(log);
  p.stderr.pipe(log);
  procs.push(p);
  return p;
}

function stop(p) {
  try {
    process.kill(-p.pid, "SIGTERM");
  } catch {}
}

async function waitFor(url, ms = 60000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const r = await fetch(url);
      if (r.status < 500) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("timed out waiting for " + url);
}

async function startWorker(port, persist, extraVars = []) {
  fs.rmSync(path.join(root, persist), { recursive: true, force: true });
  const args = ["wrangler", "dev", "--port", String(port), "--ip", "127.0.0.1", "--persist-to", persist, "--show-interactive-dev-session=false"];
  // Always point at the mock, even when .dev.vars holds a real key, so the suite never spends money.
  // RESEND_API_KEY is blanked so the suite never sends real email; the worker logs the owner subject instead.
  for (const v of [`OPENAI_BASE_URL:http://127.0.0.1:${MOCK_PORT}`, "OPENAI_API_KEY:sk-mock-local-only", "TURNSTILE_SECRET_KEY:1x0000000000000000000000000000000AA", "RESEND_API_KEY:", "SITE_URL:http://localhost:4321", ...extraVars]) args.push("--var", v);
  const p = start("npx", args, `wrangler-${port}.log`);
  base = `http://127.0.0.1:${port}`;
  logFile = path.join(root, ".wrangler", `wrangler-${port}.log`);
  await waitFor(base + "/status", 90000);
  return p;
}

async function check(body, ip = IP_A) {
  const t0 = Date.now();
  const res = await fetch(base + "/check", {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN, "cf-connecting-ip": ip },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  const ms = Date.now() - t0;
  let lines = [];
  let json = null;
  if ((res.headers.get("content-type") || "").includes("ndjson")) {
    lines = text.split("\n").filter(Boolean).map((l) => JSON.parse(l));
  } else {
    try {
      json = JSON.parse(text);
    } catch {}
  }
  return { status: res.status, headers: res.headers, text, lines, json, ms };
}

const form = (url) => ({ url, competitor: "Northvale", revenue: "150k_plus", name: "Test Person", email: "test@example.com", token: "XXXX.DUMMY.TOKEN.XXXX" });
const done = (r) => r.lines.find((l) => l.type === "done");
const mock = (p, body) =>
  fetch(`http://127.0.0.1:${MOCK_PORT}${p}`, { method: body ? "POST" : "GET", body: body && JSON.stringify(body) }).then((r) => r.json());

function validReport(rep) {
  const keys = ["domain", "url", "brand", "products", "checkedAt", "overall", "sections", "weights", "cost", "ms"];
  const sec = ["visibility", "accuracy", "crawlers", "readiness"];
  return (
    rep &&
    keys.every((k) => k in rep) &&
    sec.every((k) => k in rep.sections) &&
    Number.isInteger(rep.overall.score) &&
    rep.overall.findings.length === 3 &&
    typeof rep.overall.verdict === "string"
  );
}

function noDashCopy(rep) {
  // User facing strings we write: verdict, findings, section errors. Names like OAI-SearchBot may keep hyphens.
  const strings = [rep.overall.verdict, ...rep.overall.findings, ...Object.values(rep.sections).filter((s) => s.error).map((s) => s.error)];
  return strings.every((s) => !/[–—]|\s-\s/.test(s));
}

/** Email templates: subject, next step per revenue range, and the copy rules. No server needed. */
async function emailChecks() {
  const { build } = await import("esbuild");
  const bundle = path.join(root, ".wrangler", "email-bundle.mjs");
  fs.mkdirSync(path.dirname(bundle), { recursive: true });
  await build({ entryPoints: [path.join(root, "src/email.ts")], bundle: true, format: "esm", platform: "neutral", outfile: bundle, logLevel: "error" });
  const { visitorEmail, ownerEmail } = await import(pathToFileURL(bundle).href + "?t=" + Date.now());
  const sample = path.join(out, "allbirds.com.json");
  const report = fs.existsSync(sample)
    ? JSON.parse(fs.readFileSync(sample, "utf8"))
    : JSON.parse(fs.readFileSync(path.join(out, "e2e-ruggable.com.json"), "utf8"));
  report.headToHead = { source: "visitor", input: "Northvale", name: "Northvale", domain: null, theirs: 2, yours: 1, total: 3 };
  const lead = (revenue) => ({ email: "pat@brand.com", name: "Pat Lee", revenue, source: null });
  const banned = /[–—]|\s-\s|\bfree\b|share of voice|intelligence|roadmap|answer first|AEO|\bcategory\b|intro call|book|20 minute|\bhours?\b/i;
  const link = "http://localhost:4321/ai-visibility-check?result=x&step=3";
  for (const [rev, label, button] of [
    ["under_50k", "Under $50K", "Get the Full Store Audit"],
    ["50k_150k", "$50K to $150K", "See Close the Gap"],
    ["150k_plus", "$150K+", "See Close the Gap"],
  ]) {
    const v = visitorEmail(report, lead(rev), link);
    const o = ownerEmail(report, lead(rev), { domain: report.domain, typed: "Northvale", cached: false, link });
    // Our copy only: product titles come from the store and may have dashes.
    const ownerText = o.text.split("\n\n").slice(0, 3).join("\n").split("\n").filter((l) => !l.startsWith("Top products:")).join("\n");
    record(
      `Emails for ${label}`,
      o.subject === `Gap report: ${report.domain} vs Northvale (${label})` &&
        v.text.includes(button) && v.html.includes(button) &&
        (button === "See Close the Gap" ? v.text.includes("Your gap video is on its way") && v.text.includes("pat@brand.com") : v.text.includes("$50K a month and up")) &&
        ["Revenue range: " + label, "Name: Pat Lee", "Email: pat@brand.com", "Head to head: Northvale 2 of 3", "Full result: " + link].every((x) => o.text.includes(x)) &&
        !banned.test(v.text) && !banned.test(ownerText),
      `${o.subject} | ${v.subject}`,
    );
    if (rev === "150k_plus") {
      fs.writeFileSync(path.join(out, "email-visitor.html"), v.html);
      fs.writeFileSync(path.join(out, "email-visitor.txt"), `Subject: ${v.subject}\n\n${v.text}\n`);
      fs.writeFileSync(path.join(out, "email-owner.html"), o.html);
      fs.writeFileSync(path.join(out, "email-owner.txt"), `Subject: ${o.subject}\n\n${o.text}\n`);
    }
  }
  fs.unlinkSync(bundle);
}

async function main() {
  await emailChecks();
  start("node", ["test/mock-openai.mjs", String(MOCK_PORT)], "mock-openai.log");
  await waitFor(`http://127.0.0.1:${MOCK_PORT}/__stats`);

  // ---------- Phase 1: normal config ----------
  let w = await startWorker(8787, ".wrangler/test-state-1");

  {
    const r = await fetch(base + "/status", { headers: { origin: ORIGIN } });
    const j = await r.json();
    record("GET /status not paused", r.status === 200 && j.paused === false && j.limit === 50, JSON.stringify(j));
    record("CORS header on allowed origin", r.headers.get("access-control-allow-origin") === ORIGIN);
    const pre = await fetch(base + "/check", {
      method: "OPTIONS",
      headers: { origin: ORIGIN, "access-control-request-method": "POST", "access-control-request-headers": "content-type" },
    });
    record(
      "OPTIONS preflight",
      pre.status === 204 && pre.headers.get("access-control-allow-origin") === ORIGIN && /POST/.test(pre.headers.get("access-control-allow-methods") || ""),
      `status ${pre.status}`,
    );
    const bad = await fetch(base + "/status", { headers: { origin: "https://evil.example" } });
    record("No CORS header on other origins", !bad.headers.get("access-control-allow-origin"));
  }

  // bad_request
  for (const [name, body] of [
    ["missing url", { token: "t" }],
    ["bad email", { ...form("allbirds.com"), email: "not-an-email" }],
    ["missing email", { ...form("allbirds.com"), email: undefined }],
    ["missing competitor", { ...form("allbirds.com"), competitor: undefined }],
    ["blank competitor", { ...form("allbirds.com"), competitor: "  " }],
    ["missing revenue", { ...form("allbirds.com"), revenue: undefined }],
    ["unknown revenue", { ...form("allbirds.com"), revenue: "1m_plus" }],
    ["name over 80 chars", { ...form("allbirds.com"), name: "x".repeat(81) }],
    ["brand over 60 chars", { ...form("allbirds.com"), brand: "x".repeat(61) }],
    ["missing token", { ...form("allbirds.com"), token: "" }],
    ["competitor over 100 chars", { ...form("allbirds.com"), competitor: "x".repeat(101) }],
    ["competitor is a number", { ...form("allbirds.com"), competitor: 42 }],
    ["competitor is a private address", { ...form("allbirds.com"), competitor: "http://127.0.0.1/" }],
    ["competitor is the store itself", { ...form("allbirds.com"), competitor: "https://www.allbirds.com/" }],
    ["competitor is only junk", { ...form("allbirds.com"), competitor: "!!! ???" }],
  ]) {
    const r = await check(body);
    record(`400 bad_request: ${name}`, r.status === 400 && r.json?.error === "bad_request", r.json?.message);
  }

  // Step flow endpoints: /result opens a saved report by id, /detect validates the URL.
  {
    const post = async (path, body) => {
      const res = await fetch(base + path, {
        method: "POST",
        headers: { "content-type": "application/json", origin: ORIGIN, "cf-connecting-ip": IP_A },
        body: JSON.stringify(body),
      });
      return { status: res.status, json: await res.json().catch(() => null) };
    };
    const get = async (p) => {
      const res = await fetch(base + p, { headers: { origin: ORIGIN } });
      return { status: res.status, json: await res.json().catch(() => null) };
    };
    let r = await get("/result?id=nope");
    record("/result rejects a malformed id", r.status === 400 && r.json?.error === "bad_request", r.json?.message);
    r = await get("/result?id=00000000-0000-4000-8000-000000000000");
    record("/result 404 for an unknown id", r.status === 404 && r.json?.error === "not_found", r.json?.message);
    const e = await post("/email", { ticket: "00000000-0000-4000-8000-000000000000", email: "a@b.co" });
    record("/email is gone (the email comes with the check)", e.status === 404, String(e.status));
    r = await post("/detect", { url: "http://127.0.0.1" });
    record("/detect rejects a private address", r.status === 400 && r.json?.error === "invalid_url", r.json?.message);
    r = await post("/detect", { url: "allbirds.com" });
    record("/detect reads the brand", r.status === 200 && !!r.json?.brand && !("category" in r.json), JSON.stringify(r.json));
    const rep = await fetch(base + "/report?domain=example.com", { headers: { origin: ORIGIN } });
    record("/report 404 for a store with no saved report", rep.status === 404);
  }

  // invalid_url
  for (const u of [
    "http://127.0.0.1",
    "http://localhost:8787",
    "http://10.0.0.1",
    "ftp://x.com",
    "https://user:pass@allbirds.com",
    "https://allbirds.com:8080",
    "https://printer.local",
    "https://intranet",
    "http://[::1]/",
    "http://2130706433/",
    "https://nas.home.arpa",
  ]) {
    const r = await check(form(u));
    record(`400 invalid_url: ${u}`, r.status === 400 && r.json?.error === "invalid_url", r.json?.message);
  }

  // Real stores, fresh checks (IP A: checks 1 and 2)
  const timings = {};
  for (const s of STORES) {
    await mock("/__reset", {});
    const r = await check({ ...form(s.url), competitor: s.competitor }, IP_A);
    const rep = done(r)?.report;
    const resultId = done(r)?.result;
    const domain = rep?.domain || s.url.replace(/^https?:\/\/(www\.)?/, "");
    if (resultId) {
      const res = await fetch(`${base}/result?id=${resultId}`, { headers: { origin: ORIGIN } });
      const text = await res.text();
      const saved = JSON.parse(text)?.report;
      record(
        `Saved result reopens with the visitor's competitor and no lead data ${domain}`,
        res.status === 200 && saved?.headToHead?.name === s.competitor && !/test@example\.com|150k_plus|Test Person/.test(text),
        `${res.status}, ${saved?.headToHead?.name}`,
      );
    } else record(`Saved result reopens ${domain}`, false, "no result id on done line");
    const subjects = await ownerSubjects();
    record(
      `Owner email for every submission ${domain}`,
      subjects.includes(`Gap report: ${domain} vs ${s.competitor} ($150K+)`),
      subjects.at(-1),
    );
    fs.writeFileSync(path.join(out, `${domain}.ndjson`), r.text);
    if (rep) fs.writeFileSync(path.join(out, `${domain}.json`), JSON.stringify(rep, null, 2));
    timings[domain] = r.ms;
    const progress = r.lines.filter((l) => l.type === "progress").map((l) => l.step + ": " + l.message);
    const sections = r.lines.filter((l) => l.type === "section");
    const okSections = sections.filter((l) => l.data).map((l) => l.key);
    const stats = await mock("/__stats");
    record(
      `Fresh check ${domain}`,
      r.status === 200 && r.headers.get("content-type") === "application/x-ndjson" && validReport(rep) && sections.length === 4 && r.lines.at(-1).type === "done",
      `${(r.ms / 1000).toFixed(1)}s, overall ${rep?.overall.score}, ok sections: ${okSections.join(",")}, cost $${rep?.cost.usd} over ${rep?.cost.calls} calls, mock tokens in ${stats.usage.input} out ${stats.usage.output}, web searches ${stats.webSearchCalls}`,
    );
    record(`Copy has no dashes ${domain}`, rep && noDashCopy(rep));
    const vis = rep?.sections.visibility;
    record(
      `3 questions with sources checked ${domain}`,
      !!vis && vis.total === 3 && vis.questions.length === 3 && typeof vis.sources?.total === "number" &&
        vis.questions.every((q) => q.sources.every((x) => ["yours", "listed", "absent", "unread"].includes(x.presence))) &&
        vis.questions.every((q) => q.sources.every((x) => !/utm_/.test(x.url))),
      vis ? `sources ${vis.sources.total}, on ${vis.sources.on}, unread ${vis.sources.unread}` : "no visibility",
    );
    const named = (vis?.questions ?? []).flatMap((q) => q.brands);
    record(
      `Retailers and publishers never named as brands ${domain}`,
      !!vis && named.length > 0 && !named.some((b) => ["amazon", "wirecutter", "etsy"].includes(b.toLowerCase())) && !/Amazon|Wirecutter|Etsy/.test(rep.overall.verdict),
      JSON.stringify([...new Set(named)]),
    );
    record(
      `Top findings written ${domain}`,
      Array.isArray(rep?.overall.top) && rep.overall.top.length === 3 && rep.overall.top.every((f) => f.text && f.cost),
      JSON.stringify(rep?.overall.top?.map((f) => f.text)),
    );
    const h = rep?.headToHead;
    record(
      `Head to head counts the typed competitor ${domain}`,
      !!h && h.source === "visitor" && h.input === s.competitor && h.name === s.competitor && h.theirs === s.theirs && h.total === vis?.total && h.yours === vis?.mentioned,
      JSON.stringify(h),
    );
    const stats2 = await mock("/__stats");
    const fin = r.lines.filter((l) => l.type === "update").at(-1)?.report ?? rep;
    record(`Head to head adds no OpenAI calls ${domain}`, fin?.cost.calls === stats2.calls, `report ${fin?.cost.calls}, mock ${stats2.calls}`);
    console.log("      competitor:", rep?.competitor ? `${rep.competitor.name} (${rep.competitor.domain}) ${rep.competitor.theirs?.count} vs yours ${rep.competitor.yours?.count}` : "none");
    console.log("      progress:", progress.join(" | "));
    console.log("      findings:", JSON.stringify(rep?.overall.findings));
  }

  // Cache hit. Only complete reports are cached; when a real store limited our visits (readiness failed),
  // the first report is put in the local cache directly so the cache paths are still tested.
  {
    const first = JSON.parse(fs.readFileSync(path.join(out, "allbirds.com.json"), "utf8"));
    if (first && Object.values(first.sections).some((x) => x.error)) {
      const seed = path.join(root, ".wrangler", "seed-report.json");
      fs.writeFileSync(seed, JSON.stringify({ ...first, headToHead: null }));
      const put = spawnSync("npx", ["wrangler", "kv", "key", "put", "report:v2:allbirds.com", "--path", seed, "--binding", "CHECKS", "--local", "--persist-to", ".wrangler/test-state-1"], { cwd: root, encoding: "utf8" });
      console.log("      seeded the cache (a section failed on the real store):", put.status === 0 ? "ok" : put.stderr.slice(0, 300));
    }
    const r = await check(form(STORES[0].url), IP_A);
    record(
      "Cache hit returns instantly",
      r.status === 200 && r.lines.length === 1 && r.lines[0].type === "done" && r.lines[0].cached === true && r.ms < 1500,
      `${r.ms} ms, ${r.lines.length} line(s)`,
    );
    const pub = await (await fetch(base + "/report?domain=allbirds.com", { headers: { origin: ORIGIN } })).json().catch(() => null);
    const h = pub?.report?.headToHead;
    record("Cached report keeps the most named competitor, not an earlier visitor's", h?.source === "top", JSON.stringify(h));
    record("Cached report carries no lead data", !!pub && !/test@example\.com|150k_plus|Test Person|referrer/.test(JSON.stringify(pub)));
    const before = (await ownerSubjects()).length;
    const k = await check({ ...form(STORES[0].url), competitor: "Kestrel & Co", revenue: "under_50k" }, IP_A);
    const hk = k.lines[0]?.report?.headToHead;
    record("Cache hit counts a new competitor on the saved answers", k.lines[0]?.cached === true && hk?.source === "visitor" && hk.name === "Kestrel & Co" && hk.theirs === 2, JSON.stringify(hk));
    const after = await ownerSubjects();
    record(
      "Owner email fires on a cache hit",
      after.length > before && after.at(-1) === "Gap report: allbirds.com vs Kestrel & Co (Under $50K)",
      after.at(-1),
    );
    const u = await check({ ...form(STORES[0].url), competitor: "https://www.brooklinen.com/" }, IP_A);
    const hu = u.lines[0]?.report?.headToHead;
    record("Competitor website is read for its name", hu?.source === "visitor" && hu.domain === "brooklinen.com" && /brooklinen/i.test(hu.name) && hu.theirs === 0, JSON.stringify(hu));
  }

  // A site with no products stops before any AI call, with no score, and doesn't use a check.
  {
    await mock("/__reset", {});
    const r = await check(form("https://example.com"), IP_C);
    const stopped = r.lines.find((l) => l.type === "stopped");
    const stats = await mock("/__stats");
    record(
      "Site with no products stops before any AI call",
      r.status === 200 && stopped?.reason === "not_store" && !r.lines.some((l) => l.type === "done") && stats.calls === 0,
      `${stopped?.reason}: ${stopped?.message} (mock calls ${stats.calls})`,
    );
    const subj = await ownerSubjects();
    record("Owner email fires when the check stops", subj.at(-1) === "Gap report: example.com vs Northvale ($150K+)", subj.at(-1));
  }

  // One section failing (search calls return 500). IP A: check 3.
  {
    await mock("/__mode", { failSearch: true });
    const r = await check(form(FAIL_STORE.url), IP_A);
    await mock("/__mode", { failSearch: false });
    const rep = done(r)?.report;
    fs.writeFileSync(path.join(out, `failure-${rep?.domain || "store"}.ndjson`), r.text);
    const errs = r.lines.filter((l) => l.type === "section" && l.error).map((l) => l.key);
    const oks = r.lines.filter((l) => l.type === "section" && l.data).map((l) => l.key);
    const expectedScore = rep
      ? Math.round((rep.sections.crawlers.score * 15 + rep.sections.readiness.score * 25) / 40)
      : null;
    record(
      "Failing search calls: other sections and done report still arrive",
      r.status === 200 && errs.includes("visibility") && errs.includes("accuracy") && oks.includes("crawlers") && oks.includes("readiness") && validReport(rep),
      `${(r.ms / 1000).toFixed(1)}s, errors: ${errs.join(",")}, ok: ${oks.join(",")}, message: "${rep?.sections.visibility.error ?? r.lines.find((l) => l.type === "stopped")?.message}"`,
    );
    record("Overall reweights over successful sections", rep && rep.overall.score === expectedScore, `overall ${rep?.overall.score}, expected ${expectedScore}`);
    const again = await check(form(FAIL_STORE.url), IP_B);
    // A report with failed sections is not cached, so this is a fresh check from IP B (its 1st), not a cache hit.
    record("Report with a failed section is not cached", again.status === 200 && !again.lines.some((l) => l.cached), `${(again.ms / 1000).toFixed(1)}s`);
  }

  // 4th fresh check from IP A in one day -> 429
  {
    const r = await check(form("https://www.kyliecosmetics.com"), IP_A);
    record("4th fresh check from one IP returns 429", r.status === 429 && r.json?.error === "rate_limited" && !/call|book/i.test(r.json?.message ?? ""), r.json?.message);
    const c = await check(form(STORES[0].url), IP_A);
    record("Cache hit still served after the IP limit", c.status === 200 && c.lines[0]?.cached === true);
  }
  stop(w);
  await new Promise((r) => setTimeout(r, 1500));

  // ---------- Phase 2: DAILY_CHECK_LIMIT=0 ----------
  w = await startWorker(8788, ".wrangler/test-state-2", ["DAILY_CHECK_LIMIT:0"]);
  {
    const s = await (await fetch(base + "/status")).json();
    record("/status paused with DAILY_CHECK_LIMIT=0", s.paused === true && s.limit === 0, JSON.stringify(s));
    const r = await check(form("brooklinen.com", "bed sheets"), "198.51.100.30");
    record(
      "POST /check returns 503 paused",
      r.status === 503 && r.json?.error === "paused" && /carson@carsoncobb\.com/.test(r.json?.message ?? "") && !/call|book/i.test(r.json?.message ?? ""),
      JSON.stringify(r.json),
    );
    const subj = await ownerSubjects();
    record("Owner email fires when checks are paused", subj.at(-1) === "Gap report: brooklinen.com vs Northvale ($150K+)", subj.at(-1));
  }
  stop(w);
  await new Promise((r) => setTimeout(r, 1500));

  // ---------- Phase 3: Turnstile always fails ----------
  w = await startWorker(8789, ".wrangler/test-state-3", ["TURNSTILE_SECRET_KEY:2x0000000000000000000000000000000AA"]);
  {
    const r = await check(form("brooklinen.com", "bed sheets"), "198.51.100.40");
    record("Turnstile failure returns 403 turnstile", r.status === 403 && r.json?.error === "turnstile", r.json?.message);
  }
  stop(w);

  fs.writeFileSync(path.join(out, "timings.json"), JSON.stringify(timings, null, 2));
  fs.writeFileSync(path.join(out, "results.json"), JSON.stringify(results, null, 2));
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  return failed.length;
}

main()
  .then((failed) => {
    procs.forEach(stop);
    process.exit(failed ? 1 : 0);
  })
  .catch((e) => {
    console.error(e);
    procs.forEach(stop);
    process.exit(1);
  });
