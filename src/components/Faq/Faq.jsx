import React, { useRef, useState } from 'react';
import styles from './Faq.module.scss';

const faqs = [
  {
    question: 'How much does this actually cost?',
    answer: 'We start with a discovery call to discuss your store\'s performance and see if there\'s an opportunity to work together. After that, pricing depends on what your store needs. Could be $3K for targeted fixes. Could be $20K for a complete overhaul. I give you transparent pricing after we identify the problems. Here\'s what I can tell you: my work is an investment that generates ROI, not an expense. You\'ll see measurable improvements in your conversion rates and revenue.'
  },
  {
    question: 'How fast will I see results?',
    answer: 'Some fixes show impact immediately - fix a slow page, watch bounce rate drop that same day. Bigger improvements take 2-4 weeks to show meaningful data. But you\'ll see measurable results in metrics that matter, not vague promises about "brand perception."'
  },
  {
    question: 'I\'ve already had my store "optimized" - what\'s different?',
    answer: 'Then someone missed something. I constantly find critical issues on stores that were supposedly "already optimized." The previous developer either didn\'t know what to look for or took shortcuts. Let\'s discuss your store\'s performance on a discovery call - I\'ll share initial thoughts on what I\'m seeing and we can explore if my approach is a fit for your goals.'
  },
  {
    question: 'Do you guarantee specific results?',
    answer: 'I don\'t make percentage guarantees because every store is different. What I will tell you: I only take projects where I\'m confident I can make a significant impact on your revenue. If I don\'t think I can help you, I\'ll say so on the discovery call. I\'m not desperate for clients - I\'m selective about who I work with.'
  },
  {
    question: 'Why shouldn\'t I just hire an agency instead?',
    answer: 'Go ahead if you want to pay $15K minimum, work with junior developers, and wait months for results. Agencies have massive overhead. You\'re paying for their fancy office and account managers, not expertise. With me, you work directly with someone who\'s actually done this work at scale. I move faster and cost less. Your choice.'
  },
  {
    question: 'What actually happens on the discovery call?',
    answer: 'We\'ll discuss your store\'s performance and see if there\'s an opportunity to work together. I\'ll share initial thoughts on what I\'m seeing and we can explore if my approach is a fit for your goals. No sales pitch. No pressure. Just a clear conversation about your store\'s current state and whether we\'re a good fit to work together.'
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