// Content pages (src/content/pages/*.md) and tools: what each one is, for the JSON-LD,
// breadcrumbs, footer, sitemap and llms.txt. The page copy itself lives in the markdown.

import type { PlanKey } from './schema';

export type PageKind = 'service' | 'industry' | 'guide' | 'report';

export interface ContentPageInfo {
  slug: string;
  kind: PageKind;
  /** Short name for breadcrumbs, the footer and llms.txt */
  label: string;
  /** One line summary for llms.txt */
  summary: string;
  /** Service and industry pages: the Service entry in the JSON-LD */
  service?: { name: string; serviceType: string; audience: string; offers?: boolean | 'only'; plans?: PlanKey[] };
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
      plans: ['full'],
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
      plans: ['full'],
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
    summary: 'Getting supplements recommended by ChatGPT, Gemini and Google AI Mode, then turning that traffic into orders.',
    service: {
      name: 'AI search and CRO for supplement brands',
      serviceType: 'AI search and conversion optimization',
      audience: 'Supplement brands on Shopify',
      offers: 'only',
    },
  },
  {
    slug: 'food-beverage-brands',
    kind: 'industry',
    label: 'Food and beverage brands',
    summary: 'Getting food and drinks recommended by ChatGPT, Gemini and Google AI Mode, then turning that traffic into orders.',
    service: {
      name: 'AI search and CRO for food and beverage brands',
      serviceType: 'AI search and conversion optimization',
      audience: 'Food and beverage brands on Shopify',
      offers: 'only',
    },
  },
  {
    slug: 'pet-brands',
    kind: 'industry',
    label: 'Pet brands',
    summary: 'Getting pet products recommended by ChatGPT, Gemini and Google AI Mode, then turning that traffic into orders.',
    service: {
      name: 'AI search and CRO for pet brands',
      serviceType: 'AI search and conversion optimization',
      audience: 'Pet brands on Shopify',
      offers: 'only',
    },
  },
  {
    slug: 'beauty-skincare-brands',
    kind: 'industry',
    label: 'Beauty and skincare brands',
    summary: 'Getting beauty and skincare products recommended by ChatGPT, Gemini and Google AI Mode, then turning that traffic into orders.',
    service: {
      name: 'AI search and CRO for beauty and skincare brands',
      serviceType: 'AI search and conversion optimization',
      audience: 'Beauty and skincare brands on Shopify',
      offers: 'only',
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
