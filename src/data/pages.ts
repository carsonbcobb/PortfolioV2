// Content pages (src/content/pages/*.md) and tools: what each one is, for the JSON-LD,
// breadcrumbs, footer, sitemap and llms.txt. The page copy itself lives in the markdown.

export type PageKind = 'service' | 'industry' | 'guide' | 'report';

export interface ContentPageInfo {
  slug: string;
  kind: PageKind;
  /** Short name for breadcrumbs, the footer and llms.txt */
  label: string;
  /** One line summary for llms.txt */
  summary: string;
  /** Service and industry pages: the Service entry in the JSON-LD */
  service?: { name: string; serviceType: string; audience: string; offers?: boolean };
}

export const CONTENT_PAGES: ContentPageInfo[] = [
  {
    slug: 'ai-search',
    kind: 'service',
    label: 'AI search optimization',
    summary:
      'How AI assistants decide what to recommend, and the on site and off site work that gets a Shopify brand recommended, with how it is measured.',
    service: {
      name: 'AI search optimization for Shopify brands',
      serviceType: 'AI search optimization (AEO and GEO)',
      audience: 'Shopify brands',
      offers: true,
    },
  },
  {
    slug: 'fractional-head-of-ecommerce',
    kind: 'service',
    label: 'Fractional Head of Ecommerce',
    summary: 'What a fractional Head of Ecommerce leads, what it costs, and when it fits a growing Shopify brand.',
    service: {
      name: 'Fractional Head of Ecommerce for Shopify brands',
      serviceType: 'Fractional ecommerce management',
      audience: 'Growing Shopify brands',
    },
  },
  {
    slug: 'shopify-subscriptions',
    kind: 'service',
    label: 'Shopify subscriptions',
    summary: 'Fixing subscription offers, Recharge or Skio plans, product page widgets, cancel flows and subscriber email.',
    service: {
      name: 'Shopify subscription setup and optimization',
      serviceType: 'Shopify subscription management',
      audience: 'Shopify brands selling products customers reorder',
    },
  },
  {
    slug: 'shopify-conversion-optimization',
    kind: 'service',
    label: 'Conversion rate optimization',
    summary:
      'Conversion rate optimization built for high intent AI traffic and everyone else: product pages, cart, checkout, mobile speed and testing.',
    service: {
      name: 'Conversion rate optimization for Shopify brands',
      serviceType: 'Conversion rate optimization',
      audience: 'Shopify brands',
      offers: true,
    },
  },
  {
    slug: 'klaviyo-email-for-shopify',
    kind: 'service',
    label: 'Klaviyo email',
    summary: 'Klaviyo flows and segments for Shopify brands: welcome, cart, post purchase, subscriber and winback.',
    service: {
      name: 'Klaviyo email for Shopify brands',
      serviceType: 'Email marketing',
      audience: 'Shopify brands using Klaviyo',
    },
  },
  {
    slug: 'shopify-migration',
    kind: 'service',
    label: 'Shopify migration',
    summary: 'Moving to Shopify or rebuilding a theme without losing rankings, reviews or subscribers.',
    service: {
      name: 'Shopify migrations and theme rebuilds',
      serviceType: 'Shopify migration',
      audience: 'Brands moving to Shopify or rebuilding their theme',
    },
  },
  {
    slug: 'supplement-brands',
    kind: 'industry',
    label: 'Supplement brands',
    summary: 'Running Shopify stores for supplement and wellness brands: reorder timing, subscriptions, bundles and stock.',
    service: {
      name: 'Shopify store management for supplement brands',
      serviceType: 'Fractional ecommerce management',
      audience: 'Supplement and wellness brands on Shopify',
    },
  },
  {
    slug: 'food-beverage-brands',
    kind: 'industry',
    label: 'Food and beverage brands',
    summary: 'Running Shopify stores for coffee, tea, snack, sauce and drink brands: subscriptions, bundles and gifting.',
    service: {
      name: 'Shopify store management for food and beverage brands',
      serviceType: 'Fractional ecommerce management',
      audience: 'Food and beverage brands on Shopify',
    },
  },
  {
    slug: 'pet-brands',
    kind: 'industry',
    label: 'Pet brands',
    summary: 'Running Shopify stores for pet food, treat and supplement brands: autoship, trial packs and bundles.',
    service: {
      name: 'Shopify store management for pet brands',
      serviceType: 'Fractional ecommerce management',
      audience: 'Pet food, treat and supplement brands on Shopify',
    },
  },
  {
    slug: 'beauty-skincare-brands',
    kind: 'industry',
    label: 'Beauty and skincare brands',
    summary: 'Running Shopify stores for beauty and skincare brands: variants, routines, bundles, replenishment and reviews.',
    service: {
      name: 'Shopify store management for beauty and skincare brands',
      serviceType: 'Fractional ecommerce management',
      audience: 'Beauty and skincare brands on Shopify',
    },
  },
  {
    slug: 'agency-vs-fractional-head-of-ecommerce',
    kind: 'guide',
    label: 'Agency vs fractional lead',
    summary: 'An honest comparison of hiring an agency or a fractional Head of Ecommerce: cost, accountability and speed.',
  },
  {
    slug: 'recharge-vs-skio-vs-loop',
    kind: 'guide',
    label: 'Recharge vs Skio vs Loop',
    summary: 'Pricing, fees, features and migration support for the three main Shopify subscription apps.',
  },
  {
    slug: 'state-of-shopify-subscriptions-2026',
    kind: 'report',
    label: 'State of Shopify Subscriptions 2026',
    summary: 'Data from 606 Shopify stores and 121,519 products on subscriptions, sold out best sellers, gifting and bundles.',
  },
];

export interface ToolInfo {
  slug: string;
  name: string;
  title: string;
  description: string;
  /** One line for the /tools index, the footer and llms.txt */
  summary: string;
}

export const TOOLS: ToolInfo[] = [
  {
    slug: 'store-check',
    name: 'Shopify store check',
    title: 'Shopify Store Check: Find Revenue Leaks | Carson Cobb',
    description:
      'Check any Shopify store for missing subscriptions, sold out best sellers, gifting and bundles using its public product data. Takes about 20 seconds.',
    summary: 'Enter any Shopify store and see where it may be leaking revenue.',
  },
  {
    slug: 'subscription-calculator',
    name: 'Subscription revenue calculator',
    title: 'Subscription Revenue Calculator for Shopify | Carson Cobb',
    description:
      'See what subscribe and save could add to your Shopify store. Put in your orders, order value and discount to estimate extra monthly and yearly revenue.',
    summary: 'Estimate what a subscribe and save offer could add each month and in year one.',
  },
  {
    slug: 'free-shipping-calculator',
    name: 'Free shipping threshold calculator',
    title: 'Free Shipping Threshold Calculator | Carson Cobb',
    description:
      'Find the right free shipping threshold for your Shopify store from your order value, best seller price, add ons, shipping cost and margin.',
    summary: 'Find where to set your free shipping line so carts grow without losing margin.',
  },
];

export const toolBySlug = (slug: string) => {
  const t = TOOLS.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown tool: ${slug}`);
  return t;
};

export const pageBySlug = (slug: string) => {
  const p = CONTENT_PAGES.find((x) => x.slug === slug);
  if (!p) throw new Error(`No entry in CONTENT_PAGES for ${slug}`);
  return p;
};
