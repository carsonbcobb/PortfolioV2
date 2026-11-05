/* AI Visibility Check: the step flow on /ai-visibility-check.
 * Step 1 store, 2 running plus email, 3 score, 4 to 7 one section each, 8 the close.
 * Talks to the Worker in worker/: POST /detect, POST /check (NDJSON stream), POST /email, GET /report.
 * All text from the Worker or the store is set as text, never as HTML. */
(() => {
  const me = document.currentScript;
  const API = (me && me.dataset.api) || '';
  const SITEKEY = (me && me.dataset.sitekey) || '';
  const CAL = (me && me.dataset.cal) || '';
  const flow = document.getElementById('flow');
  if (!flow) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const steps = $$('.flow__step', flow);
  const navBar = $('.flow__nav', flow);
  const live = $('#flow-live');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const FIRST_RESULT = 3;
  const LAST = 8;
  const TITLES = { 1: 'Your store', 2: 'Running your check', 3: 'Your score', 4: 'AI visibility', 5: 'Brand accuracy', 6: 'Crawler access', 7: 'Site readiness', 8: 'What this means' };

  // Element helper: el('p', {class: 'x'}, 'text', child). Strings always become text nodes.
  const el = (tag, attrs, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k !== null && k !== undefined && k !== false) n.append(k instanceof Node ? k : String(k));
    return n;
  };
  const track = (name, params) => {
    try {
      if (window.gtag) window.gtag('event', name, params || {});
    } catch {}
  };
  const store = {
    get(k) {
      try {
        return sessionStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        sessionStorage.setItem(k, v);
      } catch {}
    },
  };
  const listNames = (a) => (a.length <= 1 ? a.join('') : a.length === 2 ? `${a[0]} and ${a[1]}` : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);
  const plural = (n, one, many) => (n === 1 ? one : many);
  const isErr = (s) => !s || typeof s.error === 'string';
  const safeUrl = (u) => {
    try {
      const x = new URL(u);
      return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : null;
    } catch {
      return null;
    }
  };

  // ---------- State ----------
  const S = {
    step: 1,
    url: '',
    domain: '',
    brand: '',
    category: '',
    report: null,
    ticket: null,
    email: '',
    emailSent: false,
    running: false,
    token: '',
  };

  // ---------- Stage height: the flow fills the screen under the nav ----------
  const header = document.querySelector('header.dark');
  const setNavHeight = () => document.documentElement.style.setProperty('--nav-h', `${header ? header.offsetHeight : 0}px`);
  setNavHeight();
  window.addEventListener('resize', setNavHeight);

  // ---------- Steps ----------
  let fadeTimer = null;
  const show = (n, opts = {}) => {
    n = Math.max(1, Math.min(LAST, n));
    if (n >= FIRST_RESULT && !S.report) n = 1;
    const from = steps.find((s) => s.classList.contains('is-active'));
    const to = steps.find((s) => s.dataset.step === String(n));
    S.step = n;
    flow.dataset.step = String(n);

    const reveal = () => {
      steps.forEach((s) => {
        if (s !== to) {
          s.hidden = true;
          s.classList.remove('is-active', 'is-leaving');
        }
      });
      to.hidden = false;
      // Force a style flush so the fade in runs (rAF does not fire in background tabs).
      void to.offsetWidth;
      to.classList.add('is-active');
      navBar.hidden = n < FIRST_RESULT;
      updateNav();
      if (n === 8) layoutClose();
      if (opts.focus !== false) {
        const h = to.querySelector('[tabindex="-1"]');
        if (h) h.focus({ preventScroll: true });
      }
      live.textContent = `Step ${n} of ${LAST}: ${TITLES[n]}`;
    };

    clearTimeout(fadeTimer);
    if (from && from !== to && !reduced.matches) {
      from.classList.add('is-leaving');
      from.classList.remove('is-active');
      fadeTimer = setTimeout(reveal, 250);
    } else reveal();

    if (opts.history !== false) {
      const qs = new URLSearchParams();
      if (S.domain && n > 1) qs.set('store', S.domain);
      if (n > 1) qs.set('step', String(n));
      const url = `${location.pathname}${qs.toString() ? `?${qs}` : ''}`;
      const state = { aivc: true, step: n };
      if (opts.replace) history.replaceState(state, '', url);
      else history.pushState(state, '', url);
    }
  };

  const dots = $('#dots');
  for (let i = FIRST_RESULT; i <= LAST; i++) {
    dots.append(
      el('li', {}, el('button', { type: 'button', class: 'dot-btn', 'data-goto': String(i), 'aria-label': `Step ${i - FIRST_RESULT + 1} of ${LAST - FIRST_RESULT + 1}: ${TITLES[i]}` })),
    );
  }
  const updateNav = () => {
    $$('.dot-btn', dots).forEach((b) => {
      const on = Number(b.dataset.goto) === S.step;
      b.classList.toggle('is-on', on);
      if (on) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    const next = $('.flow__nav-btn--next', navBar);
    next.hidden = S.step >= LAST;
    $('[data-action="back"]', navBar).textContent = S.step === FIRST_RESULT ? '← New check' : '← Back';
  };

  window.addEventListener('popstate', (e) => {
    const n = e.state && e.state.aivc ? e.state.step : 1;
    if (n === 2 && S.report && S.email) return show(FIRST_RESULT, { history: false });
    show(n, { history: false });
  });

  // ---------- Turnstile ----------
  let tsWidget = null;
  let tokenWaiters = [];
  const renderTurnstile = () => {
    if (!window.turnstile || typeof window.turnstile.render !== 'function' || tsWidget !== null || !SITEKEY || !$('#ts-box')) return;
    tsWidget = window.turnstile.render('#ts-box', {
      sitekey: SITEKEY,
      appearance: 'interaction-only',
      theme: 'dark',
      callback: (t) => {
        S.token = t;
        tokenWaiters.forEach((f) => f(t));
        tokenWaiters = [];
      },
      'expired-callback': () => {
        S.token = '';
        window.turnstile.reset(tsWidget);
      },
      'error-callback': () => {
        S.token = '';
      },
    });
  };
  window.aivcTurnstile = renderTurnstile;
  renderTurnstile();
  const getToken = () =>
    S.token
      ? Promise.resolve(S.token)
      : new Promise((resolve, reject) => {
          renderTurnstile();
          tokenWaiters.push(resolve);
          setTimeout(() => reject(new Error('The spam check did not load. Please refresh the page and try again.')), 20000);
        });
  const spendToken = () => {
    S.token = '';
    if (window.turnstile && tsWidget !== null) window.turnstile.reset(tsWidget);
  };

  // ---------- Step 1: store, detect, confirm ----------
  const storeForm = $('#store-form');
  const confirmForm = $('#confirm-form');
  const storeError = $('#store-error');
  const storeFine = $('#store-fine');
  const ERRORS = {
    bad_request: 'Please check the store URL and try again.',
    invalid_url: "That doesn't look like a public store URL. Try something like yourstore.com.",
    turnstile: 'The spam check failed. Please refresh the page and try again.',
    rate_limited: "You've run 3 checks today. Come back tomorrow, or book a review to talk about next steps.",
    paused: 'Checks are paused for today. Book a review instead.',
    expired: 'This report has expired. Please run the check again.',
  };
  const fail1 = (msg) => {
    storeError.textContent = msg;
    storeError.hidden = false;
  };
  const busy = (btn, on, label) => {
    btn.disabled = on;
    btn.textContent = on ? label : btn.dataset.label || btn.textContent;
  };
  const normUrl = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
  const domainOf = (u) => {
    try {
      return new URL(normUrl(u)).hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      return '';
    }
  };

  const postJson = async (path, body) => {
    const res = await fetch(`${API}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(ERRORS[data.error] || data.message || 'Something went wrong. Please try again.');
    return data;
  };

  if (storeForm) {
    const btn = $('button[type="submit"]', storeForm);
    storeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      storeError.hidden = true;
      const url = String(storeForm.url.value || '').trim();
      if (!url || !domainOf(url)) return fail1('Please enter your store URL, like yourstore.com.');
      busy(btn, true, 'Reading your store...');
      try {
        const d = await postJson('/detect', { url: normUrl(url) });
        S.url = normUrl(url);
        S.domain = d.domain;
        confirmForm.brand.value = d.brand || '';
        confirmForm.category.value = d.category || '';
        storeForm.hidden = true;
        storeFine.hidden = true;
        confirmForm.hidden = false;
        sizeChips();
        (d.category ? $('button[type="submit"]', confirmForm) : confirmForm.category).focus();
        track('visibility_check_detect', { cached: !!d.cached });
      } catch (err) {
        fail1(err.message);
      } finally {
        busy(btn, false);
      }
    });

    // Chips grow with their text.
    const sizeChips = () => $$('.chip input', confirmForm).forEach((i) => (i.style.width = `${Math.max(8, (i.value || i.placeholder).length + 1)}ch`));
    confirmForm.addEventListener('input', sizeChips);

    confirmForm.addEventListener('submit', (e) => {
      e.preventDefault();
      storeError.hidden = true;
      const brand = confirmForm.brand.value.trim();
      const category = confirmForm.category.value.trim();
      if (!brand) return fail1('Please add your brand name.') || confirmForm.brand.focus();
      if (!category) return fail1('Please add your main product category, like natural skincare.') || confirmForm.category.focus();
      S.brand = brand;
      S.category = category;
      startCheck();
    });

    $('[data-action="change-store"]').addEventListener('click', () => resetStep1(true));
  }

  const resetStep1 = (focusInput) => {
    if (!storeForm) return;
    storeForm.hidden = false;
    storeFine.hidden = false;
    confirmForm.hidden = true;
    storeError.hidden = true;
    if (focusInput) storeForm.url.focus();
  };

  // ---------- Step 2: running, plus email ----------
  const runList = $('#run-list');
  const runError = $('#run-error');
  const runRetry = $('#run-retry');
  const emailForm = $('#email-form');
  const emailNote = $('#email-note');
  const emailError = $('#email-error');
  const lines = [];

  const addLine = (msg) => {
    // A new line ends the lines it supersedes: setup lines, and a section's line without an id.
    lines.forEach((l) => {
      if (l.done) return;
      if (l.step === 'setup' && msg.step !== 'setup') finishLine(l);
      if (l.step === msg.step && !l.id && msg.id) finishLine(l);
    });
    const li = el('li', { class: 'run__line' }, el('span', { class: 'run__mark', 'aria-hidden': 'true' }), el('span', { class: 'run__text' }, msg.message));
    const line = { id: msg.id || null, step: msg.step, li, done: false };
    lines.push(line);
    runList.append(li);
    return line;
  };
  const finishLine = (l) => {
    l.done = true;
    l.li.classList.add('is-done');
    $('.run__mark', l.li).textContent = '✓';
  };

  const ready = () => {
    if (!S.report || !S.email) return;
    sendEmail();
    renderReport();
    show(FIRST_RESULT, { replace: true });
  };

  emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    emailError.hidden = true;
    const v = String(emailForm.email.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailError.hidden = false;
      return emailForm.email.focus();
    }
    S.email = v;
    store.set(`aivc:email:${S.domain}`, v);
    emailNote.textContent = S.report ? 'Opening your results...' : `Got it. Your report will go to ${v}. Your results open when the check finishes.`;
    $('button', emailForm).disabled = true;
    emailForm.email.readOnly = true;
    track('visibility_check_email');
    ready();
  });

  const sendEmail = async () => {
    if (S.emailSent || !S.ticket || !S.email) return;
    S.emailSent = true;
    const line = $('#sent-line');
    try {
      await postJson('/email', { ticket: S.ticket, email: S.email });
      line.textContent = `Your full report is on its way to ${S.email}.`;
    } catch {
      line.textContent = "We couldn't email your report this time. Your full results are on this page.";
    }
  };

  const startCheck = async () => {
    if (S.running) return;
    S.running = true;
    S.report = null;
    S.ticket = null;
    S.emailSent = false;
    lines.length = 0;
    runList.replaceChildren();
    runError.hidden = true;
    runRetry.hidden = true;
    $('#run-title').textContent = `Checking ${S.brand}`;
    const remembered = store.get(`aivc:email:${S.domain}`);
    if (remembered && !S.email) emailForm.email.value = remembered;
    if (!S.email) {
      emailForm.hidden = false;
      $('button', emailForm).disabled = false;
      emailForm.email.readOnly = false;
      emailNote.textContent = "Your results open as soon as the check finishes and you've added your email.";
    } else {
      emailNote.textContent = `Your report will go to ${S.email}.`;
    }
    const startBtn = $('button[type="submit"]', confirmForm);
    startBtn.disabled = true;

    let token;
    try {
      token = await getToken();
    } catch (err) {
      S.running = false;
      startBtn.disabled = false;
      return fail1(err.message);
    }
    show(2);
    if (!S.email) setTimeout(() => emailForm.email.focus({ preventScroll: true }), 300);
    track('visibility_check_start');

    try {
      const res = await fetch(`${API}/check`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: S.url, category: S.category, brand: S.brand, token }),
      });
      spendToken();
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(ERRORS[body.error] || body.message || 'Something went wrong. Please try again.');
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finished = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (value) buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf('\n')) >= 0) {
          const raw = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!raw) continue;
          let msg;
          try {
            msg = JSON.parse(raw);
          } catch {
            continue;
          }
          if (msg.type === 'progress') addLine(msg);
          else if (msg.type === 'tick') lines.filter((l) => l.id === msg.id).forEach(finishLine);
          else if (msg.type === 'section') lines.filter((l) => l.step === msg.key).forEach(finishLine);
          else if (msg.type === 'error') throw new Error(msg.message || 'Something went wrong. Please try again.');
          else if (msg.type === 'done') {
            finished = true;
            if (msg.cached && !lines.length) addLine({ step: 'setup', message: 'Found your saved report from the last 7 days' });
            lines.forEach(finishLine);
            S.report = msg.report;
            S.ticket = msg.ticket || null;
            S.brand = msg.report.brand || S.brand;
            track('visibility_check_complete', { score: msg.report.overall.score, cached: !!msg.cached });
            if (!S.email) {
              emailNote.textContent = 'Your results are ready. Add your email to see them.';
              emailForm.email.focus({ preventScroll: true });
            }
            ready();
          }
        }
        if (done) break;
      }
      if (!finished) throw new Error('The check stopped before it finished. Please try again.');
    } catch (err) {
      runError.textContent = err.message || 'Something went wrong. Please try again.';
      runError.hidden = false;
      runRetry.hidden = false;
    } finally {
      S.running = false;
      startBtn.disabled = false;
    }
  };

  // ---------- The report ----------
  const SEARCH_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'];
  const band = (s) => (s >= 80 ? 'good' : s >= 50 ? 'fair' : 'poor');

  const competitors = (v, brand) => {
    const counts = new Map();
    for (const q of v.questions) {
      if (q.mentioned) continue;
      for (const b of q.brands || []) {
        if (b.toLowerCase() === brand.toLowerCase()) continue;
        counts.set(b, (counts.get(b) || 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map((x) => x[0]);
  };

  // The top 3 findings for step 3, each tied to what it costs. Problems only, never fixes.
  const buildFindings = (r) => {
    const out = [];
    const brand = r.brand || r.domain;
    const v = r.sections.visibility;
    if (!isErr(v)) {
      const rivals = competitors(v, brand).slice(0, 2);
      if (v.mentioned === 0)
        out.push({
          w: 100,
          bad: true,
          text: rivals.length
            ? `When shoppers ask ChatGPT for ${r.category}, it recommends ${listNames(rivals)}, not you.`
            : `When shoppers ask ChatGPT for ${r.category}, it doesn't recommend you.`,
          cost: 'Those shoppers are ready to buy, and they buy from whoever AI names.',
        });
      else if (v.mentioned < v.total)
        out.push({
          w: 90,
          bad: true,
          text: `ChatGPT recommends you in ${v.mentioned} of ${v.total} buyer questions.${rivals.length ? ` In the rest, it names ${listNames(rivals)}.` : ''}`,
          cost: 'Every question you miss sends a ready buyer to a competitor.',
        });
      else out.push({ w: 20, bad: false, text: `ChatGPT recommends you in all ${v.total} buyer questions.`, cost: 'Your buyers ask hundreds more, and each one is up for grabs.' });
    }
    const c = r.sections.crawlers;
    if (!isErr(c)) {
      const stopped = c.bots.filter((b) => b.robots === 'blocked' || b.fetch === 'blocked' || b.fetch === 'challenge');
      const chatgpt = stopped.filter((b) => SEARCH_BOTS.includes(b.name));
      if (chatgpt.length)
        out.push({ w: 95, bad: true, text: "ChatGPT's crawler is blocked from your store.", cost: "AI can't recommend products it can't read." });
      else if (stopped.length)
        out.push({
          w: 70,
          bad: true,
          text: `${listNames(stopped.map((b) => b.name))} ${plural(stopped.length, "can't", "can't")} reach your store.`,
          cost: 'Shoppers using those assistants never hear about you.',
        });
    }
    const a = r.sections.accuracy;
    if (!isErr(a)) {
      if (a.grade === 'wrong') out.push({ w: 92, bad: true, text: 'AI describes your brand inaccurately.', cost: 'Shoppers who ask about you by name get the wrong picture before they reach your store.' });
      else if (a.grade === 'unknown') out.push({ w: 88, bad: true, text: `ChatGPT can't say what ${brand} sells.`, cost: "A brand AI can't describe is a brand it won't recommend." });
      else if (a.grade === 'partly accurate')
        out.push({ w: 55, bad: true, text: `AI's description of ${brand} leaves out key details.`, cost: "The missing details are often the reason a shopper would choose you." });
      else out.push({ w: 15, bad: false, text: `ChatGPT describes ${brand} accurately.`, cost: 'Being described right is the floor. Being named is the win.' });
    }
    const rd = r.sections.readiness;
    if (!isErr(rd)) {
      const p = rd.products || {};
      const product = (rd.pages || []).find((pg) => pg.type === 'Product' && pg.found);
      if (product && product.cells.Product === 'missing')
        out.push({ w: 85, bad: true, text: "Your product pages don't give AI your price, reviews or availability in a form it reads reliably.", cost: "AI is less likely to recommend what it can't verify." });
      if (p.total > 0 && p.incomplete > 0) {
        const share = p.incomplete / p.total;
        out.push({
          w: share >= 0.5 ? 80 : share >= 0.2 ? 60 : 30,
          bad: true,
          text: `${p.incomplete} of ${p.total} products are missing details AI uses.`,
          cost: "Those products are hard for AI to recommend, however good they are.",
        });
      }
      if (rd.duplicates && rd.duplicates.length)
        out.push({ w: 65, bad: true, text: 'Your product pages send AI conflicting product data.', cost: 'Conflicting data makes AI less sure what you sell and what it costs.' });
    }
    return out.sort((x, y) => y.w - x.w).slice(0, 3);
  };

  const costLine = (text) => el('p', { class: 'sect__cost' }, text);
  const sectHead = (eyebrow, big, score) =>
    el(
      'header',
      { class: 'sect__head' },
      el('div', {}, el('p', { class: 'eyebrow' }, eyebrow), el('h2', { class: 'flow__h2 sect__big', tabindex: '-1' }, big)),
      typeof score === 'number' ? el('span', { class: `pill pill--${band(score)}`, title: 'Section score' }, `${score}/100`) : null,
    );
  const sectError = (eyebrow, msg) => [sectHead(eyebrow, "This part couldn't finish this time."), el('p', { class: 'flow__body' }, msg || 'Run the check again later to see it.')];

  const renderVisibility = (r) => {
    const box = $('#sect-visibility');
    const v = r.sections.visibility;
    if (isErr(v)) return box.replaceChildren(...sectError('AI visibility', v && v.error));
    const brand = r.brand || r.domain;
    const list = el('ol', { class: 'qs' });
    const detail = el('div', { class: 'qdetail', hidden: true });
    v.questions.forEach((q, i) => {
      const others = (q.brands || []).filter((b) => b.toLowerCase() !== brand.toLowerCase());
      const sub = q.mentioned
        ? `Recommended${q.position ? `, position ${q.position}` : ''}`
        : others.length
          ? `Instead: ${others.slice(0, 3).join(', ')}`
          : 'Not recommended';
      list.append(
        el(
          'li',
          {},
          el(
            'button',
            { type: 'button', class: `q ${q.mentioned ? 'is-pass' : 'is-fail'}`, onclick: () => openQ(i) },
            el('span', { class: 'q__mark', 'aria-hidden': 'true' }, q.mentioned ? '✓' : '✕'),
            el('span', { class: 'q__body' }, el('span', { class: 'q__text' }, q.question), el('span', { class: 'q__sub' }, el('span', { class: 'visually-hidden' }, q.mentioned ? 'Pass. ' : 'Fail. '), sub)),
            el('span', { class: 'q__more', 'aria-hidden': 'true' }, '›'),
          ),
        ),
      );
    });
    const openQ = (i) => {
      if (srcLine) srcLine.hidden = true;
      const q = v.questions[i];
      const others = (q.brands || []).filter((b) => b.toLowerCase() !== brand.toLowerCase());
      const sources = (q.sources || []).slice(0, 5);
      detail.replaceChildren(
        el('button', { type: 'button', class: 'flow__link qdetail__back', onclick: closeQ }, '← All questions'),
        el('p', { class: 'qdetail__q' }, `“${q.question}”`),
        el('p', { class: `qdetail__verdict ${q.mentioned ? 'is-pass' : 'is-fail'}` }, q.mentioned ? `You're recommended${q.position ? `, position ${q.position}` : ''}.` : 'You are not recommended.', q.cited ? ' Your site was cited as a source.' : ''),
        others.length ? el('p', { class: 'qdetail__row' }, el('strong', {}, q.mentioned ? 'Also named: ' : 'Recommended instead: '), others.slice(0, 6).join(', ')) : null,
        sources.length
          ? el(
              'div',
              { class: 'qdetail__row' },
              el('strong', {}, 'Sources AI cited: '),
              el(
                'ul',
                { class: 'qdetail__sources' },
                sources.map((s) => {
                  const href = safeUrl(s.url);
                  const p = PRESENCE[s.presence] || PRESENCE.unread;
                  return el(
                    'li',
                    {},
                    el('span', { class: `src__tag src__tag--${p.k}` }, p.label),
                    href ? el('a', { href, target: '_blank', rel: 'noopener nofollow' }, s.host || s.title || href) : s.title,
                  );
                }),
              ),
            )
          : null,
      );
      list.hidden = true;
      detail.hidden = false;
      $('.qdetail__back', detail).focus();
    };
    const closeQ = () => {
      if (srcLine) srcLine.hidden = false;
      detail.hidden = true;
      list.hidden = false;
      const b = $$('.q', list)[0];
      if (b) b.focus();
    };
    const src = v.sources;
    const srcLine =
      src && src.total
        ? el(
            'p',
            { class: 'flow__fine src__sum' },
            `AI ${v.mentioned < v.total ? 'recommended your competitors' : 'built these answers'} based on ${plural(src.total, 'this source', `these ${src.total} sources`)}, and you're on ${src.on} of them.`,
          )
        : null;
    box.replaceChildren(
      sectHead('AI visibility', `Recommended in ${v.mentioned} of ${v.total} questions.`, v.score),
      el('div', { class: 'sect__body' }, list, srcLine, detail),
      costLine(v.mentioned < v.total ? 'Every question you miss is a shopper ready to buy, sent to a competitor.' : `You show up for these ${v.total}. Your buyers ask hundreds more.`),
    );
  };

  const PRESENCE = {
    yours: { k: 'on', label: 'Your site' },
    listed: { k: 'on', label: 'Lists you' },
    absent: { k: 'off', label: 'Not you' },
    unread: { k: 'na', label: "Couldn't read" },
  };

  const GRADE = { accurate: 'Accurate', 'partly accurate': 'Partly accurate', wrong: 'Inaccurate', unknown: "ChatGPT doesn't know you" };
  const renderAccuracy = (r) => {
    const box = $('#sect-accuracy');
    const a = r.sections.accuracy;
    if (isErr(a)) return box.replaceChildren(...sectError('Brand accuracy', a && a.error));
    const issues = [...(a.wrong || []).map((t) => ({ t, k: 'Wrong' })), ...(a.missing || []).map((t) => ({ t, k: 'Missing' }))].slice(0, 3);
    box.replaceChildren(
      sectHead('Brand accuracy', `${GRADE[a.grade] || a.grade}.`, a.score),
      el(
        'div',
        { class: 'sect__body' },
        el('p', { class: 'eyebrow eyebrow--dim' }, `What ChatGPT said about ${r.brand || r.domain}`),
        a.answer ? el('blockquote', { class: 'quote' }, a.answer) : el('p', { class: 'flow__body' }, 'It had nothing to say.'),
        issues.length
          ? el(
              'ul',
              { class: 'issues' },
              issues.map((x) => el('li', {}, el('span', { class: `issue__tag issue__tag--${x.k.toLowerCase()}` }, x.k), el('span', { class: 'issue__text' }, x.t))),
            )
          : el('p', { class: 'flow__body' }, 'Nothing important was wrong or missing.'),
      ),
      costLine(
        a.grade === 'accurate'
          ? 'Shoppers who ask about you get the right picture. Being named in the first place is the harder part.'
          : a.grade === 'partly accurate'
            ? 'Shoppers who ask about you get half the story, and the missing half is often why they would buy.'
            : 'Shoppers who ask about you by name get the wrong picture before they ever reach your store.',
      ),
    );
  };

  const botStatus = (b) => {
    if (b.robots === 'blocked') return { ok: false, label: 'Blocked by robots.txt' };
    if (b.fetch === 'challenge') return { ok: false, label: 'Challenged by bot protection' };
    if (b.fetch === 'blocked') return { ok: false, label: `Turned away${b.status ? ` (${b.status})` : ''}` };
    if (b.fetch === 'error') return { ok: null, label: "Couldn't test" };
    return { ok: true, label: 'Allowed' };
  };
  const renderCrawlers = (r) => {
    const box = $('#sect-crawlers');
    const c = r.sections.crawlers;
    if (isErr(c)) return box.replaceChildren(...sectError('Crawler access', c && c.error));
    const st = c.bots.map((b) => ({ b, s: botStatus(b) }));
    const blocked = st.filter((x) => x.s.ok === false).length;
    const challenged = c.bots.filter((b) => b.fetch === 'challenge').length;
    box.replaceChildren(
      sectHead('Crawler access', blocked ? `${blocked} of ${c.bots.length} AI crawlers can't reach your store.` : `All ${c.bots.length} AI crawlers can reach your store.`, c.score),
      el(
        'div',
        { class: 'sect__body' },
        el(
          'ul',
          { class: 'bots' },
          st.map((x) =>
            el(
              'li',
              { class: `bot ${x.s.ok === true ? 'is-pass' : x.s.ok === false ? 'is-fail' : 'is-na'}` },
              el('span', { class: 'bot__mark', 'aria-hidden': 'true' }, x.s.ok === true ? '✓' : x.s.ok === false ? '✕' : '?'),
              el('span', { class: 'bot__name' }, x.b.name),
              el('span', { class: 'bot__label' }, x.s.label),
            ),
          ),
        ),
        el('p', { class: 'flow__fine' }, challenged ? `Bot protection challenged ${challenged} of ${c.bots.length} crawlers.` : 'Bot protection did not challenge any of them.'),
      ),
      costLine(blocked ? "AI can't recommend products it can't read, so blocked pages drop out of its answers." : 'AI can get in. What it finds there decides whether you get named.'),
    );
  };

  const COLS = { Organization: 'Org', WebSite: 'Site', Product: 'Prod', BreadcrumbList: 'Crumb', ItemList: 'List', FAQPage: 'FAQ', Article: 'Post' };
  const CELL = { present: 'Present', incomplete: 'Incomplete', missing: 'Missing' };
  const renderReadiness = (r) => {
    const box = $('#sect-readiness');
    const d = r.sections.readiness;
    if (isErr(d)) return box.replaceChildren(...sectError('Site readiness', d && d.error));
    const p = d.products || {};
    const big = p.total ? `${p.incomplete} of ${p.total} products are missing details AI uses.` : 'Your schema, page by page.';
    const table = el(
      'table',
      { class: 'grid7' },
      el('caption', { class: 'visually-hidden' }, 'Schema found on each page type'),
      el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, el('span', { class: 'visually-hidden' }, 'Page type')), d.columns.map((c) => el('th', { scope: 'col' }, el('abbr', { title: c }, COLS[c] || c))))),
      el(
        'tbody',
        {},
        d.pages.map((pg) =>
          el(
            'tr',
            {},
            el('th', { scope: 'row' }, pg.type, pg.found ? '' : el('span', { class: 'grid7__nf' }, ' not found')),
            d.columns.map((c) => {
              const v = pg.found ? pg.cells[c] : null;
              return el('td', {}, el('span', { class: `cell cell--${v || 'na'}`, 'aria-hidden': 'true' }), el('span', { class: 'visually-hidden' }, v ? CELL[v] : 'Not checked'));
            }),
          ),
        ),
      ),
    );
    const cmp = r.competitor && r.competitor.theirs ? r.competitor : null;
    const grid = el('div', {});
    const compare = el('div', { class: 'cmp', hidden: true });
    if (cmp) {
      const keys = Object.keys(cmp.labels);
      const yours = cmp.yours ? cmp.yours.fields : null;
      const mark = (on) => el('span', { class: `cmp__mark ${on ? 'is-pass' : 'is-fail'}` }, el('span', { 'aria-hidden': 'true' }, on ? '✓' : '✕'), el('span', { class: 'visually-hidden' }, on ? 'Given' : 'Not given'));
      compare.append(
        el('button', { type: 'button', class: 'flow__link qdetail__back', onclick: () => toggle(false) }, '← Page by page'),
        el(
          'p',
          { class: 'cmp__sum' },
          yours
            ? `Your product page gives AI ${cmp.yours.count} of ${keys.length} product details. ${cmp.name}'s gives ${cmp.theirs.count}.`
            : `${cmp.name}'s product page gives AI ${cmp.theirs.count} of ${keys.length} product details. We couldn't read yours.`,
        ),
        el(
          'table',
          { class: 'cmp__table' },
          el('caption', { class: 'visually-hidden' }, `Product details in schema: you and ${cmp.name}`),
          el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, el('span', { class: 'visually-hidden' }, 'Detail')), el('th', { scope: 'col' }, 'You'), el('th', { scope: 'col' }, cmp.name))),
          el(
            'tbody',
            {},
            keys.map((k) => el('tr', {}, el('th', { scope: 'row' }, cmp.labels[k]), el('td', {}, yours ? mark(yours[k]) : '?'), el('td', {}, mark(cmp.theirs.fields[k])))),
          ),
        ),
        el('p', { class: 'flow__fine' }, `${cmp.name} came up in ${cmp.mentions} of ${(r.sections.visibility && r.sections.visibility.total) || 3} buyer questions. Read from one product page on ${cmp.domain}.`),
      );
    }
    const toggle = (on) => {
      grid.hidden = on;
      compare.hidden = !on;
      const b = on ? $('.qdetail__back', compare) : $('.cmp__open', grid);
      if (b) b.focus();
    };
    box.replaceChildren(
      sectHead('Site readiness', big, d.score),
      el(
        'div',
        { class: 'sect__body' },
        grid,
        compare,
      ),
      costLine("Pages and products AI can't read fully are ones it won't confidently recommend."),
    );
    grid.append(
      ...[
        cmp
          ? el(
              'button',
              { type: 'button', class: 'cmp__open', onclick: () => toggle(true) },
              el('span', {}, cmp.yours ? `You give AI ${cmp.yours.count} product details. ${cmp.name} gives ${cmp.theirs.count}.` : `See what ${cmp.name} gives AI.`),
              el('span', { class: 'q__more', 'aria-hidden': 'true' }, '›'),
            )
          : null,
        table,
        el(
          'p',
          { class: 'legend', 'aria-hidden': 'true' },
          el('span', {}, el('span', { class: 'cell cell--present' }), 'Present'),
          el('span', {}, el('span', { class: 'cell cell--incomplete' }), 'Incomplete'),
          el('span', {}, el('span', { class: 'cell cell--missing' }), 'Missing'),
        ),
        d.duplicates && d.duplicates.length ? el('p', { class: 'flow__fine' }, `Your product page carries ${d.duplicates.length > 1 ? 'several' : 'more than one'} Product schema block, so AI can read conflicting prices or ratings.`) : null,
      ].filter(Boolean),
    );
  };

  const renderReport = () => {
    const r = S.report;
    if (!r) return;
    const score = Math.max(0, Math.min(100, Math.round(r.overall.score)));
    const scoreStep = $('[data-step="3"]', flow);
    scoreStep.dataset.band = band(score);
    $('#score-num').textContent = String(score);
    $('.dial__fill', scoreStep).style.strokeDasharray = `${score} 100`;
    $('#score-eyebrow').textContent = `${r.brand || r.domain} · AI visibility score`;
    $('#score-verdict').textContent = r.overall.verdict;
    const written = Array.isArray(r.overall.top) && r.overall.top.length ? r.overall.top.map((x) => ({ bad: true, text: x.text, cost: x.cost })) : null;
    const f = written || buildFindings(r);
    const fallback = (r.overall.findings || []).map((t) => ({ bad: true, text: t, cost: '' }));
    $('#findings').replaceChildren(
      ...(f.length ? f : fallback).slice(0, 3).map((x) => el('li', { class: x.bad ? 'is-fail' : 'is-pass' }, el('p', { class: 'finding__text' }, x.text), x.cost ? el('p', { class: 'finding__cost' }, x.cost) : null)),
    );
    const guard = (fn) => {
      try {
        fn(r);
      } catch (e) {
        console.error(e);
      }
    };
    guard(renderVisibility);
    guard(renderAccuracy);
    guard(renderCrawlers);
    guard(renderReadiness);
    $('#close-score').textContent = `${score}/100.`;
    $('#close-score').dataset.band = band(score);
    if (S.email && !S.ticket) $('#sent-line').textContent = '';
  };

  // ---------- Step 8: the calendar, inline when it fits, else in a modal ----------
  const inline = $('#calendar-inline');
  const modal = $('#cal-modal');
  const openBtn = $('#open-calendar');
  const bookTitle = $('#book-title');
  const iframe = () => el('iframe', { src: CAL, title: 'Book a 20 minute AI Search Review', loading: 'lazy', width: '100%', height: '100%', style: 'border:0' });
  const layoutClose = () => {
    const step = $('[data-step="8"]', flow);
    const fits = window.innerWidth >= 1024 && step.clientHeight >= 640;
    inline.hidden = !fits;
    openBtn.hidden = fits;
    bookTitle.hidden = !fits;
    if (fits && !inline.firstChild) inline.append(iframe());
  };
  window.addEventListener('resize', () => S.step === 8 && layoutClose());

  // ---------- Buttons ----------
  flow.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action], [data-goto]');
    if (!t) return;
    if (t.dataset.goto) return show(Number(t.dataset.goto));
    const a = t.dataset.action;
    if (a === 'next') show(S.step + 1);
    else if (a === 'back') {
      if (S.step === FIRST_RESULT) {
        resetStep1(false);
        show(1);
      } else show(S.step - 1);
    } else if (a === 'close') show(LAST);
    else if (a === 'restart') {
      resetStep1(true);
      show(1);
    } else if (a === 'open-calendar') {
      const body = $('#calendar-modal');
      if (!body.firstChild) body.append(iframe());
      modal.showModal();
      track('book_call_open');
    } else if (a === 'close-calendar') modal.close();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  // ---------- Reload: reopen the report from the 7 day cache ----------
  const params = new URLSearchParams(location.search);
  const want = Number(params.get('step')) || 1;
  const fromUrl = params.get('store');
  history.replaceState({ aivc: true, step: 1 }, '', location.pathname);
  if (fromUrl && API && storeForm) {
    storeForm.url.value = fromUrl;
    const remembered = store.get(`aivc:email:${domainOf(fromUrl)}`);
    if (remembered && want >= FIRST_RESULT) {
      fetch(`${API}/report?domain=${encodeURIComponent(fromUrl)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!d || !d.report) return;
          S.report = d.report;
          S.domain = d.report.domain;
          S.url = d.report.url;
          S.brand = d.report.brand;
          S.category = d.report.category;
          S.email = remembered;
          S.emailSent = true;
          renderReport();
          $('#sent-line').textContent = `Your full report was sent to ${remembered}.`;
          // Pushed on top of step 1, so the browser back button still steps back inside the flow.
          show(Math.min(LAST, want), { focus: false });
        })
        .catch(() => {});
    }
  }
})();
