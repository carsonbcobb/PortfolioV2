import React from 'react';
import styles from './CaseStudies.module.scss';

const caseStudies = [
  {
    title: "Health & Wellness Brand",
    story: "Optimized product page load and streamlined the Add-to-Cart flow, resulting in a noticeably smoother checkout experience and happier customers."
  },
  {
    title: "Supplement Retailer",
    story: "Upgraded image handling and reduced script bloat—customers saw pages load faster, and cart abandonment dropped significantly."
  },
  {
    title: "Sports Performance Company",
    story: "Ran targeted UX micro-tests and refined button copy, which noticeably improved user engagement and guided more shoppers into checkout."
  }
];

const CaseStudies = () => {
  return (
    <section className={styles['case-studies']} id="case-studies">
      <h2 className={styles['case-studies__title']}>Real Client Success Stories</h2>
      <div className={styles['case-studies__grid']}>
        {caseStudies.map((caseStudy, index) => (
          <div key={index} className={styles['case-study-card']}>
            <h3 className={styles['case-study-card__title']}>{caseStudy.title}</h3>
            <p className={styles['case-study-card__story']}>{caseStudy.story}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseStudies; 