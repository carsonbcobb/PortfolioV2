import React from 'react';
import styles from './TheProblem.module.scss';

const TheProblem = () => {
  return (
    <section className={styles.problem} id="problem">
      <span className={styles.eyebrow}>The Problem</span>
      <h2>Hiring each skill separately is <em>expensive and disjointed</em>.</h2>

      <div className={styles.problemIntro}>
        <p>To cover everything a store needs, most DTC brands hire a designer, a developer, an SEO, and a retention person. That is four or five salaries or contractors, none of them cheap, and they rarely coordinate. You pay a fortune and still stitch the pieces together yourself.</p>
      </div>

      <div className={styles.problemGrid}>
        <div className={styles.problemCard}>
          <span className={styles.stepNum}>01</span>
          <h3>Four Or Five Line Items</h3>
          <p>Each specialty is its own hire and its own invoice. The total to properly cover a store runs well past a single monthly retainer.</p>
        </div>
        <div className={styles.problemCard}>
          <span className={styles.stepNum}>02</span>
          <h3>Skills That Don't Talk</h3>
          <p>Your SEO does not know what your dev changed. Your designer does not know what converts. Disconnected experts produce a disconnected store.</p>
        </div>
        <div className={styles.problemCard}>
          <span className={styles.stepNum}>03</span>
          <h3>You Manage It All</h3>
          <p>Coordinating four vendors becomes your job. You end up project managing instead of running your business.</p>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;
