import React from 'react';
import styles from './Services.module.scss';

const Services = () => {
  return (
    <section className={styles.whatIDo} id="service-bundles">
      <h2>I Find Money You're Losing And Recover It</h2>
      
      <div className={styles.approach}>
        <p className={styles.approachIntro}>Most developers just build what you ask for. I dig deeper.</p>
        
        <div className={styles.approachGrid}>
          <div className={styles.approachCard}>
            <div className={styles.cardIcon}>🔍</div>
            <h3>I Find Every Leak</h3>
            <p>Slow load times killing mobile traffic. Broken checkout flows losing sales. Poor UX destroying conversion rates. Hidden technical problems dragging down performance. I find every single thing costing you revenue.</p>
          </div>

          <div className={styles.approachCard}>
            <div className={styles.cardIcon}>⚡</div>
            <h3>I Fix Them Fast</h3>
            <p>No endless discovery phases. No junior developers learning on your dime. No bureaucratic waste. I move fast, communicate clearly, and execute efficiently.</p>
          </div>

          <div className={styles.approachCard}>
            <div className={styles.cardIcon}>💰</div>
            <h3>You Make More Money</h3>
            <p>Better conversion rates. Lower bounce rates. Higher average order values. More revenue from the same traffic. Results you measure in dollars, not vanity metrics.</p>
          </div>
        </div>
      </div>

      <div className={styles.whatYouGet}>
        <h3>Here's Exactly What Happens When You Work With Me:</h3>
        
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h4>Free 30-Minute Store Audit</h4>
            <p>I'll tear apart your store on a live call and show you:</p>
            <ul>
              <li>The single biggest conversion killer on your site right now</li>
              <li>Specific technical issues costing you sales every day</li>
              <li>Quick wins worth thousands in recovered revenue</li>
              <li>Exactly how much money you're leaving on the table</li>
            </ul>
            <p className={styles.stepValue}>This audit is worth $1,000. You get it free. Zero strings attached.</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h4>Custom Battle Plan (If We're A Good Fit)</h4>
            <p>I'll create a detailed plan showing:</p>
            <ul>
              <li>Every issue I found, ranked by revenue impact</li>
              <li>Exactly what I'll fix and how I'll do it</li>
              <li>Clear timeline with transparent pricing</li>
              <li>Projected impact on your bottom line</li>
            </ul>
            <p className={styles.stepValue}>No cookie-cutter packages. No upselling. Just what YOUR store actually needs.</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h4>Fast Execution & Real Results</h4>
            <p>I get to work immediately:</p>
            <ul>
              <li>Fix critical revenue-killers first</li>
              <li>Regular updates so you know exactly what's happening</li>
              <li>Everything tested to ensure it actually works</li>
              <li>You see measurable improvement in your metrics within weeks</li>
            </ul>
            <p className={styles.stepValue}>My work typically pays for itself within 30 days through increased revenue.</p>
          </div>
        </div>
      </div>

      <div className={styles.whatIDoBottom}>
        <a href="https://koalendar.com/e/meet-with-carson-koaUwc9W-2" className={styles.btnHuge} target="_blank" rel="noopener noreferrer">
          Get Your Free Store Audit Now
        </a>
        <p className={styles.guarantee}>Even if we don't work together, you'll walk away knowing exactly what's costing you sales and how to fix it.</p>
      </div>
    </section>
  );
};

export default Services;
