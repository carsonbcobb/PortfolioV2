import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './GrowthProcess.module.scss';

const steps = [
  {
    icon: '🕵️‍♂️',
    title: '1. Baseline Tracking',
    description: 'I install GA4 & add-to-cart tags, capture 7 days of data.'
  },
  {
    icon: '🚀',
    title: '2. Optimizations',
    description: 'I shave 0.2–0.5s off your LCP & restyle the Add-to-Cart flow.'
  },
  {
    icon: '🧪',
    title: '3. Micro-CRO Tests',
    description: 'We run 2 quick A/B tests on button copy & badge placements.'
  },
  {
    icon: '📈',
    title: '4. Growth Roadmap',
    description: 'You receive a prioritized plan to keep scaling month after month.'
  }
];

const GrowthProcess = () => {
  return (
    <section className={styles.growthProcess} aria-label="4 step growth process" id="process">
      <div className={styles.container}>
        <h2 className={styles['growth-process__title']}>My 4-Step Growth Process</h2>
        
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
            <span>Start Your 30-Day Accelerator</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default GrowthProcess; 