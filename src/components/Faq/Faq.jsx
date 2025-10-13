import React, { useRef, useState } from 'react';
import styles from './Faq.module.scss';

const faqs = [
  {
    question: 'How much does this actually cost?',
    answer: 'The audit is completely free. After that, pricing depends on what your store needs. Could be $3K for targeted fixes. Could be $20K for a complete overhaul. I give you transparent pricing after we identify the problems. Here\'s what I can tell you: my work typically pays for itself within the first month through increased revenue. It\'s an investment that generates ROI, not an expense.'
  },
  {
    question: 'How fast will I see results?',
    answer: 'Some fixes show impact immediately - fix a slow page, watch bounce rate drop that same day. Bigger improvements take 2-4 weeks to show meaningful data. But you\'ll see measurable results in metrics that matter, not vague promises about "brand perception."'
  },
  {
    question: 'I\'ve already had my store "optimized" - what\'s different?',
    answer: 'Then someone missed something. I constantly find critical issues on stores that were supposedly "already optimized." The previous developer either didn\'t know what to look for or took shortcuts. Book the audit - if I genuinely can\'t find anything worth fixing, you\'ve lost 30 minutes. If I do find issues (which I will), you\'ll know exactly what\'s still costing you sales.'
  },
  {
    question: 'Do you guarantee specific results?',
    answer: 'I don\'t make percentage guarantees because every store is different. What I will tell you: I only take projects where I\'m confident I can make a significant impact on your revenue. If I don\'t think I can help you, I\'ll say so on the audit call. I\'m not desperate for clients - I\'m selective about who I work with.'
  },
  {
    question: 'Why shouldn\'t I just hire an agency instead?',
    answer: 'Go ahead if you want to pay $15K minimum, work with junior developers, and wait months for results. Agencies have massive overhead. You\'re paying for their fancy office and account managers, not expertise. With me, you work directly with someone who\'s actually done this work at scale. I move faster and cost less. Your choice.'
  },
  {
    question: 'What actually happens on the free audit call?',
    answer: 'I\'ll screen share your store and walk through it in real-time, pointing out every issue I see. You\'ll leave with brutal honesty about what\'s wrong and what it\'s costing you. No sales pitch. No pressure. Just a clear understanding of your store\'s problems and what it takes to fix them. Even if we don\'t work together, you\'ll have actionable information you can use.'
  }
];

function AccordionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggle = () => {
    setIsOpen(!isOpen);
    const el = contentRef.current;
    if (!isOpen) {
      el.style.maxHeight = el.scrollHeight + 'px';
      el.style.paddingBottom = '1.25rem';
    } else {
      el.style.maxHeight = '0';
      el.style.paddingBottom = '0';
    }
  };

  return (
    <div className={`${styles['faq-item']} ${isOpen ? styles.open : ''}`}>
      <div className={styles['faq-question']} onClick={toggle}>
        {question}
        <span className={styles.arrow}>{isOpen ? '−' : '+'}</span>
      </div>
      <div
        ref={contentRef}
        className={styles['faq-answer-wrapper']}
        style={{ 
          maxHeight: 0, 
          overflow: 'hidden', 
          transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <p className={styles['faq-answer']}>{answer}</p>
      </div>
    </div>
  );
}

const Faq = () => {
    return (
        <section id="faq" aria-label="Questions You're Probably Asking" className={styles['faq-section']}>
            <h2>Questions You're Probably Asking</h2>
            <div className={styles['faq-list']}>
                {faqs.map((item, i) => (
                    <AccordionItem key={i} question={item.question} answer={item.answer} />
                ))}
            </div>
        </section>
    );
};

export default Faq; 