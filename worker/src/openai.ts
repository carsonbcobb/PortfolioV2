import { PRICING, TIMEOUTS } from "./config";
import type { Env, Source } from "./types";

/** Accumulates OpenAI spend for one check. */
export class CostTracker {
  usd = 0;
  calls = 0;
  searches = 0;
  tokens = { input: 0, output: 0 };

  add(model: string, role: "search" | "small", usage: ResponseUsage | undefined, webSearchCalls: number) {
    this.calls++;
    const price = PRICING.models[model] ?? PRICING.fallback[role];
    const inp = usage?.input_tokens ?? 0;
    const out = usage?.output_tokens ?? 0;
    this.tokens.input += inp;
    this.tokens.output += out;
    this.searches += webSearchCalls;
    this.usd += (inp * price.input + out * price.output) / 1_000_000 + webSearchCalls * PRICING.webSearchCallUsd;
  }
}

interface ResponseUsage {
  input_tokens?: number;
  output_tokens?: number;
}

interface OutputItem {
  type: string;
  content?: { type: string; text?: string; annotations?: { type: string; url?: string; title?: string }[] }[];
  action?: { sources?: { url?: string; title?: string }[] };
}

interface ResponsesResult {
  output?: OutputItem[];
  output_text?: string;
  usage?: ResponseUsage;
  error?: { message?: string } | null;
}

export class OpenAIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

export class OpenAI {
  constructor(private env: Env, public cost: CostTracker, private signal?: AbortSignal) {}

  private async call(body: Record<string, unknown>, role: "search" | "small"): Promise<ResponsesResult> {
    if (!this.env.OPENAI_API_KEY) throw new OpenAIError("OpenAI key is not configured");
    const timeout = AbortSignal.timeout(TIMEOUTS.openaiMs);
    const signal = this.signal ? AbortSignal.any([timeout, this.signal]) : timeout;
    const base = this.env.OPENAI_BASE_URL.replace(/\/+$/, "");
    const res = await fetch(`${base}/responses`, {
      method: "POST",
      signal,
      headers: {
        authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let data: ResponsesResult;
    try {
      data = (await res.json()) as ResponsesResult;
    } catch {
      throw new OpenAIError(`OpenAI returned ${res.status}`, res.status);
    }
    if (!res.ok || data.error) {
      // Never forward provider error bodies to the client; just log them.
      console.error("openai error", res.status, data.error?.message);
      throw new OpenAIError(`OpenAI returned ${res.status}`, res.status);
    }
    const searches = (data.output ?? []).filter((o) => o.type === "web_search_call").length;
    this.cost.add(String(body.model), role, data.usage, searches);
    return data;
  }

  /** SMALL_MODEL call with a strict JSON schema; returns the parsed object. */
  async structured<T>(opts: { name: string; schema: Record<string, unknown>; system: string; user: string }): Promise<T> {
    const data = await this.call(
      {
        model: this.env.SMALL_MODEL,
        input: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
        text: { format: { type: "json_schema", name: opts.name, schema: opts.schema, strict: true } },
        reasoning: { effort: "low" },
      },
      "small",
    );
    const text = outputText(data);
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new OpenAIError("Model returned invalid JSON");
    }
  }

  /** Web search call, the way a ChatGPT user would ask. Buyer questions use BUYER_MODEL when set, else SEARCH_MODEL. */
  async search(question: string, purpose: "buyer" | "other" = "other"): Promise<{ answer: string; sources: Source[]; searchCalls: number }> {
    const data = await this.call(
      {
        model: (purpose === "buyer" && this.env.BUYER_MODEL) || this.env.SEARCH_MODEL,
        input: question,
        tools: [{ type: "web_search" }],
        include: ["web_search_call.action.sources"],
        // One search per question keeps the fee at $0.01 a question; low reasoning keeps answers quick.
        max_tool_calls: 1,
        reasoning: { effort: "low" },
      },
      "search",
    );
    const answer = outputText(data);
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
    return { answer, sources, searchCalls };
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
