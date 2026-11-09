// The /guides section: markdown in src/content/guides, listed in hub order, with each guide's related reports.
import { REPORTS, slugOf, type MarkdownPage } from './reports';

const files = Object.values(import.meta.glob<MarkdownPage>('../content/guides/*.md', { eager: true }));

/** Hub order, with the two reports each guide links to under Related */
const LIST: [string, [string, string]][] = [
  ['why-chatgpt-doesnt-recommend-my-shopify-store', ['sources-chatgpt-cites-2026', 'who-chatgpt-recommends-2026']],
  ['why-chatgpt-recommends-my-competitor', ['who-chatgpt-recommends-2026', 'how-question-wording-changes-ai-recommendations']],
  ['shopify-products-in-chatgpt-shopping', ['shopify-catalog-data-ai-shopping-2026', 'what-ai-gets-wrong-about-products-2026']],
  ['hire-ai-search-specialist-shopify', ['chatgpt-gemini-ai-mode-brand-overlap-2026', 'does-llms-txt-do-anything']],
  ['ai-search-optimization-cost-shopify', ['sources-chatgpt-cites-2026', 'chatgpt-gemini-ai-mode-brand-overlap-2026']],
];

const guideAt = (name: string) => {
  const guide = files.find((p) => slugOf(p) === `guides/${name}`);
  if (!guide) throw new Error(`No guide at /guides/${name}`);
  return guide;
};

export const GUIDES = LIST.map(([name]) => guideAt(name));

/** A guide by its name after /guides/ */
export const guideNamed = guideAt;

/** The other guides plus the guide's two related reports, as links */
export function relatedTo(page: MarkdownPage) {
  const link = (p: MarkdownPage) => ({ href: `/${slugOf(p)}`, label: p.frontmatter.h1 });
  const [, reports] = LIST.find(([name]) => guideAt(name) === page)!;
  return {
    guides: GUIDES.filter((g) => g !== page).map(link),
    reports: reports.map((name) => {
      const report = REPORTS.find((r) => slugOf(r) === `reports/${name}`);
      if (!report) throw new Error(`Related report /reports/${name} does not exist`);
      return link(report);
    }),
  };
}
