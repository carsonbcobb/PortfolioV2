import React from 'react';
import styles from '../ContactBottom.module.scss';
import linkedinIcon from '../../../assets/contact/llinkedinlogo.png';
import emailIcon    from '../../../assets/contact/email.png';

const infoItems = [
  {
    href: 'https://www.linkedin.com/in/carsoncobb/',
    icon: linkedinIcon,
    labelTop: 'CONTACT ME ON',
    labelBottom: 'LinkedIn',
    external: true,
  },
  {
    href: 'mailto:carson@carsoncobb.com',
    icon: emailIcon,
    labelTop: 'EMAIL ADDRESS',
    labelBottom: 'carson@carsoncobb.com',
    external: false,
  }
];

const ContactInfo = () => (
  <section className={styles.contactInfo}>
    {infoItems.map(({ href, icon, labelTop, labelBottom, external }) => (
      <a
        key={href}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={styles.infoItem}
      >
        <img src={icon} alt="" className={styles.icon} />
        <div className={styles.text}>
          <span className={styles.small}>{labelTop}</span>
          <strong>{labelBottom}</strong>
        </div>
      </a>
    ))}
  </section>
);

export default ContactInfo;
