// JSON-LD for every page: one entity graph (Person, Organization, WebSite) shared site wide, plus each
// page's own nodes. Prices come from the same plan data the pricing cards render, so a price change in
// site.ts updates the cards and the schema together.
import {
  SITE_URL,
  ogImageFor,
  EMAIL,
  LINKEDIN_URL,
  GHOST_REVENUE_URL,
  LINKEDIN_COMPANY_URL,
  HEADSHOT,
  PROGRAM,
  PROGRAM_SIZES,
  FULL_AUDIT,
  TERMS,
  AI_CASES,
  CHECK_PATH,
  AGENCY_PARTNER_PLANS,
  AGENCY_PARTNER_INTRO,
  AGENCY_FAQS,
  BIO,
  BIO_ROLE,
  BIO_SENTENCE,
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

// Dataset spatialCoverage for reports whose copy says the stores are US stores. Google's Dataset
// rich results accept Place here, not Country. The services are offered anywhere.
const US = { '@type': 'Place', name: 'United States' };

// Google flags date only values as invalid datetimes, so add a UTC time.
const dt = (d: string) => (/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00Z` : d);
const WORLD = 'Worldwide';
// Where the business works: US brands first, and brands anywhere.
const AREAS = [{ '@type': 'Country', name: 'United States' }, WORLD];
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
  jobTitle: BIO_ROLE,
  description: BIO,
  email: EMAIL,
  ...sameAs(LINKEDIN_URL, GHOST_REVENUE_URL, LINKEDIN_COMPANY_URL),
  knowsLanguage: 'en',
  hasOccupation: {
    '@type': 'Occupation',
    name: 'AI search and conversion optimization specialist for Shopify brands',
  },
  knowsAbout: [
    'AI search optimization',
    'Generative engine optimization',
    'Answer engine optimization',
    'Conversion rate optimization',
    'Shopify',
    'Structured data',
    'Product structured data',
  ],
  worksFor: ref(ID.business),
  contactPoint: ref(ID.contact),
};

const business = {
  '@type': 'ProfessionalService',
  '@id': ID.business,
  name: 'Carson Cobb',
  url: HOME,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description: BIO_SENTENCE,
  knowsAbout: [
    'AI search optimization',
    'Generative engine optimization',
    'Answer engine optimization',
    'Conversion rate optimization',
    'Shopify',
    'Structured data',
    'Product structured data',
  ],
  founder: ref(ID.carson),
  employee: ref(ID.carson),
  ...sameAs(LINKEDIN_COMPANY_URL, LINKEDIN_URL),
  priceRange: '$2,500 to $5,000 per month',
  areaServed: AREAS,
  contactPoint: ref(ID.contact),
};

const contact = {
  '@type': 'ContactPoint',
  '@id': ID.contact,
  contactType: 'sales',
  email: EMAIL,
  url: `${SITE_URL}${CHECK_PATH}`,
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
const PROGRAM_URL = `${SITE_URL}${PROGRAM.path}`;
const FULL_AUDIT_URL = `${SITE_URL}${FULL_AUDIT.path}`;
const PLAN = {
  program: `${SITE_URL}/#service-close-the-gap`,
  fullAudit: `${SITE_URL}/#service-full-store-audit`,
};
export type PlanKey = keyof typeof PLAN;

const english = { '@type': 'Language', name: 'English', alternateName: 'en' };
const channel = (processingTime?: string) => ({
  '@type': 'ServiceChannel',
  name: 'Email and recorded video',
  serviceUrl: `${SITE_URL}/start`,
  availableLanguage: english,
  ...(processingTime ? { processingTime } : {}),
});
const audience = (description: string) => ({ '@type': 'BusinessAudience', audienceType: 'Shopify brands', description });
const output = (name: string, description: string) => ({ '@type': 'Thing', name, description });
const sentenceList = (xs: string[]) => xs.map((x) => (/[.!?]$/.test(x) ? x : `${x}.`)).join(' ');
const FIT_LINE = PROGRAM.fit;
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

// One Offer per Close the Gap size: the monthly price, billed month to month.
const sizeOffer = (z: (typeof PROGRAM_SIZES)[number]) => ({
  '@type': 'Offer',
  '@id': `${PROGRAM_URL}#offer-${z.key}`,
  name: z.name,
  description: `${z.fit}. ${sentenceList(z.items)} ${usd(z.monthly)}/month, month to month. Cancel any time with 30 days written notice. ${PROGRAM.guarantee} ${PROGRAM.scope}`,
  url: PROGRAM_URL,
  itemOffered: ref(PLAN.program),
  seller: ref(ID.business),
  price: z.monthly,
  priceCurrency: 'USD',
  priceSpecification: {
    '@type': 'UnitPriceSpecification',
    price: z.monthly,
    priceCurrency: 'USD',
    unitText: 'MONTH',
  },
  eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
  availability: 'https://schema.org/InStock',
});

const fullAuditOffer = () =>
  offer({
    id: `${FULL_AUDIT_URL}#offer`,
    name: FULL_AUDIT.name,
    description: `${FULL_AUDIT.timing} ${FULL_AUDIT.walkthrough} ${TERMS.ownership}`,
    url: FULL_AUDIT_URL,
    service: PLAN.fullAudit,
    price: FULL_AUDIT.price,
    unit: 'once',
  });

const planServices: Record<PlanKey, () => object> = {
  program: () => ({
    '@type': 'Service',
    '@id': PLAN.program,
    name: PROGRAM.name,
    serviceType: 'AI search optimization against competitors',
    description: `${PROGRAM.summary} ${PROGRAM.after}`,
    url: PROGRAM_URL,
    provider: ref(ID.business),
    areaServed: AREAS,
    audience: audience(FIT_LINE),
    availableChannel: channel(),
    serviceOutput: output(
      'Competitor head to head, on site fixes, source work and competitor reports',
      sentenceList([...PROGRAM.months.flatMap((m) => m.items), ...PROGRAM.always.items]),
    ),
    offers: PROGRAM_SIZES.map(sizeOffer),
  }),
  fullAudit: () => ({
    '@type': 'Service',
    '@id': PLAN.fullAudit,
    name: FULL_AUDIT.name,
    serviceType: 'Shopify conversion audit',
    description: FULL_AUDIT.summary,
    url: FULL_AUDIT_URL,
    provider: ref(ID.business),
    areaServed: AREAS,
    audience: audience(FIT_LINE),
    availableChannel: channel('P2D'),
    serviceOutput: output('Written report, ranked fixes and recorded video walkthrough', sentenceList(FULL_AUDIT.includes)),
    offers: fullAuditOffer(),
  }),
};

export const planNodes = (keys: PlanKey[] = ['program', 'fullAudit']) => keys.map((k) => planServices[k]());

// The offers shown on the homepage, /ai-search and the service pages: both Close the Gap sizes.
const summaryOffers = (base: string, service: string) =>
  PROGRAM_SIZES.map((z) => ({ ...sizeOffer(z), '@id': `${base}#offer-${z.key}`, itemOffered: ref(service) }));

const BRAND_AUDIENCE = audience(FIT_LINE);

const CHECK_CHANNEL = { '@type': 'ServiceChannel', serviceUrl: `${SITE_URL}${CHECK_PATH}`, name: 'AI Visibility Check', availableLanguage: english };

// The AI search and CRO services: what the work produces, in the page's own words.
const BRAND_OUTPUT = output(
  'Gap report, implementation and competitor reports',
  'A head to head against your main competitors on ChatGPT, Gemini and Google AI Mode, the on site fixes implemented, source work, and a competitor report every week or two.',
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
          'I show Shopify brands exactly where their competitors beat them in ChatGPT, Gemini and Google AI Mode, category by category, and what it is costing them. Then I close the gap, and make sure the shoppers AI sends actually buy. Founders stay in control: I propose, you decide.',
        provider: ref(ID.business),
        areaServed: AREAS,
        audience: BRAND_AUDIENCE,
        availableChannel: [CHECK_CHANNEL, channel()],
        serviceOutput: BRAND_OUTPUT,
        offers: summaryOffers(HOME, ID.brandService),
        isRelatedTo: Object.values(PLAN).map(ref),
      },
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
          'Close the Gap, a 90 day program in two sizes, the Full Store Audit, and the AI Visibility Check.',
        url: PRICING_URL,
        provider: ref(ID.business),
        areaServed: AREAS,
        audience: BRAND_AUDIENCE,
        availableChannel: channel(),
        serviceOutput: BRAND_OUTPUT,
        hasOfferCatalog: ref(ID.pricingCatalog),
      },
      {
        '@type': 'OfferCatalog',
        '@id': ID.pricingCatalog,
        name: 'AI search and CRO plans for Shopify brands',
        itemListElement: [...PROGRAM_SIZES.map(sizeOffer), fullAuditOffer()],
      },
      faqPage(`${PRICING_URL}#faq`, pageId, meta.faqs),
    ],
  };
}

// /close-the-gap and /full-store-audit: the page, its Service with every Offer, and the page's FAQ.
function offerPageSchema(url: string, plan: PlanKey, label: string, meta: { title: string; description: string; faqs: { q: string; a: string }[] }) {
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
        about: ref(PLAN[plan]),
        mainEntity: ref(PLAN[plan]),
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [
        { name: 'Pricing', url: PRICING_URL },
        { name: label, url },
      ]),
      planServices[plan](),
      faqPage(`${url}#faq`, pageId, meta.faqs),
    ],
  };
}
export const closeTheGapSchema = (meta: { title: string; description: string; faqs: { q: string; a: string }[] }) =>
  offerPageSchema(PROGRAM_URL, 'program', PROGRAM.name, meta);
export const fullStoreAuditSchema = (meta: { title: string; description: string; faqs: { q: string; a: string }[] }) =>
  offerPageSchema(FULL_AUDIT_URL, 'fullAudit', FULL_AUDIT.name, meta);

// /ai-visibility-check: the check as a WebApplication, plus its FAQ.
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
      breadcrumb(crumbId, [{ name: 'Gap report', url }]),
      {
        '@type': 'WebApplication',
        '@id': appId,
        name: 'Gap report',
        description:
          "Shows how often ChatGPT recommends a Shopify brand and its top competitor for questions built from the brand's top products, how accurately it describes the brand, whether AI crawlers can reach the store, and what its top product pages tell AI. Returns a score from 0 to 100.",
        url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        featureList: [
          'Head to head against the competitor the brand enters, counted on the same ChatGPT answers',
          'AI visibility for buyer questions built from the store\'s own products, in ChatGPT with web search',
          'Brand accuracy check',
          'AI crawler access for GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended and Applebot-Extended',
          'Product page readiness across the store\'s top products',
        ],
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
        author: ref(ID.carson),
        provider: ref(ID.business),
        inLanguage: 'en-US',
      },
      faqPage(`${url}#faq`, pageId, meta.faqs),
    ],
  };
}

export const AGENCY_DESCRIPTION =
  'Agencies sell AI search and conversion work to their Shopify clients, and I implement it under their name: competitor head to heads, product data, product pages that answer buyer questions, off site work and conversion testing. White label, NDA signed upfront.';

export function agenciesSchema(meta: { title: string; description: string }) {
  const url = `${AGENCIES}#pricing`;
  // Agencies pay the same prices as brands; these offers point to the brand offers for the price.
  const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const agencyOffer = (p: { name: string; summary: string }) => ({
    '@type': 'Offer',
    '@id': `${AGENCIES}#offer-${slug(p.name)}`,
    name: p.name,
    description: `${p.summary} Delivered under your agency's name, at the same prices brands pay.`,
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
        provider: ref(ID.business),
        areaServed: AREAS,
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'Marketing and ecommerce agencies',
          description:
            'Agencies that sell AI search and conversion work to Shopify clients and need it implemented under their name.',
        },
        availableChannel: { '@type': 'ServiceChannel', serviceUrl: `mailto:${EMAIL}`, name: 'Email' },
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
  // offers 'only': the Close the Gap offers, without the fit line, output or channel
  // (the industry pages show the pricing cards but not those).
  service?: { name: string; serviceType: string; audience: string; offers?: boolean | 'only'; plans?: PlanKey[] };
  /** Comparison guides: an Article by Carson with its dates */
  article?: { headline: string; datePublished: string; dateModified: string };
}

export function contentSchema(p: ContentSchemaInput) {
  const url = `${SITE_URL}/${p.slug}`;
  const pageId = `${url}#webpage`;
  const crumbId = `${url}#breadcrumb`;
  const serviceId = `${url}#service`;
  const faqId = `${url}#faq`;
  const articleId = `${url}#article`;
  const main = p.service ? serviceId : p.article ? articleId : undefined;

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
      provider: ref(ID.business),
      areaServed: AREAS,
      audience: { '@type': 'BusinessAudience', audienceType: p.service.audience, ...(p.service.offers === true ? { description: FIT_LINE } : {}) },
      availableChannel: p.service.offers === 'only' ? [CHECK_CHANNEL] : [CHECK_CHANNEL, channel()],
      // The AI search and CRO pages sell both Close the Gap sizes directly.
      ...(p.service.offers === true ? { serviceOutput: BRAND_OUTPUT } : {}),
      ...(p.service.offers || p.service.plans?.includes('fullAudit')
        ? {
            offers: [
              ...(p.service.offers ? summaryOffers(url, serviceId) : []),
              ...(p.service.plans?.includes('fullAudit') ? [fullAuditOffer()] : []),
            ],
          }
        : {}),
      ...(p.service.plans ? { isRelatedTo: p.service.plans.map((k) => ref(PLAN[k])) } : {}),
    });
  }

  if (p.article) {
    graph.push({
      '@type': 'Article',
      '@id': articleId,
      headline: p.article.headline,
      description: p.description,
      url,
      mainEntityOfPage: ref(pageId),
      image: `${SITE_URL}${ogImageFor(`/${p.slug}`).path}`,
      datePublished: dt(p.article.datePublished),
      dateModified: dt(p.article.dateModified),
      author: ref(ID.carson),
      publisher: ref(ID.business),
      inLanguage: 'en-US',
    });
  }

  if (p.faqs.length) graph.push(faqPage(faqId, pageId, p.faqs));
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function toolSchema(t: { slug: string; name: string; title: string; description: string }, faqs: { q: string; a: string }[] = []) {
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
        provider: ref(ID.business),
        inLanguage: 'en-US',
      },
      ...(faqs.length ? [faqPage(`${url}#faq`, pageId, faqs)] : []),
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
const GUIDES_URL = `${SITE_URL}/guides`;

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
  /** The breadcrumb section above the page (default: Reports) */
  section?: { name: string; url: string };
  /** False for a roundup of other sources: Article, FAQ and breadcrumbs only */
  dataset?: boolean;
  /** True when the report says its stores or brands are in the US: adds spatialCoverage */
  us?: boolean;
  keywords?: string[];
  /** Downloadable data files: the Dataset distribution */
  files?: { path: string; name: string; description: string }[];
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
        p.section ?? { name: 'Reports', url: REPORTS_URL },
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
        datePublished: dt(p.datePublished),
        dateModified: dt(p.dateModified),
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
        datePublished: dt(p.datePublished),
        dateModified: dt(p.dateModified),
        temporalCoverage: p.coverage,
        ...(p.us ? { spatialCoverage: US } : {}),
        isAccessibleForFree: true,
        ...(size.length ? { size: size.join(', ') } : {}),
        measurementTechnique: p.technique ?? "Reading each store's public Shopify storefront data",
        variableMeasured: p.variables,
        ...(p.files?.length
          ? {
              distribution: p.files.map((f) => ({
                '@type': 'DataDownload',
                name: f.name,
                description: f.description,
                encodingFormat: 'text/csv',
                contentUrl: `${SITE_URL}${f.path}`,
              })),
            }
          : {}),
        keywords: p.keywords ?? ['Shopify', 'ecommerce', 'benchmarks', 'DTC'],
        inLanguage: 'en-US',
      }]),
      faqPage(`${url}#faq`, pageId, p.faqs),
    ],
  };
}

// A guide: Article, FAQ and breadcrumbs, the same graph as a report without a Dataset.
export function guideSchema(p: Pick<ReportSchemaInput, 'slug' | 'title' | 'description' | 'h1' | 'faqs' | 'datePublished' | 'dateModified'>) {
  return reportSchema({
    ...p,
    checked: p.dateModified,
    coverage: p.dateModified,
    variables: [],
    dataset: false,
    section: { name: 'Guides', url: GUIDES_URL },
  });
}

// A hub page: a CollectionPage listing its items, plus its FAQ when it has one.
function collectionSchema(
  url: string,
  section: string,
  meta: { title: string; description: string; dateModified?: string },
  items: { slug: string; name: string }[],
  faqs: { q: string; a: string }[] = [],
) {
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
        ...(meta.dateModified ? { dateModified: dt(meta.dateModified) } : {}),
        author: ref(ID.carson),
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: items.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: r.name,
            url: `${SITE_URL}/${r.slug}`,
          })),
        },
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [{ name: section, url }]),
      ...(faqs.length ? [faqPage(`${url}#faq`, pageId, faqs)] : []),
    ],
  };
}

export const reportsIndexSchema = (
  meta: { title: string; description: string; dateModified?: string },
  reports: { slug: string; name: string }[],
  faqs: { q: string; a: string }[],
) => collectionSchema(REPORTS_URL, 'Reports', meta, reports, faqs);

export const guidesIndexSchema = (meta: { title: string; description: string }, guides: { slug: string; name: string }[]) =>
  collectionSchema(GUIDES_URL, 'Guides', meta, guides);

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

// /about: a ProfilePage whose main entity is Carson, with Home > About.
export function aboutSchema(meta: { title: string; description: string; dateModified: string }) {
  const url = `${SITE_URL}/about`;
  const pageId = `${url}#webpage`;
  const crumbId = `${url}#breadcrumb`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...shared(),
      {
        '@type': 'ProfilePage',
        '@id': pageId,
        url,
        name: meta.title,
        description: meta.description,
        isPartOf: ref(ID.website),
        breadcrumb: ref(crumbId),
        about: ref(ID.carson),
        mainEntity: ref(ID.carson),
        dateModified: dt(meta.dateModified),
        inLanguage: 'en-US',
      },
      breadcrumb(crumbId, [{ name: 'About', url }]),
    ],
  };
}
