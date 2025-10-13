import React from 'react';
import styles from './TheProblem.module.scss';

const TheProblem = () => {
  return (
<section className={styles.problem}>
  <h2>Your Store Is Bleeding Revenue Right Now</h2>
  
  <div className={styles.problemIntro}>
    <p>While you're reading this, potential customers are landing on your store, getting frustrated, and leaving to buy from your competitors.</p>
    <p><strong>And you probably have no idea it's happening.    </strong></p>
  </div>
  
  <div className={styles.problemGrid}>
    <div className={styles.problemCard}>
      <div className={styles.stat}>4 seconds</div>
      <p>That's how long customers wait before abandoning a slow site. Every second over that threshold is burning money. If your mobile store takes longer, you're hemorrhaging revenue every single hour.
      </p>
    </div>
    
    <div className={styles.problemCard}>
      <div className={styles.stat}>70%</div>
      <p>Of shoppers add items to cart but never buy. Small friction points you can't see are destroying your revenue potential. Each abandoned cart is money walking out the door.</p>
    </div>
    
    <div className={styles.problemCard}>
      <div className={styles.stat}>$10,000+</div>
      <p>Average monthly revenue loss from fixable technical issues in mid-sized stores. How much is YOUR store losing while you're sitting on these problems?</p>
    </div>
  </div>

  <div className={styles.problemBottom}>
    <h3>The worst part?</h3>
    <p>You can't fix what you can't see. These issues are invisible until someone who knows what to look for tears your store apart.</p>
    <p><strong>That's exactly what I do.</strong></p>
  </div>
</section>
  );
};

export default TheProblem;

