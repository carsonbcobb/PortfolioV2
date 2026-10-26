import React from 'react';
import styles from './ContactBottom.module.scss';

const EMAIL_URL = 'mailto:carson@carsoncobb.com?subject=Shopify%20store%20inquiry';
const LINKEDIN_URL = 'https://www.linkedin.com/in/carsoncobb';

const ContactBottom = () => {
  return (
    <div id="contact-bottom" className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles['contact-bottom__title']}>One retainer. A whole team's <em>range of expertise</em>.</h2>
            <p className={styles.copy}>
              Send me a message about your store. I will tell you honestly whether it is a fit, and what I would focus on first.
            </p>
            <a
              href={EMAIL_URL}
              className={styles.primaryCta}
            >
              Email me
            </a>
            <p className={styles.emailLine}>
              <a href={EMAIL_URL}>carson@carsoncobb.com</a>
            </p>
            <p className={styles.linkedinLine}>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                Message me on LinkedIn
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBottom;
