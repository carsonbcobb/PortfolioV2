import fs from 'node:fs';
import path from 'node:path';

export const SITE_URL = 'https://www.carsoncobb.com';
export const EMAIL = 'carson@carsoncobb.com';
export const EMAIL_URL = `mailto:${EMAIL}?subject=Shopify%20store%20inquiry`;
export const AGENCY_EMAIL_URL = `mailto:${EMAIL}?subject=Agency%20partnership`;
export const LINKEDIN_URL = 'https://www.linkedin.com/in/carsoncobb';
// LinkedIn company page, listed in the JSON-LD sameAs.
export const LINKEDIN_COMPANY_URL: string | null = 'https://www.linkedin.com/company/carsoncobb';
export const GA_ID = 'G-PEDB1QHBG3';

// Cal.com booking link comes from the CAL_LINK env variable at build time.
// Until it is set, booking buttons fall back to email so no button is ever dead.
const calLink = (import.meta.env.CAL_LINK ?? process.env.CAL_LINK ?? '').trim();
if (!calLink) {
  console.warn('[carsoncobb] CAL_LINK is not set. Booking buttons will fall back to email.');
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

export const VERTICALS = ['Supplements', 'Beauty', 'Skincare', 'Wellness', 'Food & Beverage', 'Apparel', 'Home'];

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
    text: 'Klaviyo flows and campaigns, subscriptions, upsells, and post purchase, so every customer is worth more over time.',
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

// How I work, shown above the six OWN cards. Numbered 01 to 04 on the page.
export const HOW_I_WORK = [
  {
    title: 'I find the money',
    text: 'Audits and clear recommendations on where the store is losing sales, ranked by what will pay back fastest.',
  },
  {
    title: 'I build it myself',
    text: 'Code changes, design, testing, and email, done hands on. Nothing waits in a queue for someone else.',
  },
  {
    title: 'I run everyone else',
    text: 'Apps, agencies, and freelancers touching the store go through me, so you stop being the project manager.',
  },
  {
    title: 'I report on the numbers',
    text: "Monthly reporting on conversion, order value, and repeat revenue, and what I'm doing next.",
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
    statLabel: 'subscription opt in',
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

// Pricing: start with the audit, then a fixed price Build or a retainer.
export const AUDIT = {
  tag: 'Start here',
  name: 'AI Search and Conversion Audit',
  price: 1500,
  unit: ' one time',
  includes: [
    '50 buyer question test in ChatGPT',
    'Competitor and citation analysis',
    'Conversion leak review',
    'Prioritized plan',
  ],
  note: 'The full $1,500 is credited toward a Build started within 30 days.',
};

export const BUILD = {
  tag: 'Fixed price, 3 to 4 weeks',
  name: 'Build',
  tiers: [
    { label: 'Up to 50 products', price: 5000, from: false },
    { label: '50 to 500 products', price: 7500, from: false },
    { label: '500+ products', price: 10000, from: true },
  ],
  includes: [
    'On site AI search work across every template',
    'Conversion rebuild of key pages',
    'Measurement setup: post purchase survey, AI traffic tracking and a baseline',
    'A retest of the same questions after 30 days',
  ],
  note: 'I take 3 Builds a month.',
};

// price null shows "Let's talk".
export const RETAINERS = [
  {
    name: 'Growth',
    price: 4500 as number | null,
    unit: '/month',
    summary: 'I grow your traffic from AI search and your conversion rate.',
    includes: [
      'Monthly AI search tracking and report',
      'Ongoing on site AI and conversion testing',
      'Off site work: getting into the lists and articles AI cites, affiliate and publisher outreach, review strategy and Amazon listing improvements',
    ],
    note: null as string | null,
    featured: false,
  },
  {
    name: 'Full',
    price: 7500,
    unit: '/month',
    summary: 'Your ecommerce lead, working at your direction.',
    includes: [
      'Everything in Growth',
      'I propose the roadmap and you decide',
      'I plan and build launches, promotions and holidays for your sign off',
      'I run Klaviyo day to day in your brand voice',
      'I manage subscriptions, merchandising, apps and vendors so you have one point of contact',
      "A weekly report on what changed and what's next",
      'I handle QA so issues get caught before customers see them',
    ],
    note: 'You choose how hands on you want to be.',
    featured: true,
  },
  {
    name: 'Dedicated',
    price: null,
    unit: '',
    summary: 'Full time capacity for brands that need it.',
    includes: [],
    note: "Let's talk.",
    featured: false,
  },
];

// Retainer comparison table: one row per term, one value per retainer in RETAINERS order.
export const RETAINER_ROWS = [
  { label: 'Price', values: ['$4,500/month', '$7,500/month', "Let's talk"] },
  { label: 'Capacity', values: ['Up to 30 hours a month', 'Up to 60 hours a month', 'Full time capacity'] },
  { label: 'Calls', values: ['Check in every 2 weeks', 'Weekly call, plus 1 extra call a week when needed', 'Built around your team'] },
  { label: 'Response time', values: ['Within 1 business day', 'Same business day', 'Same business day'] },
  { label: 'Minimum', values: ['3 months', '3 months', 'Custom'] },
];

export const RETAINER_NOTE =
  "Retainers are part time by design. If you need more in a month, we move you up a tier or quote the extra work as a fixed add on. Out of office days are always shared in advance. Any retainer can implement your audit plan at the retainer's pace; the Build is the fast lane.";

export const STEPS = [
  {
    when: 'Step 1',
    title: 'AI Search and Conversion Audit',
    text: "I test 50 real buyer questions in ChatGPT, built from your own customers' language, and show where you're recommended, who shows up instead and why. Then I map where your store is losing sales. You get a prioritized plan.",
  },
  {
    when: 'Step 2',
    title: 'Build or retainer',
    text: 'Implement the plan in a fixed 3 to 4 week Build, or on a retainer that implements it and keeps growing from there.',
  },
  {
    when: 'Step 3',
    title: 'Measure',
    text: 'I rerun the same questions and track AI driven traffic and sales, so you can see what changed.',
  },
];

// The 20 minute call, wherever it is described.
export const CALL_NAME = 'AI Search Review';
export const CALL_TEXT =
  "Before the call I run your top buyer questions through ChatGPT. On the call I'll show you where you're recommended, who shows up instead, and what's driving it.";
export const CTA_LABEL = 'See if ChatGPT recommends you';
export const HEADER_CTA_LABEL = 'Check your AI visibility';

export const FAQS: { q: string; a: string; link?: { href: string; text: string } }[] = [
  {
    q: 'What is AI search?',
    a: "Shoppers asking ChatGPT, Google's AI answers and similar tools what to buy, and getting a short list of recommended brands.",
  },
  {
    q: 'Can you guarantee ChatGPT will recommend us?',
    a: 'No one honestly can. I measure your mention rate across 50 real buyer questions before and after the work, and track AI driven traffic and sales, so you see exactly what moved. On site work is one part; reviews, press, lists and retail listings matter too, and the audit shows which ones apply to you.',
  },
  {
    q: 'How do you measure AI traffic when most of it shows up as direct?',
    a: 'AI referral traffic, a post purchase survey, branded and direct traffic growth, and the high converting visitor segment that AI research produces.',
  },
  {
    q: 'Why is there a 3 month minimum on retainers?',
    a: 'AI search and off site work take 60 to 90 days to show. The audit and Build are the low commitment ways to start.',
  },
  {
    q: 'Do I stay in control?',
    a: 'Always. I propose, you decide, and nothing goes live without your sign off.',
  },
  {
    q: 'Who do you work with?',
    a: 'Shopify brands, especially in wellness, supplements and beauty, from startups to billion dollar companies.',
  },
  {
    q: 'How is this different from hiring a freelancer?',
    a: "A freelancer waits for your task list. I bring the plan, rank what's worth doing, do the work, and report on what moved. You decide what goes live.",
  },
  {
    q: 'Do you create the content and run social yourself?',
    a: 'I set the direction, plan the content, and create what fits, like site content, email, and product pages. For high volume production I direct your team or freelancers so it stays on brand and tied to revenue.',
  },
  {
    q: 'Do you work with agencies?',
    a: 'Yes, as a white label Shopify developer. See the agencies page.',
    link: { href: '/agencies', text: 'agencies page' },
  },
];

// Agencies page copy, taken word for word from the approved design (agencies-design-reference.html).

export const AGENCY_TICKET_STATS = [
  { label: 'Avg turnaround', value: '1.4 days' },
  { label: 'Active clients', value: '4' },
  { label: 'Client calls led', value: '3' },
];

// status: live, review, or building (sets the pill color).
export const AGENCY_TICKETS = [
  { client: 'Skincare client', title: 'Holiday campaign landing page', hours: '6h', status: 'live', label: 'Live' },
  { client: 'Supplement client', title: 'Subscription offer on product pages', hours: '4h', status: 'live', label: 'Live' },
  { client: 'Apparel client', title: 'Back in stock and email signup forms', hours: '3h', status: 'review', label: 'In review' },
  { client: 'Wellness client', title: 'A/B test on a new product page layout', hours: '5h', status: 'building', label: 'Building' },
  { client: 'Home goods client', title: 'Theme migration and custom sections', hours: '8h', status: 'building', label: 'Building' },
];

export const AGENCY_STATS = [
  { value: '50+', label: 'Shopify stores' },
  { value: '6+ years', label: 'Shopify development' },
  { value: '1 to 2 days', label: 'turnaround on most tickets' },
  { value: '100%', label: 'white label, NDA signed upfront' },
];

export const AGENCY_PAINS = [
  {
    tag: '01',
    title: 'You say no',
    text: 'The client takes the work, and sometimes the whole account, to an agency that can do it.',
  },
  {
    tag: '02',
    title: 'You gamble on freelancers',
    text: 'Missed deadlines, broken themes, and someone who disappears mid project with your client watching.',
  },
  {
    tag: '03',
    title: 'You hire full time',
    text: 'A senior Shopify dev on payroll only works if the work is steady every single month.',
  },
];

// icon is the inner SVG markup for a 24x24 stroke icon.
export const AGENCY_SCOPE = [
  {
    icon: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
    title: 'Theme builds and custom sections',
    text: 'New themes, migrations, and custom sections your clients can edit themselves without calling you.',
  },
  {
    icon: '<path d="M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3"/>',
    title: 'Subscriptions and upsells',
    text: 'Subscription programs, bundles, and cart offers, built and styled to match the theme.',
  },
  {
    icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    title: 'Email and SMS onsite',
    text: 'Signup forms, back in stock alerts, and onsite tracking wired in properly so your flows run on clean data.',
  },
  {
    icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
    title: 'Campaign landing pages',
    text: 'Fast, on brand pages for paid and email campaigns, ready before the ads go live.',
  },
  {
    icon: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    title: 'Run the store roadmap and ship it',
    text: 'Your test ideas and audit recommendations, actually built and shipped, not stuck in a backlog.',
  },
  {
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    title: 'Speed and app cleanup',
    text: 'Slow pages, app conflicts, and technical debt untangled so campaigns convert the way they should.',
  },
];

export const AGENCY_PLANS = [
  {
    tag: 'Reserved capacity',
    name: 'Partner',
    price: 4000,
    unit: ' / month',
    summary: '32 reserved hours a month. Guaranteed capacity for agencies with steady Shopify work.',
    includes: [
      '32 hours reserved for you every month',
      'Priority queue and same day response',
      'Client facing when you need it, on calls as your team',
      'Weekly report of everything shipped',
    ],
    featured: true,
  },
];

export const AGENCY_STEPS = [
  {
    when: 'Step 1',
    title: 'Intro call',
    text: '20 minutes on your clients, your stack, and how your team likes to work. I sign your NDA and non solicit.',
  },
  {
    when: 'Step 2',
    title: 'Pick a plan',
    text: 'Reserve 32 hours a month as a Partner, or choose a white label plan for one client store. Paid upfront.',
  },
  {
    when: 'Step 3',
    title: 'Hand over the account',
    text: 'Hand me the account or the project. I take it from strategy to launch, as part of your team.',
  },
];

export const AGENCY_PROMISE = [
  'I work under your brand, in your tools and email',
  "On client calls, I'm introduced as part of your team",
  'I never contact your clients outside your channels',
  'NDA and non solicit signed before we start',
  'Your clients never appear in my portfolio',
];

// Per client plans for agencies to resell, priced per store.
export const AGENCY_CLIENT_PLANS = [
  {
    tag: 'Advice only',
    name: 'Advisor',
    price: 1000,
    unit: ' / month per store',
    summary: 'A monthly store review and ranked fix list, in your branding, so your team always knows what to ship next.',
    includes: [
      'Monthly review of conversion, product pages, cart, speed and email',
      'Ranked action plan your team can execute',
      "Delivered as your agency's work",
      'Up to 8 hours a month',
    ],
  },
  {
    tag: 'Try it first',
    name: 'Store Sprint',
    price: 1500,
    unit: ' one time per store',
    summary: 'One week. I find the changes most likely to move revenue for your client and ship them.',
    includes: [
      'Full store review',
      'Top fixes shipped, not a PDF',
      'Unbranded video walkthrough you can send as your own',
      'Credited to a monthly plan for that store within 30 days',
    ],
  },
  {
    tag: 'For the store itself',
    name: 'Operator',
    price: 3000,
    unit: ' / month per store',
    summary: "I run your client's store under your name: development, testing, email and reporting.",
    includes: [
      'Development, design, and technical health',
      'Ongoing conversion testing',
      'Klaviyo, subscriptions, and upsells',
      'Monthly report in your branding',
      'Up to 24 hours a month',
    ],
  },
  {
    tag: 'For the whole business',
    name: 'Head of Ecommerce',
    price: 5500,
    unit: ' / month per store',
    summary: 'A senior ecommerce lead for your client, working as part of your team.',
    includes: [
      'Everything in Operator',
      'Marketing, content, and campaign planning',
      'Client calls as part of your team when you need it',
      'Up to 44 hours a month',
    ],
  },
];

export const AGENCY_FAQS = [
  {
    q: 'How is this different from hiring an offshore developer?',
    a: 'An offshore developer needs a detailed spec and someone on your team to QA the work. I decide what to build, build it, and can talk to your client directly. You get senior judgment, not just hours.',
  },
  {
    q: "What's the difference between senior hours and white label plans?",
    a: 'Partner capacity covers work across any client, with 32 hours held for you every month. White label plans are for one client store at a fixed monthly price, so you can package them as your own service and set your own markup.',
  },
  {
    q: 'How fast can you start?',
    a: "Usually within a week of our call. Send your first ticket the day your plan starts, and you'll have an estimate back within one business day.",
  },
  {
    q: 'How fast do you turn work around?',
    a: 'Most tickets ship in 1 to 2 business days. Larger builds are scoped upfront with a fixed delivery date, so you can promise your client a date and hit it.',
  },
  {
    q: 'What if something takes longer than estimated?',
    a: "I flag it before I go over, never after. You approve the extra time or we adjust scope, so your client's bill never surprises anyone, including you.",
  },
  {
    q: 'Can you be client facing?',
    a: 'Yes. I join calls, present work, and lead technical conversations as part of your team, under your brand. Or I stay fully behind the scenes. You decide account by account.',
  },
  {
    q: 'Will you ever work with our clients directly?',
    a: 'No. The NDA and non solicit are signed before we start. If one of your clients ever reaches out to me on their own, I send them straight back to you.',
  },
  {
    q: 'How do I know the work will hold up?',
    a: "I've worked inside 50+ Shopify stores, from startups to ten figure brands. Every ticket ships tested on desktop and mobile, with a short video walkthrough your team can forward to the client.",
  },
  {
    q: "What's outside your scope?",
    a: 'Media buying and high volume content production stay with your team. Everything that happens on the store itself, on Shopify and Shopify Plus, from theme code to apps to performance, I handle.',
  },
  {
    q: 'Do unused hours roll over?',
    a: 'No. Partner hours reset each month, since that time is held exclusively for you.',
  },
];
