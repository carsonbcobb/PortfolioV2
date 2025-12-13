import React from 'react';
import styles from './WhyMe.module.scss';

const WhyMe = () => {
  return (
    <section className={styles.proof}>
      <h2>Here's Why You Should Trust Me</h2>
      
      <div className={styles.proofContent}>
        <div className={styles.proofMain}>
          <h3>I've Been Doing This For Years</h3>
          <p>Over 6+ years, I've optimized 30+ e-commerce stores across supplements, health & wellness, and DTC brands. I've seen every mistake. Every conversion killer. Every technical issue that silently destroys revenue.</p>
          <p><strong>More importantly - I know exactly how to fix them.</strong></p>
        </div>

        <div className={styles.proofStats}>
          <div className={styles.proofStat}>
            <div className={styles.statNumber}>30+</div>
            <div className={styles.statLabel}>Stores Optimized</div>
          </div>
          <div className={styles.proofStat}>
            <div className={styles.statNumber}>6+</div>
            <div className={styles.statLabel}>Years Experience</div>
          </div>
          <div className={styles.proofStat}>
            <div className={styles.statNumber}>$5M+</div>
            <div className={styles.statLabel}>Revenue Generated</div>
          </div>
        </div>

        <div className={styles.proofBullets}>
          <h4>What Makes Me Different From Every Other Developer:</h4>
          <ul>
            <li><strong>You work directly with me.</strong><br/>No account managers. No junior developers. No middlemen. Just me, personally handling your project.</li>
            <li><strong>I've worked with major brands.</strong><br/>The optimization strategies that work for 8-figure companies work for growing brands too. I bring that experience to your store.</li>
            <li><strong>I focus on revenue, not vanity metrics.</strong><br/>I don't care about "pretty code" or technical perfectionism. I care about what makes you more money.</li>
            <li><strong>I move fast and execute efficiently.</strong><br/>No corporate bureaucracy. No endless meetings. Just clear communication and fast results.</li>
          </ul>
        </div>
      </div>

      <div className={styles.proofCta}>
        <h3>Let Me Prove It</h3>
        <p>Let's discuss your store's performance and see if there's an opportunity to work together. I'll share initial thoughts on what I'm seeing and we can explore if my approach is a fit for your goals.</p>
        <a href="https://koalendar.com/e/meet-with-carson-koaUwc9W-2" className={styles.btnSecondary} target="_blank" rel="noopener noreferrer">
          Schedule a Discovery Call
        </a>
      </div>
    </section>
  );
};

export default WhyMe;

