import React from 'react';
import './StickyAuditButton.scss';

const StickyAuditButton = () => {
  return (
    <a
      href="https://ghostrevenue.co"
      target="_blank"
      rel="noopener noreferrer"
      className="sticky-audit-button"
      aria-label="Need full implementation? Visit Ghost Revenue"
    >
      Need full implementation?
    </a>
  );
};

export default StickyAuditButton; 