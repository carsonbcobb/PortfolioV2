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
    rehypePlugins: [rehypeTableScroll],
  },
});
