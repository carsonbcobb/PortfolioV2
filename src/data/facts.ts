// The single source of truth for who Carson is, what he sells and the numbers behind the work.
// site.ts, schema.ts, llms.txt, llms-full.txt and the page templates read from here. Markdown copy can't
// import it, so markdown repeats these lines word for word; scripts/check-terms.mjs fails the build when the
// built site carries an old variant (old prices, old role lines, retired positioning).

export const FACTS = {
  name: 'Carson Cobb',
  role: 'Independent AI search and CRO specialist for Shopify brands',
  location: {
    text: 'California, United States',
    region: 'CA',
    country: 'US',
    serves: 'Based in California. Working remotely with Shopify brands anywhere.',
  },
  experience: '6+ years of Shopify development and conversion work',
  /** Product areas, always as examples, never as a specialty. */
  categories: 'supplements, skincare, food, apparel, travel and more',
  abTesting: "I've run A/B tests for DTC brands for six years.",
  // Who does the work, per tier. Match the plan cards: Focus hands the team every fix ready to ship, Full implements.
  implementation: {
    headline: 'I do the work myself.',
    what: 'I write the structured data, edit the Shopify theme, restructure the product data and ship the fixes, with your sign off before anything goes live.',
    full: 'On Close the Gap: Full, I implement every fix in your store myself.',
    focus: 'On Focus, I write every fix, from the JSON-LD to the page copy, and hand it to your team ready to ship.',
    audit: 'The Full Store Audit is a ranked list of conversion fixes, walked through on video, for your team to ship.',
  },
  // The same, in the third person, for llms.txt and the JSON-LD.
  implementationThird: [
    'Carson does the work himself. He writes the structured data, edits the Shopify theme, restructures the product data and ships the fixes, with the client\'s sign off before anything goes live.',
    'On Close the Gap: Full, he implements every fix in the store himself.',
    'On Focus, he writes every fix, from the JSON-LD to the page copy, and hands it to the brand\'s team ready to ship.',
    'The Full Store Audit is a ranked list of conversion fixes, walked through on video, for the brand\'s team to ship.',
  ],
  offers: {
    focus: {
      name: 'Close the Gap: Focus',
      price: 2500,
      billing: 'month to month, cancel with 30 days notice',
      fit: 'For brands doing about $50K to $150K a month',
    },
    full: {
      name: 'Close the Gap: Full',
      price: 5000,
      billing: 'month to month, cancel with 30 days notice',
      fit: 'For brands doing about $150K a month and up',
    },
    audit: {
      name: 'Full Store Audit',
      price: 1997,
      billing: 'one time',
      fit: 'A one time conversion audit, not an AI search product',
    },
  },
  // The canonical stats, exactly as /results shows them. No other version anywhere.
  stats: {
    aiProjects: { value: '50+', label: 'AI search projects' },
    aiSites: { value: '30+', label: 'sites optimized for AI search' },
    products: { value: '4,000+', label: 'products restructured with machine readable attributes' },
    stores: { value: '50+', label: 'Shopify stores built, rebuilt or run' },
    revenue: { value: '$40M+', label: 'in client revenue supported' },
    lift: { value: '2.1x', label: 'average conversion lift on rebuilt pages' },
  },
  knowsAbout: [
    'AI search optimization',
    'Generative engine optimization',
    'Answer engine optimization',
    'Shopify structured data',
    'JSON-LD',
    'Conversion rate optimization',
    'A/B testing',
    'Shopify development',
    'Ecommerce subscriptions',
  ],
  profiles: {
    linkedin: 'https://www.linkedin.com/in/carsoncobb/',
    linkedinCompany: 'https://www.linkedin.com/company/carsoncobb',
    // Placeholder: paste Carson's Upwork profile URL here. Left empty, it stays out of sameAs.
    upwork: '',
    // Ghost Revenue, the company Carson founded (named on /about). Kept in sameAs for that reason.
    ghostRevenue: 'https://ghostrevenue.co',
  },
};

const s = FACTS.stats;
export const stat = (k: keyof typeof FACTS.stats) => `${s[k].value} ${s[k].label}`;

/** One sentence: who Carson is. Used in the footer, schema, llms.txt and author lines. */
export const FACTS_SENTENCE = `${FACTS.name} is an independent AI search and CRO specialist for Shopify brands, with ${FACTS.experience}.`;

/** The Person and business description in the JSON-LD and the llms.txt summary. */
export const FACTS_DESCRIPTION = `${FACTS_SENTENCE} He gets Shopify brands recommended by ChatGPT, Gemini and Google AI Mode, then makes sure the shoppers AI sends actually buy. He does the work himself: structured data, theme changes, product data and conversion work, with the client's sign off before anything goes live. ${FACTS.location.serves} He works with Shopify brands in every product category.`;

/** The implementation statement, per tier, as one paragraph. */
export const IMPLEMENTATION_TEXT = `${FACTS.implementation.headline} ${FACTS.implementation.what} ${FACTS.implementation.full} ${FACTS.implementation.focus}`;

export const IMPLEMENTATION_FAQ = {
  q: 'Do you implement the changes or just give recommendations?',
  a: `I implement them. On Close the Gap: Full, I make every change in your store myself: I write the structured data, edit the Shopify theme, restructure the product data, build the comparison and FAQ content and ship it, once your team signs off. On Focus, I do the same work up to the last step: every fix comes to your team written and ready to ship, code included, and your team puts it live. The Full Store Audit is the one offer that's a list of fixes, ranked by what each is worth and walked through on video.`,
};
