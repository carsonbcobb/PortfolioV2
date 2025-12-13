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
      aria-label="Schedule a Discovery Call"
    >
      Schedule a Discovery Call
    </button>
  );
};

export default StickyAuditButton; 