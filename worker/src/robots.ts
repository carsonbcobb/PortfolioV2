/**
 * robots.txt parser following RFC 9309: groups of user-agent lines followed by
 * rules, case insensitive product token matching with `*` fallback, groups for
 * the same agent are merged, and the longest matching rule wins (Allow wins ties).
 */

interface Rule {
  allow: boolean;
  pattern: string;
}

interface Group {
  agents: string[];
  rules: Rule[];
}

export interface Robots {
  groups: Group[];
}

export function parseRobots(text: string): Robots {
  const groups: Group[] = [];
  let current: Group | null = null;
  let lastWasAgent = false;
  for (const rawLine of text.split(/\r\n|\r|\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if (key === "allow" || key === "disallow") {
      lastWasAgent = false;
      if (!current) continue; // rules before any user-agent are ignored
      if (key === "disallow" && value === "") continue; // empty disallow allows everything
      current.rules.push({ allow: key === "allow", pattern: value });
    } else {
      // sitemap, crawl-delay and others do not end a user-agent run per common practice,
      // but they do mark the end of the agent line sequence.
      lastWasAgent = false;
    }
  }
  return { groups };
}

/** Rules that apply to a product token (merged across matching groups), falling back to `*`. */
function rulesFor(robots: Robots, token: string): Rule[] {
  const t = token.toLowerCase();
  const exact = robots.groups.filter((g) => g.agents.some((a) => a === t));
  if (exact.length) return exact.flatMap((g) => g.rules);
  const star = robots.groups.filter((g) => g.agents.includes("*"));
  return star.flatMap((g) => g.rules);
}

function patternToRegex(pattern: string): RegExp {
  let p = pattern;
  const anchored = p.endsWith("$");
  if (anchored) p = p.slice(0, -1);
  const body = p
    .split("*")
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp("^" + body + (anchored ? "$" : ""));
}

/** True when `token` may fetch `path` (default "/"). */
export function isAllowed(robots: Robots, token: string, path = "/"): boolean {
  const rules = rulesFor(robots, token);
  let best: Rule | null = null;
  for (const r of rules) {
    if (!r.pattern.startsWith("/") && !r.pattern.startsWith("*")) continue;
    if (!patternToRegex(r.pattern).test(path)) continue;
    if (
      !best ||
      r.pattern.length > best.pattern.length ||
      (r.pattern.length === best.pattern.length && r.allow && !best.allow)
    ) {
      best = r;
    }
  }
  return best ? best.allow : true;
}
