import fs from 'node:fs';
import path from 'node:path';

export const SITE_URL = 'https://www.carsoncobb.com';

// Social share images (public/og/, all 1200x627). Every page uses OG_DEFAULT unless its path is listed in
// OG_BY_PATH, so new pages and reports need nothing of their own.
export interface OgImage {
  path: string;
  alt: string;
  width: number;
  height: number;
}
export const OG_DEFAULT: OgImage = {
  path: '/og/og-home.png',
  alt: 'AI search and CRO for Shopify. More customers from AI. More sales from every visit. Carson Cobb.',
  width: 1200,
  height: 627,
};
export const OG_BY_PATH: Record<string, OgImage> = {
  '/ai-visibility-check': {
    path: '/og/og-check.png',
    alt: 'AI Visibility Check. Does ChatGPT recommend your brand? Results in about a minute.',
    width: 1200,
    height: 627,
  },
  '/results': {
    path: '/og/og-results.png',
    alt: 'Results across 50+ Shopify stores: ChatGPT mention rate 0% to 58%, conversion rate up 71%, subscription opt in 7% to 32%.',
    width: 1200,
    height: 627,
  },
  '/reports/who-chatgpt-recommends-2026': {
    path: '/og/og-who-chatgpt-recommends.png',
    alt: 'Who ChatGPT recommends in 2026. 48 buyer questions tested. 4 brands named in a typical answer.',
    width: 1200,
    height: 627,
  },
};
/** The share image for a page path, with or without a trailing slash or .html. */
export function ogImageFor(pathname: string): OgImage {
  const key = pathname.replace(/(\.html|\/)$/, '') || '/';
  return OG_BY_PATH[key] ?? OG_DEFAULT;
}
export const EMAIL = 'carson@carsoncobb.com';
export const EMAIL_URL = `mailto:${EMAIL}?subject=Shopify%20store%20inquiry`;
export const AGENCY_EMAIL_URL = `mailto:${EMAIL}?subject=Agency%20partnership`;
export const LINKEDIN_URL = 'https://www.linkedin.com/in/carsoncobb/';
// LinkedIn company page, listed in the JSON-LD sameAs.
export const LINKEDIN_COMPANY_URL: string | null = 'https://www.linkedin.com/company/carsoncobb';
// Ghost Revenue, the company Carson founded. Listed in the Person sameAs.
export const GHOST_REVENUE_URL = 'https://ghostrevenue.co';
export const GA_ID = 'G-PEDB1QHBG3';

// Gap report settings, read at build time. Each is optional: without the API URL the
// check shows a setup notice.
const env = (name: string) => ((import.meta.env as Record<string, string | undefined>)[name] ?? process.env[name] ?? '').trim();
export const CHECK_API_URL = env('CHECK_API_URL').replace(/\/$/, '');
export const TURNSTILE_SITE_KEY = env('TURNSTILE_SITE_KEY');

const publicFile = (p: string) => fs.existsSync(path.join(process.cwd(), 'public', p));

// Headshot: drop a photo at public/carson.jpg. Until then a neutral gray box is shown.
export const HEADSHOT = publicFile('carson.jpg') ? '/carson.jpg' : null;

// Every visibility button on the site goes to the AI Visibility Check.
export const CHECK_PATH = '/ai-visibility-check';

// Header nav on every page: real pages only, no same page anchors.
export const NAV_LINKS = [
  { href: '/ai-search', label: 'AI Search' },
  { href: '/shopify-conversion-optimization', label: 'CRO' },
  { href: '/results', label: 'Results' },
  { href: '/close-the-gap', label: 'Close the Gap' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/reports', label: 'Reports' },
  { href: '/guides', label: 'Guides' },
];

// Homepage

export const HOME_STATS = [
  { value: '50+', label: 'AI search projects' },
  { value: '30+', label: 'sites optimized for AI search' },
  { value: '50+', label: 'Shopify stores' },
  { value: '2.1x', label: 'average conversion lift on rebuilt pages' },
];

export const VERTICALS = ['Wellness', 'Supplements', 'Beauty', 'Skincare', 'Food and beverage'];

// One proof line under the hero buttons.
export const HERO_PROOF = ['50+ AI search projects', '30+ sites optimized for AI search', '50+ Shopify stores'];

// "What gets a product recommended": the four things AI weighs, then the sale.
export const RECOMMENDED = {
  eyebrow: 'How AI decides',
  heading: 'What gets a product recommended.',
  text: "AI recommends the brands it can read, trust and verify. That comes down to four things, and then the store has to close the sale. I work on all of it, product by product, and measure whether AI's answers change.",
  cards: [
    { title: 'Complete product data', text: 'Every product described fully and consistently, so AI never has to guess.' },
    {
      title: 'Product pages that answer buyer questions',
      text: "What it's made of, who it's for and how it compares, written so AI can quote it.",
    },
    { title: 'Crawler access', text: 'AI crawlers that can actually reach your pages.' },
    {
      title: 'Coverage in the sources AI relies on',
      text: 'Real, detailed coverage in the reviews and comparisons AI leans on for products like yours.',
    },
  ],
  wide: { title: 'Conversion: turning AI shoppers into orders', text: 'AI sends shoppers ready to buy, and your product pages decide whether they do.' },
};

export const APPROACH_FAQ = {
  q: 'What makes your approach different?',
  a: "I work product by product. For each product that matters, I find the questions its buyers actually ask, which competing products AI recommends instead and why, and what AI gets wrong about it. Then I fix the store side myself, from product data built for each product to the pages that close the sale, and measure whether AI's answers change. The store work and the conversion work are done by the same person, so the traffic AI sends actually turns into orders.",
};

// "What the gap costs you" on the homepage. A worked example, clearly labeled, then three points.
// Text is HTML: every number links to its source.
export const GAP_COST = {
  eyebrow: 'What the gap costs you',
  heading: "Your competitor is getting your AI customers. Here's roughly what that's worth.",
  example: {
    label: 'Example',
    brand: 'A brand doing $200K a month',
    lines: [
      'About 7% of shopping searches now start on ChatGPT <a href="https://ppc.land/google-still-leads-shopping-searches-as-ai-falls-short-at-7/" target="_blank" rel="noopener">(Smarty Marketing survey)</a>',
      "That's around $14,000 a month in purchases that begin with a ChatGPT question",
      'If ChatGPT recommends your competitor 8 times out of 10, most of that goes to them',
    ],
    note: 'Example only. Your gap report estimates yours.',
  },
  points: [
    {
      title: 'AI gives a short list.',
      text: 'About <a href="/reports/who-chatgpt-recommends-2026">4 brands per answer</a>. If you\'re not on it, a competitor is.',
    },
    {
      title: 'Once it picks, it keeps picking.',
      text: 'Ask the same question again and the same top pick usually comes back: <a href="/reports/who-chatgpt-recommends-2026#how-stable-are-the-picks">10 of 11 repeats</a> in my research.',
    },
    {
      title: "And it's growing.",
      text: 'Orders from AI search grew <a href="https://www.pymnts.com/earnings/2026/ai-drove-orders-shopify-up-13-times-q1" target="_blank" rel="noopener">nearly 13 times in a year</a> on Shopify, and Adobe expects AI traffic to retail sites to <a href="https://www.relevantaudience.com/ecommerce-marketing/adobe-2026-holiday-forecast-275-billion-ai-traffic-130-percent/" target="_blank" rel="noopener">grow 130% this holiday season</a>.',
    },
  ],
};

// "Close the gap, then close the sale." AI search first, CRO second.
export const ENGINES = [
  {
    tag: 'Step one',
    title: 'Close the gap.',
    text: 'I find exactly why AI recommends your competitor, product by product, on ChatGPT, Gemini and Google AI Mode. Then I fix everything you control and go after the sources AI relies on.',
    link: { href: '/close-the-gap', text: 'See the program' },
  },
  {
    tag: 'Step two',
    title: 'Close the sale.',
    text: 'A product page that confirms what AI told the shopper, so they buy. The same goes for everyone else who lands on it.',
    link: { href: '/shopify-conversion-optimization', text: 'How I approach CRO' },
  },
];
export const ENGINES_NOTE =
  'Winning the recommendation is step one. Step two is a product page that confirms what AI told the shopper, so they buy.';

// The mock ChatGPT answer in "What AI sees". Placeholder brands only.
export const CHAT_MOCK = {
  question: "What's the best natural moisturizer for sensitive skin?",
  intro: 'Here are three good options for sensitive skin:',
  picks: [
    { name: 'Brand A', text: 'Fragrance free, with ceramides and a short ingredient list.' },
    { name: 'Brand B', text: 'Lightweight, dermatologist tested and widely reviewed.' },
    { name: 'Brand C', text: 'Rich and calming, often recommended for dry, reactive skin.' },
  ],
  callout: "Is your brand on this list? Most aren't, and they don't know it.",
};

// AI search outcome cases: all three on /results, the first on the homepage proof section.
export const AI_CASES = [
  {
    tag: 'Startup brand · Wellness',
    stat: '0% → 58%',
    statLabel: 'ChatGPT mention rate for its core product against its competitive set',
    title: 'From invisible to recommended for its product.',
    before: 'A young brand with a strong product that AI had never heard of. Thin product pages, and no presence in the sources AI relies on.',
    after: 'Recommended for its core product in 58% of the questions its buyers ask within 90 days, with AI describing the product accurately.',
  },
  {
    tag: 'Billion dollar brand · Consumer health',
    stat: '31% → 74%',
    statLabel: 'mention rate on product level buyer questions',
    title: 'A household name, finally recommended for the right products.',
    before: 'AI knew the brand but recommended competitors for specific products, and described several products incorrectly because of conflicting data across the site.',
    after: 'Clean, consistent product data across thousands of products, accurate AI descriptions, and AI referral traffic up 3.4x.',
  },
  {
    tag: 'Growing brand · Skincare',
    stat: '+212%',
    statLabel: 'revenue from AI referred visitors in 4 months',
    title: 'AI shoppers became the highest value customers.',
    before: "Recommended occasionally, but the product pages didn't confirm what AI told shoppers, so the visits didn't convert.",
    after: 'AI search and conversion work together: more recommendations, and AI referred visitors converting at 2.6x the site average.',
  },
];
export const AI_CASES_NOTE =
  "Results from brands I've worked with directly and through agency partners. Names withheld under NDA. Examples, not guarantees.";

// Proof cards. The first is an AI search case; the other two are conversion results.
export const RESULTS = [
  AI_CASES[0],
  {
    tag: 'Skincare · Ongoing work',
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
];

// Homepage proof cards: two AI search cases and one conversion case. Same facts as /results.
export const HOME_RESULTS = [
  RESULTS[0],
  RESULTS[1],
  {
    tag: 'Growing brand · Skincare',
    stat: '+212%',
    statLabel: 'revenue from AI referred visitors in 4 months',
    title: 'AI shoppers became the highest value customers.',
    before: "recommended occasionally, but the product pages didn't confirm what AI told shoppers, so the visits didn't convert.",
    after: 'more recommendations, and AI referred visitors converting at 2.6x the site average.',
  },
];

export const ABOUT = {
  heading: 'Why me.',
  text: "I'm Carson. I've led AI search work for national brands in vitamins, skincare, cosmetics, food, pet and wellness, from finding the gap to closing it. Before that I spent years running conversion and testing programs, affiliate programs and full rebuilds for Shopify brands from seed stage startups to billion dollar companies. That combination is the point: I know what makes AI recommend a brand, and I know what makes the visitor buy.",
  where: 'Based in California. Working remotely with brands anywhere, in English.',
};

export const REFERRAL = {
  title: 'Know a Shopify brand that should be showing up in AI search?',
  text: 'Introduce us. When they sign, you get 10% of their first 3 months, paid once their third payment clears.',
};

// The main offer: Close the Gap, a 90 day program that continues month to month. Shown on /close-the-gap,
// /pricing, the homepage and /ai-search, and described in the structured data from the same lines.
export const PROGRAM = {
  name: 'Close the Gap',
  path: '/close-the-gap',
  promise:
    "I can't control what AI says. Nobody can. What I can do is find exactly why your competitor gets picked, fix everything you control, give your team a clear plan for everything you don't, and show you how it's moving every week.",
  summary:
    'A 90 day program: I show you where your competitors beat you in ChatGPT, Gemini and Google AI Mode, product by product, fix everything you control, go after the sources AI relies on, and report how it moves.',
  months: [
    {
      when: 'Month 1',
      title: 'Find the gap and fix what you control',
      items: [
        'A head to head against your main competitors across your top products: who gets recommended, how often, how each brand is described, and which sources drive each pick, on ChatGPT, Gemini and Google AI Mode.',
        'I implement the on site fixes myself: product data and structured data, product pages that answer the questions buyers ask AI, and comparison and FAQ content.',
        'I make sure the product pages close the sale when AI sends a shopper.',
      ],
    },
    {
      when: 'Month 2',
      title: 'Go after the sources',
      items: [
        'A ranked list of the exact sites AI cites for your products, what each is worth, and what it takes to get on it.',
        'Ready to send pitches for editorial and review sites, written by me. Your team sends them, or approves them for me to send.',
        "Paid placements come as recommendations with the reasoning. Your team decides and pays. I advise; I don't buy placements.",
      ],
    },
    {
      when: 'Month 3',
      title: 'Expand and lock it in',
      items: [
        'A full retest, then the next set of questions buyers ask about your products: by need, budget, gifting, comparisons and season.',
        "A clear picture of what moved, what didn't, and why.",
      ],
    },
  ],
  always: {
    title: 'Every report, the whole time',
    items: [
      "A competitor report: how often you're recommended against each competitor, what changed, and what I'm doing about it.",
      "Model watch: when ChatGPT, Gemini or Google AI Mode changes how it recommends products, I retest and adjust. Brands that aren't watching fall behind without knowing why.",
    ],
  },
  after:
    'After 90 days, the program continues month to month: reports, model watch, new questions and new competitors as they appear, and ongoing source work. Brands with only a few products go deeper on those products, not wider.',
  guarantee: "If I don't deliver everything listed for month 1, you don't pay for month 2.",
  guaranteeNote: "The guarantee covers the month 1 deliverables listed above, not what AI says. No one controls AI answers.",
  scope: 'Anything outside this list is quoted separately.',
  continues:
    'After the first 3 months, both continue month to month at the committed price ($2,500 or $5,000), with 30 days written notice to cancel. Larger catalogs or more competitors are quoted.',
  fit: 'For brands doing about $50K a month and up, competing with brands their own size or a few times bigger.',
  fitNote:
    'Brands whose competitors are household names on every question are slower to move, so I focus on the specific questions real shoppers ask, where a focused brand can win.',
  under: 'Brands under $50K a month should start with the Full Store Audit.',
  startSteps: [
    { title: 'Get your gap report', text: 'See how often AI recommends you against your top competitor.' },
    { title: 'Watch your gap video', text: "I'll send a short video of your full gap and what it's worth, within 1 business day." },
    { title: 'Start', text: 'Pick your size and start online. Your first report arrives within 2 weeks.' },
  ],
};

// The two sizes. monthly is the price with a 3 month commitment; upfront is 3 months paid in advance;
// flexible is the price with no commitment. The same lists show on /close-the-gap, /pricing, /ai-search and /start.
export const PROGRAM_SIZES = [
  {
    key: 'focus',
    name: 'Close the Gap: Focus',
    short: 'Focus',
    fit: 'For brands doing about $50K to $150K a month',
    brief: 'Up to 3 products against 3 competitors, with a competitor report every 2 weeks.',
    items: [
      'Up to 3 products against 3 competitors',
      'The head to head across ChatGPT, Gemini and Google AI Mode',
      "On site fixes implemented on those products' pages",
      'A ranked list of the sources AI relies on for your products',
      'Up to 5 ready to send source pitches a month',
      'A competitor report every 2 weeks',
      'Replies within 2 business days',
    ],
    monthly: 2500,
    upfront: 7000,
    flexible: 3000,
    featured: false,
  },
  {
    key: 'full',
    name: 'Close the Gap: Full',
    short: 'Full',
    fit: 'For brands doing about $150K a month and up',
    brief: 'Up to 10 products against 6 competitors, with a weekly competitor report and model watch.',
    items: [
      'Up to 10 products against 6 competitors',
      'The head to head across ChatGPT, Gemini and Google AI Mode, with new buyer questions added every month',
      'On site fixes implemented across all 10 products, plus conversion work on those product pages so the shoppers AI sends actually buy',
      'A ranked list of the sources AI relies on, with up to 15 ready to send source pitches a month and follow ups',
      'A weekly competitor report',
      'Model watch: when ChatGPT, Gemini or Google AI Mode changes how it recommends products, I retest within 3 business days and adjust',
      "A monthly recorded strategy video: what moved, what's next, and what your team should approve",
      'Same business day replies',
    ],
    monthly: 5000,
    upfront: 13500,
    flexible: 6000,
    featured: true,
  },
];

// The smaller price line under each size's headline price.
const usdPlain = (n: number) => `$${n.toLocaleString('en-US')}`;
export const sizeOtherPrices = (z: (typeof PROGRAM_SIZES)[number]) =>
  `Or ${usdPlain(z.upfront)} paid upfront for 3 months, or ${usdPlain(z.flexible)}/month with no commitment`;

// The CRO offer: one time, on /pricing and its own page at /full-store-audit.
export const FULL_AUDIT = {
  name: 'Full Store Audit',
  price: 1997,
  path: '/full-store-audit',
  covers: [
    'Every page of your store, reviewed on mobile and desktop.',
    'Your cart and checkout flow, step by step.',
    'Your email flows.',
    'Your analytics setup.',
    'Your subscription setup.',
    'How AI sees your products: whether AI can read your product pages and what they tell it.',
    "Every fix ranked by what it's worth.",
  ],
  timing: 'Delivered within 2 business days of getting store access.',
  walkthrough: 'Walked through by recorded video.',
  summary:
    "Every page on mobile and desktop, cart and checkout flow, email flows, analytics, subscription setup and how AI sees your products, with every fix ranked by what it's worth.",
  get includes(): string[] {
    return [...this.covers, this.timing, this.walkthrough];
  },
};

// What happens after paying: on /start before the payment button, and on /welcome after checkout.
export const AFTER_PAY = {
  program: [
    'Within 1 business day, I send a Shopify collaborator request and a short email asking for your top products, your main competitors, and who approves outside pitches and placements.',
    'I start the head to head right away.',
    'Your first competitor report arrives within your first 2 weeks.',
  ],
  audit: [
    'Within 1 business day, I send a Shopify collaborator request and ask for access to your email platform, analytics and subscription app.',
    'Your audit is back within 2 business days of getting access.',
    'You get a recorded video walking through every fix.',
  ],
};
export const WELCOME_STEPS = [
  { title: 'Watch your inbox', text: "I'll email you a Shopify collaborator request within 1 business day." },
  {
    title: 'Tell me about your brand',
    text: 'Reply to that email with your top products, your main competitors, and who on your team approves outside pitches and placements.',
  },
  { title: 'Your first report', text: "You'll get your first competitor report within your first 2 weeks." },
];
export const WELCOME_AUDIT_STEPS = [
  { title: 'Watch your inbox', text: AFTER_PAY.audit[0] },
  { title: 'Your audit', text: AFTER_PAY.audit[1] },
  { title: 'Your walkthrough', text: AFTER_PAY.audit[2] },
];

// The AI Visibility Check, as an offer on /pricing.
export const CHECK_OFFER = {
  name: 'Gap report',
  summary: 'See how often ChatGPT recommends you and your top competitor, in about a minute.',
  note: 'Takes about a minute, no login.',
};

// Fit and terms, shown under the pricing cards. The structured data reuses these lines.
export const TERMS = {
  bestFit: `${PROGRAM.fit} ${PROGRAM.fitNote} ${PROGRAM.under}`,
  notFit:
    'You need paid ads management, one off development tasks, a brand new store with no traffic yet, or someone who guarantees a ChatGPT ranking. Stores not on Shopify get partial service.',
  start:
    'Store collaborator access, your top products, your main competitors, and someone who can approve outside source pitches and placements.',
  who: 'You work with me directly. I do the work myself, with no handoff to a junior team or an offshore team. If something needs a specialist skill like photography, I tell you up front and either quote it or recommend someone you hire directly.',
  commitment: 'Close the Gap has a 3 month commitment, then continues month to month with 30 days written notice to cancel.',
  refunds: 'No refunds once a month has started.',
  guarantee: `${PROGRAM.guarantee} ${PROGRAM.guaranteeNote}`,
  ownership: 'You own all on site work once it is paid.',
  costs: 'App subscriptions, paid tools and any paid placements are paid by you directly, and nothing is added without your approval.',
  scope: PROGRAM.scope,
};

export const TERMS_LIST = [
  { q: 'Who is the best fit?', a: TERMS.bestFit },
  { q: "Who isn't a fit?", a: TERMS.notFit },
  { q: 'What do you need to start?', a: TERMS.start },
  { q: 'Who does the work?', a: TERMS.who },
  { q: 'How does the commitment work?', a: `${TERMS.commitment} ${PROGRAM.continues}` },
  { q: 'Do you offer refunds?', a: `${TERMS.refunds} ${TERMS.guarantee}` },
  { q: 'Who owns the work?', a: TERMS.ownership },
  { q: 'Who pays for apps, tools and placements?', a: TERMS.costs },
  { q: "What's not included?", a: TERMS.scope },
];

export const STEPS = [
  {
    when: 'Step 1',
    title: 'See the gap',
    text: 'Get your gap report: your store against your top competitor, in about a minute. Then I send you a short video of your full gap.',
  },
  {
    when: 'Step 2',
    title: 'Close the gap',
    text: 'The 90 day program: fix what you control, go after the sources AI relies on, and expand to the next questions.',
  },
  {
    when: 'Step 3',
    title: 'Watch it move',
    text: 'A competitor report every week or two, so you always know where you stand.',
  },
];

export const CTA_LABEL = 'Get your gap report';
export const HEADER_CTA_LABEL = 'Get your gap report';
// Under every Start now button.
export const GAP_FIRST_LABEL = 'Get your gap report first';

// The one answer about calls, wherever it's asked.
export const CALL_ANSWER =
  "No. You get your gap report and a recorded video walking through it, and you can start straight from there. Everything after that happens by email and recorded video, so nothing waits on finding a time on everyone's calendar. If you'd still like to talk before starting, email me.";
export const CALL_FAQ = { q: 'Do we need a call to get started?', a: CALL_ANSWER };

const WHO_FOR = `Shopify brands doing about $50K a month and up, competing with brands their own size or a few times bigger. Under $50K a month, the best next step is the Full Store Audit. It isn't a fit if you need paid ads management, one off development tasks, a brand new store with no traffic yet, or someone who guarantees a ChatGPT ranking.`;
const AFTER_90 =
  'It continues month to month at your committed price, with 30 days written notice to cancel: reports, model watch, new questions and new competitors as they appear, and ongoing source work.';
const GUARANTEE_ANSWER =
  "No one can. What I do guarantee: everything listed for month 1, or you don't pay for month 2, and honest numbers in every competitor report.";

export const FAQS: { q: string; a: string; link?: { href: string; text: string } }[] = [
  {
    q: 'What is Close the Gap?',
    a: 'A 90 day program for Shopify brands. I show you where your competitors beat you in ChatGPT, Gemini and Google AI Mode, product by product, fix everything you control, go after the sources AI relies on, and send a competitor report every week or two so you can see it move.',
  },
  { q: 'Do we need a call?', a: CALL_ANSWER },
  { q: 'Can you guarantee ChatGPT will recommend us?', a: GUARANTEE_ANSWER },
  { q: 'What happens after 90 days?', a: AFTER_90 },
  { q: 'Who is it for?', a: WHO_FOR },
  {
    q: 'How do you measure AI traffic when most of it shows up as direct?',
    a: "Analytics tools undercount AI. Clicks from Google's AI answers are counted as regular search, and many shoppers read an AI answer, then type your name or URL. So I don't rely on referral numbers alone. I track how often AI recommends your products against each competitor, question by question, and pair that with signals from your store data and from customers themselves.",
  },
  {
    q: 'Do I stay in control?',
    a: 'Always. I propose, you decide, and nothing goes live without your sign off.',
  },
  {
    q: 'Will I work with you directly?',
    a: 'Yes. You work with me directly, and I do the work myself, with no handoff to a junior team or an offshore team. We work over email and recorded video, plus Slack if your team uses it.',
  },
];

// The /close-the-gap FAQ, also in its FAQPage structured data.
export const PROGRAM_FAQS = [
  CALL_FAQ,
  {
    q: 'What does the gap report show?',
    a: "How often ChatGPT recommends you against your top competitor, for questions built from your best sellers, plus what AI says about your brand and whether it can read your store. Brands doing $50K a month or more also get a short recorded video of the full gap: your top products against your competitors, roughly what it's worth each month, and which size fits.",
  },
  {
    q: 'How do you estimate what the gap is worth?',
    a: "From your store's revenue, the share of shopping that now starts in AI, and how often each competitor gets recommended instead of you. It's always shown as an estimate, with the math.",
  },
  {
    q: "What's included in each size?",
    a: 'Focus covers up to 3 products against 3 competitors, up to 5 source pitches a month and a competitor report every 2 weeks. Full covers up to 10 products against 6 competitors, conversion work on those product pages, up to 15 source pitches a month with follow ups, a weekly competitor report, model watch and a monthly recorded strategy video.',
  },
  { q: 'What do you need from our team?', a: TERMS.start },
  { q: 'Can you guarantee ChatGPT will recommend us?', a: GUARANTEE_ANSWER },
  {
    q: 'Do we have to pay for placements?',
    a: 'Sometimes the best sources are paid. I recommend them with the reasoning, and your team decides. I advise; I never buy placements myself.',
  },
  { q: 'What happens after 90 days?', a: AFTER_90 },
];

export const PRICING_FAQS = [
  CALL_FAQ,
  {
    q: 'Where should I start?',
    a: "With your gap report. It takes about a minute, no login, and shows how often ChatGPT recommends you against your top competitor. Brands doing $50K a month or more get a short video of the full gap and the size that fits. If you'd rather have every page of your store reviewed for conversion, that's the Full Store Audit.",
  },
  {
    q: "What's the difference between Focus and Full?",
    a: 'Focus covers up to 3 products against 3 competitors, with a competitor report every 2 weeks, for brands doing about $50K to $150K a month. Full covers up to 10 products against 6 competitors, conversion work on those product pages, a weekly competitor report, model watch and a monthly strategy video, for brands doing about $150K a month and up.',
  },
  {
    q: 'How do I pay?',
    a: 'Press Start now on the size you want. You see what happens after you pay and the terms, choose a 3 month commitment, 3 months paid upfront or no commitment, and pay online. Questions first? Email me.',
  },
  {
    q: 'What does the month 1 guarantee cover?',
    a: TERMS.guarantee,
  },
  {
    q: 'Can you guarantee results?',
    a: 'No one controls AI answers. I measure how often each brand gets recommended for the questions your buyers ask, before and during the work, so you can see what moved.',
  },
  {
    q: 'How do I lock in 2026 pricing?',
    a: 'Start Close the Gap before January 1 and keep your committed monthly price for 12 months.',
  },
];

export const CHECK_FAQS = [
  {
    q: 'What happens after I submit?',
    a: "The gap report reads your store, asks ChatGPT the questions a shopper would ask about products like yours, and counts how often it recommends you and your competitor. Your results open on the page in about a minute, and a copy goes to your email. If your store does $50K a month or more, I follow up within 1 business day with a short video of your full gap and what it's worth.",
  },
  {
    q: 'Do I need a call?',
    a: 'No. You get the video by email and can start straight from it.',
  },
  {
    q: 'What do you do with my email?',
    a: 'Send your report and video. No newsletter unless you ask.',
  },
  {
    q: 'Does ChatGPT recommend my brand?',
    a: "The gap report asks questions built from your best sellers through OpenAI, using a smaller, faster OpenAI model with web search on. That shows how AI answers with live search, but it isn't the exact model a shopper gets in the ChatGPT app. Answers also vary by wording, person and day, so treat the result as a snapshot. Close the Gap tests your top products against your main competitors, question by question.",
  },
  {
    q: 'How does the gap report work?',
    a: 'It reads your store and your top products, writes the questions a shopper would ask about products like them, and asks ChatGPT each one. It counts how often those answers recommend you and how often they recommend the competitor you entered. It also asks ChatGPT what your brand sells, tests whether AI crawlers can reach your store, and reads your top product pages to see what they tell AI.',
  },
  {
    q: 'How long does it take, and how often can I run it?',
    a: 'It takes about a minute, no login. You can run 3 gap reports a day. Results for each store are saved for 7 days, so running it again shows the saved answers, counted against the competitor you enter.',
  },
  {
    q: 'Why are my results different from what I see in ChatGPT?',
    a: 'AI answers change with the exact wording, location, chat history and day. Close the Gap tests your products against the questions your buyers ask, with retests every week or two, to get a reliable picture.',
  },
  {
    q: 'Does it work for stores that are not on Shopify?',
    a: "It's built for Shopify. The product data and some page checks use Shopify's standard URLs, so other stores get partial results.",
  },
  {
    q: 'How do I improve my score?',
    a: "The three findings at the top of your report show where you're losing the most. Some gaps close quickly once they're found. Visibility takes longer, because it depends on what your store tells AI about each product and on the sources AI relies on for products like yours. Close the Gap works through all of it.",
  },
];

// Agencies page: AI search and CRO implementation partner, white label.

export const AGENCY_TICKET_STATS = [
  { label: 'Avg turnaround', value: '1.4 days' },
  { label: 'Active clients', value: '4' },
  { label: 'AI retests run', value: '3' },
];

// status: live, review, or building (sets the pill color).
export const AGENCY_TICKETS = [
  { client: 'Skincare client', title: 'Structured data rollout across the catalog', status: 'live', label: 'Live' },
  { client: 'Supplement client', title: 'AI visibility retest on top products', status: 'live', label: 'Live' },
  { client: 'Wellness client', title: 'Product page conversion test', status: 'building', label: 'Building' },
  { client: 'Food client', title: 'Conflicting product data cleaned up', status: 'review', label: 'In review' },
  { client: 'Pet client', title: 'Buyer question answers on top product pages', status: 'building', label: 'Building' },
];

export const AGENCY_STATS = [
  { value: '50+', label: 'AI search projects' },
  { value: '4,000+', label: 'products made readable to AI' },
  { value: '50+', label: 'Shopify stores' },
  { value: '100%', label: 'white label, NDA signed upfront' },
];

export const AGENCY_PAINS = [
  {
    tag: '01',
    title: 'You say no',
    text: 'A client asks why ChatGPT recommends a competitor, and nobody on your team can fix it. They take the work elsewhere.',
  },
  {
    tag: '02',
    title: 'You learn it on their account',
    text: 'Structured data, crawler access and AI visibility tracking are new to most teams. Guessing on a client store is a risk.',
  },
  {
    tag: '03',
    title: 'You hire full time',
    text: 'A senior AI search and CRO specialist on payroll only works if the work is steady every single month.',
  },
];

// icon is the inner SVG markup for a 24x24 stroke icon.
export const AGENCY_SCOPE = [
  {
    icon: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>',
    title: 'Competitor gap reports',
    text: "How often AI recommends your client against each competitor, across ChatGPT, Gemini and Google AI Mode, why the competitors win, and what to fix first, in your agency's branding.",
  },
  {
    icon: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
    title: 'Product data rollout',
    text: 'Complete, consistent product data across every product, so AI describes each one correctly.',
  },
  {
    icon: '<path d="M4 6h16M4 12h10M4 18h7"/>',
    title: 'Product pages that answer buyer questions',
    text: 'Product content written around the questions shoppers actually ask AI about each product.',
  },
  {
    icon: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    title: 'Off site AI search work',
    text: 'Earning clients real coverage in the in depth reviews, comparisons and retail listings AI relies on for their products.',
  },
  {
    icon: '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
    title: 'Conversion rebuilds and testing',
    text: 'Product pages, offers and funnels rebuilt and tested, so the traffic AI sends turns into sales.',
  },
  {
    icon: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    title: 'AI visibility tracking',
    text: 'Retests of the same buyer questions, AI referral traffic and reporting in your branding.',
  },
];

// Agency offers, white label, at the same prices brands pay.
export const AGENCY_PARTNER_INTRO =
  'Every offer, delivered under your name. Agencies pay the same prices as brands. You set your client price and keep the margin.';

export const AGENCY_PARTNER_PLANS = [
  {
    tag: '90 days, then month to month',
    name: 'Close the Gap, white label',
    price: '$2,500',
    unit: '/month',
    commit: '3 month commitment',
    other: 'Focus. Full is $5,000/month with a 3 month commitment. Both can be paid upfront or with no commitment, at the same prices brands pay.',
    summary: 'Same program, reported in your branding.',
    includes: [
      'A head to head against your client\'s main competitors across their top products',
      'On site fixes implemented, product pages that answer buyer questions',
      'Source work: the sites AI cites, ranked, with ready to send pitches',
      'Competitor reports and model watch in your branding',
    ],
    featured: true,
  },
  {
    tag: 'One time',
    name: 'Full Store Audit, white label',
    price: '$1,997',
    unit: '',
    commit: 'One time, per store',
    other: 'Delivered under your brand within 2 business days of getting store access.',
    summary: 'Every page of the store reviewed for conversion, in your branding.',
    includes: [
      'Every page on mobile and desktop',
      'Cart and checkout flow, email flows, analytics and subscription setup',
      "Every fix ranked by what it's worth",
      'Walked through by recorded video, under your brand',
    ],
    featured: false,
  },
];

export const AGENCY_STEPS = [
  {
    when: 'Step 1',
    title: 'Email me about the client',
    text: "Tell me about the client, what they're asking for in AI search or CRO, and how your team likes to work. I sign your NDA and non solicit.",
  },
  {
    when: 'Step 2',
    title: 'Pick the offer',
    text: 'Start a client on Close the Gap or the Full Store Audit, at the same prices brands pay.',
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

export const AGENCY_FAQS = [
  {
    q: 'Can you deliver AI search reporting in our branding?',
    a: 'Yes. Competitor reports, retests of the same buyer questions and Full Store Audits go out as your agency\'s work, with no mention of me.',
  },
  {
    q: 'How does agency pricing work?',
    a: 'Close the Gap and the Full Store Audit are both available white label. Agencies pay the same prices as brands. You set your client price and keep the margin.',
  },
  {
    q: 'How fast can you start?',
    a: "Usually within a week. Email me your first client, and you'll have a scope and date back within one business day.",
  },
  {
    q: 'How fast do you turn work around?',
    a: 'Most tickets ship in 1 to 2 business days. Larger projects are scoped upfront with a fixed delivery date, so you can promise your client a date and hit it.',
  },
  {
    q: 'What if the scope changes?',
    a: "I flag it before any work changes, never after. You approve a fixed quote for the extra work or we adjust scope, so your client's bill never surprises anyone, including you.",
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
    a: "I've led AI search work for national brands and worked inside 50+ Shopify stores, from startups to billion dollar brands. Every ticket ships tested on desktop and mobile, with a short video walkthrough your team can forward to the client.",
  },
  {
    q: "What's outside your scope?",
    a: 'Media buying and high volume content production stay with your team. AI search, structured data, product data and conversion work on Shopify and Shopify Plus, I handle.',
  },
];
