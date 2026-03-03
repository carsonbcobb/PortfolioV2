import React from 'react';
import styles from './StatsBar.module.scss';

const stats = [
  { value: '2.4%→6.7%', label: 'Sample CVR Lift' },
  { value: '131%', label: 'Revenue Increase (Client)' },
  { value: '$0', label: 'Extra Ad Spend Required' }
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
    </section>
  );
};

export default StatsBar;
