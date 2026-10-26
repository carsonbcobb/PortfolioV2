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

// Values in [brackets] are placeholders for Carson to replace with real data before launch.
// `npm run check:placeholders` fails the build while any remain in dist/.
export const STATS = [
  { value: '50+', label: 'Shopify stores' },
  { value: '[2.1x]', label: 'Average conversion lift on rebuilt PDPs' },
  { value: '[$40M+]', label: 'In client revenue supported' },
  { value: '6+', label: 'Years' },
];

export const VERTICALS = ['Supplements', 'Beauty', 'Skincare', 'Wellness', 'Food & Beverage', 'Apparel', 'Home'];

export const DISCLAIMER =
  'Results shown are specific past client outcomes. They are examples, not a guarantee or prediction of results for any other store. Individual results vary.';

export const PLANS = [
  {
    name: 'Essentials',
    price: 1500,
    tagline: 'For stores that need a reliable senior developer on call.',
    bestFor: 'stores under $1M that need a dev on call',
    includes: [
      'Up to 15 hours per month',
      'Theme, app, and bug fixes',
      'Small builds and landing pages',
      '2 business day response',
      'Monthly recap of everything shipped',
    ],
    featured: false,
  },
  {
    name: 'Operator',
    price: 2500,
    tagline: 'You hand me the store. I run it end to end.',
    bestFor: '$1M to $5M brands ready to grow',
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
    bestFor: 'brands with no in house ecommerce team',
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

export const RESULTS_NOTE = 'Client names withheld. Most of my work is under NDA or white label.';

export const CASE_STUDIES = [
  {
    tag: 'Ongoing Retainer',
    title: 'Skincare Brand, Run End to End',
    problem:
      'One hero product drove over half of revenue, the collection page buried products under an oversized banner, the mobile cart fought itself, and nobody owned the store week to week.',
    solution:
      'Took over the store on a monthly retainer. Built a dedicated hero product page, a product finder quiz, and rebuilt collection and cart layouts for mobile. Launched a content program answering the exact questions buyers ask before purchasing.',
    resultPrimary: '[2.1% → 3.6%] conversion rate',
    resultSecondary: '[62%] increase in organic revenue in [6] months',
  },
  {
    tag: 'Retention + Subscriptions',
    title: 'Tea Subscription Brand',
    problem:
      'Strong first orders, weak repeat revenue. Subscriptions were an afterthought, there was no upsell path, and Recharge and Rebuy were configured in ways that fought each other.',
    solution:
      'Rebuilt the subscription experience from product page to post-purchase. Untangled the Recharge and Rebuy setup, repositioned subscribe and save on product pages, built smart cart upsells, and launched post-purchase offers.',
    resultPrimary: 'Subscription opt-in [8% → 21%]',
    resultSecondary: '[18%] AOV increase on the same traffic',
  },
  {
    tag: 'Complex Development',
    title: 'Multi Store Catalog Rebuild',
    problem:
      "Three Shopify stores and hundreds of products, with specs trapped in description text. Shoppers couldn't filter or compare, and every launch meant hours of copy and paste.",
    solution:
      'Designed a structured product data system, one definition per category, and mapped it into templates across all three stores. Specs, comparisons, and filters now update from a single source.',
    resultPrimary: '[34%] more shoppers using filters to find products',
    resultSecondary: 'New product setup cut from [3 hours] to [15 minutes]',
  },
];

// Replace the bracketed text with real quotes. The section is hidden in production
// builds until both quotes are filled in (dev shows the placeholders).
const TESTIMONIAL_1 = {
  quote: '[Real client quote, 1 to 2 sentences, about results or reliability]',
  name: '[Founder]',
  brand: '[Skincare brand]',
};
const TESTIMONIAL_2 = {
  quote: '[Real client quote, 1 to 2 sentences, about working with Carson]',
  name: '[Head of Ecommerce]',
  brand: '[Supplement brand]',
};
const isFilled = (t: typeof TESTIMONIAL_1) => Object.values(t).every((v) => v.trim() && !v.includes('['));
export const TESTIMONIALS =
  import.meta.env.DEV || [TESTIMONIAL_1, TESTIMONIAL_2].every(isFilled) ? [TESTIMONIAL_1, TESTIMONIAL_2] : [];

export const RECENT_WORK = [
  {
    tag: 'Operations',
    title: 'Full store operations, supplement brand',
    text: 'Ran the store end to end: launches, promos, theme, apps, and order flows.',
    result: '[Zero] downtime across [3] BFCM seasons',
  },
  {
    tag: 'Conversion',
    title: 'PDP rebuild, wellness brand',
    text: 'New product page template built around education and trust, A/B tested against the original.',
    result: '[+27%] add to cart rate',
  },
  {
    tag: 'Subscriptions',
    title: 'Post-purchase offers, wellness brand',
    text: 'One click post-purchase cross-sells built in Recharge.',
    result: '[11%] take rate on offers',
  },
  {
    tag: 'Cart',
    title: 'Cart drawer rebuild, skincare brand',
    text: 'Rebuilt the mobile cart with tiered upsells and fixed conflicting discount launchers.',
    result: '[+$6] average order value',
  },
  {
    tag: 'Email',
    title: 'Klaviyo flow overhaul, skincare brand',
    text: 'Audited and rebuilt welcome, abandonment, and post-purchase flows.',
    result: '[+38%] flow revenue',
  },
  {
    tag: 'Speed',
    title: 'App cleanup and speed pass, beauty brand',
    text: 'Removed dead apps and scripts and rebuilt slow sections.',
    result: 'Mobile load time [5.8s → 2.4s]',
  },
  {
    tag: 'Launch',
    title: 'New category launch, energy drink brand',
    text: 'Product pages and landing pages for a product category customers had never heard of.',
    result: 'Launched in [10] days',
  },
  {
    tag: 'Catalog',
    title: 'Variant migration, home goods brand',
    text: 'Merged separate products into variants without losing a single review or ranking.',
    result: '[1,200+] reviews preserved',
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
    title: 'Sprint or Straight to Retainer',
    text: 'Start with a one week Store Sprint, or go straight into a plan. Either way, week one maps where revenue is leaking and ships the first fixes.',
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
    q: 'What does the retainer actually cover?',
    a: 'Everything a store needs to grow: conversion and testing, Shopify development and technical health, traffic and SEO, retention and subscriptions, and the operations underneath like settings, order flows, and email. It all moves under one plan instead of being split across separate vendors.',
  },
  {
    q: 'Which plan is right for me?',
    a: "Most growing brands start on Operator. If you mostly need fixes and small builds, Essentials covers it. If you don't have anyone in house running ecommerce, Full Ownership is built for that. On our call I'll tell you honestly which one fits.",
  },
  {
    q: "What's the Store Sprint?",
    a: "A one week, fixed price engagement. I review your store, pick the five fixes most likely to move revenue, and ship them. It's the easiest way to see how I work, and it's credited to your first month if you start a retainer within 30 days.",
  },
  {
    q: 'How fast will I see results?',
    a: 'The first fixes ship in week one. Most clients see measurable movement within the first month, and it compounds from there because every part of the store is being worked on together.',
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
    q: 'Do you work with agencies?',
    a: 'Yes, as white label dev. See /agencies.',
    link: { href: '/agencies', text: '/agencies' },
  },
  {
    q: 'Why a retainer instead of hiring specialists?',
    a: 'To properly cover a store you normally need a designer, a developer, an SEO, and a retention person. That is four or five contractors, four or five invoices, and a lot of coordination that lands on you. The retainer gives you that whole range of expertise for one flat monthly price, working together instead of in silos.',
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
