import React, { useEffect } from 'react';
import styles from './ContactBottom.module.scss';

const ContactBottom = () => {
  useEffect(() => {
    // Load Koalendar script if not already loaded
    if (!document.querySelector('script[src="https://koalendar.com/assets/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://koalendar.com/assets/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Initialize Koalendar after component mounts
    const initKoalendar = () => {
      if (window.Koalendar) {
        window.Koalendar('inline', {
          url: 'https://koalendar.com/e/meet-with-carson-koaUwc9W?embed=true&hide_branding=true',
          selector: '#inline-widget-meet-with-carson-koaUwc9W'
        });
      }
    };

    // If Koalendar is already loaded, initialize immediately
    if (window.Koalendar) {
      initKoalendar();
    } else {
      // Otherwise, wait for the script to load
      window.addEventListener('load', initKoalendar);
    }

    // Remove Koalendar branding link
    const removeBrandingLink = () => {
      // Target the specific div containing the branding
      const brandingDiv = document.querySelector('div.flex.items-center.justify-center.w-full.p-1\\.5.text-base.text-gray-500');
      if (brandingDiv) {
        brandingDiv.remove();
      }
    };

    // Initial removal
    removeBrandingLink();

    // Set up a MutationObserver to catch dynamically added links
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        removeBrandingLink();
      });
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener('load', initKoalendar);
      observer.disconnect();
    };
  }, []);

  return (
    <div id="contact-bottom" className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles['contact-bottom__title']}>Ready To Stop Leaving Money On The Table?</h2>
            <p className={styles.copy}>
              Every day you wait is another day of lost revenue. Every hour your store has these issues is money walking out the door.
            </p>
            <p className={styles.copy}>
              The audit is free. The insights are invaluable. And if we're a good fit, you could see ROI within weeks.
            </p>
            <div className={styles.calendarHeading}>
              <h3>Book Your Free Store Audit</h3>
              <p className={styles.availability}>Limited availability: Only 3 audit spots left this month.</p>
            </div>
          </div>
          <div className={styles.calendarContainer}>
            <div id="inline-widget-meet-with-carson-koaUwc9W"></div>
            <p className={styles.calendarFooter}>The audit takes 30 minutes. What you learn could be worth thousands in recovered revenue.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBottom;
