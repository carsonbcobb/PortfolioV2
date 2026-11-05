import type { SectionKey } from "./types";

/** OpenAI prices in USD per 1M tokens, plus a flat fee per web search call. */
export const PRICING = {
  models: {
    "chat-latest": { input: 5.0, output: 30.0 },
    "gpt-6-luna": { input: 0.1, output: 0.5 },
    "gpt-5.4-mini": { input: 0.75, output: 4.5 },
  } as Record<string, { input: number; output: number }>,
  /** Used when a model name is not in the table above (keyed by role). */
  fallback: {
    search: { input: 0.75, output: 4.5 },
    small: { input: 0.1, output: 0.5 },
  },
  webSearchCallUsd: 0.01,
};

/** Buyer questions asked per check. */
export const QUESTION_COUNT = 3;

export const WEIGHTS: Record<SectionKey, number> = {
  visibility: 40,
  readiness: 25,
  accuracy: 20,
  crawlers: 15,
};

export const LIMITS = {
  perIpPerDay: 3,
  reportTtlSeconds: 7 * 24 * 60 * 60,
  counterTtlSeconds: 2 * 24 * 60 * 60,
};

export const TIMEOUTS = {
  fetchMs: 8_000,
  openaiMs: 45_000,
  overallMs: 88_000,
  sections: {
    visibility: 85_000,
    // Brand accuracy is never cut off with the rest: it retries, then finishes after the report is shown.
    accuracy: 150_000,
    crawlers: 30_000,
    readiness: 45_000,
  } as Record<SectionKey, number>,
};

export const MAX_BODY_BYTES = 2 * 1024 * 1024;
export const MAX_REDIRECTS = 5;

export const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

/**
 * AI crawlers tested. `token` is the robots.txt product token; `ua` is the real
 * user agent the crawler sends. Google-Extended and Applebot-Extended are robots
 * tokens only: their fetches happen as Googlebot and Applebot, so those UAs are used.
 */
export const BOTS: { name: string; token: string; ua: string }[] = [
  {
    name: "GPTBot",
    token: "gptbot",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot",
  },
  {
    name: "OAI-SearchBot",
    token: "oai-searchbot",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
  },
  {
    name: "ChatGPT-User",
    token: "chatgpt-user",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
  },
  {
    name: "PerplexityBot",
    token: "perplexitybot",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  },
  {
    name: "ClaudeBot",
    token: "claudebot",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  },
  {
    name: "Google-Extended",
    token: "google-extended",
    ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  },
  {
    name: "Applebot-Extended",
    token: "applebot-extended",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)",
  },
];
