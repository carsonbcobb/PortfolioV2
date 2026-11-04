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

const booking = "https://calendar.app.google/arLBYoErUBfsuqfN9";
const v = visitorEmail(report, booking);
const o = ownerEmail(report, "visitor@example.com", false);
fs.writeFileSync(path.join(out, "email-visitor.html"), v.html);
fs.writeFileSync(path.join(out, "email-visitor.txt"), `Subject: ${v.subject}\n\n${v.text}\n`);
fs.writeFileSync(path.join(out, "email-owner.html"), o.html);
fs.writeFileSync(path.join(out, "email-owner.txt"), `Subject: ${o.subject}\n\n${o.text}\n`);
console.log("visitor subject:", v.subject);
console.log("owner subject:  ", o.subject);
console.log("wrote", ["email-visitor.html", "email-visitor.txt", "email-owner.html", "email-owner.txt"].map((f) => path.join(out, f)).join("\n      "));
