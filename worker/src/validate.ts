/** Input and URL validation. Every user facing message follows the copy rules (no dashes). */

const BLOCKED_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".lan",
  ".home.arpa",
  ".intranet",
  ".corp",
  ".home",
  ".localdomain",
  ".invalid",
  ".test",
  ".example",
  ".onion",
];

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

function parseIPv4(host: string): number[] | null {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return null;
  const parts = m.slice(1).map(Number);
  return parts.every((p) => p >= 0 && p <= 255) ? parts : null;
}

/** True for private, loopback, link local, CGNAT, multicast and other reserved IPv4 ranges. */
export function isReservedIPv4(ip: string): boolean {
  const p = parseIPv4(ip);
  if (!p) return false;
  const [a, b, c] = p;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 192 && b === 88 && c === 99) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  );
}

/** True for loopback, unspecified, ULA, link local, multicast, mapped/compat and doc IPv6 ranges. */
export function isReservedIPv6(ip: string): boolean {
  const h = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "::" || h === "::1") return true;
  if (h.startsWith("::ffff:") || h.startsWith("64:ff9b:")) return true;
  if (/^f[cd]/.test(h)) return true; // fc00::/7
  if (/^fe[89ab]/.test(h)) return true; // fe80::/10
  if (h.startsWith("ff")) return true; // multicast
  if (h.startsWith("2001:db8") || h.startsWith("2001:0db8")) return true;
  return false;
}

/**
 * Validates a hostname as a public internet name. Returns an error message or null.
 * IP literals are rejected outright (a store always has a domain name).
 */
export function hostnameProblem(hostnameRaw: string): string | null {
  const host = hostnameRaw.toLowerCase().replace(/\.$/, "");
  if (!host) return "That address has no hostname.";
  if (host.startsWith("[") || host.includes(":")) return "Please enter your store's domain name, not an IP address.";
  if (parseIPv4(host)) return "Please enter your store's domain name, not an IP address.";
  // Anything that is only digits, dots and hex markers is an IP in disguise.
  if (/^[0-9.]+$/.test(host) || /^(0x[0-9a-f]+\.?)+$/.test(host)) {
    return "Please enter your store's domain name, not an IP address.";
  }
  if (host === "localhost" || BLOCKED_SUFFIXES.some((s) => host.endsWith(s) || host === s.slice(1))) {
    return "That address is not a public website.";
  }
  if (!host.includes(".")) return "That address is not a public website.";
  if (!/^[a-z0-9.-]+$/.test(host)) return "That address has characters a domain cannot have.";
  return null;
}

/** Checks scheme, credentials, port and hostname of an already parsed URL. */
export function urlProblem(u: URL): string | null {
  if (u.protocol !== "http:" && u.protocol !== "https:") return "Only http and https addresses can be checked.";
  if (u.username || u.password) return "Please remove the login details from the address.";
  if (u.port && u.port !== "80" && u.port !== "443") return "Only standard web ports can be checked.";
  return hostnameProblem(u.hostname);
}

/** Parses visitor input into a URL. Adds https:// when the visitor typed a bare domain. */
export function parseStoreUrl(input: string): { url: URL } | { problem: string } {
  let raw = input.trim();
  if (!raw) return { problem: "Please enter your store URL." };
  if (raw.length > 2048) return { problem: "That address is too long." };
  if (!/^[a-z][a-z0-9+.-]*:/i.test(raw)) raw = "https://" + raw.replace(/^\/+/, "");
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { problem: "That does not look like a valid web address." };
  }
  const p = urlProblem(u);
  if (p) return { problem: p };
  return { url: u };
}

export function domainOf(u: URL): string {
  return u.hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
}

/**
 * Resolves the hostname over DNS over HTTPS and rejects names that do not exist
 * or that point at private/reserved addresses (defence in depth; Workers cannot
 * reach private networks anyway). Fails open if the resolver itself is unreachable.
 */
export async function dnsProblem(hostname: string): Promise<string | null> {
  const ask = async (type: "A" | "AAAA") => {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=${type}`,
      { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(4000) },
    );
    if (!res.ok) throw new Error("doh " + res.status);
    return (await res.json()) as { Status: number; Answer?: { type: number; data: string }[] };
  };
  try {
    const [a, aaaa] = await Promise.all([ask("A"), ask("AAAA").catch(() => null)]);
    const answers = [...(a.Answer ?? []), ...(aaaa?.Answer ?? [])];
    const ips = answers.filter((x) => x.type === 1 || x.type === 28).map((x) => x.data);
    if (a.Status === 3 || (ips.length === 0 && answers.length === 0 && a.Status !== 0)) {
      return "We could not find that website. Check the address and try again.";
    }
    if (ips.length === 0 && answers.length === 0) {
      return "We could not find that website. Check the address and try again.";
    }
    if (ips.some((ip) => isReservedIPv4(ip) || (ip.includes(":") && isReservedIPv6(ip)))) {
      return "That address is not a public website.";
    }
    return null;
  } catch {
    return null;
  }
}
