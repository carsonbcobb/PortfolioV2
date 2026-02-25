import React from 'react';
import styles from './Hero.module.scss';

const KOALENDAR_URL = 'https://koalendar.com/e/meet-with-carson-koaUwc9W';

const Hero = () => {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>I Turn Shopify Stores Into Conversion Machines</h1>
          
          <div className={styles.copy}>
            <p>Your store is losing revenue to problems you can't see. I find every conversion killer, show you exactly what it's costing you, and fix it. Conversion audits, ongoing optimization, and white-label partnerships for agencies.</p>
          </div>

          <div className={styles.ctaGroup}>
            <a 
              href={KOALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryCta}
            >
              Schedule a Discovery Call
            </a>
            <a href="#results" className={styles.secondaryCta}>
              See Results
            </a>
          </div>

          <div className={styles.scarcity}>
            I take on a limited number of clients at a time to ensure every brand gets my full attention.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 