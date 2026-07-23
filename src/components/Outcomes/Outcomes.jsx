import React from 'react';
import styles from './Outcomes.module.scss';

const outcomes = [
  {
    title: 'Conversion',
    outcome: 'Turning the traffic you already have into more buyers. Rebuilt product pages, checkout, and mobile experience.',
    metric: '1.9% to 4.8% conversion rate'
  },
  {
    title: 'AI Search (AEO)',
    outcome: 'Getting your store surfaced in ChatGPT, Google AI, and answer engines through structured data and AI search optimization. Most stores are invisible here.',
    metric: 'Cited in AI answers for 50+ buyer queries within 90 days'
  },
  {
    title: 'Traffic',
    outcome: 'Growing qualified visits through modern SEO and structured data, so acquisition is not fully dependent on paid ads.',
    metric: '68% increase in organic traffic in 6 months'
  },
  {
    title: 'Retention & Subscriptions',
    outcome: 'Keeping customers buying after the first order with subscription flows, upsells, and email that actually converts.',
    metric: 'Subscription opt-in from 8% to 21%, 18% AOV lift'
  },
  {
    title: 'Growth',
    outcome: 'Every layer working together compounds. Steady month over month improvement instead of one-off fixes.',
    metric: '40%+ revenue lift over 6 months on the same ad spend'
  }
];

const Outcomes = () => {
  return (
    <section className={styles.outcomes} id="outcomes" aria-label="Results across the whole store">
      <span className={styles.eyebrow}>What I Move</span>
      <h2>Results across the whole store, not one slice of it.</h2>
      <p className={styles.intro}>
        A store grows when every part of it is working. Here is what I optimize for, and the kind of movement it drives.
      </p>
      <div className={styles.grid}>
        {outcomes.map((item, index) => (
          <div key={index} className={styles.card}>
            <h3>{item.title}</h3>
            <p>{item.outcome}</p>
            <p className={styles.metric}>{item.metric}</p>
          </div>
        ))}
      </div>
      <p className={styles.disclaimer}>
        Results shown are specific past client outcomes. They are examples, not a guarantee or prediction of results for any other store. Individual results vary.
      </p>
    </section>
  );
};

export default Outcomes;
