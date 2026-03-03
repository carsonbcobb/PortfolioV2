import React from 'react';
import styles from './Hero.module.scss';

const KOALENDAR_URL = 'https://koalendar.com/e/ghost-revenue-discovery-call';

const Hero = () => {
  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>Conversion Optimization Specialist</span>
          <h1>Your store is <em>bleeding revenue</em>. I find it and fix it.</h1>

          <div className={styles.copy}>
            <p>I start every engagement with a full-funnel conversion audit to find exactly where your site is losing revenue. Then I fix it. Audits, ongoing optimization, and white-label partnerships for agencies.</p>
          </div>

          <div className={styles.ctaGroup}>
            <a
              href={KOALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryCta}
            >
              See What Your Store Is Losing
            </a>
            <a href="#results" className={styles.secondaryCta}>
              See My Results
            </a>
          </div>

          <div className={styles.scarcity}>
            I take on a limited number of clients at a time so every brand gets my full attention.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 