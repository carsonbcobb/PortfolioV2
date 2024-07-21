import React from 'react';
import './ContactBottom.styles.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import phoneIcon from '../../assets/home/phone.png';
import emailIcon from '../../assets/home/email.png';
import touchImage from '../../assets/home/touch.png';

const ContactBottom=() =>
{
	return (
		<div id='contact-bottom'>
			<section className='touch'>
				<div className='touch__content'>
					<h2>Let's Chat!</h2>
					<p className='desk-text'>
					I’m always excited to connect with fellow professionals, potential collaborators, and anyone interested in discussing innovative projects. Whether you have a question, need a consultation, or are looking to start a new project, I’d love to hear from you. Please feel free to reach out using the form below, and I will get back to you as soon as possible.


					</p>
					<p className='mob-text'>
					I’m always excited to connect with fellow professionals, potential collaborators, and anyone interested in discussing innovative projects. Whether you have a question, need a consultation, or are looking to start a new project, I’d love to hear from you. Please feel free to reach out using the form below, and I will get back to you as soon as possible.

s.
					</p>
					<form id='form'>
						<div className='touch__content--form-group'>
							<input
								id='inputFN'
								type='text'
								name='firstName'
								placeholder='Enter Your First Name'
							/>
							<input
								id='inputLN'
								type='text'
								name='lastName'
								placeholder='Enter Your Last Name'
							/>
							<input
								id='inputEmail'
								type='email'
								name='email'
								placeholder='Enter Your Email Address'
							/>
							<input
								id='inputPhone'
								type='phone'
								name='phone'
								placeholder='Enter Your Phone Number'
							/>
						</div>
						<textarea
							id='textarea'
							type='message'
							name='message'
							placeholder='Enter Your Message'
						/>
						<div className="button__container">
							<button
								onClick={ () =>
								{
									const form=document.getElementById( 'form' );
									return (
										( form.method='POST' ),
										( form.action='https://submit-form.com/QhONV08k' ),
										( form.encType='multipart/form-data' )
									);
								} }
								onSubmit={ () =>
								{
									const form=document.getElementById( 'form' );
									return form.reset();
								} }
								className='button'
								type='submit'
								value='Send'
							>
								<FontAwesomeIcon icon={ faArrowRight } className='faIcon' />{ ' ' }
								Submit Now
							</button>
						</div>{ ' ' }
						<input
							type='hidden'
							name='_subject'
							value='Contact form submitted'
						/>
					</form>
				</div>


			</section>
			<section className='extra-contact'>
				<div className='extra-contact__item'>
					<img src={ phoneIcon } className='wiggleAnimation' />
					<div>
						<h3 className='extra-conteact__item--text'>
							<span className='small-text'>PHONE NUMBER</span>559.916.5560
						</h3>
					</div>
				</div>

				<div className='extra-contact__item'>
					<img src={ emailIcon } className='wiggleAnimation wiggle-email' />
					<div>
						<h3 className='extra-conteact__item--text'>
							<span className='small-text'>EMAIL ADDRESS</span>
							carson@carsoncobb.com
						</h3>
					</div>
				</div>
			</section>
			<p id='copyright'>© Copyright 2021 Carson Cobb. All rights reserved.</p>
		</div>
	);
};

export default ContactBottom;
