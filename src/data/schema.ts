// JSON-LD for both pages. Prices come from the same plan data the pricing cards render,
// so a price change in site.ts updates the cards and the schema together.
import {
  SITE_URL,
  EMAIL,
  CAL_LINK,
  LINKEDIN_URL,
  LINKEDIN_COMPANY_URL,
  HEADSHOT,
  AUDIT,
  BUILD,
  RETAINERS,
  FAQS,
  CALL_NAME,
  AGENCY_PLANS,
  AGENCY_CLIENT_PLANS,
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
  brandPlans: `${SITE_URL}/#brand-plans`,
  homeFaq: `${SITE_URL}/#faq`,
  agencyPage: `${AGENCIES}#webpage`,
  agencyBreadcrumb: `${AGENCIES}#agency-breadcrumb`,
  agencyService: `${AGENCIES}#agency-service`,
  agencySeniorHours: `${AGENCIES}#agency-senior-hours`,
  agencyWhiteLabel: `${AGENCIES}#agency-white-label`,
  agencyFaq: `${AGENCIES}#faq`,
};

const US = { '@type': 'Country', name: 'United States' };
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
  jobTitle: 'AI Search and CRO Consultant for Shopify Brands',
  description:
    "AI search and CRO for Shopify brands. I get products recommended in ChatGPT and Google's AI answers, then make sure the store turns that traffic into sales. 6+ years and 50+ Shopify stores, from startups to ten figure brands.",
  email: EMAIL,
  ...sameAs(LINKEDIN_URL, LINKEDIN_COMPANY_URL),
  knowsAbout: [
    'AI search',
    'Answer engine optimization (AEO)',
    'Generative engine optimization',
    'Structured data',
    'Schema.org',
    'Shopify',
    'Shopify Plus',
    'Shopify theme development',
    'Ecommerce strategy',
    'Conversion rate optimization',
    'A/B testing',
    'Klaviyo',
    'Email marketing',
    'Subscriptions',
    'Recharge',
    'Rebuy',
    'Site speed optimization',
    'Ecommerce analytics',
    'DTC brands',
    'White label Shopify development',
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
  knowsAbout: ['AI search', 'Answer engine optimization (AEO)', 'Structured data', 'Conversion rate optimization', 'Shopify'],
  founder: ref(ID.carson),
  ...sameAs(LINKEDIN_COMPANY_URL),
  areaServed: US,
  contactPoint: ref(ID.contact),
};

const contact = {
  '@type': 'ContactPoint',
  '@id': ID.contact,
  contactType: 'sales',
  email: EMAIL,
  url: CAL_LINK,
  availableLanguage: 'English',
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

// Price lookup by plan name, so the schema can't drift from the cards.
const priceOf = (plans: { name: string; price: number }[], name: string) => {
  const plan = plans.find((p) => p.name === name);
  if (!plan) throw new Error(`[schema] No plan named "${name}" in site.ts`);
  return plan.price;
};

// White label plans agencies resell per client store. Prices come from AGENCY_CLIENT_PLANS.
const AGENCY_CLIENT_OFFERS: { slug: string; name: string; unit: Unit; description: string }[] = [
  {
    slug: 'advisor',
    name: 'Advisor',
    unit: 'month',
    description:
      'Monthly store review with a ranked list of fixes your team can execute. Up to 8 hours a month. Implementation not included.',
  },
  {
    slug: 'store-sprint',
    name: 'Store Sprint',
    unit: 'once',
    description:
      'One week: full store review and the highest impact fixes shipped, with a video walkthrough. Credited to a monthly plan within 30 days.',
  },
  {
    slug: 'operator',
    name: 'Operator',
    unit: 'month',
    description:
      'Store built, fixed, and optimized continuously: development, testing, email, subscriptions, and monthly reporting. Up to 24 hours a month.',
  },
  {
    slug: 'head-of-ecommerce',
    name: 'Head of Ecommerce',
    unit: 'month',
    description:
      'Everything in Operator plus marketing and content direction, campaign planning, and client calls as part of your team. Up to 44 hours a month.',
  },
];

const WHITE_LABEL = " Per client store, delivered under your agency's name.";

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

export function homeSchema(meta: { title: string; description: string }) {
  const url = `${SITE_URL}/#pricing`;
  const brandOffer = (slug: string, name: string, description: string, price: number, unit: Unit, from = false) =>
    offer({ id: `${SITE_URL}/#offer-${slug}`, name, description, url, service: ID.brandService, price, unit, from });
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
        areaServed: US,
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'Shopify brands',
          description:
            'Shopify brands, especially in wellness, supplements and beauty, from startups to billion dollar companies.',
        },
        availableChannel: { '@type': 'ServiceChannel', serviceUrl: CAL_LINK, name: `${CALL_NAME}, 20 minutes` },
        hasOfferCatalog: ref(ID.brandPlans),
      },
      {
        '@type': 'OfferCatalog',
        '@id': ID.brandPlans,
        name: 'Plans for brands',
        itemListElement: [
          brandOffer('audit', AUDIT.name, `${AUDIT.includes.join(', ')}. ${AUDIT.note}`, AUDIT.price, 'once'),
          ...BUILD.tiers.map((t) =>
            brandOffer(
              `build-${t.price}`,
              `${BUILD.name}, ${t.label.toLowerCase()}`,
              `Fixed price, 3 to 4 weeks${t.from ? ', price depends on catalog size' : ''}. ${BUILD.includes.join(', ')}.`,
              t.price,
              'once',
              t.from,
            ),
          ),
          ...RETAINERS.filter((r) => r.price !== null).map((r) =>
            brandOffer(
              `retainer-${r.name.toLowerCase()}`,
              `${r.name} retainer`,
              `${r.summary} 3 month minimum.`,
              r.price as number,
              'month',
            ),
          ),
        ],
      },
      faqPage(ID.homeFaq, ID.homePage, FAQS),
    ],
  };
}

export function agenciesSchema(meta: { title: string; description: string }) {
  const url = `${AGENCIES}#pricing`;
  const agencyOffer = (slug: string, name: string, description: string, price: number, unit: Unit) =>
    offer({ id: `${AGENCIES}#offer-${slug}`, name, description, url, service: ID.agencyService, price, unit });

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
        name: 'White Label Shopify Development and Ecommerce Management for Agencies',
        serviceType: 'White label Shopify development',
        description:
          'I lead client stores end to end, from strategy and CRO to the build, and join calls as part of your team. No specs, no QA, no hand holding. You sell bigger retainers without hiring senior talent.',
        provider: ref(ID.carson),
        areaServed: US,
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'Marketing and ecommerce agencies',
          description:
            'Agencies that need a senior Shopify lead for client accounts, or white label store management plans to resell.',
        },
        availableChannel: { '@type': 'ServiceChannel', serviceUrl: CAL_LINK, name: 'Intro call' },
        hasOfferCatalog: [ref(ID.agencySeniorHours), ref(ID.agencyWhiteLabel)],
      },
      {
        '@type': 'OfferCatalog',
        '@id': ID.agencySeniorHours,
        name: 'Reserved senior capacity',
        itemListElement: [
          agencyOffer(
            'partner',
            'Partner',
            '32 reserved hours a month for work across any client, with a priority queue and same day response.',
            priceOf(AGENCY_PLANS, 'Partner'),
            'month',
          ),
        ],
      },
      {
        '@type': 'OfferCatalog',
        '@id': ID.agencyWhiteLabel,
        name: 'White label plans for your clients',
        itemListElement: AGENCY_CLIENT_OFFERS.map((o) =>
          agencyOffer(o.slug, o.name, o.description + WHITE_LABEL, priceOf(AGENCY_CLIENT_PLANS, o.name), o.unit),
        ),
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
  service?: { name: string; serviceType: string; audience: string };
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
      areaServed: US,
      audience: { '@type': 'BusinessAudience', audienceType: p.service.audience },
      availableChannel: { '@type': 'ServiceChannel', serviceUrl: CAL_LINK, name: `${CALL_NAME}, 20 minutes` },
    });
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
  tools: { slug: string; name: string }[],
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
            url: `${url}/${t.slug}`,
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
        image: `${SITE_URL}/og-image.png`,
        datePublished: p.datePublished,
        dateModified: p.dateModified,
        author: ref(ID.carson),
        publisher: ref(ID.business),
        about: ref(datasetId),
        inLanguage: 'en-US',
      },
      {
        '@type': 'Dataset',
        '@id': datasetId,
        name: `${p.h1} data`,
        description: p.description,
        url,
        creator: ref(ID.carson),
        datePublished: p.datePublished,
        dateModified: p.dateModified,
        temporalCoverage: p.checked,
        spatialCoverage: US,
        isAccessibleForFree: true,
        ...(size.length ? { size: size.join(', ') } : {}),
        measurementTechnique: "Reading each store's public Shopify storefront data",
        variableMeasured: p.variables,
        keywords: ['Shopify', 'ecommerce', 'benchmarks', 'DTC'],
        inLanguage: 'en-US',
      },
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
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [{ name: 'Results', url }]),
    ],
  };
}
