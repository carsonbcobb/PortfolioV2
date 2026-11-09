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

// Reports end with a line linking the AI Visibility Check. That link becomes the standard accent
// button on its own line, and the sentence above keeps its words as plain text.
const CHECK_HREF = '/ai-visibility-check';
function rehypeReportCta() {
  const text = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(text).join(''));
  return (tree, file) => {
    if (!/[\\/]content[\\/](reports|guides)[\\/]/.test(file.path ?? '')) return;
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

export default defineConfig({
  site: 'https://www.carsoncobb.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // agencies.html instead of agencies/index.html. Amplify serves /agencies straight from
    // agencies.html; a folder made it 301 to /agencies/, away from the canonical URL.
    format: 'file',
    inlineStylesheets: 'always',
  },
  markdown: {
    rehypePlugins: [rehypeTableScroll, rehypeReportCta, rehypeExternalLinks],
  },
});
