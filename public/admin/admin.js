(function () {
  'use strict';

  var STORAGE_KEY = 'blog_admin_unlocked';
  var PWD_KEY = 'blog_admin_pwd';
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
  var submitBtn = document.getElementById('submit-btn');
  var confirmModal = document.getElementById('confirm-modal');
  var confirmMessage = document.getElementById('confirm-message');
  var confirmCancel = document.getElementById('confirm-cancel');
  var confirmPublish = document.getElementById('confirm-publish');

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
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
    sessionStorage.setItem(PWD_KEY, pwd);
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
    var title = titleInput.value.trim();
    var slug = slugInput.value.trim();
    if (!title || !slug) {
      alert('Title and slug are required.');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      alert('Slug must be lowercase letters, numbers, and hyphens only.');
      return;
    }
    if (!metaDescInput.value.trim()) {
      alert('Meta description is required.');
      return;
    }
    if (!summaryInput.value.trim()) {
      alert('Summary / TL;DR is required.');
      return;
    }
    if (!bodyInput.value.trim()) {
      alert('Body content is required.');
      return;
    }
    confirmMessage.textContent = 'Publish “‘ + title + '” at /blog/' + slug + '/? This will go live in about 60 seconds.';
    confirmModal.hidden = false;
  });

  confirmCancel.addEventListener('click', function () {
    confirmModal.hidden = true;
  });

  confirmPublish.addEventListener('click', function () {
    confirmModal.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Publishing…';

    var payload = {
      adminPassword: sessionStorage.getItem(PWD_KEY) || passwordInput.value,
      title: titleInput.value.trim(),
      slug: slugInput.value.trim(),
      category: document.getElementById('category').value,
      metaDescription: metaDescInput.value.trim(),
      summary: summaryInput.value.trim(),
      body: bodyInput.value,
      faqs: getFaqs(),
      relatedSlugs: (relatedInput.value || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean),
      publishDate: publishDateInput.value
    };

    document.querySelectorAll('.admin-form-wrap .message').forEach(function (m) { m.remove(); });
    fetch('/.netlify/functions/publish-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (data) { throw new Error(data.error || res.statusText); });
        return res.json();
      })
      .then(function (data) {
        var msg = document.createElement('div');
        msg.className = 'message success';
        msg.innerHTML = 'Post published. <a target="_blank" rel="noopener" href="' + (data.url || 'https://carsoncobb.com/blog/' + payload.slug + '/') + '">View post →</a>';
        formWrap.appendChild(msg);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish post';
      })
      .catch(function (err) {
        var msg = document.createElement('div');
        msg.className = 'message error';
        msg.textContent = err.message || 'Publish failed. Try again.';
        formWrap.appendChild(msg);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish post';
      });
  });

  updateMetaCount();
  updatePreview();
})();
