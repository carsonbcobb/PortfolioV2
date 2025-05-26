import React from 'react';
import './Services.scss';

const services = [
  {
    title: '30-Day A-to-C Accelerator',
    description: 'A single-minded, 30-day sprint to boost your add-to-cart rate by 8-15% —guaranteed.',
    deliverables: [
      '7-day baseline tracking (GA4 + add-to-cart events)',
      'Speed & UX optimizations',
      'Up to two A/B tests',
      'Final report & 30-min wrap-up call'
    ],
    price: '$3,500 one-time',
    guarantee: '8-15% lift in add-to-cart or I work free until we do',
    cta: 'Book Accelerator Slot',
    ctaLink: 'https://koalendar.com/e/meet-with-carson-koaUwc9W-2',
    isHighlighted: true
  },
  {
    title: '5-Point Speed & UX Audit Call',
    description: 'Free 30-minute live audit + tailored PDF report within 24 hours.',
    deliverables: [
      'Live 30-min audit call covering speed & UX blockers',
      'Tailored PDF audit report emailed within 24 h'
    ],
    price: 'Free',
    guarantee: 'N/A',
    cta: 'Book Audit Call',
    ctaLink: 'https://koalendar.com/e/meet-with-carson-koaUwc9W',
    isHighlighted: false
  },
  {
    title: 'Site Concierge Retainer',
    description: 'Monthly block of hours you can spend however you need—optimizations, tests, or support.',
    deliverables: [
      '12 hrs/mo of your chosen work',
      'Priority 24-h turnaround on critical tasks',
      'Monthly 30-min strategy & reporting call'
    ],
    price: '$2,000/mo',
    guarantee: 'Work paused when hours cap is reached; overage at $140/hr',
    cta: 'Start Retainer',
    ctaLink: 'https://koalendar.com/e/meet-with-carson-koaUwc9W-2e',
    isHighlighted: false
  }
];


const Services = () => {
  return (
    <section className="services-offers" id="service-bundles">
      <h2>Signature Packages</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div className={`service-card ${service.isHighlighted ? 'highlighted' : ''}`} key={index}>
            <h3>{service.title}</h3>
            <div className="service-price">{service.price}</div>
            <p>{service.description}</p>
            <div className="deliverables">
              <h4>Deliverables</h4>
              <ul>
                {service.deliverables.map((deliverable, i) => (
                  <li key={i}>{deliverable}</li>
                ))}
              </ul>
            </div>
            <div className="guarantee">
              <h4>Guarantee</h4>
              <p>{service.guarantee}</p>
            </div>
            <a 
              className="learn-more-btn" 
              href={service.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {service.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
