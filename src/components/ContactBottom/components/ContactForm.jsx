import React from 'react';

import styles from '../ContactBottom.module.scss';

const fields = [
  { name: 'firstName', placeholder: 'First Name', type: 'text' },
  { name: 'lastName',  placeholder: 'Last Name',  type: 'text' },
  { name: 'email',     placeholder: 'Email Address', type: 'email' }
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
      <div className={styles.formGroup}>
        {fields.map(f => (
          <input
            key={f.name}
            name={f.name}
            type={f.type}
            placeholder={f.placeholder}
            required
            className={styles.input}
          />
        ))}
      </div>

      <textarea
        name="message"
        placeholder="Add Your Message Here"
        required
        className={styles.textarea}
      />

      <input type="hidden" name="_subject" value="Contact form submitted" />


    </form>
  );
};

export default ContactForm;
