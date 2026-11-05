import { BOTS } from "../config";
import { isAllowed, parseRobots } from "../robots";
import { safeFetch } from "../safefetch";
import type { BotResult, CrawlersSection, Emit, FetchResult, StoreContext } from "../types";

const CHALLENGE_MARKERS = [
  "just a moment",
  "challenge-platform",
  "_cf_chl",
  "cf-chl-",
  "attention required! | cloudflare",
  "g-recaptcha",
  "h-captcha",
  "hcaptcha.com",
  "px-captcha",
  "captcha-delivery.com", // DataDome
  "geo.captcha-delivery",
  "verify you are human",
  "are you a robot",
];

export async function runCrawlers(ctx: StoreContext, emit: Emit, signal?: AbortSignal): Promise<CrawlersSection> {
  emit({ type: "progress", step: "crawlers", message: "Testing whether AI crawlers can reach your store" });

  const [robotsRes, llmsRes, ...botFetches] = await Promise.all([
    safeFetch(ctx.origin + "/robots.txt", { accept: "text/plain,*/*", signal }).catch(() => null),
    safeFetch(ctx.origin + "/llms.txt", { accept: "text/plain,text/markdown,*/*", maxBytes: 64 * 1024, signal }).catch(
      () => null,
    ),
    ...BOTS.map((b) => fetchAsBot(ctx.origin + "/", b.ua, signal)),
  ]);

  // A missing or unreachable robots.txt means no restrictions.
  const robotsText =
    robotsRes && robotsRes.status >= 200 && robotsRes.status < 300 && !/<html/i.test(robotsRes.body.slice(0, 500))
      ? robotsRes.body
      : "";
  const robots = parseRobots(robotsText);

  const bots: BotResult[] = BOTS.map((b, i) => ({
    name: b.name,
    robots: isAllowed(robots, b.token, "/") ? "allowed" : "blocked",
    fetch: botFetches[i].fetch,
    status: botFetches[i].status,
  }));

  const ct = llmsRes?.headers.get("content-type") ?? "";
  const llmsTxt =
    !!llmsRes &&
    llmsRes.status === 200 &&
    !/html/i.test(ct) &&
    llmsRes.body.trim().length > 0 &&
    !/^\s*<(!doctype|html)/i.test(llmsRes.body);

  const per = bots.map((b): number => {
    // "error" (a timeout or a 429 rate limit) is inconclusive, so it doesn't count as a block.
    const fails = (b.robots === "blocked" ? 1 : 0) + (b.fetch === "ok" || b.fetch === "error" ? 0 : 1);
    return fails === 0 ? 1 : fails === 1 ? 0.5 : 0;
  });
  const score = Math.round((per.reduce((a, c) => a + c, 0) / per.length) * 95 + (llmsTxt ? 5 : 0));
  return { score, bots, llmsTxt };
}

async function fetchAsBot(url: string, ua: string, signal?: AbortSignal): Promise<{ fetch: FetchResult; status: number | null }> {
  try {
    const r = await safeFetch(url, { userAgent: ua, maxBytes: 256 * 1024, signal });
    const status = r.status;
    if (r.headers.get("cf-mitigated")?.toLowerCase() === "challenge") return { fetch: "challenge", status };
    const head = r.body.slice(0, 200_000).toLowerCase();
    const small = r.body.length < 60_000;
    const hasMarker = CHALLENGE_MARKERS.some((m) => head.includes(m));
    // Normal store pages can include captcha scripts for forms, so only call it a
    // challenge when the page is an error status or a small interstitial page.
    if (hasMarker && (status >= 400 || small)) return { fetch: "challenge", status };
    if ([401, 403, 503].includes(status)) return { fetch: "blocked", status };
    if (status >= 200 && status < 300) return { fetch: "ok", status };
    return { fetch: "error", status };
  } catch {
    return { fetch: "error", status: null };
  }
}
