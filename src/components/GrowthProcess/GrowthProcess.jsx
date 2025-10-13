import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './GrowthProcess.module.scss';

const steps = [
  {
    icon: '🔍',
    title: 'Deep Analysis',
    description: "I systematically tear apart your store looking for every problem. Site speed. Mobile experience. Checkout flow. UX issues. Technical debt. Every single revenue leak."
  },
  {
    icon: '💣',
    title: 'Prioritize By Impact',
    description: "I rank every issue by how much it's costing you. We fix the biggest money-losers first - the problems bleeding the most revenue right now."
  },
  {
    icon: '⚡',
    title: 'Execute Fast',
    description: "No endless meetings or corporate bureaucracy. I execute quickly, communicate clearly, and keep you updated on progress. You always know what's happening."
  },
  {
    icon: '💰',
    title: 'Measure Results',
    description: "Track the impact in real metrics that matter. Conversion rate improvements. Revenue increases. Results you can see in your bank account."
  }
];

const GrowthProcess = () => {
  return (
    <section className={styles.growthProcess} aria-label="4 step growth process" id="process">
      <div className={styles.container}>
        <h2 className={styles['growth-process__title']}>How This Actually Works</h2>
        
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <span className={styles.icon} role="img" aria-label={step.title}>
                {step.icon}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <a href="https://koalendar.com/e/meet-with-carson-koaUwc9W-2" target="_blank" rel="noopener noreferrer" className={styles.button}>
            <span>Book Your Free Audit</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default GrowthProcess; 