import React from 'react';

import './Contact.styles.scss';
import SelectHeader from '../../components/SelectHeader/SelectHeader';

import contactBanner from '../../assets/contact/contact-banner.png';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import SocialFooter from '../../components/SocialFooter/SocialFooter';

const Contact = () => {
	return (
		<div id='contact'>
			<SelectHeader />
			<div className='contact__banner'>
				<img src={contactBanner} />
			</div>
			<ContactBottom />
			<SocialFooter />
		</div>
	);
};

export default Contact;
