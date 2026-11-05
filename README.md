# carsoncobb.com

Static Astro site. Pages: `/` and `/agencies`. The old Create React App site is in `old-site/` for reference only and is not built.

```bash
npm install
npm run dev          # local dev at http://localhost:4321
npm run build        # static output in dist/
npm run check:terms         # fails if banned terms appear anywhere in dist/
npm run check:placeholders  # fails if any "[" placeholder text is left in dist/
```

All copy and pricing live in `src/data/site.ts`. The home page follows the approved design (`design-reference.html`) and uses `src/layouts/HomeLayout.astro` and `src/styles/home.css`; `/agencies` and 404 use `src/layouts/Layout.astro`.

## Placeholders waiting on Carson

| Item | Where | Until supplied |
| --- | --- | --- |
| Cal.com link | `CAL_LINK` env var (Amplify > Environment variables) | "Book a call" falls back to email |
| Headshot | `public/carson.jpg` (shown at 220×260 with rounded corners) | Neutral gray box |

## Amplify rewrites

The old SPA fallback (`/<*>` → `/index.html`, 200) must be removed, or every page serves the home page. Replace all old rules with:

| Source | Target | Type |
| --- | --- | --- |
| `/<*>` | `/404.html` | 404 (Rewrite) |

Share images live in `public/og/` at 1200x627. `OG_DEFAULT` in `src/data/site.ts` (og-home.png) applies to every page; `OG_BY_PATH` overrides it for /ai-visibility-check, /results and /reports/who-chatgpt-recommends-2026. New pages and reports get the default automatically.
