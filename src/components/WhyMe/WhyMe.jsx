import React from 'react';
import styles from './WhyMe.module.scss';

const cards = [
  {
    headline: 'Depth in every part of the store.',
    text: 'Conversion, development, AI search, traffic, retention, and operations. Real skill in each, not a generalist who is shallow everywhere. That combination is rare and it is what a store actually needs.'
  },
  {
    headline: 'One price instead of four invoices.',
    text: 'Hiring each of these skills separately means four or five contractors and four or five bills. You get the same range for one flat monthly retainer.'
  },
  {
    headline: 'Nothing falls through the gaps.',
    text: 'When one specialist covers the whole store, the SEO work and the dev work and the conversion work actually line up. No disconnected vendors producing a disconnected store.'
  },
  {
    headline: 'I will tell you if I cannot help.',
    text: 'Not every store is a fit. If I do not see a real opportunity to move your numbers, I will tell you early and save you the money.'
  }
];

const WhyMe = () => {
  return (
    <section className={styles.proof} id="trust">
      <span className={styles.eyebrow}>Why Work With Me</span>
      <h2>The range of a whole team, from one specialist.</h2>
      <p className={styles.proofSubtext}>
        Most stores need conversion, development, AI search, retention, and operations handled. Brands usually hire four or five people for that. I have spent 6+ years across 50+ Shopify stores in nearly every DTC vertical building depth in all of it, so you get the full range without the full headcount.
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
