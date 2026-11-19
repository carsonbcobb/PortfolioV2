import type { APIRoute } from 'astro';
import {
  SITE_URL,
  EMAIL,
  PROGRAM,
  PROGRAM_SIZES,
  FULL_AUDIT,
  CHECK_PATH,
  ENGINES,
  AGENCY_PARTNER_PLANS,
  AGENCY_PARTNER_INTRO,
} from '../data/site';
import { CONTENT_PAGES, TOOLS } from '../data/pages';
import { REPORT_HUB, REPORTS, AI_RESEARCH, slugOf } from '../data/reports';
import { GUIDES } from '../data/guides';

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
    "I'm Carson Cobb. I've led AI search work for national brands in vitamins, skincare, cosmetics, food, pet and wellness: 50+ AI search projects, 30+ sites optimized for AI search, and 4,000+ products restructured with machine readable attributes. Before that I spent years running conversion and testing programs, affiliate programs and full rebuilds for 50+ Shopify stores, from seed stage startups to billion dollar brands. Rebuilt pages average a 2.1x conversion lift. Founders stay in control: I propose, you decide, and nothing goes live without your sign off. I never promise rankings; I measure. Based in California, working with brands across the US.",
    '',
    '## Two engines',
    '',
    ...ENGINES.map((e) => `- **${e.tag}: ${e.title.replace(/\.$/, '')}.** ${e.text} More: ${url(e.link.href)}`),
    '',
    '## Gap report',
    '',
    `At ${url(CHECK_PATH)}, takes about a minute, no login: enter a Shopify store URL, a top competitor and a monthly revenue range to see how often ChatGPT recommends each brand for questions built from the store's top products, how accurately it describes the brand, whether AI crawlers can reach the store, and what its top product pages tell AI. Brands doing $50K a month or more get a short recorded video of the full gap within 1 business day.`,
    '',
    `Contact: ${EMAIL}. No call needed: start any offer online at ${url('/pricing')}, or email with questions.`,
    '',
    `## Offers for brands (full pricing: ${url('/pricing')})`,
    '',
    `- **${PROGRAM.name}** (${url(PROGRAM.path)}): ${PROGRAM.summary} ${PROGRAM.after}`,
    ...PROGRAM_SIZES.map(
      (z) =>
        `- **${z.name}**: ${z.fit}. ${z.items.join('. ')}. ${usd(z.monthly)}/month with a 3 month commitment. Or ${usd(z.upfront)} paid upfront for 3 months, or ${usd(z.flexible)}/month with no commitment.`,
    ),
    `- ${PROGRAM.guarantee} ${PROGRAM.guaranteeNote} ${PROGRAM.continues} ${PROGRAM.scope}`,
    `- **${FULL_AUDIT.name}** (${url(FULL_AUDIT.path)}): ${usd(FULL_AUDIT.price)} one time. ${FULL_AUDIT.summary} ${FULL_AUDIT.timing} ${FULL_AUDIT.walkthrough}`,
    '',
    '## Partner pricing for agencies',
    '',
    AGENCY_PARTNER_INTRO,
    '',
    ...AGENCY_PARTNER_PLANS.map((p) => `- **${p.name}**: ${p.summary}`),
    '',
    '## Main pages',
    '',
    `- [Home](${url('/')}): AI is picking the winners in every product market: how competitors win in AI search, how I close the gap and then the sale, proof, pricing summary and FAQ.`,
    `- [AI search optimization](${url('/ai-search')}): How AI decides what to recommend, the on site and off site work, and how it is measured.`,
    `- [Conversion rate optimization](${url('/shopify-conversion-optimization')}): CRO built for high intent AI traffic and everyone else.`,
    `- [Close the Gap](${url(PROGRAM.path)}): The 90 day program, its two sizes, the month 1 guarantee and the FAQ.`,
    `- [Pricing](${url('/pricing')}): Close the Gap Focus and Full, the Full Store Audit, the gap report, and fit and terms.`,
    `- [Full Store Audit](${url(FULL_AUDIT.path)}): A one time conversion audit of every page, cart and checkout, email flows, analytics and subscriptions.`,
    `- [AI Visibility Check](${url(CHECK_PATH)}): Whether ChatGPT recommends your brand or your top competitor. Takes about a minute, no login.`,
    `- [About Carson Cobb](${url('/about')}): Carson's background in Shopify CRO and ecommerce, how he works, and links to his results.`,
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
    '## AI search research',
    '',
    ...AI_RESEARCH.map((r) => `- [${r.frontmatter.h1}](${url(`/${slugOf(r)}`)}): ${r.frontmatter.description}`),
    '',
    '## Reports',
    '',
    `- [All reports](${url('/reports')}): ${REPORT_HUB.frontmatter.description}`,
    ...REPORTS.filter((r) => !AI_RESEARCH.includes(r)).map(
      (r) => `- [${r.frontmatter.h1}](${url(`/${slugOf(r)}`)}): ${r.frontmatter.description}`,
    ),
    '',
    '## Guides',
    '',
    `- [All guides](${url('/guides')}): Plain answers to the questions founders ask about ChatGPT, Google AI and their Shopify store.`,
    ...GUIDES.map((g) => `- [${g.frontmatter.h1}](${url(`/${slugOf(g)}`)}): ${g.frontmatter.description}`),
    ...pages('guide'),
    '',
    '## Tools',
    '',
    `- [All tools](${url('/tools')}): The gap report plus subscription, free shipping and revenue calculators for Shopify brands.`,
    ...TOOLS.map((t) => `- [${t.name}](${url(`/tools/${t.slug}`)}): ${t.summary}`),
    '',
  ].join('\n');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
