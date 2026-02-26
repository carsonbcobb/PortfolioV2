# Fix blank /blog and /admin on AWS Amplify

Amplify rewrites every request to your React app’s `index.html` unless a rule matches first. So `/blog` and `/admin` either load the SPA (blank) or, if you added rules, the HTML loads but **requests for `blog.css`, `blog.js`, `admin.css`, `admin.js`** are still caught by the catch‑all and return the React app instead of the real files — so the pages load with no styles or scripts and look blank.

**Fix:** Add these rules **above** your catch‑all and SPA rules (order matters).

## Rules to add (in this order, at the top)

| Source address   | Target address        | Type    |
|------------------|------------------------|--------|
| `/blog`          | `/blog/index.html`     | Rewrite (200) |
| `/blog/<*>`      | `/blog/<*>`            | Rewrite (200) |

**Do not add** a rewrite for `/admin` or `/admin/<*>`. The admin is a **React route** at `/admin` that uses Amplify Auth (sign-in). If you rewrite `/admin` to a static file, the SPA never loads and Auth cannot run. Let the SPA catch‑all serve `/admin` so the React app shows the protected Admin page.

## Steps in Amplify Console

1. **App settings** → **Rewrites and redirects**.
2. Add the four rules above **at the very top** (above the domain redirect if you have one, and definitely above `/<*>` and the SPA regex).
3. Save.

## JSON (if you use the editor)

Add these **at the beginning** of the redirects array (blog only; no /admin so the SPA handles it):

```json
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
}
```

## If it’s still blank

1. **Confirm the files are in the build**  
   In Amplify, open the latest build → **Build details** (or the build artifacts). Check that the output includes `blog/index.html`, `blog/blog.css`, `blog/blog.js`, `admin/index.html`, `admin/admin.css`, `admin/admin.js`. With Create React App they come from `public/blog` and `public/admin`; if your build doesn’t copy `public/`, those paths won’t exist.

2. **Test assets directly**  
   After deploying, open `https://www.carsoncobb.com/blog/blog.css`. You should see CSS. If you see HTML (the React app), the `/blog/<*>` rule is still below the catch‑all or missing.

## Check

- **https://yoursite.com/blog/** → blog listing.
- **https://yoursite.com/admin/** → admin (password gate).

If it’s still blank, confirm in the Amplify **Build** tab that the build output includes `blog/index.html` and `admin/index.html` (from `public/blog` and `public/admin`).
