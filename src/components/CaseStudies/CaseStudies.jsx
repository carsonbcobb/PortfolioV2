import React from 'react';
import styles from './CaseStudies.module.scss';

const caseStudies = [
  {
    title: "Subscription E-Commerce Platform",
    problem: "Platform losing subscribers. Broken checkout killing conversions.",
    solutions: [
      "Complete platform migration",
      "Rebuilt subscription experience",
      "Fixed all mobile UX issues"
    ],
    resultHeadline: "+$200K ANNUAL RECURRING REVENUE",
    resultMetrics: [
      "20% Conversion Increase",
      "15% Retention Boost"
    ]
  },
  {
    title: "Health Supplement Brand",
    problem: "High traffic, terrible conversion. Cart abandonment destroying profit.",
    solutions: [
      "Redesigned product pages",
      "Custom checkout optimization",
      "Mobile experience overhaul"
    ],
    resultHeadline: "2X MOBILE REVENUE",
    resultMetrics: [
      "Conversion Rate: +40%",
      "Average Order Value: ↑"
    ]
  },
  {
    title: "Agency Client Portfolio",
    problem: "Multiple clients with slow sites, poor SEO, declining conversions.",
    solutions: [
      "Performance optimization",
      "Strategic landing pages",
      "Data-driven A/B testing"
    ],
    resultHeadline: "CONSISTENT GROWTH ACROSS ALL CLIENTS",
    resultMetrics: [
      "↑ Speed  ↑ Rankings",
      "↑ Revenue Per Visitor"
    ]
  }
];

const CaseStudies = () => {
  return (
    <section className={styles['case-studies']} id="case-studies">
      <h2 className={styles['case-studies__title']}>Real Stores, Real Revenue Growth</h2>
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
              <ul>
                {caseStudy.solutions.map((solution, idx) => (
                  <li key={idx}>{solution}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles['case-study-card__results']}>
              <div className={styles['result-box']}>
                <div className={styles['result-icon']}>📊</div>
                <div className={styles['result-headline']}>{caseStudy.resultHeadline}</div>
                <div className={styles['result-metrics']}>
                  {caseStudy.resultMetrics.map((metric, idx) => (
                    <div key={idx} className={styles['result-metric']}>{metric}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseStudies; 