import React from 'react';
import styles from './Hero.module.scss';

const Hero = () => {
  return (
    <section className={styles.hero} aria-label="Hero: boost add-to-cart">
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>I Turn Shopify Stores Into Conversion Machines</h1>
          
          <div className={styles.copy}>
          <p>Your store is losing revenue every day to technical issues you don't even know exist. I find them and fix them - that's how I've generated over $5M in additional revenue for e-commerce brands.
          </p>
          </div>

          <div className={styles.ctaGroup}>
            <a 
              href="https://koalendar.com/e/meet-with-carson-koaUwc9W"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryCta}
            >
              Get Your Free Store Audit
            </a>
          </div>

          <div className={styles.scarcity}>
          🚨 Only 3 audit spots available this month
</div>
        </div>

      </div>
    </section>
  );
};

export default Hero; 