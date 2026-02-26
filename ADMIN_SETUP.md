# Admin (blog post editor) – setup

The **admin** is the blog post editor. You can use it in two ways.

## Option 1: React app with Amplify Auth (recommended)

**URL:** `https://yoursite.com/admin` (handled by the React app; no static rewrite for `/admin` in Amplify).

1. **Backend:** Run `npx ampx sandbox` from the project root. When it finishes, copy the generated config into the app:
   ```bash
   cp amplify_outputs.json src/amplify_outputs.json
   ```
2. **First-time sign-in:** Create an account using the Amplify Authenticator (email + password). You only need one admin user.
3. **Rewrites:** In Amplify, **do not** add a rewrite for `/admin`. Let the SPA serve `/admin` so the React route and Auth run.

After that, going to `/admin` shows the sign-in screen; after sign-in you see the “New blog post” form with preview and “Generate for deploy”.

## Option 2: Static admin page (no Auth)

**URL:** `https://yoursite.com/admin/` (must be served as a **static** file; add rewrites for `/admin` and `/admin/<*>` in Amplify).

- The static page at `public/admin/index.html` has a **client-only password gate** (not secure; anyone can bypass via devtools).
- Use this only for local or low-risk use. See `ADMIN_AUTH.md` for real protection options.

## Generate-for-deploy flow (both options)

1. Fill in title, slug, category, meta description, summary, body (Markdown), optional FAQs, related slugs, date.
2. Click **Generate for deploy**.
3. Download the generated `index.html` and save it as `public/blog/[slug]/index.html`.
4. Copy the **card HTML** into `public/blog/index.html` (inside the blog grid).
5. Copy the **sitemap entry** into `public/blog/sitemap.xml` (before `</urlset>`).
6. Commit and push; Amplify deploys and the post is live at `/blog/[slug]/`.
