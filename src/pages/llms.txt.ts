import type { APIRoute } from 'astro';
import { SITE_URL, EMAIL, CAL_LINK, HOURLY_RATE, PLANS, AGENCY_PLANS, AGENCY_CLIENT_PLANS } from '../data/site';
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
    '> Fractional Head of Ecommerce for growing Shopify brands. I run the store on a monthly plan: strategy, development, conversion, email, subscriptions and reporting, led by one senior person.',
    '',
    'I have spent 6+ years inside 50+ Shopify stores, from startups to ten figure brands. I work with growing Shopify brands doing $10K to $10M a month, and with agencies that need a senior Shopify lead under their own name. Based in California, working with brands across the US.',
    '',
    `Contact: ${EMAIL}. Book a 20 minute intro call: ${CAL_LINK}`,
    '',
    '## Plans for brands',
    '',
    ...PLANS.map(plan),
    `- **One off work**: ${usd(HOURLY_RATE)}/hr with a one hour minimum.`,
    '',
    'Monthly plans are billed in advance and run month to month, with 30 days notice to cancel.',
    '',
    '## Plans for agencies',
    '',
    'Senior hours on demand:',
    '',
    ...AGENCY_PLANS.map(plan),
    '',
    'White label plans, priced per client store:',
    '',
    ...AGENCY_CLIENT_PLANS.map(plan),
    '',
    '## Main pages',
    '',
    `- [Home](${url('/')}): What I do for growing Shopify brands, results, plans and FAQ.`,
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
