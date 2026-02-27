import React, { useState, useCallback } from 'react';
import './AdminForm.css';

const CATEGORIES = ['Conversion Optimization', 'Shopify', 'Conversion Psychology', 'Case Studies', 'AEO'];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inlineFmt(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function mdToHtml(md) {
  if (!md || typeof md !== 'string') return '';
  const out = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

function buildCardHtml(title, slug, category, publishDate, readTime, excerpt) {
  return [
    '<article class="blog-card" data-category="' + category + '">',
    '  <a href="' + slug + '/">',
    '    <div class="blog-card__meta">',
    '      <time datetime="' + publishDate + '">' + publishDate + '</time>',
    '      <span class="blog-card__category">' + category + '</span>',
    '      <span>' + readTime + ' min read</span>',
    '    </div>',
    '    <h2 class="blog-card__title">' + title + '</h2>',
    '    <p class="blog-card__excerpt">' + excerpt + '</p>',
    '  </a>',
    '</article>',
  ].join('\n');
}

function buildSitemapEntry(canonicalUrl, lastmod) {
  return [
    '  <url>',
    '    <loc>' + canonicalUrl + '</loc>',
    '    <lastmod>' + lastmod + '</lastmod>',
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.7</priority>',
    '  </url>',
  ].join('\n');
}

export default function AdminForm() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [metaDescription, setMetaDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [faqs, setFaqs] = useState([{ q: '', a: '' }]);
  const [relatedSlugs, setRelatedSlugs] = useState('');
  const [publishDate, setPublishDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [previewHtml, setPreviewHtml] = useState('');
  const [generating, setGenerating] = useState(false);
  const [outSlug, setOutSlug] = useState('');
  const [outCard, setOutCard] = useState('');
  const [outSitemap, setOutSitemap] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [copyLabel, setCopyLabel] = useState({ card: 'Copy card', sitemap: 'Copy sitemap' });

  const updatePreview = useCallback(() => {
    const raw = body.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const html = mdToHtml(raw);
    setPreviewHtml(html || '<em>Start typing to see preview.</em>');
  }, [body]);

  React.useEffect(() => {
    updatePreview();
  }, [body, updatePreview]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (!slugManual) setSlug(slugify(e.target.value));
  };

  const addFaq = () => setFaqs((f) => [...f, { q: '', a: '' }]);
  const removeFaq = (i) => setFaqs((f) => f.filter((_, j) => j !== i));
  const updateFaq = (i, field, value) =>
    setFaqs((f) => f.map((item, j) => (j === i ? { ...item, [field]: value } : item)));

  const getFaqs = () => faqs.filter((f) => f.q.trim() && f.a.trim()).map((f) => ({ question: f.q.trim(), answer: f.a.trim() }));

  const validateAndBuild = () => {
    if (!title.trim() || !slug.trim()) {
      alert('Title and slug are required.');
      return null;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      alert('Slug must be lowercase letters, numbers, and hyphens only.');
      return null;
    }
    if (!metaDescription.trim()) {
      alert('Meta description is required.');
      return null;
    }
    if (!summary.trim()) {
      alert('Summary / TL;DR is required.');
      return null;
    }
    if (!body.trim()) {
      alert('Body content is required.');
      return null;
    }
    const wordCount = (summary + ' ' + body).split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 250));
    const publishedDate = publishDate + 'T12:00:00.000Z';
    const modifiedDate = new Date().toISOString();
    const canonicalUrl = 'https://carsoncobb.com/blog/' + slug + '/';
    const ogImage = 'https://carsoncobb.com/og-blog-default.png';
    const excerpt = summary.replace(/\s+/g, ' ').slice(0, 160);
    const postMetaHtml = publishDate + ' · ' + category + ' · ' + readTime + ' min read · Carson Cobb';
    const postSummaryHtml = summary ? '<div class="post-summary"><p>' + summary.replace(/\n/g, '</p><p>') + '</p></div>' : '';
    const postBodyHtml = mdToHtml(body);
    const faqList = getFaqs();
    const related = relatedSlugs.split(',').map((s) => s.trim()).filter(Boolean);

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
        description: 'Founder of Ghost Revenue. 6+ years optimizing ecommerce stores. 50+ Shopify stores optimized. $10M+ in recovered revenue.',
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
    if (faqList.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqList.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      };
      faqSchemaScript = '<script type="application/ld+json">' + JSON.stringify(faqSchema) + '</script>';
    }

    let relatedPostsHtml = '';
    if (related.length > 0) {
      relatedPostsHtml =
        '<div class="blog-related"><h3>Related posts</h3><div class="blog-grid">' +
        related
          .slice(0, 3)
          .map((s) => '<article class="blog-card" data-category=""><a href="../' + s + '/"><span class="blog-card__title">' + s.replace(/-/g, ' ') + '</span></a></article>')
          .join('') +
        '</div></div>';
    }

    const lastmod = new Date().toISOString().slice(0, 10);
    return {
      title,
      slug,
      category,
      metaDescription,
      summary,
      postMetaHtml,
      postSummaryHtml,
      postBodyHtml,
      canonicalUrl,
      ogImage,
      publishedDate,
      modifiedDate,
      articleSchema,
      faqSchemaScript,
      relatedPostsHtml,
      publishDate,
      readTime,
      excerpt,
      lastmod,
    };
  };

  const fillTemplate = (template, data) => {
    return template
      .replace(/\[POST_TITLE\]/g, data.title)
      .replace(/\[META_DESCRIPTION\]/g, data.metaDescription)
      .replace(/\[CANONICAL_URL\]/g, data.canonicalUrl)
      .replace(/\[OG_IMAGE\]/g, data.ogImage)
      .replace(/\[ARTICLE_PUBLISHED_TIME\]/g, data.publishedDate)
      .replace(/\[ARTICLE_MODIFIED_TIME\]/g, data.modifiedDate)
      .replace(/\[ARTICLE_SECTION\]/g, data.category)
      .replace(/\[POST_META_HTML\]/g, data.postMetaHtml)
      .replace(/\[POST_SUMMARY_HTML\]/g, data.postSummaryHtml)
      .replace(/\[POST_BODY_HTML\]/g, data.postBodyHtml)
      .replace(/\[RELATED_POSTS_HTML\]/g, data.relatedPostsHtml)
      .replace(/\[TOC_HTML\]/g, '')
      .replace(/\[ARTICLE_SCHEMA_JSON\]/g, JSON.stringify(data.articleSchema))
      .replace(/\[FAQ_SCHEMA_SCRIPT\]/g, data.faqSchemaScript);
  };

  const onGenerate = () => {
    const data = validateAndBuild();
    if (!data) return;
    setGenerating(true);
    fetch('/blog/post-template.html')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load template');
        return res.text();
      })
      .then((template) => {
        const postHtml = fillTemplate(template, data);
        const cardHtml = buildCardHtml(data.title, data.slug, data.category, data.publishDate, data.readTime, data.excerpt);
        const sitemapEntry = buildSitemapEntry(data.canonicalUrl, data.lastmod);
        setOutSlug(data.slug);
        setOutCard(cardHtml);
        setOutSitemap(sitemapEntry);
        const blob = new Blob([postHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setShowOutput(true);
        setGenerating(false);
      })
      .catch((err) => {
        alert(err.message || 'Failed to load template.');
        setGenerating(false);
      });
  };

  const copyCard = () => {
    navigator.clipboard.writeText(outCard);
    setCopyLabel((c) => ({ ...c, card: 'Copied!' }));
    setTimeout(() => setCopyLabel((c) => ({ ...c, card: 'Copy card' })), 2000);
  };
  const copySitemap = () => {
    navigator.clipboard.writeText(outSitemap);
    setCopyLabel((c) => ({ ...c, sitemap: 'Copied!' }));
    setTimeout(() => setCopyLabel((c) => ({ ...c, sitemap: 'Copy sitemap' })), 2000);
  };

  const metaLen = metaDescription.length;
  const metaInRange = metaLen >= 150 && metaLen <= 160;

  return (
    <div className="admin-form-wrap is-unlocked">
      <h1>New blog post</h1>
      <form onSubmit={(e) => e.preventDefault()} id="post-form">
        <div className="form-group">
          <label htmlFor="title">Post Title *</label>
          <input type="text" id="title" value={title} onChange={handleTitleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="slug">Slug *</label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManual(true);
            }}
            required
            placeholder="e.g. how-to-improve-product-pages"
          />
          <p className="hint">Lowercase, hyphens only. Used in URL: /blog/[slug]/</p>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="meta-description">Meta Description *</label>
          <textarea
            id="meta-description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            required
            maxLength={170}
          />
          <p className={`char-count ${metaInRange ? 'in-range' : metaLen ? 'out-range' : ''}`}>{metaLen} / 150–160</p>
        </div>
        <div className="form-group">
          <label htmlFor="summary">Summary / TL;DR *</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            required
            placeholder="2–3 sentences at the top of the post and for AI answers."
          />
        </div>
        <div className="form-group">
          <label>Body (Markdown) *</label>
          <textarea
            id="body"
            className="body-field"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            placeholder="## Heading\nUse **bold**, *italic*, [links](url), lists, blockquotes."
            />
        </div>
        <div className="form-group">
          <label>FAQ (optional)</label>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-row">
              <input
                type="text"
                className="q"
                placeholder="Question"
                value={faq.q}
                onChange={(e) => updateFaq(i, 'q', e.target.value)}
              />
              <input
                type="text"
                className="a"
                placeholder="Answer"
                value={faq.a}
                onChange={(e) => updateFaq(i, 'a', e.target.value)}
              />
              <button type="button" className="remove-faq" onClick={() => removeFaq(i)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="add-faq" onClick={addFaq}>
            + Add FAQ
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="related">Related post slugs</label>
          <input
            type="text"
            id="related"
            value={relatedSlugs}
            onChange={(e) => setRelatedSlugs(e.target.value)}
            placeholder="slug-one, slug-two, slug-three"
          />
        </div>
        <div className="form-group">
          <label htmlFor="publish-date">Publish Date *</label>
          <input type="date" id="publish-date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} required />
        </div>
        <div className="submit-actions">
          <button type="button" id="generate-btn" onClick={onGenerate} disabled={generating}>
            {generating ? 'Generating…' : 'Generate for deploy'}
          </button>
        </div>
      </form>

      <section className="preview-section">
        <h2>Preview</h2>
        <div className="preview-box" id="preview" dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </section>

      {showOutput && (
        <section className="generate-output preview-section">
          <h2>Generated output (Amplify / GitHub)</h2>
          <p className="hint">Add the post file to the repo, paste the card and sitemap entry, then push. Amplify will deploy.</p>
          <div className="form-group">
            <label>
              1. Post file — save as <code>public/blog/{outSlug}/index.html</code>
            </label>
            <a className="btn-primary" download="index.html" href={downloadUrl}>
              Download index.html
            </a>
          </div>
          <div className="form-group">
            <label>
              2. Card HTML — paste at the top of the grid in <code>public/blog/index.html</code>
            </label>
            <textarea readOnly value={outCard} rows={6} />
            <button type="button" className="add-faq" onClick={copyCard}>
              {copyLabel.card}
            </button>
          </div>
          <div className="form-group">
            <label>
              3. Sitemap entry — paste inside <code>&lt;urlset&gt;</code> in <code>public/blog/sitemap.xml</code>
            </label>
            <textarea readOnly value={outSitemap} rows={6} />
            <button type="button" className="add-faq" onClick={copySitemap}>
              {copyLabel.sitemap}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
