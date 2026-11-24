import { escapeHtml } from "./html";
import { isError } from "./scoring";
import type { Env, HeadToHead, Lead, Report, SectionKey, VisitSource } from "./types";
import { REVENUE_LABELS, underFit } from "./validate";

export const SECTION_LABELS: Record<SectionKey, string> = {
  visibility: "ChatGPT recommendations",
  accuracy: "What ChatGPT says about you",
  crawlers: "AI crawler access",
  readiness: "Product pages AI can read",
};

const ORDER: SectionKey[] = ["visibility", "accuracy", "crawlers", "readiness"];
const DEFAULT_SITE = "https://www.carsoncobb.com";

export function siteUrl(env: Pick<Env, "SITE_URL">): string {
  return (env.SITE_URL || DEFAULT_SITE).replace(/\/+$/, "");
}

/** The page that reopens one saved gap report, with the visitor's own competitor. */
export function resultUrl(env: Pick<Env, "SITE_URL">, id: string): string {
  return `${siteUrl(env)}/ai-visibility-check?result=${encodeURIComponent(id)}&step=3`;
}

/** The next step after the report, by monthly revenue. Same copy as the page. */
export function nextStep(lead: Pick<Lead, "revenue" | "email">, site = DEFAULT_SITE): { lines: string[]; label: string; url: string } {
  if (underFit(lead.revenue))
    return {
      lines: [
        "Close the Gap is built for brands doing $50K a month and up.",
        "At your stage, the best next step is the Full Store Audit: every page of your store, your email flows, analytics and how AI sees your products, with every fix ranked by what it's worth, back to you in 2 business days.",
      ],
      label: "Get the Full Store Audit",
      url: `${site}/full-store-audit?from=gap-email`,
    };
  return {
    lines: [
      "Your gap video is on its way.",
      `I'll email it to ${lead.email} within 1 business day. It covers how your top products compare with your competitors, roughly what the gap is worth each month, and the program that fits.`,
    ],
    label: "See Close the Gap",
    url: `${site}/close-the-gap?from=gap-email`,
  };
}

/** The competitor as the owner email names it: the resolved name, else what the visitor typed. */
function rivalName(r: Report | null, typed: string): string {
  return (r?.headToHead?.source === "visitor" && r.headToHead.name) || typed || r?.headToHead?.name || "no competitor";
}

/** Owner email subject, the same for every submission: "Gap report: store vs competitor (range)". */
export function ownerSubject(store: string, competitor: string, lead: Pick<Lead, "revenue">): string {
  return `Gap report: ${store} vs ${competitor} (${REVENUE_LABELS[lead.revenue]})`;
}

/** The head to head line shown first in the report, or null when there is nothing to compare. */
export function headToHeadText(h: HeadToHead | null | undefined): string | null {
  if (!h || !h.total) return null;
  const counts = `${h.name} was recommended in ${h.theirs} of ${h.total} answers. You were recommended in ${h.yours}.`;
  return h.source === "visitor" ? counts : `The brand AI recommended most instead of you: ${h.name}. ${counts}`;
}

/** The competitor line for the owner email: what the visitor typed, the name it resolved to and the counts. */
function headToHeadLog(h: HeadToHead | null | undefined): string {
  if (!h) return "None compared";
  const counts = h.total ? `competitor ${h.theirs}/${h.total}, you ${h.yours}/${h.total}` : "not compared (buyer questions didn't run)";
  return h.source === "visitor"
    ? `Typed "${h.input}", read as ${h.name}${h.domain ? ` (${h.domain})` : ""}: ${counts}`
    : `None typed. Most named: ${h.name}${h.domain ? ` (${h.domain})` : ""}: ${counts}`;
}

function sectionScore(r: Report, k: SectionKey): number | null {
  const s = r.sections[k];
  if (isError(s) || r.overall.unscored?.includes(k)) return null;
  return (s as { score: number }).score;
}

/** The three source lines for the owner email. */
function sourceLines(src: VisitSource | null | undefined): [string, string][] {
  const utms = src ? [["source", src.utm_source], ["medium", src.utm_medium], ["campaign", src.utm_campaign]].filter(([, v]) => v) : [];
  return [
    ["Source", src ? src.referrer || "Direct (no referrer)" : "Unknown"],
    ["Landing page", src?.landing || "Unknown"],
    ["UTMs", utms.length ? utms.map(([k, v]) => `${k}=${v}`).join(", ") : "None"],
  ];
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

export function visitorEmail(r: Report, lead: Lead, link: string | null, site = DEFAULT_SITE): Email {
  const h2h = headToHeadText(r.headToHead);
  const rival = r.headToHead?.name;
  const subject = rival ? `Your gap report: ${r.brand} vs ${rival}` : `Your gap report for ${r.brand}`;
  const color = scoreColor(r.overall.score);
  const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";
  const next = nextStep(lead, site);
  const hello = lead.name ? `Hi ${lead.name.split(" ")[0]}, here is your gap report.` : "Here is your gap report.";

  const findings = r.overall.findings
    .map(
      (f) =>
        `<tr><td style="padding:0 0 12px 0;${font}font-size:15px;line-height:22px;color:#1f2937;" valign="top">` +
        `<span style="color:${color};font-weight:bold;">&#9679;</span>&nbsp; ${escapeHtml(f)}</td></tr>`,
    )
    .join("");

  const rows = ORDER.map((k) => {
    const s = sectionScore(r, k);
    const val = s === null ? "Couldn't check" : `${s} / 100`;
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
<p style="margin:0 0 4px 0;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#6b7280;">Gap report</p>
<h1 style="margin:0;font-size:22px;line-height:28px;color:#111827;">${escapeHtml(r.brand)}${rival ? ` vs ${escapeHtml(rival)}` : ""}</h1>
<p style="margin:4px 0 0 0;font-size:14px;color:#6b7280;">${escapeHtml(r.domain)}</p>
<p style="margin:16px 0 0 0;font-size:15px;line-height:22px;color:#374151;">${escapeHtml(hello)}</p>
</td></tr>
${
    h2h
      ? `<tr><td style="padding:16px 32px 0 32px;${font}"><p style="margin:0;padding:14px 16px;background:#f3f4f6;border-left:3px solid #ff5a5f;border-radius:6px;font-size:17px;line-height:24px;color:#111827;font-weight:600;">${escapeHtml(h2h)}</p></td></tr>`
      : ""
  }
<tr><td align="center" style="padding:24px 32px 8px 32px;${font}">
<div style="font-size:64px;line-height:68px;font-weight:bold;color:${color};">${r.overall.score}</div>
<div style="font-size:14px;color:#6b7280;">AI visibility score, out of 100</div>
<p style="margin:16px 0 0 0;font-size:17px;line-height:24px;color:#111827;font-weight:600;">${escapeHtml(r.overall.verdict)}</p>
${r.overall.note ? `<p style="margin:8px 0 0 0;font-size:14px;line-height:20px;color:#6b7280;">${escapeHtml(r.overall.note)}</p>` : ""}
</td></tr>
<tr><td style="padding:24px 32px 4px 32px;${font}">
<h2 style="margin:0 0 12px 0;font-size:16px;color:#111827;">What we found</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${findings}</table>
</td></tr>
<tr><td style="padding:12px 32px 8px 32px;${font}">
<h2 style="margin:0 0 4px 0;font-size:16px;color:#111827;">Your scores</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
${link ? `<p style="margin:12px 0 0 0;font-size:14px;"><a href="${escapeHtml(link)}" target="_blank" style="color:#111827;font-weight:bold;">Open your full gap report</a></p>` : ""}
</td></tr>
<tr><td style="padding:28px 32px 8px 32px;${font}">
<h2 style="margin:0 0 8px 0;font-size:18px;line-height:24px;color:#111827;">${escapeHtml(next.lines[0])}</h2>
<p style="margin:0;font-size:15px;line-height:22px;color:#374151;">${escapeHtml(next.lines[1])}</p>
</td></tr>
<tr><td align="center" style="padding:20px 32px 32px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" bgcolor="#111827" style="border-radius:6px;">
<a href="${escapeHtml(next.url)}" target="_blank" style="display:inline-block;padding:14px 28px;${font}font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;">${escapeHtml(next.label)}</a>
</td></tr></table>
</td></tr>
</table>
<p style="margin:16px 0 0 0;${font}font-size:12px;color:#9ca3af;">Carson Cobb &middot; carsoncobb.com</p>
</td></tr></table>
</body></html>`;

  const text = [
    `Your gap report for ${r.brand} (${r.domain})${rival ? ` vs ${rival}` : ""}`,
    "",
    hello,
    ...(h2h ? ["", h2h] : []),
    "",
    `AI visibility score: ${r.overall.score} out of 100`,
    r.overall.verdict,
    ...(r.overall.note ? [r.overall.note] : []),
    "",
    "What we found:",
    ...r.overall.findings.map((f) => `* ${f}`),
    "",
    "Your scores:",
    ...ORDER.map((k) => {
      const s = sectionScore(r, k);
      return `${SECTION_LABELS[k]}: ${s === null ? "Couldn't check" : `${s} / 100`}`;
    }),
    ...(link ? ["", `Open your full gap report: ${link}`] : []),
    "",
    ...next.lines,
    "",
    `${next.label}: ${next.url}`,
  ].join("\n");

  return { subject, html, text };
}

/** What happened to a submission that has no report: why, for the owner email. */
export type NoReport = { status: "stopped" | "failed" | "paused"; message: string };

/**
 * The owner email, sent for every submission: store, competitor, revenue range, name, email, the head to
 * head and a link to the full result. `r` is null when the check stopped or failed before a report.
 */
export function ownerEmail(
  r: Report | null,
  lead: Lead,
  meta: { domain: string; typed: string; cached: boolean; link: string | null; none?: NoReport },
): Email {
  const competitor = rivalName(r, meta.typed);
  const subject = ownerSubject(meta.domain, competitor, lead);
  const src = sourceLines(lead.source);
  const h = r?.headToHead;
  const h2h = h && h.total ? `${h.name} ${h.theirs} of ${h.total}, ${r!.brand} ${h.yours} of ${h.total}` : "Not compared (buyer questions didn't run)";
  const rows: [string, string][] = [
    ["Store", r ? `${r.brand} (${r.url})` : meta.domain],
    ["Competitor", r ? headToHeadLog(h) : `Typed "${meta.typed}"`],
    ["Revenue range", REVENUE_LABELS[lead.revenue]],
    ["Name", lead.name || "Not given"],
    ["Email", lead.email],
    ...(r ? ([["Head to head", h2h]] as [string, string][]) : []),
    ["Full result", meta.link ?? (meta.none ? `No report: ${meta.none.status}. ${meta.none.message}` : "Not saved")],
    ...src,
  ];
  let extra: [string, string][] = [];
  let scores: string[] = [];
  let json = "";
  if (r) {
    extra = [
      ["Top products", (r.products ?? []).join("; ")],
      ["Overall", `${r.overall.score} (${r.overall.verdict})`],
      ["Cached", meta.cached ? "yes (served from cache, no new cost)" : "no"],
      ["Cost", `$${r.cost.usd.toFixed(4)} over ${r.cost.calls} OpenAI calls, ${(r.ms / 1000).toFixed(1)}s`],
    ];
    scores = ORDER.map((k) => {
      const s = sectionScore(r, k);
      const sec = r.sections[k];
      return `${SECTION_LABELS[k]}: ${s === null ? `couldn't check (${isError(sec) ? sec.error : "no usable answers"})` : s}`;
    });
    json = JSON.stringify(r, null, 2);
  }
  const all = [...rows, ...extra];
  const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";
  const cell = (k: string, v: string) =>
    k === "Full result" && meta.link
      ? `<tr><td valign="top"><b>${k}</b></td><td><a href="${escapeHtml(v)}">${escapeHtml(v)}</a></td></tr>`
      : `<tr><td valign="top"><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:16px;background:#ffffff;${font}font-size:14px;color:#111827;">
<table role="presentation" cellpadding="4" cellspacing="0" border="0">
${all.map(([k, v]) => cell(k, v)).join("\n")}
</table>
${
    r
      ? `<p style="margin:12px 0 4px 0;"><b>Scores</b></p>
<ul style="margin:0;padding-left:20px;">${scores.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
<p style="margin:12px 0 4px 0;"><b>Findings</b></p>
<ul style="margin:0;padding-left:20px;">${r.overall.findings.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
<p style="margin:16px 0 4px 0;"><b>Report data</b></p>
<pre style="white-space:pre-wrap;word-break:break-word;font-size:12px;background:#f3f4f6;padding:12px;border-radius:6px;">${escapeHtml(json)}</pre>`
      : ""
  }
</body></html>`;
  const text = [
    subject,
    "",
    ...all.map(([k, v]) => `${k}: ${v}`),
    ...(r ? ["", ...scores, "", ...r.overall.findings.map((f) => `* ${f}`), "", json] : []),
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
  else console.log("resend ok", res.status, JSON.stringify({ to: to.replace(/^[^@]*/, "***"), subject: email.subject }));
}

/** Sends the visitor's report and the owner notification. Never throws. */
export async function sendReportEmails(
  env: Env,
  report: Report,
  lead: Lead,
  meta: { typed: string; cached: boolean; link: string | null },
): Promise<void> {
  const owner = ownerEmail(report, lead, { ...meta, domain: report.domain });
  if (!env.RESEND_API_KEY) {
    console.log("emails skipped: RESEND_API_KEY is not set", JSON.stringify({ owner: owner.subject }));
    return;
  }
  const jobs: Promise<void>[] = [send(env, lead.email, visitorEmail(report, lead, meta.link, siteUrl(env)), env.NOTIFY_EMAIL || undefined)];
  if (env.NOTIFY_EMAIL) jobs.push(send(env, env.NOTIFY_EMAIL, owner, lead.email));
  const results = await Promise.allSettled(jobs);
  for (const r of results) if (r.status === "rejected") console.error("email failed", String(r.reason));
}

/** The owner notification for a submission that ended without a report (stopped, failed or paused). Never throws. */
export async function sendLeadNotice(env: Env, lead: Lead, domain: string, typed: string, none: NoReport): Promise<void> {
  const owner = ownerEmail(null, lead, { domain, typed, cached: false, link: null, none });
  if (!env.RESEND_API_KEY) {
    console.log("emails skipped: RESEND_API_KEY is not set", JSON.stringify({ owner: owner.subject }));
    return;
  }
  if (!env.NOTIFY_EMAIL) return;
  await send(env, env.NOTIFY_EMAIL, owner, lead.email).catch((e) => console.error("email failed", String(e)));
}
