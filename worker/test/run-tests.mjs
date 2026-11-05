// End to end tests for the AI Visibility Check worker.
// Starts the mock OpenAI server and `wrangler dev` (local mode, local KV) itself.
// Crawler and readiness checks hit the real stores; OpenAI calls hit the mock.
//
// Usage (Node 22+, wrangler needs it): node test/run-tests.mjs
// Needs worker/.dev.vars with OPENAI_API_KEY (any value), TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
// and OPENAI_BASE_URL=http://127.0.0.1:8790
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const out = path.join(here, "out");
fs.mkdirSync(out, { recursive: true });

const MOCK_PORT = 8790;
const STORES = [
  { url: "https://www.allbirds.com" },
  { url: "brooklinen.com" },
];
const FAIL_STORE = { url: "https://www.deathwishcoffee.com" };
const IP_A = "198.51.100.10";
const IP_B = "198.51.100.20";
const ORIGIN = "http://localhost:4321";

const results = [];
const procs = [];
let base = "";

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
  for (const v of [`OPENAI_BASE_URL:http://127.0.0.1:${MOCK_PORT}`, "OPENAI_API_KEY:sk-mock-local-only", "TURNSTILE_SECRET_KEY:1x0000000000000000000000000000000AA", ...extraVars]) args.push("--var", v);
  const p = start("npx", args, `wrangler-${port}.log`);
  base = `http://127.0.0.1:${port}`;
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

const form = (url) => ({ url, email: "test@example.com", token: "XXXX.DUMMY.TOKEN.XXXX" });
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

async function main() {
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
    ["brand over 60 chars", { ...form("allbirds.com"), brand: "x".repeat(61) }],
    ["missing token", { ...form("allbirds.com"), token: "" }],
  ]) {
    const r = await check(body);
    record(`400 bad_request: ${name}`, r.status === 400 && r.json?.error === "bad_request", r.json?.message);
  }

  // Step flow endpoints: /email needs a ticket from a verified check, /detect validates the URL.
  {
    const post = async (path, body) => {
      const res = await fetch(base + path, {
        method: "POST",
        headers: { "content-type": "application/json", origin: ORIGIN, "cf-connecting-ip": IP_A },
        body: JSON.stringify(body),
      });
      return { status: res.status, json: await res.json().catch(() => null) };
    };
    let r = await post("/email", { ticket: "nope", email: "a@b.co" });
    record("/email rejects a malformed ticket", r.status === 400 && r.json?.error === "bad_request", r.json?.message);
    r = await post("/email", { ticket: "00000000-0000-4000-8000-000000000000", email: "a@b.co" });
    record("/email rejects an unknown ticket", r.status === 404 && r.json?.error === "expired", r.json?.message);
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
    const r = await check(form(s.url), IP_A);
    const rep = done(r)?.report;
    const ticket = done(r)?.ticket;
    if (ticket) {
      const send = () =>
        fetch(base + "/email", {
          method: "POST",
          headers: { "content-type": "application/json", origin: ORIGIN },
          body: JSON.stringify({ ticket, email: "review@example.com" }),
        });
      const first = await send();
      const second = await send();
      record(`Ticket sends one email for ${s.url}`, first.status === 200 && second.status === 404, `${first.status} then ${second.status}`);
    } else record(`Ticket sends one email for ${s.url}`, false, "no ticket on done line");
    const domain = rep?.domain || s.url.replace(/^https?:\/\/(www\.)?/, "");
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
    record(
      `Top findings written ${domain}`,
      Array.isArray(rep?.overall.top) && rep.overall.top.length === 3 && rep.overall.top.every((f) => f.text && f.cost),
      JSON.stringify(rep?.overall.top?.map((f) => f.text)),
    );
    console.log("      competitor:", rep?.competitor ? `${rep.competitor.name} (${rep.competitor.domain}) ${rep.competitor.theirs?.count} vs yours ${rep.competitor.yours?.count}` : "none");
    console.log("      progress:", progress.join(" | "));
    console.log("      findings:", JSON.stringify(rep?.overall.findings));
  }

  // Cache hit
  {
    const r = await check(form(STORES[0].url), IP_A);
    record(
      "Cache hit returns instantly",
      r.status === 200 && r.lines.length === 1 && r.lines[0].type === "done" && r.lines[0].cached === true && r.ms < 1500,
      `${r.ms} ms, ${r.lines.length} line(s)`,
    );
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
      `${(r.ms / 1000).toFixed(1)}s, errors: ${errs.join(",")}, ok: ${oks.join(",")}, message: "${rep?.sections.visibility.error}"`,
    );
    record("Overall reweights over successful sections", rep && rep.overall.score === expectedScore, `overall ${rep?.overall.score}, expected ${expectedScore}`);
    const again = await check(form(FAIL_STORE.url), IP_B);
    // A report with failed sections is not cached, so this is a fresh check from IP B (its 1st), not a cache hit.
    record("Report with a failed section is not cached", again.status === 200 && !again.lines.some((l) => l.cached), `${(again.ms / 1000).toFixed(1)}s`);
  }

  // 4th fresh check from IP A in one day -> 429
  {
    const r = await check(form("https://www.kyliecosmetics.com"), IP_A);
    record("4th fresh check from one IP returns 429", r.status === 429 && r.json?.error === "rate_limited", r.json?.message);
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
      r.status === 503 && r.json?.error === "paused" && r.json?.message === "Checks are paused for today. Book a review instead.",
      JSON.stringify(r.json),
    );
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
