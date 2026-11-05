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

// AI Visibility Check settings, read at build time. Each is optional: without the API URL the
// check shows a setup notice, and without the Stripe link the "start the full audit" button is hidden.
const env = (name: string) => ((import.meta.env as Record<string, string | undefined>)[name] ?? process.env[name] ?? '').trim();
export const CHECK_API_URL = env('CHECK_API_URL').replace(/\/$/, '');
export const TURNSTILE_SITE_KEY = env('TURNSTILE_SITE_KEY');
export const STRIPE_AUDIT_LINK = env('STRIPE_AUDIT_LINK');

const publicFile = (p: string) => fs.existsSync(path.join(process.cwd(), 'public', p));

// Headshot: drop a photo at public/carson.jpg. Until then a neutral gray box is shown.
export const HEADSHOT = publicFile('carson.jpg') ? '/carson.jpg' : null;

// Every visibility button on the site goes to the AI Visibility Check.
export const CHECK_PATH = '/ai-visibility-check';
// The calendar embed on the check page: the appointment schedule CAL_LINK redirects to.
export const CAL_EMBED =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ04rf3OyygzmK23uQhSa_1Zu4l8vWM0mABFsI-ogSp0z501m7PA8hy6abNrteRnV8ADYVEOnl9N?gv=true';

// Header nav on every page: real pages only, no same page anchors.
export const NAV_LINKS = [
  { href: '/ai-search', label: 'AI Search' },
  { href: '/shopify-conversion-optimization', label: 'CRO' },
  { href: '/results', label: 'Results' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/reports', label: 'Reports' },
  { href: '/agencies', label: 'Agencies' },
];

// Homepage

export const HOME_STATS = [
  { value: '50+', label: 'AEO audits and roadmaps' },
  { value: '30+', label: 'sites optimized for AI search' },
  { value: '50+', label: 'Shopify stores' },
  { value: '2.1x', label: 'average conversion lift on rebuilt pages' },
];

export const VERTICALS = ['Wellness', 'Supplements', 'Beauty', 'Skincare', 'Food and beverage'];

// One proof line under the hero buttons.
export const HERO_PROOF = ['50+ AEO audits', '30+ sites optimized for AI search', '50+ Shopify stores'];

// "Why schema alone won't get you recommended": the objection every key page answers.
export const SCHEMA_ALONE = {
  heading: "Why schema alone won't get you recommended.",
  text: "A developer can add structured data in an afternoon. It's one of the four things AI weighs, and on its own it rarely changes which brands get named. AI recommends the brands it can read, trust and verify: complete product data, answers to the questions shoppers actually ask, crawlers that can reach your pages, and reviews, lists and press that back you up. Then the store has to close the sale. I work on all of it, measure it against real buyer questions, and focus where you can win.",
  cards: [
    { title: 'Product data and schema', text: 'Complete attributes and structured data on every product, so AI can read what you sell without guessing.' },
    { title: 'Answer first content', text: 'Product pages and FAQs that answer the questions shoppers ask AI, in their own words.' },
    { title: 'Crawler access', text: 'AI crawlers that can actually reach your pages, past robots rules and bot protection.' },
    { title: 'Off site sources', text: 'The reviews, best of lists, press and forums AI trusts in your category, saying good things about you.' },
  ],
  wide: { title: 'Conversion: turning AI shoppers into orders', text: 'AI sends shoppers who are ready to buy. Product pages, offers and checkout decide whether they do.' },
};

export const SCHEMA_FAQ = {
  q: "Can't my developer just add schema?",
  a: "They can add markup, and you should have it. But schema is one input. What gets a brand recommended is complete product data, answers to real buyer questions, crawler access and the sources AI trusts in your category, measured against the questions your buyers ask. That's the work, and it's where most stores fall short.",
};

export const SHIFT = [
  { title: 'Shoppers ask AI instead of searching.', text: 'AI gives a short list, not ten blue links.' },
  {
    title: 'AI picks from what it can read and trust.',
    text: 'Your product data, your structured data, and what reviews, lists, press and Reddit say about you.',
  },
  {
    title: 'AI shoppers arrive ready to buy.',
    text: 'They convert far better than other traffic, if your store closes the sale.',
  },
];

export const ENGINES = [
  {
    tag: 'AI Search',
    title: 'Get recommended.',
    text: 'I make your store fully readable to AI, find the sources AI trusts in your category, and get you into them. Then I track how often AI recommends you across real buyer questions.',
    link: { href: '/ai-search', text: 'How AI search works' },
  },
  {
    tag: 'CRO',
    title: 'Get the sale.',
    text: 'I rebuild the pages, offers and funnels where shoppers drop off, so the high intent traffic AI sends you, and everyone else, turns into revenue.',
    link: { href: '/shopify-conversion-optimization', text: 'How I approach CRO' },
  },
];
export const ENGINES_NOTE =
  'Most brands get these from two different places, if they get them at all. One without the other leaves money on the table.';

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
    statLabel: 'ChatGPT mention rate across 50 buyer questions',
    title: 'From invisible to recommended for its product.',
    before: 'A young brand with a strong product that AI had never heard of. No structured data, thin product pages, and no presence in the sources AI cites.',
    after: 'Recommended for its core product in 58% of buyer questions within 90 days, with AI describing the product accurately.',
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
];

export const ABOUT = {
  heading: 'Why me.',
  text: "I'm Carson. I've led AI search work for national brands in vitamins, skincare, cosmetics, food, pet and wellness, from the audit and roadmap to the implementation. Before that I spent years running conversion and testing programs, affiliate programs and full rebuilds for Shopify brands from seed stage startups to billion dollar companies. That combination is the point: I know what makes AI recommend a brand, and I know what makes the visitor buy.",
  where: 'Based in California. Working with brands across the US.',
};

export const REFERRAL = {
  title: 'Know a Shopify brand that should be showing up in AI search?',
  text: 'Introduce us. When they sign, you get 10% of their first 3 months, paid once their third payment clears.',
};

// Pricing: start with the audit, then a fixed price Build or a retainer.
export const AUDIT = {
  tag: 'Start here',
  name: 'AI Search and Conversion Audit',
  price: 1500,
  unit: ' one time',
  includes: [
    'Delivered in 5 business days',
    'A written report: your mention rate across 50 buyer questions, who AI recommends instead and why, the sources AI cites in your category, your schema and product data gaps, crawler access, and your top conversion leaks',
    'A recorded video walkthrough, or a short call if you prefer',
    'A prioritized plan with what each fix is worth',
  ],
  summary: 'A 50 buyer question test, who AI recommends instead, the sources it cites, your top conversion leaks and a prioritized plan, in 5 business days.',
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
    'Answer first product content and FAQs for your top products',
    'AI crawler access fixed',
    'Conversion rebuild of your product page template, collection template and cart',
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
    note: null,
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
  SCHEMA_FAQ,
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
    q: 'Do you work with agencies?',
    a: 'Yes. Agencies sell AI search and CRO to their Shopify clients, and I implement it under their name. See the agencies page.',
    link: { href: '/agencies', text: 'agencies page' },
  },
];

export const PRICING_FAQS = [
  {
    q: 'Where should I start?',
    a: 'With the AI Search and Conversion Audit, $1,500. The full $1,500 is credited toward a Build started within 30 days.',
  },
  {
    q: 'How is the Build priced?',
    a: 'A fixed price by catalog size: $5,000 for up to 50 products, $7,500 for 50 to 500, and from $10,000 for 500 or more. It takes 3 to 4 weeks, and I take 3 Builds a month.',
  },
  {
    q: 'Why is there a 3 month minimum on retainers?',
    a: 'AI search and off site work take 60 to 90 days to show. The audit and Build are the low commitment ways to start.',
  },
  {
    q: 'What if I need more in a month?',
    a: 'Retainers are part time by design. We move you up a tier, or I quote the extra work as a fixed add on.',
  },
  {
    q: 'Can you guarantee results?',
    a: 'No one controls AI answers. I measure your mention rate across real buyer questions before and after the work, and track AI driven traffic and sales, so you can see what moved.',
  },
  {
    q: 'How do I lock in 2026 pricing?',
    a: "Start before January 1 and keep today's rate for 12 months.",
  },
];

export const CHECK_FAQS = [
  {
    q: 'Does ChatGPT recommend my brand?',
    a: 'This check shows whether it does for 5 realistic buyer questions in your category, using the model ChatGPT uses by default with web search on. Answers vary by wording, person and day, so treat the result as a snapshot.',
  },
  {
    q: 'How does the AI Visibility Check work?',
    a: 'It reads your homepage and top products, writes 3 buyer questions for your category, and asks ChatGPT each one. It also asks ChatGPT what your brand sells, tests whether AI crawlers can reach your store, and scans your structured data and product data.',
  },
  {
    q: 'Is the check free?',
    a: 'Yes. You can run 3 checks a day, and results for each store are saved for 7 days, so running it again shows the saved result.',
  },
  {
    q: 'Why are my results different from what I see in ChatGPT?',
    a: 'AI answers change with the exact wording, location, chat history and day. The full audit runs 50 questions built from your own customers\' language, repeatedly, to get a reliable picture.',
  },
  {
    q: 'What do you do with my email?',
    a: 'I email you your report, and I receive a copy so I can walk you through it if you book a review.',
  },
  {
    q: 'Does it work for stores that are not on Shopify?',
    a: "It's built for Shopify. The product data and some page checks use Shopify's standard URLs, so other stores get partial results.",
  },
  {
    q: 'How do I improve my score?',
    a: "The three findings at the top of your report show where you're losing the most. Some gaps close quickly once they're found. Visibility takes longer, because it depends on your product data, your content, crawler access and the sources AI cites in your category, not schema alone. The full audit maps all of it.",
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
  { client: 'Supplement client', title: 'AI visibility retest, 50 buyer questions', status: 'live', label: 'Live' },
  { client: 'Wellness client', title: 'Product page conversion test', status: 'building', label: 'Building' },
  { client: 'Food client', title: 'Duplicate review app schema removed', status: 'review', label: 'In review' },
  { client: 'Pet client', title: 'Answer first FAQs on top products', status: 'building', label: 'Building' },
];

export const AGENCY_STATS = [
  { value: '50+', label: 'AEO audits and roadmaps' },
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
    title: 'AI visibility audits',
    text: "Buyer questions run in ChatGPT, competitors and cited sources mapped, and a ranked plan, delivered as your agency's report.",
  },
  {
    icon: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
    title: 'Structured data rollout',
    text: 'Complete schema on every template, duplicate app schema removed, and the product attributes AI asks about.',
  },
  {
    icon: '<path d="M4 6h16M4 12h10M4 18h7"/>',
    title: 'Answer first content',
    text: 'Product content and FAQs written to answer the questions shoppers actually ask AI.',
  },
  {
    icon: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    title: 'Off site AI search work',
    text: 'Getting clients into the lists, reviews, articles and retail listings AI cites in their category.',
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

// Partner pricing: the three main offers, white label. Rates are shared on the intro call.
export const AGENCY_PARTNER_INTRO =
  'Agency partners get partner rates on every offer, delivered under your name. You set the client price and keep the margin. Rates are shared on the intro call.';

export const AGENCY_PARTNER_PLANS = [
  {
    tag: 'Start here',
    name: 'AI Search and Conversion Audit, white label',
    summary: "Your client's mention rate across 50 buyer questions, who AI recommends instead, the sources it cites, and their top conversion leaks.",
    includes: [
      'Delivered in 5 business days',
      "A written report in your agency's branding",
      'A prioritized plan with what each fix is worth',
      'A recorded video walkthrough, or a short call if you prefer',
    ],
    featured: true,
  },
  {
    tag: 'Fixed price, 3 to 4 weeks',
    name: 'Build, white label',
    summary: "The audit plan implemented on your client's store, under your name.",
    includes: [
      'On site AI search work across every template',
      'Answer first product content and FAQs',
      'AI crawler access fixed',
      'Conversion rebuild of the product page template, collection template and cart',
      'A retest of the same questions after 30 days',
    ],
    featured: false,
  },
  {
    tag: 'Monthly',
    name: 'Ongoing AI search and CRO, white label',
    summary: 'AI search and conversion work every month, reported in your branding.',
    includes: [
      'Monthly AI visibility retest and report',
      'Ongoing on site AI and conversion testing',
      'Off site work: lists, reviews and outreach',
      'Client calls as part of your team when you need it',
    ],
    featured: false,
  },
];

export const AGENCY_STEPS = [
  {
    when: 'Step 1',
    title: 'Intro call',
    text: "20 minutes on your clients, what they're asking for in AI search and CRO, and how your team likes to work. I sign your NDA and non solicit.",
  },
  {
    when: 'Step 2',
    title: 'Pick the offer',
    text: 'Start a client with the white label audit, then a Build or ongoing work. Partner rates, paid upfront.',
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
    q: 'How is this different from hiring a Shopify developer?',
    a: 'A developer builds what is in the spec, and can add schema. But schema is one input. I know which buyer questions matter, which sources AI trusts in a category and what makes a visitor buy, so I decide what to build, build it, and can explain it to your client.',
  },
  {
    q: 'Can you deliver AI search reporting in our branding?',
    a: 'Yes. Audits, retests of the same buyer questions and monthly reports go out as your agency\'s work, with no mention of me.',
  },
  {
    q: 'How does partner pricing work?',
    a: 'Every offer, the audit, the Build and ongoing work, is available white label at a partner rate. You set the client price and keep the margin. Rates are shared on the intro call.',
  },
  {
    q: 'How fast can you start?',
    a: "Usually within a week of our call. Send your first client the day we agree terms, and you'll have a scope and date back within one business day.",
  },
  {
    q: 'How fast do you turn work around?',
    a: 'Most tickets ship in 1 to 2 business days. Larger builds are scoped upfront with a fixed delivery date, so you can promise your client a date and hit it.',
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
