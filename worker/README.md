# AI Visibility Check (Cloudflare Worker)

Backend for the AI Visibility Check lead tool on carsoncobb.com. A visitor enters a Shopify store URL, a product category and an email. The Worker runs four checks in parallel, streams progress as NDJSON, returns a scored report, and emails the visitor (and you) a copy.

This folder is self contained. It is not part of the Astro build or the Amplify deploy.

## What it checks

| Section | Weight | Uses AI | What it does |
| --- | --- | --- | --- |
| visibility | 40 | yes | `SMALL_MODEL` writes 3 buyer questions from the store's top products. Each is asked to `SEARCH_MODEL` with web search forced on (`tool_choice: "required"`; an answer that didn't search is retried). An answer that asks a clarifying question or names no brands gets one rewrite with more product detail; if it still fails, it is left out of the score (`excluded`), `total` is the number scored and `asked` the number asked. With none scored, the section is left out of the overall score. `SMALL_MODEL` parses the recommended brands and where the store appears. Every cited source is then fetched (no AI) and marked `yours`, `listed` (names the brand or links to the store), `absent` or `unread`, with a summary of how many the store is on. |
| accuracy | 20 | yes | Asks `SEARCH_MODEL` "What is {brand} and what do they sell?" and grades the answer against the homepage and product titles. |
| crawlers | 15 | no | Parses robots.txt for 7 AI bots, fetches the homepage with each bot's real user agent, checks for blocks and bot challenges, and checks for llms.txt. |
| readiness | 25 | no | Finds the homepage, a collection, a product, FAQ, blog, article and About page, reads JSON-LD and microdata, flags duplicate Product schema, and audits `/products.json?limit=250`. |

If a section fails, the overall score is reweighted over the sections that worked, and `overall.note` says which checks couldn't run (`overall.unscored` lists them).

Before any AI call, the setup step confirms the site sells physical products. When the product feed can't be read, it looks again: the feed with a smaller limit, the collection pages, then the product sitemap (with the titles it lists), reading each product's own JSON or Product schema, in small batches with one retry on a 429. With no products, the stream ends with `{"type":"stopped","reason":"not_store"|"no_products"|"unreadable","message"}`: no score, no OpenAI spend, and it doesn't count toward the limits.

Two extras, not scored:

- **Competitor compare** (`report.competitor`, no AI): the brand recommended most across the buyer questions (retailers skipped) is matched to a domain from the cited sources or answers (else `name.com`, verified by its homepage), one of its product pages is found from `/products.json` or homepage links, and its Product schema is read with the same parser as readiness. The 12 detail types (name, description, images, brand, price, stock, SKU or barcode, rating, reviews, shipping, returns, size or color) are shown side by side with the store's own product page (`readiness.productDetails`). `null` when no competitor came up or its site could not be read.
- **Top findings** (`overall.top`): one last `SMALL_MODEL` call reads a digest of every result and writes the 3 findings for the score step, each with what it costs in sales. Output that contains fix advice, dashes, or numbers not in the data is thrown away and the page builds its own findings instead.

## API

`GET /status` returns `{"paused": boolean, "limit": number}`.

`POST /check` with `{"url","token"}` plus optional `"brand"` (the name the visitor confirmed), optional `"email"` and optional `"source"` (`referrer`, `landing`, `utm_source`, `utm_medium`, `utm_campaign`, saved by the site on the first visit; only used in the owner email and kept off the cached report) (token is the Turnstile response). Errors are JSON `{"error","message"}`: 400 `bad_request`, 400 `invalid_url`, 403 `turnstile`, 429 `rate_limited`, 503 `paused`. Success is a 200 `application/x-ndjson` stream of `progress` lines (visibility questions carry an `id`), `tick` lines (`{"type":"tick","id"}` when one question's answer is back), `section` lines and a final `done` line with a one time `ticket`. Cached reports stream a single `{"type":"done","report":...,"cached":true,"ticket":...}` line. When `email` is sent with the check, the report email goes out as before.

The step flow on the site uses three more routes:

- `POST /detect` with `{"url"}` reads the homepage and products and returns `{"domain","brand","category","cached"}` so the visitor confirms instead of typing. It uses `SMALL_MODEL` for the category when `OPENAI_API_KEY` is set, else the most common Shopify product type. Limited to 30 per IP per day; it does not count toward the 3 checks.
- `POST /email` with `{"ticket","email"}` sends the report emails for the check that issued the ticket (the page collects the email while the check runs). Each ticket sends once and expires after 24 hours: 400 `bad_request`, 404 `expired`.
- `GET /report?domain=` returns `{"report"}` from the 7 day cache, or 404, so a reload reopens the report.

Order of operations: validate fields, verify Turnstile, look up the 7 day cache (cache hits never count toward limits), check limits, resolve DNS, then run.

## Environment

Vars (in `wrangler.toml`):

| Name | Default |
| --- | --- |
| `DAILY_CHECK_LIMIT` | `50` (fresh checks per UTC day across all visitors) |
| `ALLOWED_ORIGINS` | `https://www.carsoncobb.com,https://carsoncobb.com,http://localhost:4321` |
| `BOOKING_URL` | `https://calendar.app.google/arLBYoErUBfsuqfN9` |
| `FROM_EMAIL` | `Carson Cobb <check@carsoncobb.com>` |
| `NOTIFY_EMAIL` | `carson@carsoncobb.com` |
| `SMALL_MODEL` | `gpt-6-luna` (question writing, parsing, grading, findings) |
| `SEARCH_MODEL` | `gpt-6-luna` (the brand question, and the buyer questions unless `BUYER_MODEL` is set, with web search). |
| `BUYER_MODEL` | Empty (uses `SEARCH_MODEL`). Set to `gpt-5.4-mini` to run only the buyer questions on mini. Measured: mini named brands in 8 of 9 answers at $0.054 to $0.104 a check; luna named brands in 9 of 9 at $0.045 to $0.066. |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` |

Secrets (set with `npx wrangler secret put NAME`, never in a file that is committed):

| Name | Notes |
| --- | --- |
| `OPENAI_API_KEY` | Required. |
| `TURNSTILE_SECRET_KEY` | Required. Without it every check is rejected with 403. |
| `RESEND_API_KEY` | Optional. When unset, emails are skipped silently. |

KV binding `CHECKS` stores `report:v2:{domain}` (7 days; v2 skips reports saved before the store check), `ip:{ip}:{yyyy-mm-dd}` and `day:{yyyy-mm-dd}` (2 days each). Per IP limit is 3 fresh checks per UTC day (from `CF-Connecting-IP`). Prices and limits live in `src/config.ts`.

## Setup and deploy

You need Node 22 or newer (Wrangler requires it) and a Cloudflare account. Use the Workers Paid plan ($5 a month): a fresh check makes about 40 to 60 outbound requests and parses several large pages, which is over the Free plan's 50 subrequest and 10 ms CPU limits.

1. Install: `cd worker && npm install`
2. Log in: `npx wrangler login`
3. Create the KV namespace: `npx wrangler kv namespace create CHECKS`, then paste the printed id into `wrangler.toml` in place of `REPLACE_WITH_KV_NAMESPACE_ID`.
4. Turnstile: in the Cloudflare dashboard, add a Turnstile widget for `carsoncobb.com` (and `localhost` for testing). The site key goes in the frontend; the secret key goes in the Worker.
5. Secrets:
   ```
   npx wrangler secret put OPENAI_API_KEY
   npx wrangler secret put TURNSTILE_SECRET_KEY
   npx wrangler secret put RESEND_API_KEY
   ```
6. Resend: add and verify the `carsoncobb.com` domain in Resend (add the SPF, DKIM and optional DMARC DNS records it shows, wherever carsoncobb.com DNS is hosted), then create an API key with sending access. `FROM_EMAIL` must use the verified domain. The free tier is 3,000 emails a month and 100 a day; each check sends 2 emails, so 50 checks a day uses the whole daily allowance.
7. Deploy: `npm run deploy`
8. URL: the Worker is live at `https://ai-visibility-check.<your-subdomain>.workers.dev`. Point the frontend at that, or add a custom domain. carsoncobb.com is on Amplify, so its DNS is probably not on Cloudflare; in that case use the workers.dev URL, or move a subdomain such as `check.carsoncobb.com` to a Cloudflare zone and add `routes = [{ pattern = "check.carsoncobb.com", custom_domain = true }]` to `wrangler.toml`.
9. Test: `curl https://<worker-url>/status` should return `{"paused":false,"limit":50}`.

To pause checks without a deploy, set `DAILY_CHECK_LIMIT` to `0` in the dashboard (Workers, Settings, Variables).

## Local development and tests

```
cd worker
npm install
cat > .dev.vars <<'EOF'
OPENAI_API_KEY=sk-mock-local-only
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
OPENAI_BASE_URL=http://127.0.0.1:8790
EOF
node test/mock-openai.mjs &     # mock Responses API on :8790
npx wrangler dev                 # local mode, local KV, on :8787
```

`1x0000000000000000000000000000000AA` is Cloudflare's always pass Turnstile test secret (send any token). Remove `OPENAI_BASE_URL` from `.dev.vars` and put a real key in to hit OpenAI for real.

- `node test/run-tests.mjs` starts the mock and `wrangler dev` itself (it always points OpenAI at the mock, even when `.dev.vars` holds a real key) and runs the full suite: validation, invalid URLs, two real stores end to end (crawler and readiness run for real, OpenAI hits the mock), cache hit, section failure, IP limit, paused, Turnstile failure. Output goes to `test/out/`.
- `node test/render-emails.mjs test/out/allbirds.com.json` renders both email templates to `test/out/email-*.html` and `.txt`.
- `npm run typecheck` runs `tsc --noEmit`.

## Cost model

Prices (per 1M tokens): `gpt-6-luna` $0.10 in and $0.50 out, `gpt-5.4-mini` $0.75 in and $4.50 out, plus $0.01 per web search call. Search content tokens are billed as input at the model's rate. Each report includes its own measured `cost` (`usd`, `calls`, `searches`, `tokens`), summed from the `usage` of every OpenAI response plus $0.01 per `web_search_call` item.

A fresh check makes 10 OpenAI calls: 4 searches with `SEARCH_MODEL` (3 buyer questions on `BUYER_MODEL` or `SEARCH_MODEL` and 1 brand question, each capped at one search with `max_tool_calls: 1`) and 6 with `SMALL_MODEL` (question writer, 3 answer parsers, accuracy grader, findings write up). The search fees are about 80% of the cost.

Measured on 4 live checks (November 2026, all `gpt-6-luna`): $0.0560, $0.0557, $0.0462 and $0.0551, about 42k to 51k input and 1.8k to 2.3k output tokens each. A check with one extra search (the cap is not always honored) costs about a cent more. With the default cap of 50 fresh checks a day the most you can spend is about $3 a day. Cache hits cost nothing. Workers Paid is $5 a month; KV use fits inside its included quota.

## Notes

- Safe fetch: http and https only, the hostname is checked on every redirect (max 5, handled manually), 8 second timeout per request (45 seconds for OpenAI), at most 2 MB of body read (the 250 product feed gets 10 MB because it is often larger), normal browser user agent except the crawler tests. The store hostname is also resolved over DNS over HTTPS before a fresh check; names that do not exist or point to private addresses are rejected.
- Google-Extended and Applebot-Extended are robots.txt tokens only. Their fetch test uses the Googlebot and Applebot user agents, since those are the crawlers that actually fetch the page.
- Reports with a failed section are not cached, so a temporary OpenAI problem is not stuck for 7 days.
- Cache hits also email the visitor their report and email you a copy marked cached.
- KV has no atomic increment, so two checks starting at the same moment can undercount the limits by one.
