/**
 * Netlify serverless function: commits new blog posts to GitHub (used only when the site is deployed on Netlify).
 * On AWS Amplify, use the admin "Generate for deploy" flow and push the generated files to GitHub manually.
 */
const GITHUB_API = 'https://api.github.com';

function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

function inlineFmt(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
}

function mdToHtml(md) {
  if (!md || typeof md !== 'string') return '';
  let out = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const lines = out.split('\n');
  const result = [];
  let inList = false;
  let listTag = null;
  const flushList = () => {
    if (inList) {
      result.push(`</${listTag}>`);
      inList = false;
    }
  };
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    if (/^###\s+/.test(trimmed)) {
      flushList();
      result.push('<h3>' + trimmed.replace(/^###\s+/, '') + '</h3>');
      continue;
    }
    if (/^##\s+/.test(trimmed)) {
      flushList();
      result.push('<h2>' + trimmed.replace(/^##\s+/, '') + '</h2>');
      continue;
    }
    if (/^#\s+/.test(trimmed)) {
      flushList();
      result.push('<h1>' + trimmed.replace(/^#\s+/, '') + '</h1>');
      continue;
    }
    if (/^>\s+/.test(trimmed)) {
      flushList();
      result.push('<blockquote>' + inlineFmt(trimmed.replace(/^>\s+/, '')) + '</blockquote>');
      continue;
    }
    if (/^-\s+/.test(trimmed)) {
      if (!inList || listTag !== 'ul') {
        flushList();
        result.push('<ul>');
        listTag = 'ul';
        inList = true;
      }
      result.push('<li>' + inlineFmt(trimmed.replace(/^-\s+/, '')) + '</li>');
      continue;
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      if (!inList || listTag !== 'ol') {
        flushList();
        result.push('<ol>');
        listTag = 'ol';
        inList = true;
      }
      result.push('<li>' + inlineFmt(trimmed.replace(/^\d+\.\s+/, '')) + '</li>');
      continue;
    }
    if (trimmed === '') {
      flushList();
      result.push('');
      continue;
    }
    flushList();
    result.push('<p>' + inlineFmt(line) + '</p>');
  }
  flushList();
  return result.join('\n');
}

async function ghFetch(path, opts = {}) {
  const token = getEnv('GITHUB_TOKEN');
  const repo = getEnv('GITHUB_REPO');
  const url = path.startsWith('http') ? path : `${GITHUB_API}/repos/${repo}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API: ${res.status} ${err}`);
  }
  return res.json();
}

async function getFile(path) {
  const data = await ghFetch(`/contents/${path}`);
  if (data.content) {
    return Buffer.from(data.content, 'base64').toString('utf8');
  }
  throw new Error(`File not found: ${path}`);
}

async function getFileSha(path) {
  const data = await ghFetch(`/contents/${path}`);
  return data.sha;
}

async function createBlob(content) {
  const res = await ghFetch(`/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({
      content: Buffer.from(content, 'utf8').toString('base64'),
      encoding: 'base64',
    }),
  });
  return res.sha;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const adminPassword = getEnv('ADMIN_PASSWORD');
  if (body.adminPassword !== adminPassword) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid password' }) };
  }

  const slug = (body.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!slug) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid slug' }) };
  }

  const title = (body.title || '').trim();
  const category = body.category || 'Conversion Optimization';
  const metaDescription = (body.metaDescription || '').trim();
  const summary = (body.summary || '').trim();
  const bodyMd = body.body || '';
  const faqs = Array.isArray(body.faqs) ? body.faqs : [];
  const relatedSlugs = Array.isArray(body.relatedSlugs) ? body.relatedSlugs : [];
  const publishDate = body.publishDate || new Date().toISOString().slice(0, 10);

  const publishedDate = publishDate + 'T12:00:00.000Z';
  const modifiedDate = new Date().toISOString();

  const wordCount = (summary + ' ' + bodyMd).split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 250));

  const canonicalUrl = `https://carsoncobb.com/blog/${slug}/`;
  const ogImage = body.featuredImage || 'https://carsoncobb.com/og-blog-default.png';

  const postMetaHtml = [
    publishDate,
    ' · ',
    category,
    ' · ',
    readTime + ' min read',
    ' · Carson Cobb',
  ].join('');

  const postSummaryHtml = summary
    ? `<div class="post-summary"><p>${summary.replace(/\n/g, '</p><p>')}</p></div>`
    : '';

  const postBodyHtml = mdToHtml(bodyMd);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: metaDescription,
    image: ogImage,
    author: {
      '@type': 'Person',
      name: 'Carson Cobb',
      url: 'https://carsoncobb.com',
      jobTitle: 'Conversion Optimization Specialist',
      description:
        'Founder of Ghost Revenue. 6+ years optimizing ecommerce stores. 50+ Shopify stores optimized. $10M+ in recovered revenue.',
      sameAs: ['https://www.linkedin.com/in/carsoncobb/', 'https://ghostrevenue.co'],
    },
    publisher: { '@type': 'Person', name: 'Carson Cobb', url: 'https://carsoncobb.com' },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    articleSection: category,
    wordCount: String(wordCount),
  };

  let faqSchemaScript = '';
  if (faqs.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: (f.question || '').trim(),
        acceptedAnswer: { '@type': 'Answer', text: (f.answer || '').trim() },
      })),
    };
    faqSchemaScript = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
  }

  let relatedPostsHtml = '';
  if (relatedSlugs.length > 0) {
    relatedPostsHtml =
      '<div class="blog-related"><h3>Related posts</h3><div class="blog-grid">' +
      relatedSlugs
        .slice(0, 3)
        .map(
          (s) =>
            `<article class="blog-card" data-category=""><a href="../${s}/"><span class="blog-card__title">${s.replace(/-/g, ' ')}</span></a></article>`
        )
        .join('') +
      '</div></div>';
  }

  let tocHtml = '';

  let template;
  const blogPath = 'public/blog';
  try {
    template = await getFile(blogPath + '/post-template.html');
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not load post template: ' + e.message }) };
  }

  const postHtml = template
    .replace(/\[POST_TITLE\]/g, title)
    .replace(/\[META_DESCRIPTION\]/g, metaDescription)
    .replace(/\[CANONICAL_URL\]/g, canonicalUrl)
    .replace(/\[OG_IMAGE\]/g, ogImage)
    .replace(/\[ARTICLE_PUBLISHED_TIME\]/g, publishedDate)
    .replace(/\[ARTICLE_MODIFIED_TIME\]/g, modifiedDate)
    .replace(/\[ARTICLE_SECTION\]/g, category)
    .replace(/\[POST_META_HTML\]/g, postMetaHtml)
    .replace(/\[POST_SUMMARY_HTML\]/g, postSummaryHtml)
    .replace(/\[POST_BODY_HTML\]/g, postBodyHtml)
    .replace(/\[RELATED_POSTS_HTML\]/g, relatedPostsHtml)
    .replace(/\[TOC_HTML\]/g, tocHtml)
    .replace(/\[ARTICLE_SCHEMA_JSON\]/g, JSON.stringify(articleSchema))
    .replace(/\[FAQ_SCHEMA_SCRIPT\]/g, faqSchemaScript);

  let indexHtml;
  let indexSha;
  try {
    indexHtml = await getFile(blogPath + '/index.html');
    indexSha = await getFileSha(blogPath + '/index.html');
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not load blog index: ' + e.message }) };
  }

  const excerpt = summary.replace(/\s+/g, ' ').slice(0, 160);
  const cardHtml = `
    <article class="blog-card" data-category="${category}">
      <a href="${slug}/">
        <div class="blog-card__meta">
          <time datetime="${publishDate}">${publishDate}</time>
          <span class="blog-card__category">${category}</span>
          <span>${readTime} min read</span>
        </div>
        <h2 class="blog-card__title">${title}</h2>
        <p class="blog-card__excerpt">${excerpt}</p>
      </a>
    </article>
  `.trim();

  const gridMatch = indexHtml.match(/<div class="blog-grid" id="blog-grid">([\s\S]*?)<\/div>/);
  const insertBefore = gridMatch ? gridMatch[1] : '';
  const newGridContent = cardHtml + (insertBefore ? '\n            ' + insertBefore : '');
  const updatedIndexHtml = indexHtml.replace(
    /<div class="blog-grid" id="blog-grid">[\s\S]*?<\/div>/,
    `<div class="blog-grid" id="blog-grid">\n            ${newGridContent}\n        </div>`
  );

  let sitemapXml;
  let sitemapSha;
  try {
    sitemapXml = await getFile(blogPath + '/sitemap.xml');
    sitemapSha = await getFileSha(blogPath + '/sitemap.xml');
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not load sitemap: ' + e.message }) };
  }

  const lastmod = new Date().toISOString().slice(0, 10);
  const newUrlEntry = `  <url>
    <loc>${canonicalUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  const updatedSitemap = sitemapXml.replace('</urlset>', newUrlEntry + '</urlset>');

  const branch = process.env.GITHUB_BRANCH || 'main';
  let refData;
  try {
    refData = await ghFetch(`/git/ref/heads/${branch}`);
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Could not get branch ref: ' + e.message }) };
  }

  const commitSha = refData.object.sha;
  const commitData = await ghFetch(`/git/commits/${commitSha}`);
  const baseTreeSha = commitData.tree.sha;

  const blobPost = await createBlob(postHtml);
  const blobIndex = await createBlob(updatedIndexHtml);
  const blobSitemap = await createBlob(updatedSitemap);

  const tree = await ghFetch('/git/trees', {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: [
        { path: `public/blog/${slug}/index.html`, mode: '100644', type: 'blob', sha: blobPost },
        { path: 'public/blog/index.html', mode: '100644', type: 'blob', sha: blobIndex },
        { path: 'public/blog/sitemap.xml', mode: '100644', type: 'blob', sha: blobSitemap },
      ],
    }),
  });

  const newCommit = await ghFetch('/git/commits', {
    method: 'POST',
    body: JSON.stringify({
      message: `New post: ${title}`,
      tree: tree.sha,
      parents: [commitSha],
    }),
  });

  await ghFetch(`/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha }),
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: canonicalUrl, slug }),
  };
};
