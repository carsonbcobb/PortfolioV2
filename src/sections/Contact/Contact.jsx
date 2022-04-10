import React from 'react';

import './Contact.styles.scss';
import SelectHeader from '../../components/SelectHeader/SelectHeader';

import contactBanner from '../../assets/contact/contact-banner.png';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import SocialFooter from '../../components/SocialFooter/SocialFooter';

const Contact=() =>
{
	return (
		<div id='contact'>
			<SelectHeader />
			<div className='contact__banner desktop'>
				<img src={ contactBanner } />
			</div>
			<section className='contact__banner--mobile mobile'>
				<div className='contact__banner--name'>
					<h3>Contact Me</h3>
				</div>
			</section>
			<ContactBottom />
			<SocialFooter />
		</div>
	);
};

export default Contact;
