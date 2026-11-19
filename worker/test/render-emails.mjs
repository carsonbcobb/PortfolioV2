// Renders both email templates from a sample report so they can be reviewed in a browser.
// Usage: node test/render-emails.mjs [path/to/report.json]
// Writes test/out/email-visitor.html, email-visitor.txt, email-owner.html, email-owner.txt
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const out = path.join(here, "out");
fs.mkdirSync(out, { recursive: true });

const reportPath = process.argv[2] || path.join(out, "allbirds.com.json");
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

const bundle = path.join(out, ".email-bundle.mjs");
await build({ entryPoints: [path.join(root, "src/email.ts")], bundle: true, format: "esm", platform: "neutral", outfile: bundle, logLevel: "error" });
const { visitorEmail, ownerEmail } = await import(pathToFileURL(bundle).href + "?t=" + Date.now());
fs.unlinkSync(bundle);

// Usage: node test/render-emails.mjs [report.json] [under_50k|50k_150k|150k_plus]
const lead = { email: "visitor@example.com", name: "Pat Lee", revenue: process.argv[3] || "150k_plus", source: null };
const link = "https://www.carsoncobb.com/ai-visibility-check?result=00000000-0000-4000-8000-000000000000&step=3";
const v = visitorEmail(report, lead, link);
const o = ownerEmail(report, lead, { domain: report.domain, typed: report.headToHead?.input || "", cached: false, link });
fs.writeFileSync(path.join(out, "email-visitor.html"), v.html);
fs.writeFileSync(path.join(out, "email-visitor.txt"), `Subject: ${v.subject}\n\n${v.text}\n`);
fs.writeFileSync(path.join(out, "email-owner.html"), o.html);
fs.writeFileSync(path.join(out, "email-owner.txt"), `Subject: ${o.subject}\n\n${o.text}\n`);
console.log("visitor subject:", v.subject);
console.log("owner subject:  ", o.subject);
console.log("wrote", ["email-visitor.html", "email-visitor.txt", "email-owner.html", "email-owner.txt"].map((f) => path.join(out, f)).join("\n      "));
