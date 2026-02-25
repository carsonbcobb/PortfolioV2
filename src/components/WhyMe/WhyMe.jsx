import React from 'react';
import styles from './WhyMe.module.scss';

const cards = [
  {
    headline: "I've seen your exact problem before.",
    text: "After 50+ audits, patterns are obvious to me that are invisible to most. I don't guess. I look at your data and know within minutes where the biggest leaks are because I've fixed the same ones dozens of times."
  },
  {
    headline: 'I do the work. Not a team.',
    text: 'No account managers relaying your feedback to a junior developer who has never run a store. You talk to me. I do the analysis. I write the audit. I build the fix. One person, fully accountable.'
  },
  {
    headline: 'I only care about revenue.',
    text: "I'm not going to redesign your site to win a design award. Every recommendation I make is ranked by how much money it will recover. If it doesn't move the needle on revenue, it doesn't make the report."
  },
  {
    headline: "I'll tell you if I can't help.",
    text: "Not every store needs an audit. If I don't see a real opportunity to improve your numbers, I'll tell you on the discovery call and save you the money."
  }
];

const WhyMe = () => {
  return (
    <section className={styles.proof}>
      <h2>This Isn't My First Store</h2>
      <p className={styles.proofSubtext}>
        I've spent 6+ years inside Shopify stores across health, wellness, supplements, apparel, and DTC. I've optimized 50+ stores and generated over $10M in additional revenue for clients. Here's what that means for you.
      </p>
      <div className={styles.proofCards}>
        {cards.map((card, index) => (
          <div key={index} className={styles.proofCard}>
            <h3>{card.headline}</h3>
            <p>{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyMe;
