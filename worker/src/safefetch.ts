import { BROWSER_UA, MAX_BODY_BYTES, MAX_REDIRECTS, TIMEOUTS } from "./config";
import { urlProblem } from "./validate";

export interface SafeFetchOptions {
  userAgent?: string;
  timeoutMs?: number;
  maxBytes?: number;
  accept?: string;
  signal?: AbortSignal;
  /** Do not read the body at all (status and headers only). */
  skipBody?: boolean;
}

export interface SafeResponse {
  status: number;
  headers: Headers;
  finalUrl: string;
  body: string;
  truncated: boolean;
  redirects: number;
}

export class UnsafeUrlError extends Error {}

/**
 * Fetches a third party URL safely: http/https only, validates the hostname on
 * every redirect hop (manual redirects, max 5), enforces a timeout and reads at
 * most `maxBytes` of the body.
 */
export async function safeFetch(input: string | URL, opts: SafeFetchOptions = {}): Promise<SafeResponse> {
  const timeoutMs = opts.timeoutMs ?? TIMEOUTS.fetchMs;
  const maxBytes = opts.maxBytes ?? MAX_BODY_BYTES;
  const timeout = AbortSignal.timeout(timeoutMs);
  const signal = opts.signal ? AbortSignal.any([timeout, opts.signal]) : timeout;

  let url = new URL(input.toString());
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const problem = urlProblem(url);
    if (problem) throw new UnsafeUrlError(problem);

    const res = await fetch(url.toString(), {
      method: "GET",
      redirect: "manual",
      signal,
      headers: {
        "user-agent": opts.userAgent ?? BROWSER_UA,
        accept: opts.accept ?? "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
    });

    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      await res.body?.cancel();
      if (hop === MAX_REDIRECTS) throw new Error("Too many redirects");
      url = new URL(res.headers.get("location")!, url);
      continue;
    }

    if (opts.skipBody) {
      await res.body?.cancel();
      return { status: res.status, headers: res.headers, finalUrl: url.toString(), body: "", truncated: false, redirects: hop };
    }
    const { text, truncated } = await readLimited(res, maxBytes);
    return { status: res.status, headers: res.headers, finalUrl: url.toString(), body: text, truncated, redirects: hop };
  }
  throw new Error("Too many redirects");
}

async function readLimited(res: Response, maxBytes: number): Promise<{ text: string; truncated: boolean }> {
  if (!res.body) return { text: "", truncated: false };
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let truncated = false;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (size + value.byteLength > maxBytes) {
      chunks.push(value.subarray(0, maxBytes - size));
      size = maxBytes;
      truncated = true;
      await reader.cancel();
      break;
    }
    chunks.push(value);
    size += value.byteLength;
  }
  const all = new Uint8Array(size);
  let off = 0;
  for (const c of chunks) {
    all.set(c, off);
    off += c.byteLength;
  }
  return { text: new TextDecoder().decode(all), truncated };
}

/** Fetches JSON safely; returns null on any failure or non 2xx status. */
export async function safeFetchJson<T>(url: string | URL, opts: SafeFetchOptions = {}): Promise<T | null> {
  try {
    const r = await safeFetch(url, { accept: "application/json", ...opts });
    if (r.status < 200 || r.status >= 300 || r.truncated) return null;
    return JSON.parse(r.body) as T;
  } catch {
    return null;
  }
}
