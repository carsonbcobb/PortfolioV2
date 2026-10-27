import React from 'react';
import styles from './StatsBar.module.scss';

const stats = [
  { value: '1.9%→4.8%', label: 'Conversion Rate Lift' },
  { value: '131%', label: 'Client Revenue Increase' },
  { value: '3.4x', label: 'Organic Traffic Growth' }
];

const StatsBar = () => {
  return (
    <section className={styles.statsBar} aria-label="Key stats">
      <div className={styles.statsBar__inner}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.stat}>
            <div className={styles.stat__value}>{stat.value}</div>
            <div className={styles.stat__label}>{stat.label}</div>
          </div>
        ))}
      </div>
      <p className={styles.disclaimer}>
        Results shown are specific past client outcomes. They are examples, not a guarantee or prediction of results for any other store. Individual results vary.
      </p>
    </section>
  );
};

export default StatsBar;
