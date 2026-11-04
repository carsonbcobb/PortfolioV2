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
  AGENCY_PLANS,
  AGENCY_CLIENT_PLANS,
} from '../data/site';
import { CONTENT_PAGES, TOOLS } from '../data/pages';
import { REPORT_HUB, REPORTS, slugOf } from '../data/reports';

// Plain markdown summary of the site at /llms.txt. Built from the same data as the pages,
// so plans and prices here always match the pricing cards.

const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
const hoursOf = (includes: string[]) => includes.find((i) => /^Up to \d+ hours/.test(i));
const plan = (p: { name: string; price: number; unit: string; summary: string; includes?: string[] }) => {
  const hours = p.includes && hoursOf(p.includes);
  return `- **${p.name}**: ${usd(p.price)}${p.unit}. ${p.summary}${hours ? ` ${hours}.` : ''}`;
};
const url = (path: string) => `${SITE_URL}${path}`;
const pages = (kind: string) =>
  CONTENT_PAGES.filter((p) => p.kind === kind).map((p) => `- [${p.label}](${url(`/${p.slug}`)}): ${p.summary}`);

export const GET: APIRoute = () => {
  const text = [
    '# Carson Cobb',
    '',
    "> AI search and CRO for Shopify brands. I get products recommended in ChatGPT and Google's AI answers, then make sure the store turns that traffic into sales.",
    '',
    'I have spent 6+ years inside 50+ Shopify stores, from startups to ten figure brands. I work with Shopify brands, especially in wellness, supplements and beauty, from startups to billion dollar companies, and with agencies that need a senior Shopify lead under their own name. Founders stay in control: I propose, you decide, and nothing goes live without your sign off. Based in California, working with brands across the US.',
    '',
    `Contact: ${EMAIL}. Book a 20 minute ${CALL_NAME}: ${CAL_LINK}. ${CALL_TEXT}`,
    '',
    '## Offers for brands',
    '',
    `- **${AUDIT.name}**: ${usd(AUDIT.price)} one time. ${AUDIT.includes.join(', ')}. ${AUDIT.note}`,
    `- **${BUILD.name}**: fixed price, 3 to 4 weeks. ${BUILD.tiers.map((t) => `${t.label}: ${t.from ? 'from ' : ''}${usd(t.price)}`).join('; ')}. Includes ${BUILD.includes.map((i) => i.charAt(0).toLowerCase() + i.slice(1)).join(', ')}. ${BUILD.note}`,
    ...RETAINERS.map((r, i) => {
      const terms = RETAINER_ROWS.map((row) => `${row.label.toLowerCase()} ${row.values[i]}`).join(', ');
      const scope = r.includes.length ? ` ${r.includes.join('; ')}.` : '';
      return `- **${r.name} retainer**: ${r.summary}${scope} Terms: ${terms}.`;
    }),
    '',
    RETAINER_NOTE,
    '',
    '## Plans for agencies',
    '',
    'Reserved senior capacity:',
    '',
    ...AGENCY_PLANS.map(plan),
    '',
    'White label plans, priced per client store:',
    '',
    ...AGENCY_CLIENT_PLANS.map(plan),
    '',
    '## Main pages',
    '',
    `- [Home](${url('/')}): AI search and CRO for Shopify brands: the problem, how it works, pricing and FAQ.`,
    `- [For agencies](${url('/agencies')}): White label Shopify work and plans for agencies.`,
    `- [Results](${url('/results')}): What running a Shopify store covers, from conversion and testing to operations, and the client results behind each part.`,
    '',
    '## Services',
    '',
    ...pages('service'),
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
