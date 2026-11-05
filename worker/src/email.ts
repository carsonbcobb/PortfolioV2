import { escapeHtml } from "./html";
import { isError } from "./scoring";
import type { Env, Report, SectionKey } from "./types";

export const SECTION_LABELS: Record<SectionKey, string> = {
  visibility: "ChatGPT recommendations",
  accuracy: "What ChatGPT says about you",
  crawlers: "AI crawler access",
  readiness: "Product pages AI can read",
};

const ORDER: SectionKey[] = ["visibility", "accuracy", "crawlers", "readiness"];
const FULL_AUDIT_LINE =
  "This check is a snapshot from one run. The full audit tests your products against the questions your own customers ask, across repeated runs, plus a conversion review.";

function sectionScore(r: Report, k: SectionKey): number | null {
  const s = r.sections[k];
  return isError(s) ? null : (s as { score: number }).score;
}

function scoreColor(score: number): string {
  if (score >= 80) return "#15803d";
  if (score >= 60) return "#a16207";
  if (score >= 40) return "#c2410c";
  return "#b91c1c";
}

export interface Email {
  subject: string;
  html: string;
  text: string;
}

export function visitorEmail(r: Report, bookingUrl: string): Email {
  const subject = `Your AI visibility report for ${r.brand}`;
  const color = scoreColor(r.overall.score);
  const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";

  const findings = r.overall.findings
    .map(
      (f) =>
        `<tr><td style="padding:0 0 12px 0;${font}font-size:15px;line-height:22px;color:#1f2937;" valign="top">` +
        `<span style="color:${color};font-weight:bold;">&#9679;</span>&nbsp; ${escapeHtml(f)}</td></tr>`,
    )
    .join("");

  const rows = ORDER.map((k) => {
    const s = sectionScore(r, k);
    const val = s === null ? "Not available" : `${s} / 100`;
    const c = s === null ? "#6b7280" : scoreColor(s);
    return (
      `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;${font}font-size:15px;color:#374151;">${escapeHtml(SECTION_LABELS[k])}</td>` +
      `<td align="right" style="padding:10px 0;border-bottom:1px solid #e5e7eb;${font}font-size:15px;font-weight:bold;color:${c};">${val}</td></tr>`
    );
  }).join("");

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:8px;">
<tr><td style="padding:32px 32px 8px 32px;${font}">
<p style="margin:0 0 4px 0;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#6b7280;">AI Visibility Check</p>
<h1 style="margin:0;font-size:22px;line-height:28px;color:#111827;">${escapeHtml(r.brand)}</h1>
<p style="margin:4px 0 0 0;font-size:14px;color:#6b7280;">${escapeHtml(r.domain)}</p>
</td></tr>
<tr><td align="center" style="padding:24px 32px 8px 32px;${font}">
<div style="font-size:64px;line-height:68px;font-weight:bold;color:${color};">${r.overall.score}</div>
<div style="font-size:14px;color:#6b7280;">out of 100</div>
<p style="margin:16px 0 0 0;font-size:17px;line-height:24px;color:#111827;font-weight:600;">${escapeHtml(r.overall.verdict)}</p>
</td></tr>
<tr><td style="padding:24px 32px 4px 32px;${font}">
<h2 style="margin:0 0 12px 0;font-size:16px;color:#111827;">What we found</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${findings}</table>
</td></tr>
<tr><td style="padding:12px 32px 8px 32px;${font}">
<h2 style="margin:0 0 4px 0;font-size:16px;color:#111827;">Your scores</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
</td></tr>
<tr><td align="center" style="padding:28px 32px 8px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" bgcolor="#111827" style="border-radius:6px;">
<a href="${escapeHtml(bookingUrl)}" target="_blank" style="display:inline-block;padding:14px 28px;${font}font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;">Book your 20 minute AI Search Review</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:16px 32px 32px 32px;${font}font-size:14px;line-height:21px;color:#4b5563;" align="center">${escapeHtml(FULL_AUDIT_LINE)}</td></tr>
</table>
<p style="margin:16px 0 0 0;${font}font-size:12px;color:#9ca3af;">Carson Cobb &middot; carsoncobb.com</p>
</td></tr></table>
</body></html>`;

  const text = [
    `Your AI visibility report for ${r.brand} (${r.domain})`,
    "",
    `Overall score: ${r.overall.score} out of 100`,
    r.overall.verdict,
    "",
    "What we found:",
    ...r.overall.findings.map((f) => `* ${f}`),
    "",
    "Your scores:",
    ...ORDER.map((k) => {
      const s = sectionScore(r, k);
      return `${SECTION_LABELS[k]}: ${s === null ? "Not available" : `${s} / 100`}`;
    }),
    "",
    `Book your 20 minute AI Search Review: ${bookingUrl}`,
    "",
    FULL_AUDIT_LINE,
  ].join("\n");

  return { subject, html, text };
}

export function ownerEmail(r: Report, visitor: string, cached: boolean): Email {
  const subject = `AI visibility check: ${r.domain} (${r.overall.score})${cached ? " [cached]" : ""}`;
  const scores = ORDER.map((k) => {
    const s = sectionScore(r, k);
    const sec = r.sections[k];
    return `${SECTION_LABELS[k]}: ${s === null ? `failed (${isError(sec) ? sec.error : ""})` : s}`;
  });
  const json = JSON.stringify(r, null, 2);
  const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:16px;background:#ffffff;${font}font-size:14px;color:#111827;">
<table role="presentation" cellpadding="4" cellspacing="0" border="0">
<tr><td><b>URL</b></td><td><a href="${escapeHtml(r.url)}">${escapeHtml(r.url)}</a></td></tr>
<tr><td><b>Brand</b></td><td>${escapeHtml(r.brand)}</td></tr>
<tr><td><b>Top products</b></td><td>${escapeHtml((r.products ?? []).join("; "))}</td></tr>
<tr><td><b>Visitor email</b></td><td>${escapeHtml(visitor)}</td></tr>
<tr><td><b>Overall</b></td><td>${r.overall.score} &middot; ${escapeHtml(r.overall.verdict)}</td></tr>
<tr><td><b>Cached</b></td><td>${cached ? "yes (served from cache, no new cost)" : "no"}</td></tr>
<tr><td><b>Cost</b></td><td>$${r.cost.usd.toFixed(4)} over ${r.cost.calls} OpenAI calls, ${(r.ms / 1000).toFixed(1)}s</td></tr>
</table>
<p style="margin:12px 0 4px 0;"><b>Scores</b></p>
<ul style="margin:0;padding-left:20px;">${scores.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
<p style="margin:12px 0 4px 0;"><b>Findings</b></p>
<ul style="margin:0;padding-left:20px;">${r.overall.findings.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
<p style="margin:16px 0 4px 0;"><b>Full report</b></p>
<pre style="white-space:pre-wrap;word-break:break-word;font-size:12px;background:#f3f4f6;padding:12px;border-radius:6px;">${escapeHtml(json)}</pre>
</body></html>`;
  const text = [
    subject,
    "",
    `URL: ${r.url}`,
    `Brand: ${r.brand}`,
    `Top products: ${(r.products ?? []).join("; ")}`,
    `Visitor email: ${visitor}`,
    `Overall: ${r.overall.score} (${r.overall.verdict})`,
    `Cached: ${cached ? "yes" : "no"}`,
    `Cost: $${r.cost.usd.toFixed(4)} over ${r.cost.calls} calls, ${(r.ms / 1000).toFixed(1)}s`,
    "",
    ...scores,
    "",
    ...r.overall.findings.map((f) => `* ${f}`),
    "",
    json,
  ].join("\n");
  return { subject, html, text };
}

async function send(env: Env, to: string, email: Email, replyTo?: string): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [to],
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) console.error("resend error", res.status, (await res.text()).slice(0, 300));
}

/** Sends both emails. Skips silently when RESEND_API_KEY is not set. Never throws. */
export async function sendReportEmails(env: Env, report: Report, visitor: string, cached: boolean): Promise<void> {
  if (!env.RESEND_API_KEY) return;
  const jobs: Promise<void>[] = [send(env, visitor, visitorEmail(report, env.BOOKING_URL), env.NOTIFY_EMAIL)];
  if (env.NOTIFY_EMAIL) jobs.push(send(env, env.NOTIFY_EMAIL, ownerEmail(report, visitor, cached), visitor));
  const results = await Promise.allSettled(jobs);
  for (const r of results) if (r.status === "rejected") console.error("email failed", String(r.reason));
}
