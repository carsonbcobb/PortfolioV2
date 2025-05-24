import React from 'react';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';
import styles from './ContactBottom.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
const ContactBottom = () => (
  <div id="contact-bottom" className={styles.wrapper}>
    <section className={styles.hero}>
      <div className={styles.inner}>
				<div className={styles.innerTextContent}>
				<h2 className={styles.title}>Ready for Your Free 5‑Point Speed & UX Audit?</h2>
        <p className={styles.copy}>
				Enter your email and I’ll send a tailored PDF report within 24 hours.
					</p>
				<button type="submit" form="contact-form"  className={`${styles.submit} button`}>
					<FontAwesomeIcon icon={faArrowRight} /> Submit Now
				</button>
				</div>
				<ContactForm />

      </div>
    </section>

  </div>
);

export default ContactBottom;
