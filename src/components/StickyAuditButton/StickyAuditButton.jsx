import React from 'react';
import './StickyAuditButton.scss';

const StickyAuditButton = () => {
  const handleClick = () => {
    // Scroll to contact form
    const contactForm = document.getElementById('contact-bottom');
    if (contactForm) {
      contactForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button 
      className="sticky-audit-button"
      onClick={handleClick}
      aria-label="Get Free Audit"
    >
      Free Audit
    </button>
  );
};

export default StickyAuditButton; 