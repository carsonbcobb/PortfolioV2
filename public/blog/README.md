# Blog system

- **Listing:** [index.html](index.html) – filter by category (JS, no reload).
- **Post template:** [post-template.html](post-template.html) – used by the Netlify function to generate new posts.
- **Styles/scripts:** blog.css, blog.js, blog-post.js (TOC and smooth scroll).

## Logo

For the blog header to show the site logo, add a logo at the site root (e.g. `public/logo.png`) so it is available as `/logo.png` and `../../logo.png` from post pages.

## Adding posts

1. Go to **/admin/** and enter the admin password.
2. Fill the form (title, slug, category, meta description, summary, body in Markdown, optional FAQs, related slugs, date).
3. Use the live preview, then click **Publish post**.
4. The Netlify function commits the new post to GitHub; Netlify deploys and the post is live at `/blog/[slug]/` in about 60 seconds.

## Netlify env vars

Set in Netlify dashboard → Site → Environment variables:

- `ADMIN_PASSWORD` – password for /admin/
- `GITHUB_TOKEN` – personal access token (repo scope)
- `GITHUB_REPO` – e.g. `username/PortfolioV2-1`
- `GITHUB_BRANCH` – e.g. `main`
