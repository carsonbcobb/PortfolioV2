import type { APIRoute } from 'astro';
import {
  SITE_URL,
  EMAIL,
  CAL_LINK,
  AUDIT,
  BUILD,
  RETAINERS,
  RETAINER_ROWS,
  RETAINER_NOTE,
  CALL_NAME,
  CALL_TEXT,
  CHECK_PATH,
  ENGINES,
  AGENCY_PARTNER_PLANS,
  AGENCY_PARTNER_INTRO,
} from '../data/site';
import { CONTENT_PAGES, TOOLS } from '../data/pages';
import { REPORT_HUB, REPORTS, slugOf } from '../data/reports';

// Plain markdown summary of the site at /llms.txt. Built from the same data as the pages,
// so plans and prices here always match the pricing cards.

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
const url = (path: string) => `${SITE_URL}${path}`;
const pages = (kind: string) =>
  CONTENT_PAGES.filter((p) => p.kind === kind).map((p) => `- [${p.label}](${url(`/${p.slug}`)}): ${p.summary}`);

export const GET: APIRoute = () => {
  const text = [
    '# Carson Cobb',
    '',
    "> AI search and CRO specialist for Shopify brands. I get products recommended in ChatGPT, Perplexity and Google's AI answers, then make sure the store turns that traffic into sales.",
    '',
    "I'm Carson Cobb. I've led AI search work for national brands in vitamins, skincare, cosmetics, food, pet and wellness: 50+ AEO audits and roadmaps, 30+ sites optimized for AI search, and 4,000+ products restructured with machine readable attributes. Before that I spent years running conversion and testing programs, affiliate programs and full rebuilds for 50+ Shopify stores, from seed stage startups to billion dollar brands. Rebuilt pages average a 2.1x conversion lift. Founders stay in control: I propose, you decide, and nothing goes live without your sign off. I never promise rankings; I measure. Based in California, working with brands across the US.",
    '',
    '## Two engines',
    '',
    ...ENGINES.map((e) => `- **${e.tag}: ${e.title.replace(/\.$/, '')}.** ${e.text} More: ${url(e.link.href)}`),
    '',
    '## AI Visibility Check',
    '',
    `Free tool at ${url(CHECK_PATH)}: enter a Shopify store URL, category and email to see whether ChatGPT recommends the brand for 3 buyer questions, how accurately it describes the brand, whether AI crawlers can reach the store, and how complete its structured data and product data are. Scored 0 to 100.`,
    '',
    `Contact: ${EMAIL}. Book a 20 minute ${CALL_NAME}: ${CAL_LINK}. ${CALL_TEXT}`,
    '',
    `## Offers for brands (full pricing: ${url('/pricing')})`,
    '',
    `- **${AUDIT.name}**: ${usd(AUDIT.price)} one time. ${AUDIT.summary} ${AUDIT.note}`,
    `- **${BUILD.name}**: fixed price, 3 to 4 weeks. ${BUILD.tiers.map((t) => `${t.label}: ${t.from ? 'from ' : ''}${usd(t.price)}`).join('; ')}. Includes ${BUILD.includes.map((i) => i.charAt(0).toLowerCase() + i.slice(1)).join(', ')}. ${BUILD.note}`,
    ...RETAINERS.map((r, i) => {
      const terms = RETAINER_ROWS.map((row) => `${row.label.toLowerCase()} ${row.values[i]}`).join(', ');
      const scope = r.includes.length ? ` ${r.includes.join('; ')}.` : '';
      return `- **${r.name} retainer**: ${r.summary}${scope} Terms: ${terms}.`;
    }),
    '',
    RETAINER_NOTE,
    '',
    '## Partner pricing for agencies',
    '',
    AGENCY_PARTNER_INTRO,
    '',
    ...AGENCY_PARTNER_PLANS.map((p) => `- **${p.name}**: ${p.summary}`),
    '',
    '## Main pages',
    '',
    `- [Home](${url('/')}): AI search and CRO for Shopify brands: the shift to AI shopping, the two engines, proof, pricing summary and FAQ.`,
    `- [AI search optimization](${url('/ai-search')}): How AI decides what to recommend, the on site and off site work, and how it is measured.`,
    `- [Conversion rate optimization](${url('/shopify-conversion-optimization')}): CRO built for high intent AI traffic and everyone else.`,
    `- [Pricing](${url('/pricing')}): The audit, fixed price Build tiers, retainers and the comparison table.`,
    `- [AI Visibility Check](${url(CHECK_PATH)}): Free check of whether ChatGPT recommends your brand.`,
    `- [Results](${url('/results')}): AI search results first, then conversion, testing, subscriptions, email and more.`,
    `- [For agencies](${url('/agencies')}): White label AI search and CRO implementation for agencies with Shopify clients.`,
    '',
    '## Other services',
    '',
    ...CONTENT_PAGES.filter((p) => p.kind === 'service' && !['ai-search', 'shopify-conversion-optimization'].includes(p.slug)).map(
      (p) => `- [${p.label}](${url(`/${p.slug}`)}): ${p.summary}`,
    ),
    '',
    '## Industries',
    '',
    ...pages('industry'),
    '',
    '## Reports',
    '',
    `- [All reports](${url('/reports')}): ${REPORT_HUB.frontmatter.description}`,
    ...REPORTS.map((r) => `- [${r.frontmatter.h1}](${url(`/${slugOf(r)}`)}): ${r.frontmatter.description}`),
    '',
    '## Guides',
    '',
    ...pages('guide'),
    '',
    '## Tools',
    '',
    `- [All tools](${url('/tools')}): Calculators and a store check for Shopify brands.`,
    ...TOOLS.map((t) => `- [${t.name}](${url(`/tools/${t.slug}`)}): ${t.summary}`),
    '',
  ].join('\n');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
