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
            <h2 className={styles['contact-bottom__title']}>Ready to Book Your Free 5-Point Speed & UX Audit Call?</h2>
            <p className={styles.copy}>
              Choose a 30-minute slot below for your live audit call. You'll receive a tailored PDF report within 24 hours.
            </p>
          </div>
          <div className={styles.calendarContainer}>
            <div id="inline-widget-meet-with-carson-koaUwc9W"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBottom;
