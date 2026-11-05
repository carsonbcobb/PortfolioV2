import { hostOf } from "../openai";
import { safeFetch } from "../safefetch";
import type { CitedSource, Source, SourcePresence, SourcesSummary, StoreContext } from "../types";

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function isOwnHost(host: string, domain: string): boolean {
  const h = host.toLowerCase().replace(/^www\./, "");
  return h === domain || h.endsWith("." + domain);
}

/** True when a page names the brand or links to the store. */
export function pageLists(html: string, brand: string, domain: string): boolean {
  const lower = html.toLowerCase();
  if (lower.includes(domain.toLowerCase())) return true;
  if (brand.length < 3) return false;
  const text = lower.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
  return new RegExp(`(^|[^a-z0-9])${escapeRe(brand.toLowerCase())}([^a-z0-9]|$)`).test(text);
}

/**
 * Reads every source ChatGPT cited (no AI) and marks whether the visitor is on it: their own site,
 * a page that names the brand or links to the store, a page without them, or a page we could not read.
 */
export async function checkSources(
  perQuestion: Source[][],
  ctx: StoreContext,
  signal?: AbortSignal,
): Promise<{ perQuestion: CitedSource[][]; summary: SourcesSummary }> {
  const unique = new Map<string, Source>();
  for (const list of perQuestion) for (const s of list) if (!unique.has(s.url)) unique.set(s.url, s);

  const presence = new Map<string, SourcePresence>();
  await Promise.all(
    [...unique.values()].map(async (s) => {
      const host = hostOf(s.url);
      if (isOwnHost(host, ctx.domain)) return presence.set(s.url, "yours");
      try {
        const r = await safeFetch(s.url, { signal, timeoutMs: 7000 });
        if (r.status !== 200 || !r.body) return presence.set(s.url, "unread");
        if (isOwnHost(hostOf(r.finalUrl), ctx.domain)) return presence.set(s.url, "yours");
        presence.set(s.url, pageLists(r.body, ctx.brand, ctx.domain) ? "listed" : "absent");
      } catch {
        presence.set(s.url, "unread");
      }
    }),
  );

  const tag = (s: Source): CitedSource => ({ ...s, host: hostOf(s.url), presence: presence.get(s.url) ?? "unread" });
  const all = [...unique.values()].map(tag);
  return {
    perQuestion: perQuestion.map((list) => list.map(tag)),
    summary: {
      total: all.length,
      on: all.filter((s) => s.presence === "yours" || s.presence === "listed").length,
      unread: all.filter((s) => s.presence === "unread").length,
    },
  };
}
