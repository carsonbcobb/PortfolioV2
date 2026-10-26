import React from 'react';
import styles from './Hero.module.scss';

const EMAIL_URL = 'mailto:carson@carsoncobb.com?subject=Shopify%20store%20inquiry';

const Hero = () => {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>Full-Store Shopify Operator</span>
          <h1>A whole team's worth of Shopify expertise, for one <em>low monthly retainer</em>.</h1>

          <div className={styles.copy}>
            <p>Conversion, development, AI search, retention, and store operations. The range of skills a DTC brand usually hires four or five people for, delivered by one specialist who has done all of it. $2,500/mo.</p>
          </div>

          <div className={styles.ctaGroup}>
            <a
              href={EMAIL_URL}
              className={styles.primaryCta}
            >
              Get in touch
            </a>
            <a href="#results" className={styles.secondaryCta}>
              See My Results
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
