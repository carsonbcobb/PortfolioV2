import React from 'react';
import styles from './TheProblem.module.scss';

const TheProblem = () => {
  return (
    <section className={styles.problem} id="problem">
      <span className={styles.eyebrow}>The Problem</span>
      <h2>You're paying for traffic that your site is <em>actively losing</em>.</h2>

      <div className={styles.problemIntro}>
        <p>Most ecommerce brands spend $10k to $30k per month on ads sending people to a site that converts at 1% to 3%. That means 97% to 99% of visitors leave without buying. The problem isn't your product. It isn't your ads. It's the experience between the click and the purchase, and almost nobody is looking at it.</p>
      </div>

      <div className={styles.problemGrid}>
        <div className={styles.problemCard}>
          <span className={styles.stepNum}>01</span>
          <h3>Revenue Leaks You Can't See</h3>
          <p>Add to cart buttons invisible on mobile. Reviews buried in tabs nobody opens. Shipping costs that surprise at checkout. These aren't design preferences. They're revenue killers hiding in plain sight.</p>
        </div>
        <div className={styles.problemCard}>
          <span className={styles.stepNum}>02</span>
          <h3>Zero Purchase Psychology</h3>
          <p>Cold traffic from ads needs trust, education, and confidence to buy. Most product pages provide none of this. Visitors want to buy. Your site just doesn't give them a reason to commit.</p>
        </div>
        <div className={styles.problemCard}>
          <span className={styles.stepNum}>03</span>
          <h3>Every Visitor Costs Money</h3>
          <p>At a 2% conversion rate, you're paying to acquire 100 visitors and losing 98 of them. That's not a traffic problem. That's a conversion problem. And it compounds every single month.</p>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;
