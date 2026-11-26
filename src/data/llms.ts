// The text of /llms.txt and /llms-full.txt. Built from facts.ts and the same plan data as the pages, so prices,
// stats and who does the work here always match the pricing cards and the JSON-LD.
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
  TOP_REPORTS,
  SIZE_COMPARE,
  TERMS_LIST,
  FAQS,
  PRICING_FAQS,
  AI_CASES,
  AI_CASES_NOTE,
} from './site';
import { FACTS, FACTS_DESCRIPTION } from './facts';
import { CONTENT_PAGES, TOOLS } from './pages';
import { REPORT_HUB, REPORTS, AI_RESEARCH, MARKDOWN_PAGES, COMPETITOR_GUIDE, slugOf } from './reports';
import { GUIDES } from './guides';

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
const url = (path: string) => `${SITE_URL}${path}`;
const pages = (kind: string) =>
  CONTENT_PAGES.filter((p) => p.kind === kind).map((p) => `- [${p.label}](${url(`/${p.slug}`)}): ${p.summary}`);
const { offers } = FACTS;

const head = () => [
  `# ${FACTS.name}`,
  '',
  `> ${FACTS.role}. ${FACTS.location.serves}`,
  '',
  FACTS_DESCRIPTION,
  '',
  '## Who does the work',
  '',
  FACTS.implementationThird[0],
  '',
  ...FACTS.implementationThird.slice(1).map((l) => `- ${l}`),
  '',
  '## Numbers',
  '',
  ...Object.values(FACTS.stats).map((s) => `- ${s.value} ${s.label}`),
  `- ${FACTS.abTesting.replace("I've", 'Carson has')}`,
  `- Results: ${url('/results')}. Clients are anonymous under NDA.`,
  '',
  `## Offers for brands (full pricing: ${url('/pricing')})`,
  '',
  `- **${offers.focus.name}**: ${usd(offers.focus.price)} a month, ${offers.focus.billing}. ${offers.focus.fit}. ${PROGRAM_SIZES[0].tagline} Includes: ${PROGRAM_SIZES[0].items.join('; ')}.`,
  `- **${offers.full.name}**: ${usd(offers.full.price)} a month, ${offers.full.billing}. ${offers.full.fit}. ${PROGRAM_SIZES[1].tagline} Includes: ${PROGRAM_SIZES[1].items.join('; ')}.`,
  `- **${offers.audit.name}** (${url(FULL_AUDIT.path)}): ${usd(offers.audit.price)} one time. ${offers.audit.fit}. ${FULL_AUDIT.summary} ${FULL_AUDIT.timing} ${FULL_AUDIT.walkthrough}`,
  `- **Gap report** (${url(CHECK_PATH)}): takes about a minute, no login. Shows how often ChatGPT recommends a Shopify store against a top competitor, how accurately it describes the brand, whether AI crawlers can reach the store, and what its top product pages tell AI. Brands doing $50K a month or more get a short recorded video of the full gap within 1 business day.`,
  '',
  `${PROGRAM.name} is ongoing monthly work, month to month. Cancel any time with 30 days written notice. ${PROGRAM.scopeText} ${PROGRAM.guarantee} ${PROGRAM.guaranteeNote} ${PROGRAM.scope}`,
  '',
  `Contact: ${EMAIL}. No call needed: start any offer online at ${url('/pricing')}, or email with questions.`,
  '',
];

const body = () => [
  '## Two steps',
  '',
  ...ENGINES.map((e) => `- **${e.tag}: ${e.title.replace(/\.$/, '')}.** ${e.text} More: ${url(e.link.href)}`),
  '',
  '## Partner pricing for agencies',
  '',
  AGENCY_PARTNER_INTRO,
  '',
  ...AGENCY_PARTNER_PLANS.map((p) => `- **${p.name}**: ${p.summary}`),
  '',
  '## Main pages',
  '',
  `- [Home](${url('/')}): How competitors win in AI search, how Carson closes the gap and then the sale, proof, pricing summary and FAQ.`,
  `- [AI search optimization](${url('/ai-search')}): How AI decides what to recommend, the on site and off site work, and how it is measured.`,
  `- [Shopify structured data](${url('/shopify-structured-data')}): Hand coded JSON-LD built into the theme, so ChatGPT, Gemini and Google read products, prices and reviews correctly.`,
  `- [Conversion rate optimization](${url('/shopify-conversion-optimization')}): CRO built for high intent AI traffic and everyone else.`,
  `- [Close the Gap](${url(PROGRAM.path)}): How it works, its two sizes, the month 1 guarantee and the FAQ.`,
  `- [Pricing](${url('/pricing')}): Close the Gap Focus and Full, the Full Store Audit, the gap report, and fit and terms.`,
  `- [Full Store Audit](${url(FULL_AUDIT.path)}): A one time conversion audit of every page, cart and checkout, email flows, analytics and subscriptions.`,
  `- [AI Visibility Check](${url(CHECK_PATH)}): Whether ChatGPT recommends your brand or your top competitor. Takes about a minute, no login.`,
  `- [Results](${url('/results')}): AI search results first, then conversion, testing, subscriptions, email and more.`,
  `- [About Carson Cobb](${url('/about')}): What Carson does, how he works, the numbers and his background.`,
  `- [For agencies](${url('/agencies')}): White label AI search and CRO implementation for agencies with Shopify clients.`,
  `- [Research reports](${url('/reports')}): ${REPORT_HUB.frontmatter.description}`,
  '',
  '## By product area (examples; Carson works with Shopify brands in every product category)',
  '',
  ...pages('industry'),
  `- [Every other product area](${url('/ai-search')}): AI search and conversion work the same way for Shopify brands in every product area.`,
  '',
  '## Start here: top research and the main guide',
  '',
  ...[COMPETITOR_GUIDE.slice(1), ...TOP_REPORTS].map((slug) => {
    const p = [...MARKDOWN_PAGES, ...GUIDES].find((m) => slugOf(m) === slug)!;
    return `- [${p.frontmatter.h1}](${url(`/${slug}`)}): ${p.frontmatter.answer ?? p.frontmatter.description}`;
  }),
  '',
  '## Other services',
  '',
  ...CONTENT_PAGES.filter(
    (p) => p.kind === 'service' && !['ai-search', 'shopify-conversion-optimization', 'shopify-structured-data'].includes(p.slug),
  ).map((p) => `- [${p.label}](${url(`/${p.slug}`)}): ${p.summary}`),
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
];

export const llmsText = () => [...head(), ...body()].join('\n');

// The full version adds the plan detail, the published case studies and every pricing and homepage FAQ answer.
export const llmsFullText = () => {
  const seen = new Set<string>();
  const faqs = [...FAQS, ...PRICING_FAQS, ...TERMS_LIST].filter((f) => !seen.has(f.q) && seen.add(f.q));
  return [
    ...head(),
    `## ${PROGRAM.name}: how the work runs`,
    '',
    ...PROGRAM.months.flatMap((m) => [`### ${m.when}: ${m.title}`, '', ...m.items.map((i) => `- ${i}`), '']),
    `### ${PROGRAM.always.title}`,
    '',
    ...PROGRAM.always.items.map((i) => `- ${i}`),
    '',
    PROGRAM.after,
    '',
    `### ${SIZE_COMPARE.title}`,
    '',
    '| | Focus | Full |',
    '| --- | --- | --- |',
    ...SIZE_COMPARE.rows.map((r) => `| ${r.join(' | ')} |`),
    '',
    '## Case studies (anonymous)',
    '',
    ...AI_CASES.map((c) => `- **${c.stat} ${c.statLabel}** (${c.tag}). ${c.title} Before: ${c.before} After: ${c.after}`),
    '',
    AI_CASES_NOTE,
    '',
    '## FAQ',
    '',
    ...faqs.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
    ...body(),
  ].join('\n');
};
