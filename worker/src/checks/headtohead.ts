import { safeFetch } from "../safefetch";
import { brandFrom } from "../store";
import type { CompetitorCompare, HeadToHead, VisibilityQuestion, VisibilitySection } from "../types";
import { domainOf, parseStoreUrl } from "../validate";
import { rankCompetitors } from "./competitor";
import { norm, sameBrand } from "./visibility";

/**
 * Head to head: how many buyer answers named the visitor's competitor, against how many named the visitor.
 * No AI. It reads the answers the visibility check already has (the parsed brand list plus the answer text),
 * so it costs nothing and works on a cached report too.
 */

/** The competitor the visitor typed, after validation. */
export interface RivalInput {
  /** What the visitor typed, cleaned (control characters out, spaces collapsed). */
  raw: string;
  /** Set when the visitor typed a website. */
  domain: string | null;
  /** A brand name typed as is; for a website, the domain stem until the homepage is read. */
  name: string;
}

export const RIVAL_MAX = 100;

/** Validates the optional competitor field. Returns null for empty, or a message for the visitor. */
export function parseRival(input: unknown): { rival: RivalInput | null } | { problem: string } {
  if (input === undefined || input === null) return { rival: null };
  if (typeof input !== "string") return { problem: "Please enter your top competitor's website or brand name." };
  const raw = input.replace(/[\u0000-\u001f\u007f<>"`{}\\]/g, " ").replace(/\s+/g, " ").trim();
  if (!raw) return { rival: null };
  if (raw.length > RIVAL_MAX) return { problem: "Please keep your competitor under 100 characters." };

  // A website: has a scheme, or is one word with a dot in it (brand.com, www.brand.co.uk/shop).
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) || /^[^\s]+\.[a-z]{2,}(\/\S*)?$/i.test(raw)) {
    const parsed = parseStoreUrl(raw);
    if ("problem" in parsed) return { problem: "That competitor website doesn't look right. Try something like theirbrand.com or just their brand name." };
    const domain = domainOf(parsed.url);
    return { rival: { raw, domain, name: stemName(domain) } };
  }

  // A brand name: letters, digits and a few name characters only.
  const name = raw.replace(/[^\p{L}\p{N} &'.+!-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 60);
  if (norm(name).length < 2) return { problem: "Please enter your top competitor's website or brand name." };
  return { rival: { raw, domain: null, name } };
}

const SUBDOMAINS = new Set(["shop", "store", "us", "uk", "ca", "au", "eu", "en", "m"]);

/** The name part of a domain: "theirbrand.co.uk" and "shop.theirbrand.com" give "theirbrand". */
export function domainStem(domain: string): string {
  const parts = domain.toLowerCase().split(".");
  return parts.length >= 3 && SUBDOMAINS.has(parts[0]) ? parts[1] : parts[0];
}

/** "theirbrand.co.uk" reads as "Theirbrand". */
function stemName(domain: string): string {
  const label = domainStem(domain);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * For a website, reads the competitor's homepage for its name (og:site_name, else the title), with the same
 * safe fetch and brand rule the check uses for the visitor's own store. Falls back to the domain stem.
 */
export async function resolveRival(r: RivalInput, signal?: AbortSignal): Promise<RivalInput> {
  if (!r.domain) return r;
  try {
    const home = await safeFetch(`https://${r.domain}/`, { signal, timeoutMs: 6000, maxBytes: 512 * 1024 });
    if (home.status !== 200) return r;
    const name = brandFrom(home.body, r.domain).replace(/\s+/g, " ").trim();
    // A homepage title that is a slogan, not a name, is no use as a label: keep the stem then.
    if (name && name.length <= 40 && norm(name).length >= 2) return { ...r, name };
  } catch {
    // Unreachable or blocked: the domain stem still matches answers.
  }
  return r;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** True when the answer names this brand: in the parsed brand list, or by name, domain or domain stem in the text. */
export function namesBrand(q: Pick<VisibilityQuestion, "brands" | "answer">, name: string, domain: string | null): boolean {
  const stem = domain ? domainStem(domain) : "";
  // sameBrand compares with the name and with the part of its last argument before the first dot.
  if ((q.brands ?? []).some((b) => sameBrand(b, name, stem || name))) return true;
  const a = (q.answer ?? "").toLowerCase();
  if (domain && a.includes(domain.toLowerCase())) return true;
  const word = (w: string) => w.length >= 3 && new RegExp(`(^|[^a-z0-9])${escapeRe(w.toLowerCase())}([^a-z0-9]|$)`).test(a);
  return word(name) || (stem.length >= 4 && word(stem));
}

/**
 * Builds the head to head from the scored answers (the same Y as "recommended in Z of Y").
 * With a typed competitor, counts it; without one, uses the brand named most instead of the visitor,
 * preferring the one the product page compare used when they tie.
 */
export function headToHead(
  v: VisibilitySection | null,
  store: { brand: string; domain: string },
  rival: RivalInput | null,
  compare?: CompetitorCompare | null,
): HeadToHead | null {
  const scored = v ? v.questions.filter((q) => !q.excluded) : [];
  const yours = v ? v.mentioned : 0;
  const total = v ? v.total : 0;

  if (rival) {
    const own = rival.domain === store.domain || sameBrand(rival.name, store.brand, store.domain);
    const theirs = own ? 0 : scored.filter((q) => namesBrand(q, rival.name, rival.domain)).length;
    return { source: "visitor", input: rival.raw, name: rival.name, domain: rival.domain, theirs, yours, total };
  }

  if (!v || !total) return null;
  const ranked = rankCompetitors(v, store);
  if (!ranked.length) return null;
  // Ties go to the brand named most in the answers that left the visitor out ("instead of you"),
  // then to the one the product page compare used, then to the first named.
  const top = ranked[0].mentions;
  const missed = scored.filter((q) => !q.mentioned);
  const instead = (name: string) => missed.filter((q) => namesBrand(q, name, null)).length;
  const tied = ranked.filter((c) => c.mentions === top);
  const best = Math.max(...tied.map((c) => instead(c.name)));
  const pool = tied.filter((c) => instead(c.name) === best);
  const pick = (compare && pool.find((c) => norm(c.name) === norm(compare.name))) || pool[0];
  const domain = compare && norm(compare.name) === norm(pick.name) ? compare.domain : null;
  const theirs = scored.filter((q) => namesBrand(q, pick.name, domain)).length;
  if (!theirs) return null;
  return { source: "top", input: "", name: pick.name, domain, theirs, yours, total };
}
