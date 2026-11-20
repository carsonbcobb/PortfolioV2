import { LIMITS, TIMEOUTS, WEIGHTS } from "./config";
import { runAccuracy } from "./checks/accuracy";
import { runCrawlers } from "./checks/crawlers";
import { runReadiness } from "./checks/readiness";
import { runVisibility } from "./checks/visibility";
import { compareCompetitor } from "./checks/competitor";
import { headToHead, parseRival, resolveRival, type RivalInput } from "./checks/headtohead";
import { resultUrl, sendLeadNotice, sendReportEmails } from "./email";
import {
  cacheReport,
  dailyLimit,
  getCachedReport,
  incrementCounters,
  ipCount,
  todayCount,
} from "./limits";
import { CostTracker, OpenAI } from "./openai";
import { buildFindings, digest, isError, overallScore, scoreNote, unscoredSections, verdictFor, writeTopFindings } from "./scoring";
import { loadStore, STOP_MESSAGES, stopReason } from "./store";
import { utcDay } from "./limits";
import type {
  CompetitorCompare,
  Emit,
  Env,
  Lead,
  ReadinessSection,
  Report,
  SectionError,
  SectionKey,
  StopReason,
  StoreContext,
  TopFinding,
  VisibilitySection,
  VisitSource,
} from "./types";
import { cleanName, dnsProblem, domainOf, isValidEmail, parseRevenue, parseStoreUrl } from "./validate";

const PAUSED_MESSAGE =
  "Gap reports are paused for today. Email carson@carsoncobb.com with your store and your top competitor, and I'll send yours.";
const RATE_MESSAGE =
  "You've run 3 gap reports today. Come back tomorrow, or email carson@carsoncobb.com with your store and your top competitor.";

// ---------- HTTP helpers ----------

function corsHeaders(req: Request, env: Env): Record<string, string> {
  const origin = req.headers.get("origin");
  const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  const h: Record<string, string> = { vary: "Origin" };
  if (origin && allowed.includes(origin)) {
    h["access-control-allow-origin"] = origin;
    h["access-control-allow-methods"] = "GET, POST, OPTIONS";
    h["access-control-allow-headers"] = "content-type";
    h["access-control-max-age"] = "86400";
  }
  return h;
}

function json(req: Request, env: Env, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...corsHeaders(req, env) },
  });
}

function fail(req: Request, env: Env, status: number, error: string, message: string): Response {
  return json(req, env, { error, message }, status);
}

// ---------- Turnstile ----------

async function verifyTurnstile(env: Env, token: string, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) {
    console.error("TURNSTILE_SECRET_KEY is not set; rejecting");
    return false;
  }
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (e) {
    console.error("turnstile error", String(e));
    return false;
  }
}

// ---------- NDJSON stream ----------

function ndjsonStream(req: Request, env: Env): { response: Response; emit: Emit; close: () => Promise<void> } {
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const enc = new TextEncoder();
  let closed = false;
  const emit: Emit = (obj) => {
    if (closed) return;
    writer.write(enc.encode(JSON.stringify(obj) + "\n")).catch(() => {
      closed = true; // client went away; keep working so the report still caches and emails
    });
  };
  const close = async () => {
    if (closed) return;
    closed = true;
    await writer.close().catch(() => {});
  };
  const response = new Response(readable, {
    status: 200,
    headers: {
      "content-type": "application/x-ndjson",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...corsHeaders(req, env),
    },
  });
  return { response, emit, close };
}

// ---------- The check ----------

const SECTION_FAIL: Record<SectionKey, string> = {
  visibility: "ChatGPT didn't answer our buyer questions on this run. Please run the check again later.",
  // Only shown if every retry and the fallback model failed, after the page already waited.
  accuracy: "ChatGPT didn't give a clear answer about your brand on this run. Please run the check again later.",
  crawlers: "We could not test AI crawler access to your store this time.",
  readiness: "We could not scan your store pages this time.",
};
const SECTION_TIMEOUT = "This part took too long, so we stopped it to keep your report quick.";

class SectionTimeout extends Error {}

async function runSection<T>(
  key: SectionKey,
  overall: AbortSignal,
  emit: Emit,
  fn: (signal: AbortSignal) => Promise<T>,
): Promise<T | SectionError> {
  const ctl = new AbortController();
  const onOverall = () => ctl.abort();
  overall.addEventListener("abort", onOverall);
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      ctl.abort();
      reject(new SectionTimeout());
    }, TIMEOUTS.sections[key]);
  });
  const overallTimeout = new Promise<never>((_, reject) => {
    if (overall.aborted) reject(new SectionTimeout());
    overall.addEventListener("abort", () => reject(new SectionTimeout()));
  });
  try {
    const data = await Promise.race([fn(ctl.signal), timeout, overallTimeout]);
    emit({ type: "section", key, data });
    return data;
  } catch (e) {
    console.error(`section ${key} failed`, e instanceof Error ? e.message : String(e));
    // Errors we wrote for the visitor ("we couldn't read your products...") are shown as is.
    const msg = e instanceof Error ? e.message : "";
    const own = /^we couldn't /.test(msg) ? msg.charAt(0).toUpperCase() + msg.slice(1) : "";
    const error = e instanceof SectionTimeout || ctl.signal.aborted ? SECTION_TIMEOUT : own || SECTION_FAIL[key];
    emit({ type: "section", key, error });
    return { error };
  } finally {
    if (timer) clearTimeout(timer);
    overall.removeEventListener("abort", onOverall);
  }
}

/** Shown in the brand accuracy card while that check finishes after the rest of the report is ready. */
const ACCURACY_PENDING = "Still checking what AI says about your brand. This usually takes another 30 seconds.";
const NEVER = new AbortController().signal;

type Run = { report: Report; complete: boolean };
type Stopped = { stopped: StopReason };

/**
 * Runs every section. Brand accuracy is not bound by the overall deadline: when the other sections are
 * done first, the report goes out with accuracy marked pending, and `rest` resolves with the final report.
 */
async function runCheck(
  env: Env,
  input: { url: URL; domain: string; brand?: string; rival?: Promise<RivalInput | null> },
  emit: Emit,
  /** Called once the site is confirmed as a store with products, before the first AI call. */
  onStart: () => Promise<void>,
): Promise<(Run & { rest?: Promise<Run> }) | Stopped> {
  const started = Date.now();
  const overallCtl = new AbortController();
  const overallTimer = setTimeout(() => overallCtl.abort(), TIMEOUTS.overallMs);
  const cost = new CostTracker();

  try {
    emit({ type: "progress", step: "setup", message: "Reading your store" });
    const store: StoreContext = await loadStore(input.url, input.domain, overallCtl.signal);
    // The visitor confirmed or edited the detected brand name on the page.
    if (input.brand) store.brand = input.brand;
    // Only stores with products we can read get questions, a score and AI spend.
    const stop = stopReason(store);
    if (stop) return { stopped: stop };
    await onStart();
    const sig = overallCtl.signal;

    const visibilityP = runSection("visibility", sig, emit, (s) => runVisibility(store, new OpenAI(env, cost, s), emit, s));
    const readinessP = runSection("readiness", sig, emit, (s) => runReadiness(store, emit, s));
    // The competitor scan starts as soon as visibility names one and readiness has read the product page.
    const competitorP = (async (): Promise<CompetitorCompare | null> => {
      const [v, r] = await Promise.all([visibilityP, readinessP]);
      if (isError(v) || sig.aborted) return null;
      emit({ type: "progress", step: "readiness", id: "rival", message: "Comparing your product data with your top competitor" });
      const ctl = AbortSignal.any([sig, AbortSignal.timeout(20_000)]);
      try {
        return await compareCompetitor(v as VisibilitySection, isError(r) ? null : (r as ReadinessSection), store, ctl);
      } catch (e) {
        console.error("competitor failed", String(e));
        return null;
      } finally {
        emit({ type: "tick", id: "rival" });
      }
    })();
    // Accuracy has its own, longer budget (TIMEOUTS.sections.accuracy) and ignores the overall deadline.
    const accuracyP = runSection("accuracy", NEVER, emit, (s) => runAccuracy(store, new OpenAI(env, cost, s), emit));
    const [visibility, crawlers, readiness, competitor] = await Promise.all([
      visibilityP,
      runSection("crawlers", sig, emit, (s) => runCrawlers(store, emit, s)),
      readinessP,
      competitorP,
    ]);
    // Counted on the answers the check already has: no extra AI calls.
    const rival = input.rival ? await input.rival : null;
    const h2h = headToHead(isError(visibility) ? null : (visibility as VisibilitySection), store, rival, competitor);

    const build = async (accuracy: Report["sections"]["accuracy"], findingsSignal: AbortSignal): Promise<Run> => {
      const sections = { visibility, accuracy, crawlers, readiness } as Report["sections"];
      emit({ type: "progress", step: "setup", message: "Scoring your report" });
      const score = overallScore(sections);
      const unscored = unscoredSections(sections);
      const findings = buildFindings(store.brand, sections);
      let top: TopFinding[] | null = null;
      if (!findingsSignal.aborted && env.OPENAI_API_KEY) {
        const ctl = AbortSignal.any([findingsSignal, AbortSignal.timeout(12_000)]);
        top = await writeTopFindings(new OpenAI(env, cost, ctl), digest(store.brand, topTitles(store), sections, competitor));
      }
      const report: Report = {
        domain: store.domain,
        url: store.origin,
        brand: store.brand,
        products: topTitles(store),
        checkedAt: new Date().toISOString(),
        overall: {
          score,
          verdict: verdictFor(score, store.brand, sections.visibility, store.domain),
          findings: top ? top.map((f) => `${f.text} ${f.cost}`) : findings,
          ...(top ? { top } : {}),
          ...(unscored.length ? { unscored, note: scoreNote(unscored) } : {}),
        },
        sections,
        competitor,
        headToHead: h2h,
        weights: { ...WEIGHTS },
        cost: { usd: Math.round(cost.usd * 10000) / 10000, calls: cost.calls, searches: cost.searches, tokens: { ...cost.tokens }, log: cost.log },
        ms: Date.now() - started,
      };
      return { report, complete: !Object.values(sections).some(isError) };
    };

    // Give accuracy a few more seconds; if it still isn't back, send the report now and finish it after.
    const PENDING = Symbol("pending");
    const early = await Promise.race([accuracyP, new Promise<typeof PENDING>((r) => setTimeout(() => r(PENDING), 3000))]);
    if (early !== PENDING) return build(early, overallCtl.signal);
    emit({ type: "section", key: "accuracy", pending: true, message: ACCURACY_PENDING });
    const first = await build({ error: ACCURACY_PENDING, pending: true }, overallCtl.signal);
    const rest = accuracyP.then((accuracy) => build(accuracy, AbortSignal.timeout(15_000)));
    return { ...first, complete: false, rest };
  } finally {
    clearTimeout(overallTimer);
  }
}

function topTitles(store: StoreContext): string[] {
  return store.top.map((p) => (p.title ?? "").trim()).filter(Boolean).slice(0, 3);
}

// ---------- Routes ----------

async function handleStatus(req: Request, env: Env): Promise<Response> {
  const limit = dailyLimit(env);
  let count = 0;
  try {
    count = await todayCount(env);
  } catch (e) {
    console.error("kv error", String(e));
  }
  return json(req, env, { paused: count >= limit, limit });
}

async function handleCheck(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch {
    return fail(req, env, 400, "bad_request", "Please send the form again.");
  }

  // 1. Validate fields
  // Questions are built from the store's own products, so no category is asked for (one sent by an older page is ignored).
  const { url, email, token, brand } = body;
  const source = cleanSource(body.source);
  if (typeof url !== "string" || !url.trim()) return fail(req, env, 400, "bad_request", "Please enter your store URL.");
  if (typeof email !== "string" || !isValidEmail(email.trim())) return fail(req, env, 400, "bad_request", "Please enter a valid work email.");
  const revenueParsed = parseRevenue(body.revenue);
  if ("problem" in revenueParsed) return fail(req, env, 400, "bad_request", revenueParsed.problem);
  const name = cleanName(body.name);
  if (name === null) return fail(req, env, 400, "bad_request", "Please keep your name under 80 characters.");
  if (brand !== undefined && (typeof brand !== "string" || brand.trim().length > 60))
    return fail(req, env, 400, "bad_request", "Please keep the brand name under 60 characters.");
  if (typeof token !== "string" || !token || token.length > 4096)
    return fail(req, env, 400, "bad_request", "Please complete the verification and try again.");

  const parsed = parseStoreUrl(url);
  if ("problem" in parsed) return fail(req, env, 400, "invalid_url", parsed.problem);
  const storeUrl = parsed.url;
  const domain = domainOf(storeUrl);
  const lead: Lead = { email: email.trim(), name, revenue: revenueParsed.revenue, source };
  const cleanBrand = typeof brand === "string" ? brand.trim().replace(/\s+/g, " ") : "";
  // Required: the visitor's top competitor, a website or a brand name.
  const rivalParsed = parseRival(body.competitor);
  if ("problem" in rivalParsed) return fail(req, env, 400, "bad_request", rivalParsed.problem);
  const rivalIn = rivalParsed.rival;
  if (!rivalIn) return fail(req, env, 400, "bad_request", "Please enter your top competitor's website or brand name.");
  if (rivalIn.domain === domain || (cleanBrand && rivalIn.name.toLowerCase() === cleanBrand.toLowerCase()))
    return fail(req, env, 400, "bad_request", "Please enter a competitor, not your own store.");
  const typed = rivalIn.raw;
  const ip = req.headers.get("cf-connecting-ip") || "unknown";

  // 2. Turnstile
  if (!(await verifyTurnstile(env, token, req.headers.get("cf-connecting-ip"))))
    return fail(req, env, 403, "turnstile", "We could not verify you are human. Please refresh the page and try again.");

  // Reading a competitor website's name starts now and runs alongside the check (no AI).
  const rivalP = resolveRival(rivalIn);

  // 3. Cache lookup (cache hits do not count toward any limit)
  const hit = await getCachedReport(env, domain);
  if (hit) {
    // The head to head is counted again on the saved answers for this visitor's competitor.
    const cached = withHeadToHead(hit, await rivalP);
    logHeadToHead(cached, true);
    const { response, emit, close } = ndjsonStream(req, env);
    const result = await saveResult(env, cached, true, lead);
    emit({ type: "done", report: cached, cached: true, result });
    ctx.waitUntil(close());
    // The owner email goes out for cached reports too.
    ctx.waitUntil(sendReportEmails(env, cached, lead, { typed, cached: true, link: result ? resultUrl(env, result) : null }));
    return response;
  }

  // 4. Limits
  try {
    const [day, mine] = await Promise.all([todayCount(env), ipCount(env, ip)]);
    if (day >= dailyLimit(env)) {
      ctx.waitUntil(sendLeadNotice(env, lead, domain, typed, { status: "paused", message: "The daily limit was reached, so the check did not run." }));
      return fail(req, env, 503, "paused", PAUSED_MESSAGE);
    }
    if (mine >= LIMITS.perIpPerDay)
      return fail(req, env, 429, "rate_limited", RATE_MESSAGE);
  } catch (e) {
    console.error("kv error", String(e));
  }

  // DNS sanity check: the name must exist and point at a public address.
  const dns = await dnsProblem(storeUrl.hostname);
  if (dns) return fail(req, env, 400, "invalid_url", dns);

  // 5. Run
  const { response, emit, close } = ndjsonStream(req, env);
  const work = (async () => {
    try {
      const counted = () => incrementCounters(env, ip).catch((e) => console.error("kv error", String(e)));
      const out = await runCheck(env, { url: storeUrl, domain, brand: cleanBrand || undefined, rival: rivalP }, emit, counted);
      if ("stopped" in out) {
        // Not a store, or no products we could read: no questions, no score, no AI spend, no check used.
        emit({ type: "stopped", reason: out.stopped, message: STOP_MESSAGES[out.stopped] });
        await close();
        await sendLeadNotice(env, lead, domain, typed, { status: "stopped", message: STOP_MESSAGES[out.stopped] });
        return;
      }
      const run = out;
      let { report, complete } = run;
      const result = await saveResult(env, report, false, lead);
      emit({ type: "done", report, result, pending: !!run.rest });
      logHeadToHead(report, false);
      if (run.rest) {
        // The page stays open and shows the rest of the report; brand accuracy finishes here.
        ({ report, complete } = await run.rest);
        if (result) await saveResult(env, report, false, lead, result);
        emit({ type: "update", report });
      }
      await close();
      // Only cache reports where every section worked, so a temporary failure is not stuck for 7 days.
      // The cache is shared by every visitor to this store, so it keeps the most named competitor, not this visitor's.
      if (complete) await cacheReport(env, withHeadToHead(report, null)).catch((e) => console.error("kv error", String(e)));
      ctx.waitUntil(sendReportEmails(env, report, lead, { typed, cached: false, link: result ? resultUrl(env, result) : null }));
    } catch (e) {
      console.error("check failed", e instanceof Error ? e.stack : String(e));
      emit({ type: "error", error: "server_error", message: "Something went wrong running your check. Please try again." });
      await close();
      await sendLeadNotice(env, lead, domain, typed, { status: "failed", message: e instanceof Error ? e.message : String(e) });
    }
  })();
  ctx.waitUntil(work);
  return response;
}

/** The report with its head to head counted for this competitor (or the most named one when null). */
function withHeadToHead(report: Report, rival: RivalInput | null): Report {
  const v = report.sections.visibility;
  return { ...report, headToHead: headToHead(isError(v) ? null : (v as VisibilitySection), report, rival, report.competitor) };
}

/** One log line per check with the competitor, for `wrangler tail`. The owner email carries it too. */
function logHeadToHead(report: Report, cached: boolean): void {
  const h = report.headToHead;
  console.log(
    "head to head",
    JSON.stringify({ domain: report.domain, cached, ...(h ? { source: h.source, typed: h.input, name: h.name, competitor: h.theirs, you: h.yours, of: h.total } : { none: true }) }),
  );
}

// ---------- Saved results, detect ----------

const RESULT_TTL = 90 * 24 * 60 * 60;
const DETECT_PER_IP_PER_DAY = 30;

/**
 * One gap report as this visitor saw it (with their competitor), plus who asked for it. The page and the
 * owner email open it by its id. The lead (email, name, revenue range, visit source) stays in KV only:
 * GET /result returns the report alone, and the report cached by domain never carries it.
 */
interface SavedResult {
  report: Report;
  cached: boolean;
  lead: Lead;
  savedAt: string;
}

/** Keeps only the expected source fields, as short strings. */
function cleanSource(raw: unknown): VisitSource | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const str = (k: string, n: number) => (typeof r[k] === "string" ? (r[k] as string).replace(/[\r\n]+/g, " ").trim().slice(0, n) : "");
  return {
    referrer: str("referrer", 300),
    landing: str("landing", 300),
    utm_source: str("utm_source", 100),
    utm_medium: str("utm_medium", 100),
    utm_campaign: str("utm_campaign", 100),
  };
}

/** Saves (or, with `id`, replaces) a result. Returns its id, or null when KV failed. */
async function saveResult(env: Env, report: Report, cached: boolean, lead: Lead, id: string = crypto.randomUUID()): Promise<string | null> {
  try {
    const rec: SavedResult = { report, cached, lead, savedAt: new Date().toISOString() };
    await env.CHECKS.put(`result:${id}`, JSON.stringify(rec), { expirationTtl: RESULT_TTL });
    return id;
  } catch (e) {
    console.error("kv error", String(e));
    return null;
  }
}

/** One saved gap report by id, without the lead. */
async function handleResult(req: Request, env: Env): Promise<Response> {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/.test(id)) return fail(req, env, 400, "bad_request", "That report link doesn't look right.");
  const saved = await env.CHECKS.get<SavedResult>(`result:${id}`, "json").catch(() => null);
  if (!saved) return fail(req, env, 404, "not_found", "This report has expired. Please run a new gap report.");
  return json(req, env, { report: saved.report });
}

/** A saved report from the 7 day cache, so a reload reopens it. */
async function handleReport(req: Request, env: Env): Promise<Response> {
  const raw = new URL(req.url).searchParams.get("domain") ?? "";
  const parsed = parseStoreUrl(raw);
  if ("problem" in parsed) return fail(req, env, 400, "invalid_url", parsed.problem);
  const report = await getCachedReport(env, domainOf(parsed.url));
  if (!report) return fail(req, env, 404, "not_found", "No saved report for this store.");
  return json(req, env, { report: withHeadToHead(report, null) });
}

/** Reads the homepage to suggest the brand name before the check. No AI. */
async function handleDetect(req: Request, env: Env): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail(req, env, 400, "bad_request", "Please enter your store URL.");
  }
  const url = body?.url;
  if (typeof url !== "string" || !url.trim()) return fail(req, env, 400, "bad_request", "Please enter your store URL.");
  const parsed = parseStoreUrl(url);
  if ("problem" in parsed) return fail(req, env, 400, "invalid_url", parsed.problem);
  const domain = domainOf(parsed.url);

  const cached = await getCachedReport(env, domain);
  if (cached) return json(req, env, { domain, brand: cached.brand, cached: true });

  const ip = req.headers.get("cf-connecting-ip") || "unknown";
  const key = `detect:${ip}:${utcDay()}`;
  try {
    const n = parseInt((await env.CHECKS.get(key)) ?? "0", 10) || 0;
    if (n >= DETECT_PER_IP_PER_DAY)
      return fail(req, env, 429, "rate_limited", RATE_MESSAGE);
    await env.CHECKS.put(key, String(n + 1), { expirationTtl: LIMITS.counterTtlSeconds });
  } catch (e) {
    console.error("kv error", String(e));
  }

  const dns = await dnsProblem(parsed.url.hostname);
  if (dns) return fail(req, env, 400, "invalid_url", dns);

  const signal = AbortSignal.timeout(12_000);
  const store = await loadStore(parsed.url, domain, signal, true);
  if (!store.homepageHtml && store.products.length === 0)
    return fail(req, env, 400, "invalid_url", "We could not load that store. Check the URL and try again.");
  return json(req, env, { domain, brand: store.brand, cached: false });
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(req.url);
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(req, env) });
    }
    try {
      if (pathname === "/status" && req.method === "GET") return await handleStatus(req, env);
      if (pathname === "/check" && req.method === "POST") return await handleCheck(req, env, ctx);
      if (pathname === "/detect" && req.method === "POST") return await handleDetect(req, env);
      if (pathname === "/result" && req.method === "GET") return await handleResult(req, env);
      if (pathname === "/report" && req.method === "GET") return await handleReport(req, env);
      if (["/status", "/check", "/detect", "/result", "/report"].includes(pathname))
        return fail(req, env, 405, "method_not_allowed", "That method is not allowed here.");
      return fail(req, env, 404, "not_found", "Not found.");
    } catch (e) {
      console.error("unhandled", e instanceof Error ? e.stack : String(e));
      return fail(req, env, 500, "server_error", "Something went wrong. Please try again.");
    }
  },
} satisfies ExportedHandler<Env>;
