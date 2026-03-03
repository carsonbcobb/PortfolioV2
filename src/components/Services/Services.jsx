import React from 'react';
import styles from './Services.module.scss';

const KOALENDAR_URL = 'https://koalendar.com/e/ghost-revenue-discovery-call';

const services = [
  {
    price: '$1,997',
    title: 'Conversion Audit',
    tagline: 'Find exactly where your store is bleeding revenue.',
    description: 'A 30 to 40+ page report that tears apart your entire site. Every page, every funnel step, mobile and desktop. Full data analysis using your Shopify, Google Analytics, and email marketing platform. Every issue ranked by revenue impact with the psychology behind why it\'s hurting conversions and specific instructions on how to fix it. Delivered in 7 business days.',
    includes: [
      'Full-funnel conversion analysis',
      'Conversion psychology framework',
      'Quick wins and major problem areas',
      'Revenue projections',
      'Prioritized implementation roadmap',
      'Full Loom video walkthrough'
    ],
    cta: 'Get Started',
    ctaUrl: KOALENDAR_URL,
    isAgency: false
  },
  {
    price: '$85/hr',
    title: 'Ongoing Optimization & Development',
    tagline: 'I find the problems and fix them for you.',
    description: 'Ongoing Shopify development and conversion optimization focused entirely on increasing your revenue. I implement audit recommendations, rebuild product pages, optimize site speed, improve your cart and checkout flow, and continuously test and iterate to push your conversion rate higher. You work directly with me. No junior developers. No account managers.',
    includes: [
      'Conversion audit and implementation',
      'Site speed optimization',
      'Product page optimization',
      'Cart and checkout improvements',
      'Post-purchase upsell setup',
      'Ongoing conversion testing and iteration'
    ],
    cta: 'Get Started',
    ctaUrl: KOALENDAR_URL,
    isAgency: false
  },
  {
    price: 'Custom Pricing',
    title: 'Agency & White-Label Partnerships',
    tagline: 'Add CRO to your agency without the overhead.',
    description: 'I deliver full conversion audits under your brand so you can offer CRO as a service to your existing clients. You set the price, keep the markup, and keep all the ongoing work it generates from your client. Zero overhead on your end. A new revenue stream for your agency and more revenue for your clients.',
    includes: [
      'White-label ready reports',
      '7 day delivery',
      'Volume pricing available',
      'Your branding, your client relationship'
    ],
    cta: "Let's Talk",
    ctaUrl: KOALENDAR_URL,
    isAgency: true
  }
];

const Services = () => {
  return (
    <section className={styles.servicesTiers} id="services">
      <span className={styles.servicesEyebrow}>Services</span>
      <h2 className={styles.servicesTiersTitle}>Three Ways To Work With Me</h2>
      <p className={styles.servicesIntro}>Standalone audit, ongoing optimization, or white-label for your agency. Pick what fits.</p>
      <div className={styles.serviceCards}>
        {services.map((service, index) => (
          <div
            key={index}
            className={`${styles.serviceCard} ${service.isAgency ? styles.serviceCardAgency : ''}`}
          >
            <div className={styles.servicePrice}>{service.price}</div>
            <h3>{service.title}</h3>
            <p className={styles.serviceTagline}>{service.tagline}</p>
            <p className={styles.serviceDescription}>{service.description}</p>
            <ul className={styles.serviceIncludes}>
              {service.includes.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <a href={service.ctaUrl} target="_blank" rel="noopener noreferrer" className={styles.serviceCta}>
              {service.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
