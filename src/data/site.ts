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
  { value: '2.1x', label: 'Avg conversion lift' },
  { value: '$40M+', label: 'In client revenue supported' },
  { value: '6+', label: 'Years' },
];

export const VERTICALS = ['Supplements', 'Beauty', 'Skincare', 'Wellness', 'Food & Beverage', 'Apparel', 'Home'];

export const DISCLAIMER =
  'Results shown are specific past client outcomes. They are examples, not a guarantee or prediction of results for any other store. Individual results vary.';

export const PLANS = [
  {
    name: 'Operator',
    price: 3000,
    bestFor: 'Brands that need their store built, fixed, and optimized continuously.',
    includes: [
      'Development, design, and technical health',
      'Ongoing conversion testing and optimization',
      'Klaviyo, subscriptions, and upsell management',
      'Analytics setup and monthly performance report',
      '1 business day response',
      'Monthly strategy call',
    ],
    featured: false,
  },
  {
    name: 'Head of Ecommerce',
    price: 5500,
    bestFor: 'Brands that want one senior lead owning the store and its growth.',
    includes: [
      'Everything in Operator',
      'Marketing, content, and social media direction',
      'Brand direction across site, email, and social',
      'Launch, promo, and campaign planning',
      'Managing your freelancers, agencies, and vendors',
      'Weekly strategy call and KPI dashboard',
      'Same day response on weekdays',
    ],
    featured: true,
  },
];

export const PLAN_TERMS =
  'Month to month after the first month. 30 days notice to cancel. Scope is set together on our first call and reviewed monthly.';

export const SPRINT = {
  price: 1500,
  duration: '1 week',
  description:
    'The fastest way to see how I work. I review your store, pick the five changes most likely to move revenue, and ship them in one week. If you start a retainer within 30 days, the full $1,500 is credited to your first month.',
  includes: [
    'Full store review',
    'Top 5 changes shipped, not just listed',
    'Loom walkthrough of everything changed',
    'Credited toward a retainer',
  ],
};

export const CASE_STUDIES = [
  {
    tag: 'Skincare · Ongoing Retainer',
    headline: 'Conversion up [71%] without spending more on ads.',
    context: '[$2M] skincare brand with one hero product and no one owning the store.',
    before:
      'A store that looked fine but leaked buyers at every step, from a buried collection page to a clunky mobile cart.',
    after:
      'A store that guides shoppers to the right product and makes checking out on a phone effortless, improving every month.',
    stats: [
      { value: '[2.1% → 3.6%]', label: 'conversion rate' },
      { value: '[+62%]', label: 'organic revenue in [6] months' },
    ],
  },
  {
    tag: 'Subscriptions · Retention',
    headline: 'Nearly [3x] more customers choosing subscribe and save.',
    context: 'Tea subscription brand with strong first orders and weak repeat revenue.',
    before:
      'Subscriptions were buried, there was no upsell path, and the subscription and upsell apps were working against each other.',
    after:
      'Subscribing is the obvious choice on every product page, and every order gets a relevant upsell before and after checkout.',
    stats: [
      { value: '[8% → 21%]', label: 'subscription opt-in' },
      { value: '[+18%]', label: 'average order value' },
    ],
  },
  {
    tag: 'Multi Store · Development',
    headline: 'Product launches went from an afternoon to [15] minutes.',
    context: 'Brand running 3 Shopify stores and hundreds of products.',
    before:
      "Specs were trapped in description text, shoppers couldn't filter or compare, and every launch meant hours of copy and paste across stores.",
    after:
      'One source of product data powers filters, comparisons, and specs across all three stores. Shoppers find what they need faster.',
    stats: [
      { value: '[+34%]', label: 'shoppers using filters' },
      { value: '[3 hrs → 15 min]', label: 'per product launch' },
    ],
  },
];

// Testimonials stay off until real quotes exist. To turn them on, fill in both quotes
// and set SHOW_TESTIMONIALS to true. Unfilled quotes never render in production.
export const SHOW_TESTIMONIALS = false;
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
  SHOW_TESTIMONIALS && (import.meta.env.DEV || [TESTIMONIAL_1, TESTIMONIAL_2].every(isFilled))
    ? [TESTIMONIAL_1, TESTIMONIAL_2]
    : [];

export const RECENT_WORK = [
  {
    result: '[Zero] downtime across [3] Black Friday seasons',
    tag: 'Supplements · Operations',
    text: 'Store fully run end to end through peak season.',
  },
  {
    result: 'Add to cart up [27%]',
    tag: 'Wellness · Conversion',
    text: 'New product page, tested head to head against the old one.',
  },
  {
    result: '[11%] of buyers taking a post-purchase offer',
    tag: 'Wellness · Subscriptions',
    text: 'One click offers added right after checkout.',
  },
  {
    result: 'Average order up [$6]',
    tag: 'Skincare · Cart',
    text: 'Rebuilt mobile cart with smart upsells.',
  },
  {
    result: 'Email flow revenue up [38%]',
    tag: 'Skincare · Email',
    text: 'Welcome, abandonment, and post-purchase flows rebuilt.',
  },
  {
    result: 'Mobile load time cut from [5.8s] to [2.4s]',
    tag: 'Beauty · Speed',
    text: 'Dead apps and slow code removed.',
  },
  {
    result: 'New category launched in [10] days',
    tag: 'Energy Drinks · Launch',
    text: 'Product and landing pages built for a product customers had never heard of.',
  },
  {
    result: '[1,200+] reviews kept through a full catalog rebuild',
    tag: 'Home Goods · Catalog',
    text: 'Separate products merged into variants with zero lost reviews or rankings.',
  },
];

export const PROBLEMS = [
  {
    title: 'A full time hire is a big bet.',
    text: "Salary, benefits, recruiting, and months of ramp time before you know if they're right.",
  },
  {
    title: "Vendors don't talk.",
    text: "Your developer doesn't know what your email person launched. Your social doesn't match your site. Nobody connects it to revenue.",
  },
  {
    title: 'You become the project manager.',
    text: 'Coordinating everyone becomes your job, instead of running the business.',
  },
];

export const CAPABILITIES = [
  {
    icon: 'code',
    title: 'Store & Development',
    items: [
      'Theme development',
      'Custom sections',
      'App setup and integrations',
      'Site speed',
      'Technical health',
      'Migrations',
    ],
  },
  {
    icon: 'layout',
    title: 'Design & UX',
    items: [
      'Product pages',
      'Landing pages',
      'Collection and cart design',
      'Mobile experience',
      'Brand consistency across the site',
    ],
  },
  {
    icon: 'trend',
    title: 'Conversion & Testing',
    items: ['A/B testing', 'Funnel analysis', 'Offer and pricing strategy', 'Checkout and cart optimization'],
  },
  {
    icon: 'mail',
    title: 'Retention & Email',
    items: [
      'Klaviyo flows and campaigns',
      'Subscriptions (Recharge)',
      'Upsells and cross-sells (Rebuy)',
      'Post-purchase',
      'Loyalty',
    ],
  },
  {
    icon: 'chart',
    title: 'Analytics & Reporting',
    items: [
      'GA4 and Shopify analytics setup',
      'KPI dashboards',
      'Monthly performance reviews',
      'Finding where revenue leaks',
    ],
  },
  {
    icon: 'megaphone',
    title: 'Marketing, Content & Brand',
    items: [
      'Social media direction',
      'Content strategy and creation',
      'Brand direction',
      'Launch and promo planning',
      'Managing freelancers and agencies',
    ],
  },
];

export const PROCESS = [
  {
    title: 'Book a call',
    text: "20 minutes. I learn the business and tell you honestly if I'm the right fit.",
  },
  {
    title: 'Sprint or straight in',
    text: 'Start with a one week Store Sprint, or go straight into a plan. Either way, week one maps where revenue is leaking and ships the first fixes.',
  },
  {
    title: 'I own it',
    text: 'From there I run the store and direct the growth: a clear plan each month, regular check ins, and reporting on the numbers that matter.',
  },
];

export const WHY_ME = [
  {
    title: 'Owner, not order taker.',
    text: "I don't wait for tickets. I find what's holding the store back and fix it.",
  },
  {
    title: 'A fraction of a full time hire.',
    text: 'Senior ecommerce leadership without the salary, benefits, recruiting, or ramp time.',
  },
  {
    title: 'You talk to the person doing the work.',
    text: "Every message comes straight to me. No account managers relaying your requests to someone you've never met.",
  },
  {
    title: 'Honest about fit.',
    text: 'Not every store is a fit. If I do not see a real opportunity to move your numbers, I will tell you early and save you the money.',
  },
];

export const FAQS = [
  {
    q: 'What does a fractional head of ecommerce do?',
    a: 'I own your Shopify store and the growth around it, the same scope as a full time ecommerce lead, on a monthly retainer. I build and optimize the store myself and direct the marketing, content, and vendors around it.',
  },
  {
    q: 'What does it cost?',
    a: "Operator is $3,000/mo and Head of Ecommerce is $5,500/mo. If you'd like to start smaller, the one week Store Sprint is $1,500 and is credited toward a retainer.",
  },
  {
    q: 'Which plan is right for me?',
    a: "If you mainly need the store built, fixed, and optimized, Operator. If you want someone owning the whole ecommerce function, including marketing direction and managing your vendors, Head of Ecommerce. I'll tell you honestly on our call.",
  },
  {
    q: 'Do you create the content and run social yourself?',
    a: 'I set the direction, plan the content, and create what fits, like site content, email, and product pages. For high volume production, such as daily social posting or photo shoots, I direct your team or freelancers so it all stays on brand and tied to revenue.',
  },
  {
    q: 'Why not just hire someone full time?',
    a: 'A full time head of ecommerce means salary, benefits, recruiting, and months of ramp time. You get the same senior leadership at a fraction of the cost, starting this week.',
  },
  {
    q: 'Do you bill hourly?',
    a: "No. Plans are flat monthly retainers. Scope is agreed on our first call and reviewed every month, so you always know what's being worked on.",
  },
  {
    q: 'How fast will I see results?',
    a: 'The first changes ship in week one. Most clients see measurable movement within the first month, and it compounds from there.',
  },
  {
    q: 'Can I cancel?',
    a: 'Yes. Month to month after the first month, with 30 days notice.',
  },
  {
    q: 'Do you work with agencies?',
    a: 'Yes, as a white label Shopify developer. See /agencies.',
    link: { href: '/agencies', text: '/agencies' },
  },
  {
    q: 'Do you guarantee results?',
    a: 'No, because every store is different. The results on this page are real examples from past clients, not promises.',
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
