import React, { useRef, useState } from 'react';
import styles from './Faq.module.scss';

const faqs = [
  {
    question: 'How does this work and what does it cost?',
    answer: 'The core offer is a monthly retainer at $2,500/mo where I run your entire Shopify store across conversion, development, AI search, retention, and operations. There is also a standalone full-store audit at $2,000 if you just want to see what your store is losing first. Retainer clients get that audit as the first thing I do, at no separate cost. Send me a message and I will tell you which fits your situation.'
  },
  {
    question: 'Why a retainer instead of hiring specialists as I need them?',
    answer: 'To properly cover a store you normally need a designer, a developer, an SEO, and a retention person. That is four or five contractors, four or five invoices, and a lot of coordination that lands on you. The retainer gives you that whole range of expertise for one flat monthly price, working together instead of in silos.'
  },
  {
    question: 'What does the retainer actually cover?',
    answer: 'Everything a store needs to grow: conversion and testing, Shopify development and technical health, AI search visibility and structured data, traffic and SEO, retention and subscriptions, and the operations underneath like settings, order flows, and email. It all moves under one plan instead of being split across separate vendors.'
  },
  {
    question: 'How fast will I see results?',
    answer: 'The audit that kicks off the retainer lands within the first week or so. From there, most clients see measurable improvement within the first several weeks, and it compounds month over month because every part of the store is finally being worked on together.'
  },
  {
    question: 'What about AI search? Why does that matter?',
    answer: 'More buyers now find products through ChatGPT, Google AI, and other answer engines, not just traditional search. Structured data and AI search optimization decide whether your store shows up there. Most people optimizing stores still ignore it. I build it in as part of the retainer.'
  },
  {
    question: 'Do you guarantee specific results?',
    answer: 'No, because every store is different. What I can share is the range of results I have driven for past clients across conversion, AI search, traffic, and retention. Those are examples of what has happened, not a promise of what any specific store will do.'
  }
];

function AccordionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggle = () => {
    setIsOpen(!isOpen);
    const el = contentRef.current;
    if (!isOpen) {
      el.style.paddingBottom = '1.75rem';
      el.style.maxHeight = el.scrollHeight + 'px';
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
export { faqs };
