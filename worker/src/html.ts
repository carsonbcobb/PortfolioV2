/** Lightweight HTML helpers (regex based; Workers have no DOM). */

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "-",
  mdash: "-",
  rsquo: "'",
  lsquo: "'",
  rdquo: '"',
  ldquo: '"',
  hellip: "...",
  copy: "(c)",
  reg: "(r)",
  trade: "(tm)",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try {
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      } catch {
        return m;
      }
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

export function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function collapse(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** Strips tags, scripts and styles and returns readable text. */
export function htmlToText(html: string): string {
  const noScripts = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|noscript|template|svg|iframe)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<head\b[\s\S]*?<\/head>/i, " ");
  return collapse(decodeEntities(noScripts.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ")));
}

/** Reads attributes from one tag string into a lowercase keyed map. */
export function parseAttrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  const inner = tag.replace(/^<\s*[a-zA-Z0-9]+/, "").replace(/\/?>$/, "");
  let m: RegExpExecArray | null;
  while ((m = re.exec(inner))) {
    out[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return out;
}

export function metaContent(html: string, key: string): string | null {
  const re = /<meta\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  const k = key.toLowerCase();
  while ((m = re.exec(html))) {
    const a = parseAttrs(m[0]);
    if ((a.property ?? a.name ?? "").toLowerCase() === k && a.content) return collapse(a.content);
  }
  return null;
}

export function titleOf(html: string): string | null {
  const m = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return m ? collapse(decodeEntities(m[1])) || null : null;
}

export function firstH1(html: string): string | null {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? collapse(decodeEntities(m[1].replace(/<[^>]+>/g, " "))) || null : null;
}

/** All href values from anchor tags, resolved against base, same host only. */
export function sameSiteLinks(html: string, base: string): URL[] {
  const out: URL[] = [];
  const seen = new Set<string>();
  const baseUrl = new URL(base);
  const host = baseUrl.hostname.replace(/^www\./, "");
  const re = /<a\b[^>]*\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const href = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "").trim();
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) continue;
    try {
      const u = new URL(href, baseUrl);
      if (u.hostname.replace(/^www\./, "") !== host) continue;
      u.hash = "";
      const key = u.pathname;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(u);
    } catch {
      /* ignore bad hrefs */
    }
  }
  return out;
}

/** Strips an optional Shopify Markets locale prefix like /en-us or /fr. */
export function stripLocale(path: string): string {
  return path.replace(/^\/[a-z]{2}(-[a-z]{2})?(?=\/)/i, "");
}
