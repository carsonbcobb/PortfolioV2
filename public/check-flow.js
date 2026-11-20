/* Gap report: the step flow on /ai-visibility-check.
 * Step 1 the form (store, competitor, revenue, name, email), 2 running, 3 head to head and score,
 * 4 to 7 one section each, 8 the next step for the visitor's revenue range.
 * Talks to the Worker in worker/: POST /check (NDJSON stream) and GET /result.
 * All text from the Worker or the store is set as text, never as HTML. */
(() => {
  const me = document.currentScript;
  const API = (me && me.dataset.api) || '';
  const SITEKEY = (me && me.dataset.sitekey) || '';
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
  const TITLES = { 1: 'Your store', 2: 'Running your gap report', 3: 'Your gap', 4: 'AI visibility', 5: 'Brand accuracy', 6: 'Crawler access', 7: 'Site readiness', 8: 'Your next step' };
  const REVENUES = ['under_50k', '50k_150k', '150k_plus'];

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
  // Saved on the first visit by SiteHead: referrer, landing page and UTMs.
  const firstSource = () => {
    try {
      const v = JSON.parse(localStorage.getItem('cc_src') || 'null');
      return v && typeof v === 'object' ? v : undefined;
    } catch {
      return undefined;
    }
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
    /** The visitor's top competitor, required: a website or a brand name. */
    rival: '',
    /** under_50k, 50k_150k or 150k_plus. Empty when a saved report is opened without it. */
    revenue: '',
    name: '',
    email: '',
    report: null,
    /** The id of the saved result, for reloads and the link in the email. */
    result: null,
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
      if (S.result && n >= FIRST_RESULT) qs.set('result', S.result);
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
    if (n === 2 && S.report) return show(FIRST_RESULT, { history: false });
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

  // ---------- Step 1: the form ----------
  const storeForm = $('#store-form');
  const storeError = $('#store-error');
  const ERRORS = {
    bad_request: 'Please check your details and try again.',
    invalid_url: "That doesn't look like a public store URL. Try something like yourstore.com.",
    turnstile: 'The spam check failed. Please refresh the page and try again.',
    rate_limited: "You've run 3 gap reports today. Come back tomorrow, or email carson@carsoncobb.com with your store and your top competitor.",
    paused: "Gap reports are paused for today. Email carson@carsoncobb.com with your store and your top competitor, and I'll send yours.",
    not_found: 'This report has expired. Please run a new gap report.',
  };
  const fail1 = (msg, field) => {
    storeError.textContent = msg;
    storeError.hidden = false;
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.focus();
    }
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

  if (storeForm) {
    storeForm.addEventListener('input', (e) => e.target.removeAttribute && e.target.removeAttribute('aria-invalid'));
    storeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      storeError.hidden = true;
      const f = storeForm.elements;
      const url = String(f.url.value || '').trim();
      const rival = String(f.competitor.value || '').trim().slice(0, 100);
      const revenue = String(f.revenue.value || '');
      const name = String(f.name.value || '').trim().slice(0, 80);
      const email = String(f.email.value || '').trim();
      if (!url || !domainOf(url) || !domainOf(url).includes('.')) return fail1('Please enter your store URL, like yourstore.com.', f.url);
      if (!rival) return fail1("Please enter your top competitor's website or brand name.", f.competitor);
      if (domainOf(rival) && domainOf(rival) === domainOf(url)) return fail1('Please enter a competitor, not your own store.', f.competitor);
      if (!REVENUES.includes(revenue)) return fail1('Please choose your monthly revenue.', f.revenue);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail1('Please enter a valid work email.', f.email);
      Object.assign(S, { url: normUrl(url), domain: domainOf(url), rival, revenue, name, email });
      startCheck();
    });
  }

  // ---------- Step 2: running ----------
  const runList = $('#run-list');
  const runError = $('#run-error');
  const runRetry = $('#run-retry');
  const runCard = $('#run-card');
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

  const remember = () => {
    if (S.result) store.set(`gap:lead:${S.result}`, JSON.stringify({ revenue: S.revenue, email: S.email, rival: S.rival }));
  };

  const startCheck = async () => {
    if (S.running) return;
    S.running = true;
    S.report = null;
    S.result = null;
    lines.length = 0;
    runList.replaceChildren();
    runError.hidden = true;
    runRetry.hidden = true;
    runRetry.textContent = 'Try again';
    runCard.hidden = false;
    $('#run-title').textContent = `Checking ${S.domain}`;
    $('#run-vs').textContent = `${S.domain} against ${S.rival}`;
    $('#run-note').textContent = `Your results open here as soon as the check finishes, and a copy goes to ${S.email}.`;
    const btn = $('button[type="submit"]', storeForm);
    busy(btn, true, 'Starting your gap report...');

    let token;
    try {
      token = await getToken();
    } catch (err) {
      S.running = false;
      busy(btn, false);
      return fail1(err.message);
    }
    show(2);
    track('visibility_check_start', { revenue: S.revenue });

    try {
      const res = await fetch(`${API}/check`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: S.url, competitor: S.rival, revenue: S.revenue, name: S.name || undefined, email: S.email, token, source: firstSource() }),
      });
      spendToken();
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body.error === 'bad_request' && body.message) || ERRORS[body.error] || body.message || 'Something went wrong. Please try again.');
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
          else if (msg.type === 'section' && msg.pending) addLine({ step: 'accuracy-wait', message: msg.message });
          else if (msg.type === 'section') lines.filter((l) => l.step === msg.key).forEach(finishLine);
          else if (msg.type === 'update') {
            // Brand accuracy finished after the report was shown: swap in the final report.
            S.report = msg.report;
            lines.forEach(finishLine);
            if (S.step >= FIRST_RESULT) renderReport();
          } else if (msg.type === 'error') throw new Error(msg.message || 'Something went wrong. Please try again.');
          else if (msg.type === 'stopped') {
            // Not a store, or no products we could read: no score.
            finished = true;
            lines.forEach(finishLine);
            $('#run-title').textContent = "We can't check this site";
            runCard.hidden = true;
            runError.textContent = msg.message;
            runError.hidden = false;
            runRetry.textContent = 'Check another store';
            runRetry.hidden = false;
            track('visibility_check_stopped', { reason: msg.reason });
          } else if (msg.type === 'done') {
            finished = true;
            if (msg.cached && !lines.length) addLine({ step: 'setup', message: 'Found your saved answers from the last 7 days' });
            lines.filter((l) => !(msg.pending && (l.step === 'accuracy' || l.step === 'accuracy-wait'))).forEach(finishLine);
            S.report = msg.report;
            S.result = msg.result || null;
            S.domain = msg.report.domain || S.domain;
            remember();
            track('visibility_check_complete', { score: msg.report.overall.score, cached: !!msg.cached, revenue: S.revenue });
            renderReport();
            $('#sent-line').textContent = `Your gap report is on its way to ${S.email}.`;
            show(FIRST_RESULT, { replace: true });
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
      busy(btn, false);
    }
  };

  // ---------- The report ----------
  const SEARCH_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'];
  const band = (s) => (s >= 80 ? 'good' : s >= 50 ? 'fair' : 'poor');

  const competitors = (v, brand) => {
    const counts = new Map();
    for (const q of v.questions) {
      if (q.mentioned || q.excluded) continue;
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
    if (!isErr(v) && v.total > 0) {
      const rivals = competitors(v, brand).slice(0, 2);
      if (v.mentioned === 0)
        out.push({
          w: 100,
          bad: true,
          text: rivals.length
            ? `When shoppers ask ChatGPT about products like yours, it recommends ${listNames(rivals)}, not you.`
            : `When shoppers ask ChatGPT about products like yours, it doesn't recommend you.`,
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
    if (!isErr(rd) && Array.isArray(rd.rows)) {
      const full = rd.rows.filter((x) => x.status === 'good').length;
      const missing = rd.rows.filter((x) => x.status === 'missing').length;
      if (full < rd.rows.length)
        out.push({
          w: missing >= 3 ? 80 : 60,
          bad: true,
          text: `${full} of ${rd.rows.length} product details are on every product page we checked.`,
          cost: "Products AI can't describe with confidence are products it won't recommend.",
        });
      const single = rd.rows.find((x) => x.key === 'single');
      if (single && single.on < single.of)
        out.push({ w: 65, bad: true, text: 'Some of your product pages send AI conflicting product data.', cost: 'Conflicting data makes AI less sure what you sell and what it costs.' });
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
  const sectError = (eyebrow, msg) => [
    sectHead(eyebrow, "Couldn't check."),
    el('p', { class: 'flow__body' }, msg || 'Run the check again later to see it.'),
    el('p', { class: 'flow__fine' }, 'This part is left out of your overall score.'),
  ];

  const renderVisibility = (r) => {
    const box = $('#sect-visibility');
    const v = r.sections.visibility;
    if (isErr(v)) return box.replaceChildren(...sectError('AI visibility', v && v.error));
    if (!v.total)
      return box.replaceChildren(
        ...sectError('AI visibility', `ChatGPT asked for more details or named no brands for all ${v.asked || v.questions.length} buyer questions, even after we asked again with more product detail.`),
      );
    const brand = r.brand || r.domain;
    const asked = v.asked || v.questions.length;
    const list = el('ol', { class: 'qs' });
    const detail = el('div', { class: 'qdetail', hidden: true });
    v.questions.forEach((q, i) => {
      const others = (q.brands || []).filter((b) => b.toLowerCase() !== brand.toLowerCase());
      const sub = q.excluded
        ? 'Not scored: no brands named'
        : q.mentioned
          ? `Recommended${q.position ? `, position ${q.position}` : ''}`
          : others.length
            ? `Instead: ${others.slice(0, 3).join(', ')}`
            : 'Not recommended';
      const state = q.excluded ? 'is-skip' : q.mentioned ? 'is-pass' : 'is-fail';
      list.append(
        el(
          'li',
          {},
          el(
            'button',
            { type: 'button', class: `q ${state}`, onclick: () => openQ(i) },
            el('span', { class: 'q__mark', 'aria-hidden': 'true' }, q.excluded ? '•' : q.mentioned ? '✓' : '✕'),
            el(
              'span',
              { class: 'q__body' },
              q.product ? el('span', { class: 'q__product' }, q.product) : null,
              el('span', { class: 'q__text' }, q.question),
              el('span', { class: 'q__sub' }, el('span', { class: 'visually-hidden' }, q.excluded ? 'Not scored. ' : q.mentioned ? 'Pass. ' : 'Fail. '), sub),
            ),
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
        q.product ? el('p', { class: 'eyebrow eyebrow--dim' }, `Built from: ${q.product}`) : null,
        el('p', { class: 'qdetail__q' }, `“${q.question}”`),
        q.excluded
          ? el('p', { class: 'qdetail__verdict' }, "ChatGPT asked for more details or named no brands, even when we asked again, so this question isn't scored.")
          : el('p', { class: `qdetail__verdict ${q.mentioned ? 'is-pass' : 'is-fail'}` }, q.mentioned ? `You're recommended${q.position ? `, position ${q.position}` : ''}.` : 'You are not recommended.', q.cited ? ' Your site was cited as a source.' : ''),
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
            `AI ${v.mentioned < v.total && competitors(v, brand).length ? 'recommended your competitors' : 'built these answers'} based on ${plural(src.total, 'this source', `these ${src.total} sources`)}, and you're on ${src.on} of them.`,
          )
        : null;
    const scoredLine =
      v.total < asked
        ? el('p', { class: 'flow__fine' }, `${v.total} of ${asked} questions were scored. ChatGPT named no brands for the other ${plural(asked - v.total, 'one', asked - v.total)}, even after we asked again with more product detail.`)
        : null;
    box.replaceChildren(
      sectHead('AI visibility', `Recommended in ${v.mentioned} of ${v.total} questions.`, v.score),
      el('div', { class: 'sect__body' }, list, scoredLine, srcLine, detail),
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
    if (a && a.pending)
      return box.replaceChildren(
        sectHead('Brand accuracy', 'Still checking.'),
        el('p', { class: 'flow__body sect__wait', role: 'status' }, el('span', { class: 'run__mark', 'aria-hidden': 'true' }), a.error),
      );
    if (isErr(a)) return box.replaceChildren(sectHead('Brand accuracy', 'No clear answer this run.'), el('p', { class: 'flow__body' }, a.error));
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

  const STATUS = { good: 'Good', partial: 'Partial', missing: 'Missing' };
  const renderReadiness = (r) => {
    const box = $('#sect-readiness');
    const d = r.sections.readiness;
    if (isErr(d)) return box.replaceChildren(...sectError('Site readiness', d && d.error));
    if (!Array.isArray(d.rows)) return box.replaceChildren(...sectError('Site readiness', 'Run the check again to see this part.'));
    const full = d.rows.filter((x) => x.status === 'good').length;
    const big = `${full} of ${d.rows.length} details are on every product page we checked.`;
    const table = el(
      'table',
      { class: 'ready' },
      el('caption', { class: 'visually-hidden' }, `Product details AI can read, across ${d.checked} product pages`),
      el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, 'Detail'), el('th', { scope: 'col' }, 'Product pages'), el('th', { scope: 'col' }, 'Status'))),
      el(
        'tbody',
        {},
        d.rows.map((x) =>
          el(
            'tr',
            {},
            el('th', { scope: 'row' }, x.label),
            el('td', { class: 'ready__count' }, `on ${x.on} of ${x.of}`),
            el('td', {}, el('span', { class: `ready__status ready__status--${x.status}` }, STATUS[x.status] || x.status)),
          ),
        ),
      ),
    );
    const byProduct =
      d.products && d.products.length
        ? el(
            'details',
            { class: 'ready__more' },
            el('summary', {}, 'See by product'),
            el(
              'ul',
              { class: 'ready__products' },
              d.products.map((p) => {
                const gaps = d.rows.filter((x) => !p.has[x.key]).map((x) => x.label.toLowerCase());
                return el(
                  'li',
                  {},
                  el('strong', {}, p.title),
                  el('span', {}, gaps.length ? `Missing: ${gaps.join(', ')}.` : 'Gives AI every detail.'),
                );
              }),
            ),
          )
        : null;
    const cmp = r.competitor && r.competitor.theirs ? r.competitor : null;
    const compare = cmp
      ? el(
          'details',
          { class: 'ready__more' },
          el('summary', {}, cmp.yours ? `You give AI ${cmp.yours.count} product details. ${cmp.name} gives ${cmp.theirs.count}.` : `See what ${cmp.name} gives AI.`),
          el(
            'table',
            { class: 'cmp__table' },
            el('caption', { class: 'visually-hidden' }, `Product details AI can read: you and ${cmp.name}`),
            el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, el('span', { class: 'visually-hidden' }, 'Detail')), el('th', { scope: 'col' }, 'You'), el('th', { scope: 'col' }, cmp.name))),
            el(
              'tbody',
              {},
              Object.keys(cmp.labels).map((k) => {
                const mark = (on) => el('span', { class: `cmp__mark ${on ? 'is-pass' : 'is-fail'}` }, el('span', { 'aria-hidden': 'true' }, on ? '✓' : '✕'), el('span', { class: 'visually-hidden' }, on ? 'Given' : 'Not given'));
                return el('tr', {}, el('th', { scope: 'row' }, cmp.labels[k]), el('td', {}, cmp.yours ? mark(cmp.yours.fields[k]) : '?'), el('td', {}, mark(cmp.theirs.fields[k])));
              }),
            ),
          ),
          el('p', { class: 'flow__fine' }, `${cmp.name} came up in ${cmp.mentions} of ${(r.sections.visibility && r.sections.visibility.total) || 3} buyer questions. Read from one product page on ${cmp.domain}, and your top product page.`),
        )
      : null;
    box.replaceChildren(
      sectHead('Site readiness', big, d.score),
      el(
        'div',
        { class: 'sect__body' },
        el('p', { class: 'flow__body ready__lead' }, `We checked ${d.checked} of your top product ${d.checked === 1 ? 'page' : 'pages'}. Each product page should include all of these.`),
        table,
        byProduct,
        compare,
      ),
      costLine("Products AI can't describe with confidence are products it won't recommend."),
    );
  };

  // The head to head, first in the report: the competitor the visitor typed.
  const renderH2H = (r) => {
    const box = $('#h2h');
    if (!box) return;
    const h = r.headToHead;
    const brand = r.brand || r.domain;
    if (!h || !h.total || !h.name) {
      const who = (h && h.name) || S.rival;
      if (!who) {
        box.hidden = true;
        return box.replaceChildren();
      }
      box.replaceChildren(
        el('p', { class: 'eyebrow' }, 'Head to head'),
        el('p', { class: 'h2h__line' }, `We couldn't compare you with ${who} this run, because ChatGPT didn't answer the buyer questions. Run it again later.`),
      );
      box.hidden = false;
      return;
    }
    const lead = h.theirs > h.yours ? 'is-behind' : h.theirs < h.yours ? 'is-ahead' : 'is-even';
    const bar = (label, n, you) =>
      el(
        'div',
        { class: `h2h__row${you ? ' h2h__row--you' : ''}` },
        el('span', { class: 'h2h__name' }, label),
        el('span', { class: 'h2h__track', 'aria-hidden': 'true' }, el('span', { class: 'h2h__fill', style: `width:${Math.round((n / h.total) * 100)}%` })),
        el('span', { class: 'h2h__count' }, `${n} of ${h.total}`),
      );
    const counts = [
      `${h.name} was recommended in `,
      el('strong', {}, `${h.theirs} of ${h.total}`),
      ' answers. You were recommended in ',
      el('strong', {}, String(h.yours)),
      '.',
    ];
    box.className = `h2h ${lead}`;
    box.replaceChildren(
      el('p', { class: 'eyebrow' }, `Head to head · ${h.total} ChatGPT ${plural(h.total, 'answer', 'answers')}`),
      el('p', { class: 'h2h__line' }, ...(h.source === 'visitor' ? counts : [`The brand AI recommended most instead of you: ${h.name}. `, ...counts])),
      el('div', { class: 'h2h__bars' }, bar(h.name, h.theirs, false), bar(brand, h.yours, true)),
    );
    box.hidden = false;
  };

  // Step 8: the next step for the visitor's revenue range.
  const renderNext = () => {
    const which = S.revenue === 'under_50k' ? 'under' : S.revenue ? 'fit' : 'none';
    $$('.next', flow).forEach((b) => (b.hidden = b.dataset.next !== which));
    const e = $('#next-email');
    if (e) e.textContent = S.email || 'you';
  };

  const renderReport = () => {
    const r = S.report;
    if (!r) return;
    renderH2H(r);
    renderNext();
    const score = Math.max(0, Math.min(100, Math.round(r.overall.score)));
    const scoreStep = $('[data-step="3"]', flow);
    scoreStep.dataset.band = band(score);
    $('#score-num').textContent = String(score);
    $('.dial__fill', scoreStep).style.strokeDasharray = `${score} 100`;
    $('#score-eyebrow').textContent = `${r.brand || r.domain} · AI visibility score`;
    $('#score-verdict').textContent = r.overall.verdict;
    let note = $('#score-note');
    if (!note) {
      note = el('p', { class: 'flow__fine', id: 'score-note' });
      $('#score-verdict').after(note);
    }
    note.textContent = r.overall.note || '';
    note.hidden = !r.overall.note;
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
    $('#close-score').textContent = `${score}/100`;
    $('#close-score').dataset.band = band(score);
  };

  const resetStep1 = (focusInput) => {
    if (!storeForm) return;
    storeError.hidden = true;
    if (focusInput) storeForm.elements.url.focus();
  };

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
    } else if (a === 'close') {
      show(LAST);
      track('gap_report_next_step', { revenue: S.revenue || 'unknown' });
    } else if (a === 'restart') {
      resetStep1(true);
      show(1);
    }
  });

  // ---------- Reload or a link from the email: reopen a saved result ----------
  const params = new URLSearchParams(location.search);
  const want = Number(params.get('step')) || FIRST_RESULT;
  const resultId = params.get('result');
  history.replaceState({ aivc: true, step: 1 }, '', location.pathname);
  if (resultId && /^[0-9a-f-]{36}$/.test(resultId) && API) {
    fetch(`${API}/result?id=${encodeURIComponent(resultId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || !d.report) return;
        S.report = d.report;
        S.result = resultId;
        S.domain = d.report.domain;
        S.url = d.report.url;
        // The revenue range and email are never in the saved report; this browser may remember them.
        try {
          const mine = JSON.parse(store.get(`gap:lead:${resultId}`) || 'null');
          if (mine) Object.assign(S, { revenue: REVENUES.includes(mine.revenue) ? mine.revenue : '', email: mine.email || '', rival: mine.rival || '' });
        } catch {}
        if (!S.rival && d.report.headToHead) S.rival = d.report.headToHead.name;
        renderReport();
        $('#sent-line').textContent = S.email ? `Your gap report was sent to ${S.email}.` : '';
        // Pushed on top of step 1, so the browser back button still steps back inside the flow.
        show(Math.max(FIRST_RESULT, Math.min(LAST, want)), { focus: false });
      })
      .catch(() => {});
  }
})();
