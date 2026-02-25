import React from 'react';
import styles from './CaseStudies.module.scss';

const caseStudies = [
  {
    title: 'DTC Health & Wellness Brand',
    problem: 'Converting at 2.4%. Product pages weren\'t educating new visitors, trust elements were missing or in the wrong places, and mobile experience was dragging down 70%+ of their traffic.',
    solution: 'Full conversion audit. Rebuilt product page structure, moved social proof above the fold, restructured mobile experience, and fixed technical performance issues.',
    resultPrimary: '2.4% → 6.7% CVR',
    resultSecondary: '179% revenue increase from the same traffic'
  },
  {
    title: 'E-Commerce Subscription Brand',
    problem: 'Converting at 3.2%. Repeat customers loved the product but new visitors were bouncing. The site wasn\'t building enough trust or education for cold ad traffic.',
    solution: 'Full conversion audit and implementation. Rebuilt the homepage for cold traffic, restructured product pages with conversion psychology, and optimized the entire mobile funnel.',
    resultPrimary: '3.2% → 7.4% CVR',
    resultSecondary: '131% revenue increase. 18% AOV increase. $0 extra ad spend.'
  },
  {
    title: 'Shopify Store (Ongoing Retainer)',
    problem: 'Multiple conversion issues across the site. Product pages underperforming, checkout flow creating friction, and site speed hurting mobile conversions.',
    solution: 'Ongoing optimization and development. Systematic improvements across every page, continuous testing, and iterative fixes based on data.',
    resultPrimary: '1.2% → 3.8% CVR',
    resultSecondary: 'Conversion rate more than doubled and continues to climb with ongoing optimizations'
  }
];

const CaseStudies = () => {
  return (
    <section className={styles['case-studies']} id="results">
      <span className={styles['case-studies__eyebrow']}>Results</span>
      <h2 className={styles['case-studies__title']}>Real Stores. Real Revenue Growth.</h2>
      <div className={styles['case-studies__grid']}>
        {caseStudies.map((caseStudy, index) => (
          <div key={index} className={styles['case-study-card']}>
            <h3 className={styles['case-study-card__title']}>{caseStudy.title}</h3>
            
            <div className={styles['case-study-card__problem']}>
              <h4><span className={styles.icon}>❌</span> THE PROBLEM</h4>
              <p>{caseStudy.problem}</p>
            </div>
            
            <div className={styles['case-study-card__solution']}>
              <h4><span className={styles.icon}>✅</span> WHAT I DID</h4>
              <p>{caseStudy.solution}</p>
            </div>
            
            <div className={styles['case-study-card__results']}>
              <div className={styles['result-box']}>
                <div className={styles['result-headline']}>{caseStudy.resultPrimary}</div>
                <div className={styles['result-metric']}>{caseStudy.resultSecondary}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseStudies;
