// JSON-LD for every page: one entity graph (Person, Organization, WebSite) shared site wide, plus each
// page's own nodes. Prices come from the same plan data the pricing cards render, so a price change in
// site.ts updates the cards and the schema together.
import {
  SITE_URL,
  ogImageFor,
  EMAIL,
  CAL_LINK,
  LINKEDIN_URL,
  LINKEDIN_COMPANY_URL,
  HEADSHOT,
  AUDIT,
  BUILD,
  RETAINERS,
  RETAINER_ROWS,
  TERMS,
  DEVELOPERS_NOTE,
  RETAINER_AUDIT_NOTE,
  AI_CASES,
  CHECK_PATH,
  AGENCY_PARTNER_PLANS,
  AGENCY_PARTNER_INTRO,
  AGENCY_FAQS,
} from './site';

const HOME = `${SITE_URL}/`;
const AGENCIES = `${SITE_URL}/agencies`;
const ref = (id: string) => ({ '@id': id });

const ID = {
  carson: `${SITE_URL}/#carson`,
  business: `${SITE_URL}/#business`,
  contact: `${SITE_URL}/#contact`,
  website: `${SITE_URL}/#website`,
  homePage: `${SITE_URL}/#webpage`,
  brandService: `${SITE_URL}/#brand-service`,
  homeFaq: `${SITE_URL}/#faq`,
  pricingService: `${SITE_URL}/pricing#service`,
  pricingCatalog: `${SITE_URL}/pricing#offers`,
  agencyPage: `${AGENCIES}#webpage`,
  agencyBreadcrumb: `${AGENCIES}#agency-breadcrumb`,
  agencyService: `${AGENCIES}#agency-service`,
  agencyPartner: `${AGENCIES}#agency-partner-pricing`,
  agencyFaq: `${AGENCIES}#faq`,
};

// Research data (Dataset spatialCoverage) is US stores; the services are offered anywhere.
const US = { '@type': 'Country', name: 'United States' };
const WORLD = 'Worldwide';
// Omits sameAs entirely when none of the profile URLs are set.
const sameAs = (...urls: (string | null)[]) => {
  const list = urls.filter(Boolean);
  return list.length ? { sameAs: list } : {};
};

// Shared entities, identical on both pages.

const person = {
  '@type': 'Person',
  '@id': ID.carson,
  name: 'Carson Cobb',
  url: HOME,
  image: new URL(HEADSHOT ?? '/logo.png', SITE_URL).href,
  jobTitle: 'AI Search and CRO Specialist for Shopify Brands',
  description:
    "AI search and CRO specialist for Shopify brands. I get products recommended in ChatGPT and Google's AI answers, then make sure the store turns that traffic into sales. 50+ AI search audits, 30+ sites optimized for AI search and 50+ Shopify stores, from startups to billion dollar brands.",
  email: EMAIL,
  ...sameAs(LINKEDIN_URL, LINKEDIN_COMPANY_URL),
  knowsLanguage: 'en',
  hasOccupation: {
    '@type': 'Occupation',
    name: 'AI search and conversion optimization specialist for Shopify brands',
  },
  knowsAbout: [
    'AI search optimization',
    'Generative engine optimization',
    'Answer engine optimization',
    'Shopify',
    'Shopify Plus',
    'Conversion rate optimization',
    'A/B testing',
    'Structured data',
    'Schema.org',
    'Product data',
    'Ecommerce analytics',
    'Klaviyo',
    'Shopify subscriptions',
    'Recharge',
    'Skio',
  ],
  worksFor: ref(ID.business),
  contactPoint: ref(ID.contact),
};

const business = {
  '@type': 'Organization',
  '@id': ID.business,
  name: 'Carson Cobb',
  url: HOME,
  logo: `${SITE_URL}/logo.png`,
  description:
    'AI search and conversion rate optimization for Shopify brands: getting products recommended in ChatGPT and Google AI answers, structured data, and store conversion work, from audit to ongoing growth.',
  knowsAbout: [
    'AI search',
    'Answer engine optimization (AEO)',
    'Generative engine optimization (GEO)',
    'Structured data',
    'Conversion rate optimization',
    'A/B testing',
    'Shopify',
  ],
  founder: ref(ID.carson),
  ...sameAs(LINKEDIN_COMPANY_URL),
  areaServed: WORLD,
  contactPoint: ref(ID.contact),
};

const contact = {
  '@type': 'ContactPoint',
  '@id': ID.contact,
  contactType: 'sales',
  email: EMAIL,
  url: CAL_LINK,
  availableLanguage: 'English',
  hoursAvailable: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => `https://schema.org/${d}`),
    description: 'US Pacific business hours',
  },
};

const website = {
  '@type': 'WebSite',
  '@id': ID.website,
  name: 'Carson Cobb',
  url: HOME,
  publisher: ref(ID.business),
  inLanguage: 'en-US',
};

// Offers

type Unit = 'month' | 'once';

const UNITS: Record<Unit, { referenceQuantity: object; unitText: string }> = {
  month: { referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' }, unitText: 'per month' },
  once: { referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: 'one time' }, unitText: 'one time' },
};

const offer = (o: { id: string; name: string; description: string; url: string; service: string; price: number; unit: Unit; from?: boolean }) => ({
  '@type': 'Offer',
  '@id': o.id,
  name: o.name,
  description: o.description,
  url: o.url,
  itemOffered: ref(o.service),
  seller: ref(ID.business),
  price: o.price,
  priceCurrency: 'USD',
  priceSpecification: {
    '@type': 'UnitPriceSpecification',
    ...(o.from ? { minPrice: o.price } : { price: o.price }),
    priceCurrency: 'USD',
    ...UNITS[o.unit],
  },
  eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
  availability: 'https://schema.org/InStock',
});

const faqPage = (id: string, page: string, faqs: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  '@id': id,
  isPartOf: ref(page),
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

const PRICING_URL = `${SITE_URL}/pricing`;

// One Service per offer on /pricing, with stable ids. Every description is built from the same lines the
// pricing cards and the Fit and terms section render, so the schema never says more than the page.
const PLAN = {
  audit: `${SITE_URL}/#service-audit`,
  build: `${SITE_URL}/#service-build`,
  core: `${SITE_URL}/#service-core`,
  growth: `${SITE_URL}/#service-growth`,
  full: `${SITE_URL}/#service-full`,
};
export type PlanKey = keyof typeof PLAN;

const english = { '@type': 'Language', name: 'English', alternateName: 'en' };
const channel = (processingTime?: string) => ({
  '@type': 'ServiceChannel',
  name: 'Email and video calls',
  serviceUrl: CAL_LINK,
  availableLanguage: english,
  ...(processingTime ? { processingTime } : {}),
});
const audience = (description: string) => ({ '@type': 'BusinessAudience', audienceType: 'Shopify brands', description });
const output = (name: string, description: string) => ({ '@type': 'Thing', name, description });
const sentenceList = (xs: string[]) => xs.map((x) => (/[.!?]$/.test(x) ? x : `${x}.`)).join(' ');
const FIT_LINE = TERMS.bestFit.split('. Signs')[0] + '.';

const retainer = (name: string) => {
  const i = RETAINERS.findIndex((r) => r.name === name);
  const r = RETAINERS[i];
  // The card's "Best for ..." line, as the audience description.
  const best = (r.note ?? '').match(/^Best for (.+?\.)( |$)/)?.[1] ?? '';
  return {
    r,
    capacity: RETAINER_ROWS.find((row) => row.label === 'Capacity')!.values[i],
    bestFor: best.charAt(0).toUpperCase() + best.slice(1),
  };
};

const monthly = (o: { id: string; name: string; service: string; price: number; description: string }) => ({
  '@type': 'Offer',
  '@id': o.id,
  name: o.name,
  description: o.description,
  url: PRICING_URL,
  itemOffered: ref(o.service),
  seller: ref(ID.business),
  price: o.price,
  priceCurrency: 'USD',
  priceSpecification: {
    '@type': 'UnitPriceSpecification',
    price: o.price,
    priceCurrency: 'USD',
    unitText: 'MONTH',
    billingDuration: 'P3M',
  },
  eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
  availability: 'https://schema.org/InStock',
});

const planServices: Record<PlanKey, () => object> = {
  audit: () => ({
    '@type': 'Service',
    '@id': PLAN.audit,
    name: AUDIT.name,
    serviceType: 'AI search and conversion audit',
    // Same words as the "Where should I start?" answer on /pricing.
    description: `${AUDIT.summary} Start with it before any implementation, or whenever you want an outside view of where you stand. The audit is the diagnosis and the plan; implementation is the Build or a retainer.`,
    url: `${PRICING_URL}#audit`,
    provider: ref(ID.carson),
    areaServed: WORLD,
    audience: audience(FIT_LINE),
    availableChannel: channel('P5D'),
    serviceOutput: output('Written report and prioritized plan', sentenceList(AUDIT.includes)),
    offers: offer({
      id: `${PRICING_URL}#offer-audit`,
      name: AUDIT.name,
      description: `${AUDIT.note} ${TERMS.ownership} The audit needs view access only.`,
      url: PRICING_URL,
      service: PLAN.audit,
      price: AUDIT.price,
      unit: 'once',
    }),
  }),
  build: () => ({
    '@type': 'Service',
    '@id': PLAN.build,
    name: BUILD.name,
    serviceType: 'AI search and conversion implementation',
    description: `A fixed price implementation of the audit plan, ${BUILD.tag.toLowerCase().replace('fixed price, ', '')}. ${TERMS.buildScope}`,
    url: `${PRICING_URL}#build`,
    provider: ref(ID.carson),
    areaServed: WORLD,
    audience: audience(FIT_LINE),
    availableChannel: channel('P4W'),
    serviceOutput: output('On site AI search and conversion work', sentenceList(BUILD.includes)),
    offers: BUILD.tiers.map((t) => ({
      ...offer({
        id: `${PRICING_URL}#offer-build-${t.min}`,
        name: `${BUILD.name}, ${t.label}`,
        description: `${t.label}. ${BUILD.counts} Fixed price, 3 to 4 weeks. ${TERMS.timing} ${TERMS.approvals} ${TERMS.support} ${TERMS.ownership} ${TERMS.costs}`,
        url: PRICING_URL,
        service: PLAN.build,
        price: t.price,
        unit: 'once',
        from: t.from,
      }),
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        minValue: t.min,
        ...(t.max !== null ? { maxValue: t.max } : {}),
        unitText: 'active products',
      },
    })),
  }),
  core: () => {
    const { r, capacity, bestFor } = retainer('Core');
    return {
      '@type': 'Service',
      '@id': PLAN.core,
      name: `${r.name} retainer`,
      serviceType: 'Ongoing AI search measurement and optimization',
      description: `${r.summary} ${capacity}. ${DEVELOPERS_NOTE}`,
      url: `${PRICING_URL}#retainers`,
      provider: ref(ID.carson),
      areaServed: WORLD,
      audience: audience(bestFor),
      availableChannel: channel(),
      serviceOutput: output('Monthly AI search report, on site work and consistent listings', sentenceList(r.includes)),
      offers: monthly({
        id: `${PRICING_URL}#offer-retainer-core`,
        name: `${r.name} retainer`,
        service: PLAN.core,
        price: r.price as number,
        description: `${capacity}, 3 month minimum. ${RETAINER_AUDIT_NOTE} ${TERMS.hours} ${TERMS.cancel} ${TERMS.ownership} ${TERMS.costs}`,
      }),
    };
  },
  growth: () => {
    const { r, capacity, bestFor } = retainer('Growth');
    return {
      '@type': 'Service',
      '@id': PLAN.growth,
      name: `${r.name} retainer`,
      serviceType: 'Ongoing AI search and conversion optimization',
      description: `${r.summary} ${capacity}. ${r.note}`,
      url: `${PRICING_URL}#retainers`,
      provider: ref(ID.carson),
      areaServed: WORLD,
      audience: audience(bestFor),
      availableChannel: channel(),
      serviceOutput: output('Monthly report, outside coverage and conversion testing', sentenceList(r.includes)),
      offers: monthly({
        id: `${PRICING_URL}#offer-retainer-growth`,
        name: `${r.name} retainer`,
        service: PLAN.growth,
        price: r.price as number,
        description: `${capacity}, 3 month minimum. ${RETAINER_AUDIT_NOTE} ${TERMS.hours} ${TERMS.cancel} ${TERMS.ownership} ${TERMS.costs}`,
      }),
    };
  },
  full: () => {
    const { r, capacity, bestFor } = retainer('Full');
    return {
      '@type': 'Service',
      '@id': PLAN.full,
      name: `${r.name} retainer`,
      serviceType: 'Fractional ecommerce management',
      description: `${r.summary} ${capacity}. ${TERMS.who.split('. ').slice(2).join('. ')}`,
      url: `${PRICING_URL}#retainers`,
      provider: ref(ID.carson),
      areaServed: WORLD,
      audience: audience(bestFor),
      availableChannel: channel(),
      serviceOutput: output('The ecommerce channel run day to day', sentenceList(r.includes)),
      offers: monthly({
        id: `${PRICING_URL}#offer-retainer-full`,
        name: `${r.name} retainer`,
        service: PLAN.full,
        price: r.price as number,
        description: `${capacity}, 3 month minimum. ${RETAINER_AUDIT_NOTE} ${TERMS.hours} ${TERMS.cancel} ${TERMS.ownership} ${TERMS.costs}`,
      }),
    };
  },
};

export const planNodes = (keys: PlanKey[] = ['audit', 'build', 'core', 'growth', 'full']) => keys.map((k) => planServices[k]());

// The three starting prices shown on the homepage and service pages: audit, Build from, retainers from.
const summaryOffers = (base: string, service: string) => {
  const lowest = (xs: number[]) => Math.min(...xs);
  const o = (slug: string, name: string, description: string, price: number, unit: Unit, from: boolean) =>
    offer({ id: `${base}#offer-${slug}`, name, description, url: PRICING_URL, service, price, unit, from });
  return [
    o('audit', AUDIT.name, `${AUDIT.summary} ${AUDIT.note}`, AUDIT.price, 'once', false),
    o('build', BUILD.name, 'Fixed price, 3 to 4 weeks, priced by catalog size.', lowest(BUILD.tiers.map((t) => t.price)), 'once', true),
    o(
      'retainers',
      'Retainers',
      'Ongoing AI search and conversion work. 3 month minimum.',
      lowest(RETAINERS.filter((r) => r.price !== null).map((r) => r.price as number)),
      'month',
      true,
    ),
  ];
};

const BRAND_AUDIENCE = audience(FIT_LINE);

const CHECK_CHANNEL = { '@type': 'ServiceChannel', serviceUrl: `${SITE_URL}${CHECK_PATH}`, name: 'AI Visibility Check', availableLanguage: english };

// The AI search and CRO services: what the work produces, in the page's own words.
const BRAND_OUTPUT = output(
  'Audit, plan and implementation',
  'An AI search and conversion audit with a prioritized plan, then a fixed price Build or a retainer that implements it, measured on the same buyer questions before and after.',
);

export function homeSchema(meta: { title: string; description: string; faqs: { q: string; a: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      business,
      contact,
      website,
      {
        '@type': 'WebPage',
        '@id': ID.homePage,
        url: HOME,
        name: meta.title,
        description: meta.description,
        isPartOf: ref(ID.website),
        about: ref(ID.brandService),
        mainEntity: ref(ID.brandService),
        inLanguage: 'en-US',
      },
      {
        '@type': 'Service',
        '@id': ID.brandService,
        name: 'AI Search and CRO for Shopify Brands',
        serviceType: 'AI search optimization and conversion rate optimization',
        description:
          "I get Shopify brands recommended in ChatGPT and Google's AI answers, then make sure the store turns that traffic into sales. Start with an audit, then a fixed price Build or a retainer. Founders stay in control: I propose, you decide.",
        provider: ref(ID.carson),
        areaServed: WORLD,
        audience: BRAND_AUDIENCE,
        availableChannel: [CHECK_CHANNEL, channel()],
        serviceOutput: BRAND_OUTPUT,
        offers: summaryOffers(HOME, ID.brandService),
        isRelatedTo: Object.values(PLAN).map(ref),
      },
      ...planNodes(),
      faqPage(ID.homeFaq, ID.homePage, meta.faqs),
    ],
  };
}

// /pricing: the Service and every offer with its price, plus the pricing FAQ.
export function pricingSchema(meta: { title: string; description: string; faqs: { q: string; a: string }[] }) {
  const pageId = `${PRICING_URL}#webpage`;
  const crumbId = `${PRICING_URL}#breadcrumb`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...shared(),
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: PRICING_URL,
        name: meta.title,
        description: meta.description,
        isPartOf: ref(ID.website),
        breadcrumb: ref(crumbId),
        about: ref(ID.pricingService),
        mainEntity: ref(ID.pricingService),
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [{ name: 'Pricing', url: PRICING_URL }]),
      {
        '@type': 'Service',
        '@id': ID.pricingService,
        name: 'AI Search and CRO for Shopify Brands',
        serviceType: 'AI search optimization and conversion rate optimization',
        description:
          'Start with the AI Search and Conversion Audit, then implement the plan in a fixed price Build or on a monthly retainer.',
        url: PRICING_URL,
        provider: ref(ID.carson),
        areaServed: WORLD,
        audience: BRAND_AUDIENCE,
        availableChannel: channel(),
        serviceOutput: BRAND_OUTPUT,
        hasOfferCatalog: ref(ID.pricingCatalog),
      },
      {
        '@type': 'OfferCatalog',
        '@id': ID.pricingCatalog,
        name: 'AI search and CRO plans for Shopify brands',
        itemListElement: Object.values(PLAN).map(ref),
      },
      ...planNodes(),
      faqPage(`${PRICING_URL}#faq`, pageId, meta.faqs),
    ],
  };
}

// /ai-visibility-check: the free check as a WebApplication, plus its FAQ.
export function checkSchema(meta: { title: string; description: string; faqs: { q: string; a: string }[] }) {
  const url = `${SITE_URL}${CHECK_PATH}`;
  const pageId = `${url}#webpage`;
  const crumbId = `${url}#breadcrumb`;
  const appId = `${url}#app`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...shared(),
      {
        '@type': 'WebPage',
        '@id': pageId,
        url,
        name: meta.title,
        description: meta.description,
        isPartOf: ref(ID.website),
        breadcrumb: ref(crumbId),
        mainEntity: ref(appId),
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [{ name: 'AI Visibility Check', url }]),
      {
        '@type': 'WebApplication',
        '@id': appId,
        name: 'AI Visibility Check',
        description:
          "Checks whether ChatGPT recommends a Shopify brand's products for questions built from its top products, how accurately it describes the brand, whether AI crawlers can reach the store, and what its top product pages tell AI. Returns a score from 0 to 100.",
        url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        featureList: [
          'AI visibility for buyer questions built from the store\'s own products, in ChatGPT with web search',
          'Brand accuracy check',
          'AI crawler access for GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended and Applebot-Extended',
          'Product page readiness across the store\'s top products',
        ],
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
        author: ref(ID.carson),
        provider: ref(ID.carson),
        inLanguage: 'en-US',
      },
      faqPage(`${url}#faq`, pageId, meta.faqs),
    ],
  };
}

export const AGENCY_DESCRIPTION =
  'Agencies sell AI search and conversion work to their Shopify clients, and I implement it under their name: AI visibility audits, product data, product pages that answer buyer questions, off site work and conversion testing. White label, NDA signed upfront.';

export function agenciesSchema(meta: { title: string; description: string }) {
  const url = `${AGENCIES}#pricing`;
  // Agency pricing is shared on the intro call, so these offers carry no public price.
  const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const agencyOffer = (p: { name: string; summary: string }) => ({
    '@type': 'Offer',
    '@id': `${AGENCIES}#offer-${slug(p.name)}`,
    name: p.name,
    description: `${p.summary} Delivered under your agency's name. Agency pricing is shared on the intro call.`,
    url,
    itemOffered: ref(ID.agencyService),
    seller: ref(ID.business),
    eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
    availability: 'https://schema.org/InStock',
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      business,
      contact,
      // Defined in full on the homepage; typed here so validators read it as the WebSite.
      { '@type': 'WebSite', '@id': ID.website },
      {
        '@type': 'WebPage',
        '@id': ID.agencyPage,
        url: AGENCIES,
        name: meta.title,
        description: meta.description,
        isPartOf: ref(ID.website),
        about: ref(ID.agencyService),
        mainEntity: ref(ID.agencyService),
        breadcrumb: ref(ID.agencyBreadcrumb),
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': ID.agencyBreadcrumb,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: HOME },
          { '@type': 'ListItem', position: 2, name: 'Agencies', item: AGENCIES },
        ],
      },
      {
        '@type': 'Service',
        '@id': ID.agencyService,
        name: 'White Label AI Search and CRO Implementation for Agencies',
        serviceType: 'White label AI search optimization and conversion rate optimization',
        description: AGENCY_DESCRIPTION,
        provider: ref(ID.carson),
        areaServed: WORLD,
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'Marketing and ecommerce agencies',
          description:
            'Agencies that sell AI search and conversion work to Shopify clients and need it implemented under their name.',
        },
        availableChannel: { '@type': 'ServiceChannel', serviceUrl: CAL_LINK, name: 'Intro call' },
        hasOfferCatalog: ref(ID.agencyPartner),
      },
      {
        '@type': 'OfferCatalog',
        '@id': ID.agencyPartner,
        name: 'Partner pricing',
        description: AGENCY_PARTNER_INTRO,
        itemListElement: AGENCY_PARTNER_PLANS.map(agencyOffer),
      },
      faqPage(ID.agencyFaq, ID.agencyPage, AGENCY_FAQS),
    ],
  };
}

// Content pages, reports, and tools. Each page repeats the shared Person, Organization and
// ContactPoint nodes under the same @id, so every page describes the same Carson Cobb.

const shared = () => [person, business, contact, { '@type': 'WebSite', '@id': ID.website }];

const breadcrumb = (id: string, trail: { name: string; url: string }[]) => ({
  '@type': 'BreadcrumbList',
  '@id': id,
  itemListElement: [{ name: 'Home', url: HOME }, ...trail].map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: t.url,
  })),
});

interface ContentSchemaInput {
  slug: string;
  title: string;
  description: string;
  label: string;
  faqs: { q: string; a: string }[];
  service?: { name: string; serviceType: string; audience: string; offers?: boolean; plans?: PlanKey[] };
}

export function contentSchema(p: ContentSchemaInput) {
  const url = `${SITE_URL}/${p.slug}`;
  const pageId = `${url}#webpage`;
  const crumbId = `${url}#breadcrumb`;
  const serviceId = `${url}#service`;
  const faqId = `${url}#faq`;
  const main = p.service ? serviceId : undefined;

  const graph: object[] = [
    ...shared(),
    {
      '@type': 'WebPage',
      '@id': pageId,
      url,
      name: p.title,
      description: p.description,
      isPartOf: ref(ID.website),
      breadcrumb: ref(crumbId),
      ...(main ? { about: ref(main), mainEntity: ref(main) } : {}),
      inLanguage: 'en-US',
    },
    breadcrumb(crumbId, [{ name: p.label, url }]),
  ];

  if (p.service) {
    graph.push({
      '@type': 'Service',
      '@id': serviceId,
      name: p.service.name,
      serviceType: p.service.serviceType,
      description: p.description,
      url,
      provider: ref(ID.carson),
      areaServed: WORLD,
      audience: { '@type': 'BusinessAudience', audienceType: p.service.audience, ...(p.service.offers ? { description: FIT_LINE } : {}) },
      availableChannel: [CHECK_CHANNEL, channel()],
      // The AI search and CRO pages sell the audit, Build and retainers directly.
      ...(p.service.offers ? { serviceOutput: BRAND_OUTPUT, offers: summaryOffers(url, serviceId) } : {}),
      ...(p.service.plans ? { isRelatedTo: p.service.plans.map((k) => ref(PLAN[k])) } : {}),
    });
    if (p.service.plans) graph.push(...planNodes(p.service.plans));
  }

  graph.push(faqPage(faqId, pageId, p.faqs));
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function toolSchema(t: { slug: string; name: string; title: string; description: string }) {
  const url = `${SITE_URL}/tools/${t.slug}`;
  const pageId = `${url}#webpage`;
  const crumbId = `${url}#breadcrumb`;
  const appId = `${url}#app`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...shared(),
      {
        '@type': 'WebPage',
        '@id': pageId,
        url,
        name: t.title,
        description: t.description,
        isPartOf: ref(ID.website),
        breadcrumb: ref(crumbId),
        mainEntity: ref(appId),
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [
        { name: 'Tools', url: `${SITE_URL}/tools` },
        { name: t.name, url },
      ]),
      {
        '@type': 'WebApplication',
        '@id': appId,
        name: t.name,
        description: t.description,
        url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
        author: ref(ID.carson),
        provider: ref(ID.carson),
        inLanguage: 'en-US',
      },
    ],
  };
}

export function toolsIndexSchema(
  meta: { title: string; description: string },
  tools: { href: string; name: string }[],
) {
  const url = `${SITE_URL}/tools`;
  const pageId = `${url}#webpage`;
  const crumbId = `${url}#breadcrumb`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...shared(),
      {
        '@type': 'CollectionPage',
        '@id': pageId,
        url,
        name: meta.title,
        description: meta.description,
        isPartOf: ref(ID.website),
        breadcrumb: ref(crumbId),
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: tools.map((t, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: t.name,
            url: `${SITE_URL}${t.href}`,
          })),
        },
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [{ name: 'Tools', url }]),
    ],
  };
}

const REPORTS_URL = `${SITE_URL}/reports`;

interface ReportSchemaInput {
  /** Path without the leading slash */
  slug: string;
  title: string;
  description: string;
  h1: string;
  faqs: { q: string; a: string }[];
  datePublished: string;
  dateModified: string;
  /** The day the data was checked */
  checked: string;
  /** Column headers of the report's tables */
  variables: string[];
  stores?: number;
  products?: number;
  /** How the data was collected, if not read from storefronts */
  technique?: string;
  /** Dataset temporalCoverage: a date or a month */
  coverage: string;
  /** False for a roundup of other sources: Article, FAQ and breadcrumbs only */
  dataset?: boolean;
  keywords?: string[];
}

// A data report: the Article, the Dataset behind it, the FAQ, and Home > Reports > report.
export function reportSchema(p: ReportSchemaInput) {
  const url = `${SITE_URL}/${p.slug}`;
  const pageId = `${url}#webpage`;
  const crumbId = `${url}#breadcrumb`;
  const articleId = `${url}#article`;
  const datasetId = `${url}#dataset`;
  const size = [
    p.stores && `${p.stores.toLocaleString('en-US')} stores`,
    p.products && `${p.products.toLocaleString('en-US')} products`,
  ].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...shared(),
      {
        '@type': 'WebPage',
        '@id': pageId,
        url,
        name: p.title,
        description: p.description,
        isPartOf: ref(ID.website),
        breadcrumb: ref(crumbId),
        about: ref(articleId),
        mainEntity: ref(articleId),
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [
        { name: 'Reports', url: REPORTS_URL },
        { name: p.h1, url },
      ]),
      {
        '@type': 'Article',
        '@id': articleId,
        headline: p.h1,
        description: p.description,
        url,
        mainEntityOfPage: ref(pageId),
        image: `${SITE_URL}${ogImageFor(`/${p.slug}`).path}`,
        datePublished: p.datePublished,
        dateModified: p.dateModified,
        author: ref(ID.carson),
        publisher: ref(ID.business),
        ...(p.dataset === false ? {} : { about: ref(datasetId) }),
        inLanguage: 'en-US',
      },
      ...(p.dataset === false ? [] : [{
        '@type': 'Dataset',
        '@id': datasetId,
        name: `${p.h1} data`,
        description: p.description,
        url,
        creator: ref(ID.carson),
        datePublished: p.datePublished,
        dateModified: p.dateModified,
        temporalCoverage: p.coverage,
        spatialCoverage: US,
        isAccessibleForFree: true,
        ...(size.length ? { size: size.join(', ') } : {}),
        measurementTechnique: p.technique ?? "Reading each store's public Shopify storefront data",
        variableMeasured: p.variables,
        keywords: p.keywords ?? ['Shopify', 'ecommerce', 'benchmarks', 'DTC'],
        inLanguage: 'en-US',
      }]),
      faqPage(`${url}#faq`, pageId, p.faqs),
    ],
  };
}

// The /reports hub: a CollectionPage listing every report, plus its FAQ.
export function reportsIndexSchema(
  meta: { title: string; description: string; dateModified?: string },
  reports: { slug: string; name: string }[],
  faqs: { q: string; a: string }[],
) {
  const pageId = `${REPORTS_URL}#webpage`;
  const crumbId = `${REPORTS_URL}#breadcrumb`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...shared(),
      {
        '@type': 'CollectionPage',
        '@id': pageId,
        url: REPORTS_URL,
        name: meta.title,
        description: meta.description,
        isPartOf: ref(ID.website),
        breadcrumb: ref(crumbId),
        ...(meta.dateModified ? { dateModified: meta.dateModified } : {}),
        author: ref(ID.carson),
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: reports.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: r.name,
            url: `${SITE_URL}/${r.slug}`,
          })),
        },
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [{ name: 'Reports', url: REPORTS_URL }]),
      faqPage(`${REPORTS_URL}#faq`, pageId, faqs),
    ],
  };
}

// /results: a WebPage about Carson Cobb's work, and Home > Results. No reviews, ratings or client names.
export function resultsSchema(meta: { title: string; description: string }) {
  const url = `${SITE_URL}/results`;
  const pageId = `${url}#webpage`;
  const crumbId = `${url}#breadcrumb`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...shared(),
      {
        '@type': 'WebPage',
        '@id': pageId,
        url,
        name: meta.title,
        description: meta.description,
        isPartOf: ref(ID.website),
        breadcrumb: ref(crumbId),
        author: ref(ID.carson),
        about: ref(ID.carson),
        mainEntity: ref(`${url}#case-studies`),
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [{ name: 'Results', url }]),
      // The published case study cards, word for word. No client names.
      {
        '@type': 'ItemList',
        '@id': `${url}#case-studies`,
        name: 'AI search case studies',
        numberOfItems: AI_CASES.length,
        itemListElement: AI_CASES.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'CreativeWork',
            name: c.title,
            description: `Before: ${c.before} After: ${c.after}`,
            about: { '@type': 'Thing', name: `${c.stat} ${c.statLabel}` },
            genre: c.tag,
            author: ref(ID.carson),
          },
        })),
      },
    ],
  };
}
