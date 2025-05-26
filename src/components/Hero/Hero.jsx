import React from 'react';
import styles from './Hero.module.scss';

const Hero = () => {
  const openAuditModal = () => {
    // TODO: Implement modal opening logic
    console.log('Opening audit modal');
  };

  return (
    <section className={styles.hero} aria-label="Hero: boost add-to-cart">
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>🚀 Increase your Add-to-Cart Rate by 8–15% in 30 Days — Guaranteed</h1>
          
          <div className={styles.copy}>
            <p>High-impact speed, UX & CRO sprint designed to boost your carts—or I’ll keep working free until we do.</p>
            <p className={styles.microTrust}>
            Trusted by 30+ Shopify merchants for consistent growth.
            </p>
          </div>

          <div className={styles.ctaGroup}>
            <a 
              href="https://koalendar.com/e/meet-with-carson-koaUwc9W"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryCta}
              aria-label="Book My Free Audit"
            >
              📅 Book My Free Audit
            </a>
          </div>

          <div className={styles.processStrip}>
            <span>🕵️‍♂️ Audit</span> → <span>🚀 Optimize</span> → <span>📈 Grow</span>
          </div>

          <div className={styles.scarcity}>
            🚨 Only <strong>3 Accelerator slots</strong> left this month
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero; 