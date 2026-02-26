(function () {
  'use strict';

  var STORAGE_KEY = 'blog_admin_unlocked';
  var gate = document.getElementById('password-gate');
  var formWrap = document.getElementById('admin-form-wrap');
  var passwordInput = document.getElementById('admin-password');
  var unlockBtn = document.getElementById('unlock-btn');
  var gateError = document.getElementById('gate-error');
  var form = document.getElementById('post-form');
  var titleInput = document.getElementById('title');
  var slugInput = document.getElementById('slug');
  var metaDescInput = document.getElementById('meta-description');
  var metaCharCount = document.getElementById('meta-char-count');
  var summaryInput = document.getElementById('summary');
  var bodyInput = document.getElementById('body');
  var faqContainer = document.getElementById('faq-container');
  var addFaqBtn = document.getElementById('add-faq');
  var relatedInput = document.getElementById('related');
  var publishDateInput = document.getElementById('publish-date');
  var previewEl = document.getElementById('preview');
  var generateBtn = document.getElementById('generate-btn');
  var generateOutput = document.getElementById('generate-output');
  var outSlug = document.getElementById('out-slug');
  var downloadPost = document.getElementById('download-post');
  var outCard = document.getElementById('out-card');
  var outSitemap = document.getElementById('out-sitemap');
  var copyCardBtn = document.getElementById('copy-card');
  var copySitemapBtn = document.getElementById('copy-sitemap');

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
    var out = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var lines = out.split('\n');
    var result = [];
    var inList = false;
    var listTag = null;
    function flushList() {
      if (inList) {
        result.push('</' + listTag + '>');
        inList = false;
      }
    }
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();
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

  function simpleMarkdown(html) {
    return html
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, function (m) { return '<ul>' + m + '</ul>'; })
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, function (m) {
        return m.indexOf('<ul>') === 0 ? m : '<ol>' + m + '</ol>';
      })
      .split('\n')
      .map(function (line) {
        if (/^<(h[1-3]|ul|ol|li|blockquote)/.test(line.trim())) return line;
        if (line.trim() === '') return line;
        return '<p>' + line + '</p>';
      })
      .join('\n');
  }

  function updatePreview() {
    var body = bodyInput.value || '';
    previewEl.innerHTML = simpleMarkdown(body.replace(/</g, '&lt;').replace(/>/g, '&gt;')) || '<em>Start typing to see preview.</em>';
  }

  function updateMetaCount() {
    var n = (metaDescInput.value || '').length;
    metaCharCount.textContent = n + ' / 150–160';
    metaCharCount.classList.toggle('in-range', n >= 150 && n <= 160);
    metaCharCount.classList.toggle('out-range', n > 0 && (n < 150 || n > 160));
  }

  function addFaqRow(q, a) {
    var row = document.createElement('div');
    row.className = 'faq-row';
    row.innerHTML =
      '<input type="text" class="q" placeholder="Question" value="' + (q || '').replace(/"/g, '&quot;') + '">' +
      '<input type="text" class="a" placeholder="Answer" value="' + (a || '').replace(/"/g, '&quot;') + '">' +
      '<button type="button" class="remove-faq">Remove</button>';
    row.querySelector('.remove-faq').addEventListener('click', function () {
      row.remove();
    });
    faqContainer.appendChild(row);
  }

  function getFaqs() {
    var rows = faqContainer.querySelectorAll('.faq-row');
    var out = [];
    rows.forEach(function (row) {
      var q = row.querySelector('.q').value.trim();
      var a = row.querySelector('.a').value.trim();
      if (q && a) out.push({ question: q, answer: a });
    });
    return out;
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
      '</article>'
    ].join('\n');
  }

  function buildSitemapEntry(canonicalUrl, lastmod) {
    return [
      '  <url>',
      '    <loc>' + canonicalUrl + '</loc>',
      '    <lastmod>' + lastmod + '</lastmod>',
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.7</priority>',
      '  </url>'
    ].join('\n');
  }

  function validateAndGetValues() {
    var title = titleInput.value.trim();
    var slug = slugInput.value.trim();
    if (!title || !slug) {
      alert('Title and slug are required.');
      return null;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      alert('Slug must be lowercase letters, numbers, and hyphens only.');
      return null;
    }
    if (!metaDescInput.value.trim()) {
      alert('Meta description is required.');
      return null;
    }
    if (!summaryInput.value.trim()) {
      alert('Summary / TL;DR is required.');
      return null;
    }
    if (!bodyInput.value.trim()) {
      alert('Body content is required.');
      return null;
    }
    var category = document.getElementById('category').value;
    var summary = summaryInput.value.trim();
    var bodyMd = bodyInput.value;
    var publishDate = publishDateInput.value || new Date().toISOString().slice(0, 10);
    var wordCount = (summary + ' ' + bodyMd).split(/\s+/).filter(Boolean).length;
    var readTime = Math.max(1, Math.ceil(wordCount / 250));
    var publishedDate = publishDate + 'T12:00:00.000Z';
    var modifiedDate = new Date().toISOString();
    var canonicalUrl = 'https://carsoncobb.com/blog/' + slug + '/';
    var ogImage = 'https://carsoncobb.com/og-blog-default.png';
    var excerpt = summary.replace(/\s+/g, ' ').slice(0, 160);
    var postMetaHtml = publishDate + ' · ' + category + ' · ' + readTime + ' min read · Carson Cobb';
    var postSummaryHtml = summary
      ? '<div class="post-summary"><p>' + summary.replace(/\n/g, '</p><p>') + '</p></div>'
      : '';
    var postBodyHtml = mdToHtml(bodyMd);
    var faqs = getFaqs();
    var relatedSlugs = (relatedInput.value || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);

    var articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: metaDescInput.value.trim(),
      image: ogImage,
      author: {
        '@type': 'Person',
        name: 'Carson Cobb',
        url: 'https://carsoncobb.com',
        jobTitle: 'Conversion Optimization Specialist',
        description: 'Founder of Ghost Revenue. 6+ years optimizing ecommerce stores. 50+ Shopify stores optimized. $10M+ in recovered revenue.',
        sameAs: ['https://www.linkedin.com/in/carsoncobb/', 'https://ghostrevenue.co']
      },
      publisher: { '@type': 'Person', name: 'Carson Cobb', url: 'https://carsoncobb.com' },
      datePublished: publishedDate,
      dateModified: modifiedDate,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      articleSection: category,
      wordCount: String(wordCount)
    };

    var faqSchemaScript = '';
    if (faqs.length > 0) {
      var faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(function (f) {
          return {
            '@type': 'Question',
            name: (f.question || '').trim(),
            acceptedAnswer: { '@type': 'Answer', text: (f.answer || '').trim() }
          };
        })
      };
      faqSchemaScript = '<script type="application/ld+json">' + JSON.stringify(faqSchema) + '</script>';
    }

    var relatedPostsHtml = '';
    if (relatedSlugs.length > 0) {
      relatedPostsHtml = '<div class="blog-related"><h3>Related posts</h3><div class="blog-grid">' +
        relatedSlugs.slice(0, 3).map(function (s) {
          return '<article class="blog-card" data-category=""><a href="../' + s + '/"><span class="blog-card__title">' + s.replace(/-/g, ' ') + '</span></a></article>';
        }).join('') +
        '</div></div>';
    }

    return {
      title: title,
      slug: slug,
      category: category,
      metaDescription: metaDescInput.value.trim(),
      summary: summary,
      postMetaHtml: postMetaHtml,
      postSummaryHtml: postSummaryHtml,
      postBodyHtml: postBodyHtml,
      canonicalUrl: canonicalUrl,
      ogImage: ogImage,
      publishedDate: publishedDate,
      modifiedDate: modifiedDate,
      articleSchema: articleSchema,
      faqSchemaScript: faqSchemaScript,
      relatedPostsHtml: relatedPostsHtml,
      publishDate: publishDate,
      readTime: readTime,
      excerpt: excerpt,
      lastmod: new Date().toISOString().slice(0, 10)
    };
  }

  function fillTemplate(template, data) {
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
  }

  if (sessionStorage.getItem(STORAGE_KEY) === '1') {
    gate.style.display = 'none';
    formWrap.classList.add('is-unlocked');
  }

  unlockBtn.addEventListener('click', function () {
    var pwd = passwordInput.value;
    if (!pwd) {
      gateError.textContent = 'Enter password';
      gateError.hidden = false;
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, '1');
    gate.style.display = 'none';
    formWrap.classList.add('is-unlocked');
    gateError.hidden = true;
  });

  titleInput.addEventListener('input', function () {
    if (!slugInput.dataset.manual) slugInput.value = slugify(titleInput.value);
  });

  slugInput.addEventListener('input', function () {
    slugInput.dataset.manual = '1';
  });

  metaDescInput.addEventListener('input', updateMetaCount);
  bodyInput.addEventListener('input', updatePreview);

  addFaqBtn.addEventListener('click', function () {
    addFaqRow('', '');
  });
  addFaqRow('', '');

  publishDateInput.value = new Date().toISOString().slice(0, 10);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });

  generateBtn.addEventListener('click', function () {
    var data = validateAndGetValues();
    if (!data) return;

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating…';

    var templateUrl = (window.location.pathname.indexOf('/admin') !== -1 ? '../blog/' : 'blog/') + 'post-template.html';
    fetch(templateUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('Could not load template');
        return res.text();
      })
      .then(function (template) {
        var postHtml = fillTemplate(template, data);
        var cardHtml = buildCardHtml(data.title, data.slug, data.category, data.publishDate, data.readTime, data.excerpt);
        var sitemapEntry = buildSitemapEntry(data.canonicalUrl, data.lastmod);

        outSlug.textContent = data.slug;
        outCard.value = cardHtml;
        outSitemap.value = sitemapEntry;

        var blob = new Blob([postHtml], { type: 'text/html' });
        var url = URL.createObjectURL(blob);
        downloadPost.href = url;
        downloadPost.download = 'index.html';
        downloadPost.style.display = 'inline-block';

        generateOutput.hidden = false;
        generateOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });

        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate for deploy';
      })
      .catch(function (err) {
        alert(err.message || 'Failed to load template. Make sure you’re viewing the admin from the same origin as the blog (e.g. /admin/).');
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate for deploy';
      });
  });

  copyCardBtn.addEventListener('click', function () {
    outCard.select();
    document.execCommand('copy');
    copyCardBtn.textContent = 'Copied!';
    setTimeout(function () { copyCardBtn.textContent = 'Copy card'; }, 2000);
  });

  copySitemapBtn.addEventListener('click', function () {
    outSitemap.select();
    document.execCommand('copy');
    copySitemapBtn.textContent = 'Copied!';
    setTimeout(function () { copySitemapBtn.textContent = 'Copy sitemap'; }, 2000);
  });

  updateMetaCount();
  updatePreview();
})();
