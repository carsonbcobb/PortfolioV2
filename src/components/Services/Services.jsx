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
            <h4>Discovery Call</h4>
            <p>We'll discuss your store's current performance and explore opportunities for growth:</p>
            <ul>
              <li>Review what's impacting your store's performance</li>
              <li>Share initial thoughts on opportunities I'm seeing</li>
              <li>Explore if my approach aligns with your goals</li>
              <li>Determine if there's a mutual fit to work together</li>
            </ul>
            <p className={styles.stepValue}>I'll review your store beforehand and come to the call with specific observations about what's working and what's not. We'll discuss the revenue impact of fixing these issues, and if it makes sense to work together, I'll outline exactly what that looks like.</p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h4>Custom Proposal (If We're A Good Fit)</h4>
            <p>I'll send you a detailed proposal that includes:</p>
            <ul>
              <li>My recommendations for your store, ranked by revenue impact</li>
              <li>Hour estimates for each recommendation so you know exactly what you're paying for</li>
              <li>A roadmap for future growth after the project is complete</li>
              <li>Transparent payment terms and next steps</li>
              <li>Everything you need to make an informed decision</li>
            </ul>
            <p className={styles.stepValue}>Every proposal is built specifically for your store's needs and growth stage. You'll know exactly what you're investing in, why it matters for your revenue, and what results to expect. No surprises, no hidden costs - just a clear path to making more money from your existing traffic.
            </p>
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
            <p className={styles.stepValue}>My work is an investment that generates ROI, not an expense. You'll see measurable improvements in your conversion rates and revenue.</p>
          </div>
        </div>
      </div>

      <div className={styles.whatIDoBottom}>
        <a href="https://koalendar.com/e/meet-with-carson-koaUwc9W-2" className={styles.btnHuge} target="_blank" rel="noopener noreferrer">
          Schedule a Discovery Call
        </a>
        <p className={styles.guarantee}>I'll review your store beforehand and come to the call with specific observations about what's working and what's not. We'll discuss the revenue impact of fixing these issues, and if it makes sense to work together, I'll outline exactly what that looks like.</p>
      </div>
    </section>
  );
};

export default Services;
