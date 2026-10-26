# Fix blank homepage, /blog, or /admin on AWS Amplify

You need **two kinds** of rules, in this order:

1. **Blog rules first** – so `/blog` and `/blog/*` serve the static blog files.
2. **SPA fallback last** – so **every other path** (including `/` and `/admin`) serves `index.html` and the React app can load.

If the **homepage or /admin is blank**, the SPA fallback is usually missing or in the wrong order. Without it, `/` and `/admin` never get `index.html`, so you see a blank page.

## Rule order (top to bottom)

| Order | Source address   | Target address      | Type          |
|-------|------------------|---------------------|---------------|
| 1     | `/blog`          | `/blog/index.html` | Rewrite (200) |
| 2     | `/blog/<*>`      | `/blog/<*>`         | Rewrite (200) |
| 3     | `/static/<*>`    | `/static/<*>`       | Rewrite (200) |
| 4     | **SPA fallback** | `/index.html`      | Rewrite (200) |

**Important:** The **`/static/<*>`** rule must appear **before** the SPA fallback. Otherwise the catch‑all rewrites requests for your JS/CSS (e.g. `/static/js/main.xxx.js`) to `index.html`, and the browser throws **"Uncaught SyntaxError: Unexpected token '<'"** because it receives HTML instead of JavaScript.

**SPA fallback** = one of these (only one):

- Source: `/<*>` → Target: `/index.html` → Type: Rewrite (200)  
- **or** the regex Amplify suggests for SPAs (matches paths that aren’t static files).

**Do not add** a rewrite for `/admin`. Admin is a React route; it must be served by the SPA fallback.

**If /admin is blank:** You likely have a rule that sends `/admin` to `/admin/index.html`. **Remove it.** Delete any rule whose source is `/admin` or `/admin/<*>`. Then `/admin` will hit the SPA fallback, the React app will load, and the in-app route will show the admin (sign-in) page.

## Steps in Amplify Console

1. **App settings** → **Rewrites and redirects**.
2. Put the **blog** rules at the **top**.
3. Add **`/static/<*>`** → **`/static/<*>`** as Rewrite (200) **above** the SPA fallback (so JS/CSS are served, not rewritten to index.html).
4. Ensure you have **one** SPA fallback rule (e.g. `/<*>` → `/index.html`, **200**) **last**. If it's 404 (Rewrite), change it to 200.
5. Save.

## JSON (if you use the editor)

Your full redirects array should look like this (blog first, then SPA fallback). Adjust if you have a domain redirect at the top:

```json
[
  {
    "source": "/blog",
    "target": "/blog/index.html",
    "status": "200",
    "condition": null
  },
  {
    "source": "/blog/<*>",
    "target": "/blog/<*>",
    "status": "200",
    "condition": null
  },
  {
    "source": "/static/<*>",
    "target": "/static/<*>",
    "status": "200",
    "condition": null
  },
  {
    "source": "/<*>",
    "target": "/index.html",
    "status": "200",
    "condition": null
  }
]
```

The last rule sends every path that isn’t `/blog` or `/blog/*` to `index.html`, so the React app (homepage, /admin, etc.) can load.

## If it’s still blank

1. **Confirm the files are in the build**  
   In Amplify, open the latest build → **Build details** (or the build artifacts). Check that the output includes `blog/index.html`, `blog/blog.css`, `blog/blog.js`, `admin/index.html`, `admin/admin.css`, `admin/admin.js`. With Create React App they come from `public/blog` and `public/admin`; if your build doesn’t copy `public/`, those paths won’t exist.

2. **Test assets directly**  
   After deploying, open `https://www.carsoncobb.com/blog/blog.css`. You should see CSS. If you see HTML (the React app), the `/blog/<*>` rule is still below the catch‑all or missing.

## Check

- **https://yoursite.com/** → homepage (React app).
- **https://yoursite.com/blog/** → blog listing.
- **https://yoursite.com/admin** → admin (React app; sign-in).

If the **homepage or /admin is still blank** after adding the SPA fallback, open the browser devtools (Console). If the React app is loading but throwing a JavaScript error (e.g. Auth or `amplify_outputs.json`), fix that in the app. If you see 404 or no document at all, the fallback rule is still wrong or missing.
