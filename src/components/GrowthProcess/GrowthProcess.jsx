import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './GrowthProcess.module.scss';

const KOALENDAR_URL = 'https://koalendar.com/e/meet-with-carson-koaUwc9W';

const steps = [
  {
    title: 'Discovery Call',
    description: "We hop on a quick call where I learn about your store, your current conversion rate, your traffic sources, and what's not working. I'll ask the right questions to understand your situation and determine if there's a real opportunity to improve your numbers. By the end of the call, I'll tell you honestly whether I can help or not. If it's a fit, I'll walk you through the process, what to expect, and how we get started."
  },
  {
    title: 'Audit',
    description: "Every page. Every funnel step. Mobile and desktop. Within the first week you have a complete breakdown of where revenue is leaking and why. A 30 to 40+ page report with every issue ranked by revenue impact and a full video walkthrough explaining each recommendation."
  },
  {
    title: 'Implementation & Results',
    description: "Whether your team implements the roadmap or I handle it through ongoing optimization, the changes start driving results within weeks. Better conversion rates, higher AOV, more revenue from the same traffic."
  }
];

const GrowthProcess = () => {
  return (
    <section className={styles.growthProcess} aria-label="Process" id="process">
      <div className={styles.container}>
        <span className={styles.eyebrow}>Process</span>
        <h2 className={styles['growth-process__title']}>Here's How It Works</h2>
        
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <a href={KOALENDAR_URL} target="_blank" rel="noopener noreferrer" className={styles.button}>
            <span>Schedule a Discovery Call</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default GrowthProcess;
