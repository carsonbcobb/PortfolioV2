import React from 'react';
import './Services.scss';

const services = [
  {
    title: 'E-Commerce Performance Audit',
    description:
      'A comprehensive audit of your Shopify or e-commerce site to identify performance issues and provide actionable recommendations.',
    price: '$750',
    details: [
      'In-depth audit report',
      'Actionable recommendations',
      'Follow-up support via email or Slack',
    ],
  },
  {
    title: 'Conversion Rate Optimization (CRO) Starter Package',
    description:
      'Optimize your sales funnel, landing pages, and checkout process with tailored recommendations to increase conversions.',
    price: '$1,500',
    details: [
      'CRO audit report',
      'A/B testing plan',
      'Implementation guidance',
      '2 weeks of support via email or Slack',
    ],
  },
  {
    title: 'Site Speed Boost',
    description:
      'Enhance your website’s speed and performance, improving user experience and SEO rankings.',
    price: '$1,000',
    details: [
      'Before-and-after speed analysis',
      'Technical optimizations',
      'Optimization report',
      'Support via email or Slack',
    ],
  },
  {
    title: 'Custom Theme Enhancement',
    description:
      'Customize and enhance your existing theme to better reflect your brand and improve user interface.',
    price: '$2,500',
    details: [
      'Theme customization',
      'Mobile optimization',
      'Two rounds of revisions',
      'Written guide for adjustments',
    ],
  },
  {
    title: 'Ongoing Optimization and Support Retainer',
    description:
      'Continuous support and optimization for your e-commerce site, keeping it updated and performing at its best.',
    price: '$1,500/month',
    details: [
      'Monthly performance reports',
      'Ongoing tweaks and updates',
      'Priority support via email or Slack',
    ],
  },
  {
    title: 'Quick Start Shopify Setup',
    description:
      'Get your Shopify store up and running quickly with a tailored setup designed to meet your specific needs.',
    price: '$3,000',
    details: [
      'Complete store setup',
      'Product uploads',
      'Post-launch support via email or Slack',
    ],
  },
  {
    title: 'Email Capture and Conversion Optimization',
    description:
      'Boost your email subscriber list and improve conversions with optimized popups, forms, and call-to-actions.',
    price: '$750',
    details: [
      'Email capture optimization',
      'Integration with email marketing tools',
      'Performance tracking',
      'Support via email or Slack',
    ],
  },
  {
    title: 'Landing Page Creation',
    description:
      'Design and develop high-converting landing pages tailored to your marketing campaigns and business goals.',
    price: '$1,200',
    details: [
      'Custom landing page design',
      'Responsive development',
      'SEO optimization',
      '1 revision included',
    ],
  },
  {
    title: 'Subscription Platform Customizations',
    description:
      'Customize your current subscription platform or portal to enhance user experience and streamline management.',
    price: '$2,000',
    details: [
      'Customization of subscription features',
      'Integration with existing platforms',
      'User interface enhancements',
      'Support via email or Slack',
    ],
  },
];

const Services = () => {
  return (
    <section className="services-offers" id="service-bundles">
      <h2>Unlock Your Brand’s Potential</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <h3>{service.title}</h3>
            <div className="service-price">{service.price}</div>
            <p>{service.description}</p>
            <ul>
              {service.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
            <a className="learn-more-btn" href="#contact-bottom">Learn More</a> 
          </div>
        ))}
      </div>
      <div class="button service-cta"><a href="#contact-bottom"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right faIcon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg> Get Started</a></div>
    </section>
  );
};

export default Services;
