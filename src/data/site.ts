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

// Headshot: drop a photo at public/carson.jpg. Until then an initials avatar is shown.
export const HEADSHOT = publicFile('carson.jpg') ? '/carson.jpg' : null;

// Approved client logos live in public/logos (ideally .webp, 80px tall). Only logos whose file exists are rendered,
// and the whole "Trusted by" row is hidden if none exist.
const LOGO_CANDIDATES = [
  { name: 'GEM', file: 'gem.webp', width: 181, height: 80 },
  { name: 'Organifi', file: 'organifi.png', width: 0, height: 0 },
  { name: "Charlotte's Web", file: 'charlottes-web.png', width: 0, height: 0 },
];
export const LOGOS = LOGO_CANDIDATES.filter((l) => publicFile(`logos/${l.file}`));

export const STATS = [
  { value: '1.9%→4.8%', label: 'Conversion Rate Lift' },
  { value: '131%', label: 'Client Revenue Increase' },
  { value: '3.4x', label: 'Organic Traffic Growth' },
];

export const DISCLAIMER =
  'Results shown are specific past client outcomes. They are examples, not a guarantee or prediction of results for any other store. Individual results vary.';

export const PLANS = [
  {
    name: 'Essentials',
    price: 1500,
    tagline: 'For stores that need a reliable senior developer on call.',
    includes: ['Up to 15 hours per month', 'Theme and app fixes, small builds', '2 business day response', 'Monthly recap'],
    featured: false,
  },
  {
    name: 'Operator',
    price: 2500,
    tagline: 'You hand me the store. I run it end to end.',
    includes: [
      'Up to 25 hours per month',
      'Ongoing CRO and A/B testing',
      'Development and technical health',
      'Retention, subscriptions, and Klaviyo flows (Recharge, Rebuy)',
      'Store operations and order flows',
      '1 business day response',
      'Monthly roadmap call',
    ],
    featured: true,
  },
  {
    name: 'Full Ownership',
    price: 4500,
    tagline: 'For brands that want the whole store off their plate.',
    includes: [
      'Up to 45 hours per month',
      'Everything in Operator',
      'Same day response on weekdays',
      'Weekly check in',
      'Priority queue',
    ],
    featured: false,
  },
];

export const PLAN_TERMS =
  'Month to month after the first month. 30 days notice to cancel. Unused hours do not roll over. Additional hours $110/hr.';

export const SPRINT = {
  price: 1500,
  duration: '1 week',
  description:
    'Not a PDF of recommendations. I review your store, pick the five fixes most likely to move revenue, and ship them in one week. If you start a retainer within 30 days, the sprint is credited to your first month.',
  includes: [
    'Conversion and technical review',
    'Top 5 fixes shipped, not just listed',
    'Loom walkthrough of everything changed',
    'Credited toward a retainer',
  ],
};

export const CASE_STUDIES = [
  {
    tag: 'Conversion',
    title: 'DTC Health & Wellness Brand',
    problem:
      'Converting at 2.4%. Product pages were not educating new visitors, trust elements were missing or in the wrong places, and the mobile experience was dragging down 70%+ of their traffic.',
    solution:
      'Took over the store end to end. Rebuilt product page structure, moved social proof above the fold, restructured the mobile experience, and fixed technical performance issues.',
    resultPrimary: '2.4% → 6.7% CVR',
    resultSecondary: '179% revenue increase from the same traffic',
  },
  {
    tag: 'Technical SEO + Traffic',
    title: 'DTC Supplement Brand',
    problem: 'Thin technical SEO, missing structured data, and slow pages were costing the store organic rankings.',
    solution:
      'Rebuilt the technical SEO foundation, implemented product structured data, and fixed site speed across the store.',
    resultPrimary: '68% increase in organic traffic',
    resultSecondary: 'Over 6 months',
  },
  {
    tag: 'Retention + Ongoing Retainer',
    title: 'E-Commerce Subscription Brand',
    problem:
      'Strong first orders but weak repeat revenue. Low subscription opt-in, no upsell path, and email flows that were not converting repeat buyers.',
    solution:
      'Ongoing retainer running the full store. Rebuilt subscription and upsell flows, restructured post-purchase email, and continuously tested across the funnel month over month.',
    resultPrimary: 'Subscription opt-in 8% → 21%',
    resultSecondary: '18% AOV increase and steady month over month revenue growth on the same ad spend',
  },
];

// Fill these in when Carson supplies them. Unfilled testimonials show as
// placeholders in `npm run dev` and are left out of production builds.
const TESTIMONIAL_1 = { quote: '', name: '', title: '', brand: '' };
const TESTIMONIAL_2 = { quote: '', name: '', title: '', brand: '' };
export const TESTIMONIALS = [TESTIMONIAL_1, TESTIMONIAL_2]
  .map((t, i) =>
    t.quote
      ? t
      : import.meta.env.DEV
        ? { quote: `TESTIMONIAL_${i + 1}`, name: 'Name', title: 'Title', brand: 'Brand' }
        : null,
  )
  .filter((t): t is NonNullable<typeof t> => t !== null);

export const OUTCOMES = [
  {
    title: 'Conversion',
    outcome:
      'Turning the traffic you already have into more buyers. Rebuilt product pages, checkout, and mobile experience.',
    metric: '1.9% to 4.8% conversion rate',
  },
  {
    title: 'Development',
    outcome:
      'Custom sections, app integrations, Recharge and Rebuy builds, and the technical work most stores have been putting off.',
    metric: null,
  },
  {
    title: 'Traffic',
    outcome:
      'Growing qualified visits through SEO and technical health, so acquisition is not fully dependent on paid ads.',
    metric: '68% increase in organic traffic in 6 months',
  },
  {
    title: 'Retention & Subscriptions',
    outcome:
      'Keeping customers buying after the first order with subscription flows, upsells, and email that actually converts.',
    metric: 'Subscription opt-in from 8% to 21%, 18% AOV lift',
  },
  {
    title: 'Growth',
    outcome: 'Every layer working together compounds. Steady month over month improvement instead of one-off fixes.',
    metric: '40%+ revenue lift over 6 months on the same ad spend',
  },
];

export const PROBLEMS = [
  {
    title: 'Four Or Five Line Items',
    text: 'Each specialty is its own hire and its own invoice. The total to properly cover a store runs well past a single monthly retainer.',
  },
  {
    title: "Skills That Don't Talk",
    text: 'Your SEO does not know what your dev changed. Your designer does not know what converts. Disconnected experts produce a disconnected store.',
  },
  {
    title: 'You Manage It All',
    text: 'Coordinating four vendors becomes your job. You end up project managing instead of running your business.',
  },
];

export const PROCESS = [
  {
    title: 'Book A Call',
    text: "20 minutes. I learn the business and tell you honestly if I'm the right fit.",
  },
  {
    title: 'Sprint Or Straight To Retainer',
    text: 'Start with a one week Store Sprint, or go straight into a plan. Either way, the first week maps where revenue is leaking and ships the first fixes.',
  },
  {
    title: 'Ongoing',
    text: 'A monthly queue, a monthly recap, and steady improvement across conversion, development, retention, and operations.',
  },
];

export const WHY_ME = [
  {
    title: 'Depth in every part of the store.',
    text: 'Conversion, development, retention, and operations. Real skill in each, not a generalist who is shallow everywhere. That combination is rare and it is what a store actually needs.',
  },
  {
    title: 'One price instead of four invoices.',
    text: 'Hiring each of these skills separately means four or five contractors and four or five bills. You get the same range for one flat monthly retainer.',
  },
  {
    title: 'Nothing falls through the gaps.',
    text: 'When one specialist covers the whole store, the SEO work and the dev work and the conversion work actually line up. No disconnected vendors producing a disconnected store.',
  },
  {
    title: 'I will tell you if I cannot help.',
    text: 'Not every store is a fit. If I do not see a real opportunity to move your numbers, I will tell you early and save you the money.',
  },
];

export const FAQS = [
  {
    q: 'How does this work and what does it cost?',
    a: 'There are three flat monthly plans. Essentials is $1,500/mo for up to 15 hours of senior development. Operator is $2,500/mo for up to 25 hours, where I run the store end to end. Full Ownership is $4,500/mo for up to 45 hours with a priority queue and weekly check ins. If you want to start smaller, the Store Sprint is $1,500 fixed: one week, five fixes shipped, and credited to your first month if you start a retainer within 30 days. Book a call and I will tell you which fits your situation.',
  },
  {
    q: 'Why a retainer instead of hiring specialists as I need them?',
    a: 'To properly cover a store you normally need a designer, a developer, an SEO, and a retention person. That is four or five contractors, four or five invoices, and a lot of coordination that lands on you. The retainer gives you that whole range of expertise for one flat monthly price, working together instead of in silos.',
  },
  {
    q: 'What does the retainer actually cover?',
    a: 'Everything a store needs to grow: conversion and testing, Shopify development and technical health, traffic and SEO, retention and subscriptions, and the operations underneath like settings, order flows, and email. It all moves under one plan instead of being split across separate vendors.',
  },
  {
    q: 'Do unused hours roll over?',
    a: 'No. The plan reserves my time for you each month.',
  },
  {
    q: 'What if I need more hours?',
    a: 'Additional hours are $110/hr, or move up a plan anytime.',
  },
  {
    q: 'Can I cancel?',
    a: 'Yes. Month to month after the first month, with 30 days notice.',
  },
  {
    q: 'How fast will I see results?',
    a: 'Whether you start with a Store Sprint or go straight into a plan, the first week maps where revenue is leaking and ships the first fixes. From there, most clients see measurable improvement within the first several weeks, and it compounds month over month because every part of the store is finally being worked on together.',
  },
  {
    q: 'Do you work with agencies?',
    a: 'Yes, as white label dev. See /agencies.',
    link: { href: '/agencies', text: '/agencies' },
  },
  {
    q: 'Do you guarantee specific results?',
    a: 'No, because every store is different. What I can share is the range of results I have driven for past clients across conversion, traffic, and retention. Those are examples of what has happened, not a promise of what any specific store will do.',
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
