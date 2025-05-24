import React from 'react';
import './Services.scss';

const services = [
  {
    title: 'Store Development Leadership',
    description:
      'Drive your Shopify store forward with expert guidance and hands-on support. I help lead development efforts, implement best practices, and streamline feature integration.',
    details: [
      'Weekly strategy sessions',
      'Technical roadmap planning',
      'Hands-on code reviews & mentoring',
      'Seamless feature integration',
    ],
  },
  {
    title: 'Conversion Optimization Partnership',
    description:
      'Boost your store’s conversion rates with data-driven strategies and continuous improvements. I analyze user behavior, refine sales funnels, and implement A/B testing to maximize results.',
    details: [
      'Conversion rate audits',
      'A/B testing strategies',
      'User behavior analysis',
      'Iterative optimization',
    ],
  },
  {
    title: 'Site Speed & Performance Enhancement',
    description:
      'Improve your Shopify store’s speed and performance for a smoother user experience and better SEO. I tackle technical bottlenecks and implement best practices to reduce load times.',
    details: [
      'Performance audits',
      'Technical optimizations',
      'Load time improvements',
      'Ongoing performance monitoring',
    ],
  },
];


const Services = () => {
  return (
    <section className="services-offers" id="service-bundles">
      <h2>Signature Packages</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <h3>{service.title}</h3>
            <div className="service-price hidden">{service.price}</div>
            <p>{service.description}</p>
            <ul>
              {service.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
            <a className="learn-more-btn" href="#contact-bottom">Book Your Slot</a> 
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
