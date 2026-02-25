import React from 'react';
import styles from './TheProblem.module.scss';

const TheProblem = () => {
  return (
    <section className={styles.problem}>
      <h2>Your Store Is Losing Revenue Right Now</h2>
      
      <div className={styles.problemIntro}>
        <p>While you're reading this, potential customers are landing on your store, getting frustrated, and leaving to buy from your competitors.</p>
        <p><strong>And you probably have no idea it's happening.</strong></p>
      </div>
      
      <div className={styles.problemGrid}>
        <div className={styles.problemCard}>
          <div className={styles.stat}>3 seconds</div>
          <p>That's how long visitors give your site before deciding to stay or leave. If your hero doesn't answer what this is, why they should care, and what to do next, they're gone.</p>
        </div>
        
        <div className={styles.problemCard}>
          <div className={styles.stat}>97%</div>
          <p>Of your visitors leave without buying. At a 3% conversion rate, you're paying to acquire 100 visitors and losing 97 of them. That's not a traffic problem. That's a conversion problem.</p>
        </div>
        
        <div className={styles.problemCard}>
          <div className={styles.stat}>$10,000+</div>
          <p>Average monthly revenue loss from fixable conversion issues in mid-sized stores. How much is YOUR store losing while you're sitting on these problems?</p>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;
