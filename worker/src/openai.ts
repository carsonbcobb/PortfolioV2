import { PRICING, TIMEOUTS } from "./config";
import type { Env, Source } from "./types";

/** Accumulates OpenAI spend for one check. */
export class CostTracker {
  usd = 0;
  calls = 0;
  searches = 0;
  tokens = { input: 0, output: 0 };
  /** One row per call, for the per step cost breakdown. */
  log: {
    step: string;
    model: string;
    input: number;
    cached: number;
    output: number;
    reasoning: number;
    searches: number;
    actions?: string[];
    usd: number;
  }[] = [];

  add(model: string, role: "search" | "small", usage: ResponseUsage | undefined, webSearchCalls: number, step: string = role, actions?: string[]) {
    this.calls++;
    const price = PRICING.models[model] ?? PRICING.fallback[role];
    const inp = usage?.input_tokens ?? 0;
    const cached = usage?.input_tokens_details?.cached_tokens ?? 0;
    const out = usage?.output_tokens ?? 0;
    this.tokens.input += inp;
    this.tokens.output += out;
    this.searches += webSearchCalls;
    // Cached input is billed at a tenth of the input rate.
    const usd =
      ((inp - cached) * price.input + cached * price.input * 0.1 + out * price.output) / 1_000_000 +
      webSearchCalls * PRICING.webSearchCallUsd;
    this.usd += usd;
    this.log.push({
      step,
      model,
      input: inp,
      cached,
      output: out,
      reasoning: usage?.output_tokens_details?.reasoning_tokens ?? 0,
      searches: webSearchCalls,
      ...(actions && actions.length ? { actions } : {}),
      usd: Math.round(usd * 1e6) / 1e6,
    });
  }
}

interface ResponseUsage {
  input_tokens?: number;
  output_tokens?: number;
  input_tokens_details?: { cached_tokens?: number };
  output_tokens_details?: { reasoning_tokens?: number };
}

interface OutputItem {
  type: string;
  content?: { type: string; text?: string; annotations?: { type: string; url?: string; title?: string }[] }[];
  action?: { type?: string; sources?: { url?: string; title?: string }[] };
}

interface ResponsesResult {
  output?: OutputItem[];
  output_text?: string;
  usage?: ResponseUsage;
  status?: string;
  error?: { message?: string } | null;
}

export class OpenAIError extends Error {
  constructor(message: string, public status?: number, public retryable = true) {
    super(message);
  }
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new OpenAIError("aborted", undefined, false));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new OpenAIError("aborted", undefined, false));
    });
  });

interface CallOpts {
  role: "search" | "small";
  step: string;
  /** Per attempt timeout. */
  timeoutMs?: number;
  /** Attempts with the primary model before the fallback model gets one try. */
  attempts?: number;
}

export class OpenAI {
  constructor(private env: Env, public cost: CostTracker, private signal?: AbortSignal) {}

  /** One request, no retry. */
  private async once(body: Record<string, unknown>, o: CallOpts): Promise<ResponsesResult> {
    if (!this.env.OPENAI_API_KEY) throw new OpenAIError("OpenAI key is not configured", undefined, false);
    const timeout = AbortSignal.timeout(o.timeoutMs ?? TIMEOUTS.openaiMs);
    const signal = this.signal ? AbortSignal.any([timeout, this.signal]) : timeout;
    const base = this.env.OPENAI_BASE_URL.replace(/\/+$/, "");
    let res: Response;
    try {
      res = await fetch(`${base}/responses`, {
        method: "POST",
        signal,
        headers: {
          authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      // Network error or our own timeout. The caller's abort is final; a timeout is worth retrying.
      const aborted = !!this.signal?.aborted;
      throw new OpenAIError(timeout.aborted ? "timed out" : `network error: ${String(e)}`, undefined, !aborted);
    }
    let data: ResponsesResult;
    try {
      data = (await res.json()) as ResponsesResult;
    } catch {
      throw new OpenAIError(`OpenAI returned ${res.status}`, res.status, res.status >= 500 || res.status === 429);
    }
    if (!res.ok || data.error) {
      // Never forward provider error bodies to the client; just log them.
      console.error("openai error", o.step, res.status, data.error?.message);
      const retryable = res.status === 429 || res.status >= 500 || res.status === 408;
      throw new OpenAIError(`OpenAI returned ${res.status}`, res.status, retryable);
    }
    const calls = (data.output ?? []).filter((x) => x.type === "web_search_call");
    this.cost.add(String(body.model), o.role, data.usage, calls.length, o.step, calls.map((c) => c.action?.type ?? "unknown"));
    return data;
  }

  /**
   * Retries with backoff (1s, then 3s) on rate limits, server errors and timeouts, then gives the
   * fallback model one try. `check` can reject a response that came back empty or unusable.
   */
  private async call<T>(body: Record<string, unknown>, o: CallOpts, check: (d: ResponsesResult) => T): Promise<T> {
    const attempts = o.attempts ?? 3;
    const fallback = this.env.FALLBACK_MODEL && this.env.FALLBACK_MODEL !== body.model ? this.env.FALLBACK_MODEL : "";
    let last: unknown;
    for (let i = 0; i < attempts + (fallback ? 1 : 0); i++) {
      const useFallback = i >= attempts;
      try {
        const data = await this.once(useFallback ? { ...body, model: fallback } : body, {
          ...o,
          step: useFallback ? `${o.step} (fallback)` : o.step,
        });
        return check(data);
      } catch (e) {
        last = e;
        if (e instanceof OpenAIError && !e.retryable) throw e;
        if (this.signal?.aborted) break;
        console.error("openai retry", o.step, i + 1, e instanceof Error ? e.message : String(e));
        if (i + 1 < attempts + (fallback ? 1 : 0)) await sleep(i === 0 ? 1000 : 3000, this.signal);
      }
    }
    throw last instanceof Error ? last : new OpenAIError(String(last));
  }

  /** SMALL_MODEL call with a strict JSON schema; returns the parsed object. Unparseable output is repaired or retried. */
  async structured<T>(opts: {
    name: string;
    schema: Record<string, unknown>;
    system: string;
    user: string;
    maxOutputTokens?: number;
    timeoutMs?: number;
  }): Promise<T> {
    return this.call(
      {
        model: this.env.SMALL_MODEL,
        input: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
        text: { format: { type: "json_schema", name: opts.name, schema: opts.schema, strict: true } },
        reasoning: { effort: "low" },
        max_output_tokens: opts.maxOutputTokens ?? 1200,
      },
      { role: "small", step: opts.name, timeoutMs: opts.timeoutMs ?? 30_000 },
      (data) => {
        const parsed = parseJson<T>(outputText(data));
        // A bad parse is retried like any other failure.
        if (parsed === undefined) throw new OpenAIError("Model returned invalid JSON");
        return parsed;
      },
    );
  }

  /**
   * Web search call, the way a ChatGPT user would ask. Buyer questions use BUYER_MODEL when set, else
   * SEARCH_MODEL. An answer that came back empty counts as a failure and is retried.
   */
  async search(
    question: string,
    purpose: "buyer" | "brand" = "buyer",
    opts: { timeoutMs?: number; attempts?: number } = {},
  ): Promise<{ answer: string; sources: Source[]; searchCalls: number }> {
    return this.call(
      {
        model: (purpose === "buyer" && this.env.BUYER_MODEL) || this.env.SEARCH_MODEL,
        input: question,
        tools: [{ type: "web_search" }],
        include: ["web_search_call.action.sources"],
        // One search per question keeps the fee at $0.01 a question; low reasoning keeps answers quick.
        max_tool_calls: 1,
        parallel_tool_calls: false,
        reasoning: { effort: "low" },
        max_output_tokens: 2500,
      },
      { role: "search", step: purpose === "buyer" ? "buyer_search" : "brand_search", timeoutMs: opts.timeoutMs, attempts: opts.attempts },
      (data) => {
        const answer = outputText(data);
        if (!answer) throw new OpenAIError("empty answer");
        return { answer, ...citations(data) };
      },
    );
  }
}

function citations(data: ResponsesResult): { sources: Source[]; searchCalls: number } {
  const sources: Source[] = [];
  const seen = new Set<string>();
  const push = (url?: string, title?: string) => {
    if (!url) return;
    url = cleanUrl(url);
    if (seen.has(url)) return;
    seen.add(url);
    sources.push({ title: (title || hostOf(url)).slice(0, 200), url });
  };
  for (const item of data.output ?? []) {
    if (item.type !== "message") continue;
    for (const c of item.content ?? []) {
      for (const a of c.annotations ?? []) if (a.type === "url_citation") push(a.url, a.title);
    }
  }
  // Fallback: sources the search consulted (only used when the answer had no inline citations).
  if (sources.length === 0) {
    for (const item of data.output ?? []) {
      if (item.type === "web_search_call") for (const s of item.action?.sources ?? []) push(s.url, s.title);
    }
  }
  const searchCalls = (data.output ?? []).filter((o) => o.type === "web_search_call").length;
  return { sources, searchCalls };
}

/** Strict JSON parse, then a repair pass: strips code fences and takes the outermost object. */
export function parseJson<T>(text: string): T | undefined {
  const t = text.trim();
  if (!t) return undefined;
  try {
    return JSON.parse(t) as T;
  } catch {
    /* repair below */
  }
  const unfenced = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const a = unfenced.indexOf("{");
  const b = unfenced.lastIndexOf("}");
  if (a < 0 || b <= a) return undefined;
  try {
    return JSON.parse(unfenced.slice(a, b + 1).replace(/,\s*([}\]])/g, "$1")) as T;
  } catch {
    return undefined;
  }
}

function outputText(data: ResponsesResult): string {
  if (typeof data.output_text === "string" && data.output_text) return data.output_text;
  const parts: string[] = [];
  for (const item of data.output ?? []) {
    if (item.type !== "message") continue;
    for (const c of item.content ?? []) if (c.type === "output_text" && c.text) parts.push(c.text);
  }
  return parts.join("\n").trim();
}

/** Drops the utm tags OpenAI adds to cited links. */
export function cleanUrl(url: string): string {
  try {
    const u = new URL(url);
    for (const k of [...u.searchParams.keys()]) if (/^utm_/i.test(k)) u.searchParams.delete(k);
    return u.toString();
  } catch {
    return url;
  }
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
