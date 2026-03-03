import React, { useRef, useState } from 'react';
import styles from './Faq.module.scss';

const faqs = [
  {
    question: 'How much does this actually cost?',
    answer: 'A standalone conversion audit is $1,997, delivered in 7 business days. Ongoing optimization and development is $85/hr. For agencies looking for white-label partnerships, pricing depends on volume. Schedule a call and I\'ll help figure out what makes sense for your situation.'
  },
  {
    question: 'How fast will I see results?',
    answer: 'The audit is delivered within 7 business days. Once changes start being implemented, most clients see measurable improvements within the first few weeks. The timeline depends on how quickly your team can implement or whether I\'m handling the ongoing work.'
  },
  {
    question: "I've already had my store optimized. What's different?",
    answer: "Most optimization is surface level. A developer moves some buttons around, updates the theme, maybe speeds up load time. I go deeper. I analyze the psychology behind why visitors aren't buying, where they're dropping off, and what specific changes will recover the most revenue. It's not a design refresh. It's a forensic analysis of your entire funnel."
  },
  {
    question: 'Do you guarantee specific results?',
    answer: "I don't guarantee specific numbers because every store is different. What I can tell you is that I've taken stores from 2.4% to 6.7%, from 3.2% to 7.4%, and helped multiple brands more than double their revenue from the same traffic. The results speak for themselves."
  },
  {
    question: "Why shouldn't I just hire an agency?",
    answer: "You can. But with an agency you'll get an account manager who doesn't touch your store, junior developers learning on your dime, and a process designed to bill hours, not drive results. With me, you get one person who has 6+ years of experience, has optimized 50+ stores, and is personally accountable for the work."
  },
  {
    question: 'What about the white-label partnership?',
    answer: "If you run an agency and want to offer conversion audits to your clients without building a CRO team, I handle the entire audit under your brand. You set your own price, keep the margin, and keep all the ongoing work it generates. It's a new revenue stream with zero overhead."
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
      <span className={styles.eyebrow}>FAQ</span>
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
