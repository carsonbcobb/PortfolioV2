import React from 'react';
import styles from './StatsBar.module.scss';

const stats = [
  { value: '50+', label: 'Stores Optimized' },
  { value: '6+', label: 'Years Experience' },
  { value: '$10M+', label: 'Revenue Generated For Clients' }
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
