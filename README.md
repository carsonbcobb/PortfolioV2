# carsoncobb.com

Static Astro site. Pages: `/` and `/agencies`. The old Create React App site is in `old-site/` for reference only and is not built.

```bash
npm install
npm run dev          # local dev at http://localhost:4321
npm run build        # static output in dist/
npm run check:terms  # fails if banned terms appear anywhere in dist/
```

All copy and pricing live in `src/data/site.ts`.

## Placeholders waiting on Carson

| Item | Where | Until supplied |
| --- | --- | --- |
| Cal.com link | `CAL_LINK` env var (Amplify > Environment variables) | "Book a call" falls back to email |
| Headshot | `public/carson.jpg` | Initials avatar |
| Logos (Organifi, Charlotte's Web, others) | `public/logos/` + list in `src/data/site.ts` | Only GEM shows |
| Testimonials | `TESTIMONIAL_1`, `TESTIMONIAL_2` in `src/data/site.ts` | Shown as placeholders in dev, hidden in production |

## Amplify rewrites

The old SPA fallback (`/<*>` → `/index.html`, 200) must be removed, or every page serves the home page. Replace all old rules with:

| Source | Target | Type |
| --- | --- | --- |
| `/<*>` | `/404.html` | 404 (Rewrite) |

The og:image source is `scripts/og-image.html` (render at 1200×630).
