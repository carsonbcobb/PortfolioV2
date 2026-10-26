import React from 'react';
import styles from './Services.module.scss';

const EMAIL_URL = 'mailto:carson@carsoncobb.com?subject=Shopify%20store%20inquiry';

const services = [
  {
    price: '$2,500/mo',
    title: 'Full-Store Operator',
    tagline: 'You hand me the store. I run it end to end.',
    description: 'One operator for your entire Shopify store. Conversion and testing, development, technical and speed, AI search visibility, structured data, retention and subscriptions, and all the operations underneath: settings, order and fulfillment flows, and email setup. Instead of coordinating a team of contractors, you get one person who owns the whole store and keeps it improving every month.',
    includes: [
      'Ongoing CRO and A/B testing',
      'Shopify development and technical health',
      'AI search visibility and structured data',
      'Retention, subscriptions, and email flows',
      'Store operations and order flow management',
      'Direct access to me, no account managers'
    ],
    cta: 'Get in touch',
    ctaUrl: EMAIL_URL,
    isAgency: false
  },
  {
    price: '$2,000',
    title: 'Full-Store Audit',
    tagline: 'See exactly what your store is losing, and how I would fix it.',
    description: 'A deep report across your entire store: conversion, technical health, AI search visibility, retention, and operations. Every issue ranked by revenue impact, with the fix and the reasoning behind it. Delivered in 7 business days. Standalone at $2,000, or included as the first thing I do when you start the retainer, at no separate cost.',
    includes: [
      'Full-store analysis, not just conversion',
      'Every issue ranked by revenue impact',
      'AI search and structured data review',
      'Prioritized fix roadmap',
      'Clear recommendations with reasoning',
      'Included as the starting point of the retainer'
    ],
    cta: 'Get in touch',
    ctaUrl: EMAIL_URL,
    isAgency: false
  }
];

const Services = () => {
  return (
    <section className={styles.servicesTiers} id="services">
      <span className={styles.servicesEyebrow}>Services</span>
      <h2 className={styles.servicesTiersTitle}>Two Ways To Work With Me</h2>
      <p className={styles.servicesIntro}>Get a standalone full-store audit, or hand me the store on a monthly retainer. Retainer clients get the audit as the first thing I do, no separate fee.</p>
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
            <a href={service.ctaUrl} className={styles.serviceCta}>
              {service.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
export { services };
