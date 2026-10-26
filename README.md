# carsoncobb.com

Static Astro site. Pages: `/` and `/agencies`. The old Create React App site is in `old-site/` for reference only and is not built.

```bash
npm install
npm run dev          # local dev at http://localhost:4321
npm run build        # static output in dist/
npm run check:terms         # fails if banned terms appear anywhere in dist/
npm run check:placeholders  # fails while any [bracketed] placeholder is left in dist/
```

All copy and pricing live in `src/data/site.ts`.

## Placeholders waiting on Carson

| Item | Where | Until supplied |
| --- | --- | --- |
| Cal.com link | `CAL_LINK` env var (Amplify > Environment variables) | "Book a call" falls back to email |
| Headshot | `public/carson.jpg` | Initials avatar |
| Testimonials | `TESTIMONIAL_1`, `TESTIMONIAL_2` in `src/data/site.ts` | Shown as placeholders in dev, section hidden in production until both are filled |
| Stats, case study, and Recent Work numbers | `[bracketed]` values in `src/data/site.ts` | `check:placeholders` fails the Amplify build |

## Amplify rewrites

The old SPA fallback (`/<*>` → `/index.html`, 200) must be removed, or every page serves the home page. Replace all old rules with:

| Source | Target | Type |
| --- | --- | --- |
| `/<*>` | `/404.html` | 404 (Rewrite) |

The og:image sources are `scripts/og-image.html` (home) and `scripts/og-image-agencies.html` (/agencies), rendered at 1200×630.
