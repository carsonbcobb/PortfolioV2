# Blog system

- **Listing:** [index.html](index.html) – filter by category (JS, no reload).
- **Post template:** [post-template.html](post-template.html) – used by the admin “Generate for deploy” flow to build new posts.
- **Styles/scripts:** blog.css, blog.js, blog-post.js (TOC and smooth scroll).

**Deploy:** This repo is set up for **AWS Amplify** (connected to GitHub). Amplify builds and deploys on push. There is no serverless publish step; new posts are added by generating files in the admin and pushing to the repo.

## Logo

For the blog header to show the site logo, add a logo at the site root (e.g. `public/logo.png`) so it is available as `/logo.png` and `../../logo.png` from post pages.

## Adding posts (Amplify / GitHub)

1. Go to **/admin/** and enter the admin password.
2. Fill the form (title, slug, category, meta description, summary, body in Markdown, optional FAQs, related slugs, date).
3. Use the live preview, then click **Generate for deploy**.
4. Download the generated **index.html** and save it as `public/blog/[slug]/index.html` in the repo.
5. Copy the **card HTML** and paste it at the top of the post grid in `public/blog/index.html` (inside `<div class="blog-grid" id="blog-grid">`).
6. Copy the **sitemap entry** and paste it inside `<urlset>` in `public/blog/sitemap.xml` (before `</urlset>`).
7. Commit and push to GitHub. Amplify will build and deploy; the post will be live at `/blog/[slug]/` once the build finishes.
