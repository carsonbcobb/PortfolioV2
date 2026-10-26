import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './GrowthProcess.module.scss';

const EMAIL_URL = 'mailto:carson@carsoncobb.com?subject=Shopify%20store%20inquiry';

const steps = [
  {
    title: 'Get In Touch',
    description: 'Send me a message about your store and where it is falling short. We get on a quick call so I can understand the business and tell you honestly whether I am the right fit for it.'
  },
  {
    title: 'I Take Over The Store',
    description: 'You start the retainer and I get to work. The first thing I do is a full-store audit that maps where revenue is leaking, across conversion, technical, AI search, retention, and operations. That audit becomes the plan for everything that follows, at no separate cost.'
  },
  {
    title: 'Ongoing Optimization',
    description: 'From there I run the store month over month. Continuous improvement across conversion, development, AI search, traffic, retention, and operations, all under one flat retainer with clear accountability for the results.'
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
              <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <a href={EMAIL_URL} className={styles.button}>
            <span>Get in touch</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default GrowthProcess;
