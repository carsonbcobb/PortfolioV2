import React, { useEffect } from 'react';
import styles from './ContactBottom.module.scss';

const KOALENDAR_URL = 'https://koalendar.com/e/meet-with-carson-koaUwc9W';

const ContactBottom = () => {
  useEffect(() => {
    if (!document.querySelector('script[src="https://koalendar.com/assets/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://koalendar.com/assets/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }

    const initKoalendar = () => {
      if (window.Koalendar) {
        window.Koalendar('inline', {
          url: 'https://koalendar.com/e/meet-with-carson-koaUwc9W?embed=true&hide_branding=true',
          selector: '#inline-widget-meet-with-carson-koaUwc9W'
        });
      }
    };

    if (window.Koalendar) {
      initKoalendar();
    } else {
      window.addEventListener('load', initKoalendar);
    }

    const removeBrandingLink = () => {
      const brandingDiv = document.querySelector('div.flex.items-center.justify-center.w-full.p-1\\.5.text-base.text-gray-500');
      if (brandingDiv) {
        brandingDiv.remove();
      }
    };

    removeBrandingLink();
    const observer = new MutationObserver(() => {
      removeBrandingLink();
    });
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
              Every day you wait is another day of paying for traffic that doesn't convert. Let's discuss your store's performance and see if there's an opportunity to work together.
            </p>
            <a
              href={KOALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryCta}
            >
              Schedule a Discovery Call
            </a>
            <p className={styles.emailLine}>Or email me directly at <a href="mailto:carson@carsoncobb.com">carson@carsoncobb.com</a></p>
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
