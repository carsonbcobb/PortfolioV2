import { defineConfig } from 'astro/config';

// Wraps every markdown table in a scroll box, so wide tables scroll on their own on phones
// instead of widening the page.
function rehypeTableScroll() {
  const wrap = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      wrap(child);
      if (child.type !== 'element' || child.tagName !== 'table') return child;
      return {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: 'Table' },
        children: [child],
      };
    });
  };
  return wrap;
}

// Links to other sites in markdown open in the same tab with rel="noopener", and are followed (no nofollow).
function rehypeExternalLinks() {
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = String(node.properties?.href ?? '');
      if (/^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?carsoncobb\.com(\/|$)/.test(href)) {
        node.properties.rel = ['noopener'];
      }
    }
    (node.children ?? []).forEach(walk);
  };
  return walk;
}

// Guides end with a line linking the AI Visibility Check. That link becomes the standard accent
// button on its own line, after the closing paragraph. (Reports get the ReportCta card instead.)
const CHECK_HREF = '/ai-visibility-check';
function rehypeReportCta() {
  const text = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(text).join(''));
  return (tree, file) => {
    if (!/[\\/]content[\\/](guides|pages)[\\/]/.test(file.path ?? '')) return;
    const blocks = tree.children.filter((n) => n.type === 'element');
    const last = blocks[blocks.length - 1];
    if (!last || last.tagName !== 'p') return;
    const i = last.children.findIndex((c) => c.type === 'element' && c.tagName === 'a' && c.properties?.href === CHECK_HREF);
    if (i < 0) return;
    const link = last.children[i];
    const label = text(link).trim();
    const next = last.children[i + 1];
    const button = {
      type: 'element',
      tagName: 'p',
      properties: { className: ['report-cta'] },
      children: [
        {
          type: 'element',
          tagName: 'a',
          properties: { href: CHECK_HREF, className: ['btn', 'btn--accent'], dataTrack: 'visibility_check' },
          children: [{ type: 'text', value: label }],
        },
      ],
    };
    // Guides keep their closing paragraph word for word, with the button after it.
    if (/[\\/]content[\\/]guides[\\/]/.test(file.path ?? '')) {
      tree.children.splice(tree.children.indexOf(last) + 1, 0, { type: 'text', value: '\n' }, button);
      return;
    }
    if (i === last.children.length - 1 || (next?.type === 'text' && /^\s*[.!]?\s*$/.test(next.value) && i + 2 === last.children.length)) {
      // The link was the whole closing sentence: drop it, the button says it.
      last.children.splice(i, 2);
      const prev = last.children[i - 1];
      if (prev?.type === 'text') prev.value = prev.value.trimEnd();
    } else {
      last.children.splice(i, 1, { type: 'text', value: label });
    }
    if (!text(last).trim()) tree.children.splice(tree.children.indexOf(last), 1, button);
    else tree.children.splice(tree.children.indexOf(last) + 1, 0, { type: 'text', value: '\n' }, button);
  };
}

// Reports: marks where the ReportCta card goes, for [...slug].astro to fill in.
// - short_version: after the "The short version" section, else after the first table, else before the second h2.
// - end: before the method section ("How this was done", "How this was compiled", ...), else at the end.
// The plain closing sentences that linked /ai-search or /ai-visibility-check are dropped, because the card
// replaces them, with a question that only leads into one. Any other sentence in the same paragraph
// ("No store is named in this report.") stays.
const SERVICE_LINK = /^\/(ai-search|ai-visibility-check|close-the-gap|full-store-audit)(?:[?#]|$)/;
const CTA_ANCHOR = /^(Close the Gap|Full Store Audit|AI Visibility Check|Run the AI Visibility Check)$/;
const METHOD_HEADING = /^(How this was (done|compiled)|About these numbers|Method)$/;
const isReportFile = (path = '') =>
  (/[\\/]content[\\/]reports[\\/]/.test(path) && !/[\\/]index\.md$/.test(path)) ||
  /[\\/]state-of-shopify-subscriptions-2026\.md$/.test(path);
function rehypeReportCtaSlots() {
  const text = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(text).join(''));
  const isEl = (n, tag) => n?.type === 'element' && (!tag || n.tagName === tag);
  // Only the old plain CTA links count: a service link with its button label as the anchor. A contextual link
  // with descriptive anchor text ("AI search optimization for Shopify brands") stays in the copy.
  const linksService = (n) =>
    isEl(n) &&
    ((n.tagName === 'a' && SERVICE_LINK.test(String(n.properties?.href ?? '')) && CTA_ANCHOR.test(text(n).trim())) ||
      (n.children ?? []).some(linksService));
  const slot = (name) => ({ type: 'element', tagName: 'div', properties: { dataCtaSlot: name }, children: [] });

  // Split a paragraph into sentences: a sentence ends where a text node has ".", "!" or "?" then space or its end.
  const sentences = (children) => {
    const out = [[]];
    for (const child of children) {
      if (child.type !== 'text') {
        out.at(-1).push(child);
        continue;
      }
      const parts = child.value.split(/(?<=[.!?])(\s+)/);
      parts.forEach((part, i) => {
        if (i % 2 === 1) {
          out.push([]);
          return;
        }
        if (part) out.at(-1).push({ type: 'text', value: part });
      });
      if (/[.!?]$/.test(child.value)) out.push([]);
    }
    return out.filter((s) => s.length && s.some((n) => n.type !== 'text' || n.value.trim()));
  };

  return (tree, file) => {
    if (!isReportFile(file.path)) return;
    const top = () => tree.children.filter((n) => isEl(n));

    // Drop the plain CTA sentences.
    for (const p of top().filter((n) => isEl(n, 'p') && linksService(n))) {
      // A question that only leads into the link ("Want your store's score?") goes with it.
      const all = sentences(p.children);
      const drop = all.map((s) => s.some(linksService));
      all.forEach((s, i) => {
        if (drop[i + 1] && /\?\s*$/.test(text({ children: s }))) drop[i] = true;
      });
      const kept = all.filter((_, i) => !drop[i]);
      if (!kept.length) {
        tree.children.splice(tree.children.indexOf(p), 1);
        continue;
      }
      p.children = kept.flatMap((s, i) => (i ? [{ type: 'text', value: ' ' }, ...s] : s));
    }

    const blocks = top();
    const h2s = blocks.filter((n) => isEl(n, 'h2'));
    const isTable = (n) => isEl(n, 'table') || (isEl(n, 'div') && [].concat(n.properties?.className ?? []).includes('table-scroll'));
    const insertBefore = (node, name) => tree.children.splice(tree.children.indexOf(node), 0, slot(name));
    const insertAfter = (node, name) => tree.children.splice(tree.children.indexOf(node) + 1, 0, slot(name));

    const method = h2s.find((h) => METHOD_HEADING.test(text(h).trim()));
    if (method) insertBefore(method, 'end');
    else tree.children.push(slot('end'));

    const short = h2s.find((h) => text(h).trim() === 'The short version');
    const afterShort = short && h2s[h2s.indexOf(short) + 1];
    const firstTable = blocks.find(isTable);
    if (afterShort) insertBefore(afterShort, 'short_version');
    else if (firstTable) insertAfter(firstTable, 'short_version');
    else if (h2s[1]) insertBefore(h2s[1], 'short_version');
    else throw new Error(`${file.path}: no place for the short version CTA`);
  };
}

export default defineConfig({
  site: 'https://www.carsoncobb.com',
  output: 'static',
  trailingSlash: 'ignore',
  // /gap-report is the short name for the gap report, which lives at /ai-visibility-check.
  redirects: { '/gap-report': '/ai-visibility-check' },
  build: {
    // agencies.html instead of agencies/index.html. Amplify serves /agencies straight from
    // agencies.html; a folder made it 301 to /agencies/, away from the canonical URL.
    format: 'file',
    inlineStylesheets: 'always',
  },
  markdown: {
    rehypePlugins: [rehypeTableScroll, rehypeReportCta, rehypeReportCtaSlots, rehypeExternalLinks],
  },
});
