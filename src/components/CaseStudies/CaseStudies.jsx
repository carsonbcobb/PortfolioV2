import React from 'react';
import styles from './CaseStudies.module.scss';

const caseStudies = [
  {
    tag: 'Conversion',
    title: 'DTC Health & Wellness Brand',
    problem: 'Converting at 2.4%. Product pages were not educating new visitors, trust elements were missing or in the wrong places, and the mobile experience was dragging down 70%+ of their traffic.',
    solution: 'Took over the store end to end. Rebuilt product page structure, moved social proof above the fold, restructured the mobile experience, and fixed technical performance issues.',
    resultPrimary: '2.4% → 6.7% CVR',
    resultSecondary: '179% revenue increase from the same traffic'
  },
  {
    tag: 'AI Search + Traffic',
    title: 'DTC Supplement Brand',
    problem: 'Invisible in AI search and losing organic ground. No structured data, thin technical SEO, and zero presence in AI answer engines while competitors were getting cited.',
    solution: 'Implemented full structured data and schema, rebuilt the technical SEO foundation, and optimized product and category content for answer engines and AI search.',
    resultPrimary: 'Cited in AI answers for 50+ buyer queries',
    resultSecondary: '68% increase in organic traffic over 6 months, with new AI search visibility in ChatGPT and Google AI'
  },
  {
    tag: 'Retention + Ongoing Retainer',
    title: 'E-Commerce Subscription Brand',
    problem: 'Strong first orders but weak repeat revenue. Low subscription opt-in, no upsell path, and email flows that were not converting repeat buyers.',
    solution: 'Ongoing retainer running the full store. Rebuilt subscription and upsell flows, restructured post-purchase email, and continuously tested across the funnel month over month.',
    resultPrimary: 'Subscription opt-in 8% → 21%',
    resultSecondary: '18% AOV increase and steady month over month revenue growth on the same ad spend'
  }
];

const CaseStudies = () => {
  return (
    <section className={styles['case-studies']} id="results">
      <span className={styles['case-studies__eyebrow']}>Results</span>
      <h2 className={styles['case-studies__title']}>Real Stores. Real Results.</h2>
      <p className={styles['case-studies__disclaimer']}>
        Results shown are specific past client outcomes. They are examples, not a guarantee or prediction of results for any other store. Individual results vary.
      </p>
      <div className={styles['case-studies__grid']}>
        {caseStudies.map((caseStudy, index) => (
          <div key={index} className={styles['case-study-card']}>
            <span className={styles['case-study-card__tag']}>{caseStudy.tag}</span>
            <h3 className={styles['case-study-card__title']}>{caseStudy.title}</h3>
            
            <div className={styles['case-study-card__problem']}>
              <h4>THE PROBLEM</h4>
              <p>{caseStudy.problem}</p>
            </div>
            
            <div className={styles['case-study-card__solution']}>
              <h4>WHAT I DID</h4>
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
