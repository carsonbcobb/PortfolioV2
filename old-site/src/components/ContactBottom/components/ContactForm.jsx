import React from 'react';

import styles from '../ContactBottom.module.scss';

const fields = [
  { name: 'firstName', placeholder: 'First Name', type: 'text', required: true },
  { name: 'lastName',  placeholder: 'Last Name',  type: 'text', required: true },
  { name: 'email', placeholder: 'Email Address', type: 'email', required: true },
  { name: 'website', placeholder: 'Website (optional)', type: 'url', required: false }
];

const ContactForm = () => {
  const handleSubmit = e => {
    e.preventDefault();
    e.currentTarget.reset();
  };

  return (
    <form
      id="contact-form"
      className={styles.form}
      method="POST"
      action="https://submit-form.com/QhONV08k"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <div className={styles.formGrid}>
        {fields.map(f => (
          <input
            key={f.name}
            name={f.name}
            type={f.type}
            placeholder={f.placeholder}
            required={f.required}
            className={styles.input}
          />
        ))}
      </div>

      <input type="hidden" name="_subject" value="Contact form submitted" />


    </form>
  );
};

export default ContactForm;
