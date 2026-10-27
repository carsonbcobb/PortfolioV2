import fs from 'node:fs';
import path from 'node:path';

export const SITE_URL = 'https://www.carsoncobb.com';
export const EMAIL = 'carson@carsoncobb.com';
export const EMAIL_URL = `mailto:${EMAIL}?subject=Shopify%20store%20inquiry`;
export const AGENCY_EMAIL_URL = `mailto:${EMAIL}?subject=White%20label%20Shopify%20dev`;
export const LINKEDIN_URL = 'https://www.linkedin.com/in/carsoncobb';
export const GA_ID = 'G-PEDB1QHBG3';

// Cal.com booking link comes from the CAL_LINK env variable at build time.
// Until it is set, "Book a call" falls back to email so no button is ever dead.
const calLink = (import.meta.env.CAL_LINK ?? process.env.CAL_LINK ?? '').trim();
if (!calLink) {
  console.warn('[carsoncobb] CAL_LINK is not set. "Book a call" buttons will fall back to email.');
}
export const CAL_LINK = calLink || EMAIL_URL;

const publicFile = (p: string) => fs.existsSync(path.join(process.cwd(), 'public', p));

// Headshot: drop a photo at public/carson.jpg. Until then a neutral gray box is shown.
export const HEADSHOT = publicFile('carson.jpg') ? '/carson.jpg' : null;

// Home page copy, taken word for word from the approved design (design-reference.html).

export const HERO_METRICS = [
  { label: 'Conversion rate', value: '3.2%', change: 'up from 2.1%' },
  { label: 'Avg order value', value: '$64', change: 'up from $58' },
];

export const HERO_SHIPPED = [
  'New product page template live across the catalog',
  'Cart upsell test won, rolled out to 100%',
  'Winback email flow launched',
  'Holiday promo calendar and landing pages ready',
];
export const HERO_NEXT = 'Next: subscription page test, social content plan';

export const STATS = [
  { value: '50+', label: 'Shopify stores' },
  { value: '6+ years', label: 'running and building stores' },
  { value: '$40M+', label: 'in client revenue supported' },
  { value: '2.1x', label: 'avg conversion lift on rebuilt pages' },
];

export const VERTICALS = ['Supplements', 'Beauty', 'Skincare', 'Wellness', 'Food & Beverage', 'Apparel', 'Home'];

export const OPTIONS = [
  {
    tag: 'Option 1',
    title: 'Hire full time',
    price: '$150K+',
    unit: ' / year',
    points: [
      'Salary, benefits, and recruiting fees',
      'Months to hire, then more months to ramp',
      'Still need a developer and designer underneath them',
    ],
    dark: false,
  },
  {
    tag: 'Option 2',
    title: 'Stitch together vendors',
    price: '4 invoices',
    unit: ' / month',
    points: [
      'Developer, designer, email agency, social freelancer',
      'None of them talk, none of them own revenue',
      'You become the project manager',
    ],
    dark: false,
  },
  {
    tag: 'The better option',
    title: 'One owner, on retainer',
    price: 'From $3,000',
    unit: ' / month',
    points: [
      'Senior lead who builds and directs everything',
      'First changes ship in week one',
      'Month to month, no recruiting, no ramp',
    ],
    dark: true,
  },
];

// Icon markup is the inner SVG of a 24×24 stroke icon.
export const OWN = [
  {
    icon: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
    title: 'Store and development',
    text: 'Theme builds, custom sections, apps and integrations, site speed, migrations, and the technical health nobody else is watching.',
  },
  {
    icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
    title: 'Design and UX',
    text: 'Product pages, landing pages, collections, cart, and mobile, designed to sell and kept consistent with your brand.',
  },
  {
    icon: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    title: 'Conversion and testing',
    text: 'A/B tests, funnel analysis, offers and pricing, and checkout fixes that turn the traffic you already pay for into buyers.',
  },
  {
    icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    title: 'Retention and email',
    text: 'Klaviyo flows and campaigns, subscriptions, upsells, and post-purchase, so every customer is worth more over time.',
  },
  {
    icon: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    title: 'Analytics and reporting',
    text: "Clean tracking, a KPI dashboard you actually read, and a monthly review of what moved and what's next.",
  },
  {
    icon: '<path d="M3 11v2a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1zM16 9a4 4 0 010 6M19 6a8 8 0 010 12"/>',
    title: 'Marketing, content, and brand',
    text: 'Social and content direction, launch and promo planning, brand consistency, and managing your freelancers and agencies.',
  },
];

export const RESULTS = [
  {
    tag: 'Skincare · Ongoing retainer',
    stat: '+71%',
    statLabel: 'conversion rate, same ad spend',
    title: 'A store that leaked buyers became one that improves every month.',
    before: 'one hero product carried the business, products were buried, and the mobile cart fought shoppers.',
    after:
      'shoppers get guided to the right product, checkout on a phone is effortless, and organic revenue grew 62% in 6 months.',
  },
  {
    tag: 'Subscriptions · Retention',
    stat: '7% → 32%',
    statLabel: 'subscription opt-in',
    title: 'Over 4x more customers choosing subscribe and save.',
    before: 'strong first orders, weak repeat revenue, and subscription and upsell apps working against each other.',
    after: 'subscribing is the obvious choice on every page, every order gets a relevant upsell, and AOV is up 18%.',
  },
  {
    tag: 'Supplements · Site rebuild',
    stat: '7.9s → 2.1s',
    statLabel: 'mobile load time',
    title: 'A rebuild that paid for itself in 6 weeks.',
    before: 'an old, bloated theme with 20+ apps, slow pages, and simple changes that took days and a developer.',
    after: 'a fast new theme the team can edit themselves, half the apps, and conversion up 24%.',
  },
];

export const FIRST_90 = [
  {
    month: 'Month 1',
    title: 'Stop the leaks',
    text: 'Fix tracking, speed, and the product pages and cart where buyers drop off. The quickest money is almost always here.',
  },
  {
    month: 'Month 2',
    title: 'Make every order worth more',
    text: 'Upsells, subscriptions, and Klaviyo flows that raise order value and bring customers back.',
  },
  {
    month: 'Month 3',
    title: 'Build the growth engine',
    text: 'A running testing roadmap, a launch and promo calendar, and content direction, so the store keeps compounding.',
  },
];

export const PLANS = [
  {
    tag: 'Start here',
    name: 'Store Sprint',
    price: 1500,
    unit: ' one time',
    summary: 'One week. I find the five changes most likely to move revenue, and ship them.',
    includes: [
      'Full store review',
      'Five changes shipped, not a PDF',
      'Video walkthrough of everything',
      '100% credited to a retainer within 30 days',
    ],
    note: { strong: 'Paid upfront.', text: 'Five changes live within seven days of kickoff.' },
    cta: 'Book a Sprint',
    monthly: false,
    featured: false,
  },
  {
    tag: 'For the store itself',
    name: 'Operator',
    price: 3000,
    unit: ' / month',
    summary: 'Your store built, fixed, and optimized continuously.',
    includes: [
      'Development, design, and technical health',
      'Ongoing conversion testing',
      'Klaviyo, subscriptions, and upsells',
      'Monthly performance report and strategy call',
      '1 business day response',
      'Up to 30 hours of work a month',
    ],
    note: null,
    cta: 'Book a call',
    monthly: true,
    featured: false,
  },
  {
    tag: 'For the whole business',
    name: 'Head of Ecommerce',
    price: 5500,
    unit: ' / month',
    summary: 'One senior lead owning the store and its growth.',
    includes: [
      'Everything in Operator',
      'Marketing, content, and social direction',
      'Launch, promo, and campaign planning',
      'Manage your freelancers and agencies',
      'Weekly strategy call and live KPI dashboard',
      'Same day response on weekdays',
      'Up to 50 hours of work a month',
    ],
    note: null,
    cta: 'Book a call',
    monthly: true,
    featured: true,
  },
];

export const STEPS = [
  {
    when: 'Day 1',
    title: 'Intro call',
    text: "20 minutes on your goals, your numbers, and where the store stands. If I'm not the right fit, I'll tell you.",
  },
  {
    when: 'Week 1',
    title: 'First fixes ship',
    text: 'Sprint or retainer, the first week maps where revenue is leaking and the first changes go live.',
  },
  {
    when: 'Month 1 and on',
    title: 'I own it',
    text: 'A clear plan each month, regular check ins, and reporting on the numbers that matter. It compounds from there.',
  },
];

export const FAQS = [
  {
    q: 'Who is this for?',
    a: "Shopify brands doing $15K a month or more, with real traffic and a product that sells. If you're pre-launch or looking for the cheapest developer available, I'm not the right fit, and I'll say so.",
  },
  {
    q: 'Which plan is right for me?',
    a: 'If you mainly need the store built, fixed, and optimized, Operator. If you want one person owning ecommerce, including marketing direction and your vendors, Head of Ecommerce. Not sure yet? Start with a Sprint.',
  },
  {
    q: 'Do you create the content and run social yourself?',
    a: 'I set the direction, plan the content, and create what fits, like site content, email, and product pages. For high volume production I direct your team or freelancers so it stays on brand and tied to revenue.',
  },
  {
    q: 'How fast will I see results?',
    a: 'The first changes ship in week one. Most clients see measurable movement within the first month.',
  },
  {
    q: 'Do you bill hourly?',
    a: 'No. Plans are flat monthly retainers. Scope is agreed on our first call and reviewed every month.',
  },
  {
    q: 'Can I cancel?',
    a: 'Yes. Month to month after the first month, with 30 days notice.',
  },
  {
    q: 'Do you work with agencies?',
    a: 'Yes, as a white label Shopify developer. See the agencies page.',
    link: { href: '/agencies', text: 'agencies page' },
  },
];

export const AGENCY_SERVICES = [
  { title: 'Theme Builds & Custom Sections', text: 'New themes, theme migrations, and custom sections your clients can edit themselves.' },
  { title: 'Recharge & Rebuy Setup', text: 'Subscriptions, bundles, and upsell placements built and styled to match the theme.' },
  { title: 'Klaviyo Onsite Integration', text: 'Signup forms, back in stock, and onsite tracking wired in properly.' },
  { title: 'App Installs & Conflicts', text: 'Installing apps cleanly and untangling the ones that fight each other.' },
  { title: 'Speed & Technical Fixes', text: 'Page speed, broken templates, and the technical debt that slows campaigns down.' },
  { title: 'Campaign Landing Pages', text: 'Landing pages for paid and email campaigns, built fast and on brand.' },
];

export const AGENCY_STEPS = [
  { title: 'Intro Call', text: 'We talk through your clients, your stack, and how your team likes to work.' },
  { title: 'Buy A Block', text: 'Prepay a 10 hour block at $100/hr. Volume rate at 40+ hours/month.' },
  { title: 'Send Tickets', text: 'Send tickets in your Slack or project tools. I ship, and report hours weekly.' },
];
