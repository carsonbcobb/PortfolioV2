# Admin (blog post editor) – setup

The **admin** is the blog post editor. You can use it in two ways.

---

## How to log in to post blogs (React admin with Auth)

1. **Go to your admin URL**  
   Open **https://yoursite.com/admin** (or your real domain).

2. **First time only – create an account**
   - On the sign-in screen, click **“Create account”** (or the sign-up tab).
   - Enter your **email** and a **password** (meet the requirements shown, e.g. 8+ chars, upper/lower/numbers).
   - Submit. If Cognito is set to verify email, check your inbox for a code and enter it.
   - You’re then signed in.

3. **Next times – sign in**
   - Go to **https://yoursite.com/admin**.
   - Enter the same **email** and **password**.
   - Click sign in. You’ll see the “New blog post” form.

4. **Post a blog**
   - Fill out the form (title, slug, category, meta description, summary, body in Markdown, etc.).
   - Use the preview, then click **“Generate for deploy”**.
   - Download the generated file, paste the card and sitemap snippet as in the on-screen steps, then commit and push.

You only need one admin account; use it whenever you want to create or edit posts.

---

## Option 1: React app with Amplify Auth (recommended)

**URL:** `https://yoursite.com/admin` (handled by the React app; no static rewrite for `/admin` in Amplify).

1. **Backend:** Run `npx ampx sandbox` from the project root. When it finishes, copy the generated config into the app:
   ```bash
   cp amplify_outputs.json src/amplify_outputs.json
   ```
   For **Amplify Hosting** builds, the backend may already be linked and outputs injected; if `/admin` shows the sign-in screen (not the “run sandbox” message), Auth is configured.

2. **Rewrites:** In Amplify, **do not** add a rewrite for `/admin`. Let the SPA serve `/admin` so the React route and Auth run.

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
