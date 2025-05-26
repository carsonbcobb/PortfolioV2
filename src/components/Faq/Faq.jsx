import React, { useRef, useState } from 'react';
import styles from './Faq.module.scss';

const faqs = [
    {
      question: 'How does the "8–15% add-to-cart lift" guarantee work?',
      answer: 'We install tracking to capture your baseline add-to-cart rate, then run our 30-Day A-to-C Accelerator (speed & UX optimizations, up to two A/B tests, and a final report). We aim to increase your add-to-cart rate by 8–15%. If your post-program rate hasn\'t improved by at least 8%, we\'ll keep working at no extra cost until it does.'
    },
    {
      question: "What's included in the 30-Day A-to-C Accelerator?",
      answer: '• 7-day baseline tracking setup (GA4 + add-to-cart events)\n• 0.2–0.5 s LCP speed & UX optimizations\n• Up to two A/B tests of your choice\n• Final performance report & 30 min wrap-up call'
    },
    {
      question: 'What do you need from me to get started?',
      answer: '• Admin access to your Shopify store\n• Google Analytics and Google Tag Manager permissions (or we can set them up)\n• A 30-minute kickoff call to agree on priorities'
    },
    {
      question: 'How long is the commitment?',
      answer: "• The Accelerator is a one-time, 30-day program.\n• Retainers are month-to-month with a three-month minimum; cancel anytime with 30 days' notice."
    },
    {
      question: 'Can I upgrade or downgrade my retainer tier?',
      answer: "Yes—just let us know 10 days before your next billing cycle and we'll adjust your included hours, overage rate, and deliverables accordingly."
    },
    {
      question: 'How do I book my free 5-Point Speed & UX Audit Call?',
      answer: 'Click the "Book Audit Call" button anywhere on the page, choose a 30-minute slot in my calendar, and I\'ll walk you through the live audit—then send you a tailored PDF report within 24 hours.'
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
        <section id="faq" aria-label="Frequently Asked Questions" className={styles['faq-section']}>
            <h2>Frequently Asked Questions</h2>
            <div className={styles['faq-list']}>
                {faqs.map((item, i) => (
                    <AccordionItem key={i} question={item.question} answer={item.answer} />
                ))}
            </div>
        </section>
    );
};

export default Faq; 