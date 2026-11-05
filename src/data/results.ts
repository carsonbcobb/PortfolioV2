// The /results page, read from src/content/results.md. The markdown is the copy; this splits it into
// the stat strip, one block per discipline, the industries table and the closing line.
import * as results from '../content/results.md';
import type { PageFrontmatter } from './reports';

export const RESULTS_META = results.frontmatter as PageFrontmatter;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Inline markdown (bold and links) to HTML */
export const inline = (s: string) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const paragraphs = (block: string) =>
  block
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('- ') && !p.startsWith('|'));

const bullets = (block: string) =>
  block
    .split('\n')
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim());

/**
 * A result bullet as a big number and the text beside it. A bullet that opens with the number drops it
 * from the text; otherwise the full sentence stays as written and the first number (or "from A to B")
 * is shown large next to it.
 */
const result = (b: string) => {
  const lead = b.match(/^\*\*(.+?)\*\*\s+(.*)$/);
  if (lead) return { big: lead[1], text: inline(lead[2]) };
  const first = b.match(/\*\*(.+?)\*\*/);
  const fromTo = b.match(/from \*\*(.+?)\*\* to \*\*(.+?)\*\*/);
  const big = fromTo && b.indexOf('**') === fromTo.index! + 5 ? `${fromTo[1]} → ${fromTo[2]}` : first?.[1];
  return { big, text: inline(b) };
};

// "## " sections in order, keyed by heading.
const body = results.rawContent();
const [introBlock, ...sectionBlocks] = body.split(/^## /m);
const sections = sectionBlocks.map((s) => {
  const nl = s.indexOf('\n');
  return { title: s.slice(0, nl).trim(), body: s.slice(nl + 1) };
});
const section = (prefix: string) => {
  const s = sections.find((x) => x.title.startsWith(prefix));
  if (!s) throw new Error(`results.md needs a "## ${prefix}" section`);
  return s;
};

export const INTRO = paragraphs(introBlock).map(inline);

const statsOf = (body: string) =>
  bullets(body).map((b) => {
    const m = b.match(/^\*\*(.+?)\*\*\s+(.*)$/);
    if (!m) throw new Error(`Stat needs a bold number first: ${b}`);
    return { value: m[1], label: m[2] };
  });

const ai = section('AI search');
export const AI_SEARCH = { title: ai.title, stats: statsOf(ai.body) };

const glance = section('At a glance');
export const GLANCE = { title: glance.title, stats: statsOf(glance.body) };

const work = section('What it takes');
export const WORK = {
  title: work.title,
  disciplines: work.body
    .split(/^### /m)
    .slice(1)
    .map((d) => {
      const nl = d.indexOf('\n');
      const name = d.slice(0, nl).trim();
      const rest = d.slice(nl + 1);
      return {
        id: slugify(name),
        name,
        text: paragraphs(rest).map(inline),
        results: bullets(rest).map(result),
      };
    }),
};

const brands = section('Brands');
const rows = brands.body
  .split('\n')
  .filter((l) => l.startsWith('|') && !/^\|\s*-/.test(l))
  .map((l) =>
    l
      .split('|')
      .slice(1, -1)
      .map((c) => inline(c.trim())),
  );
export const BRANDS = {
  title: brands.title,
  head: rows[0],
  rows: rows.slice(1),
  note: paragraphs(brands.body).map(inline),
};

// The last paragraph with the intro call link becomes the closing call to action.
const measured = section('How these numbers');
const measuredParas = paragraphs(measured.body);
const closing = measuredParas.find((p) => /\]\(\/ai-visibility-check#book\)/.test(p));
export const MEASURED = {
  title: measured.title,
  text: measuredParas.filter((p) => p !== closing).map(inline),
};
export const CLOSING = closing ? closing.replace(/\s*\[[^\]]+\]\(\/ai-visibility-check#book\)\.?$/, '').trim() : undefined;
