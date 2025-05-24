import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './Home.styles.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import SelectHeader from '../../components/SelectHeader/SelectHeader';
import HomeSlider from '../../components/Slider/Slider';
import ContactBottom from '../../components/ContactBottom/ContactBottom';

import heroImage from '../../assets/home/me.png';
import serviceImage from '../../assets/home/carson-about.png';
import howOne from '../../assets/home/how-1.png';
import howTwo from '../../assets/home/how-2.png';
import howThree from '../../assets/home/how-3.png';
import arrow from '../../assets/home/arrow.png';
import Services from '../../components/Services/Services';
import CompaniesWorkedWith from '../../components/CompaniesWorkedWith/CompaniesWorkedWith';

const Home=() =>
{
	return (
		<div id='home'>
			<div className='hero-bg'>
				<SelectHeader />

				<section className='hero'>
					<div className='hero__image--mobile'>
						<img src={ heroImage } />
					</div>
					<div className='hero__content'>
						<h1>
						 Boost your add‑to‑cart rates by 8–15% in 30 days  
							<br />
							<span className='pink'>(or your money back)</span>
						</h1>
						<p className='desk-text bold hero-title-description'>
						Proven speed, UX & CRO packages that turn browsers into buyers.
						</p>
						<p className='mob-text bold hero-title-description'>
						Proven speed, UX & CRO packages that turn browsers into buyers.
						</p>
						<div className='hero-button'>
							<a href='#service-bundles'>
								<FontAwesomeIcon icon={ faArrowRight } className='faIcon' /> Get My Free 5‑Point Audit
							</a>
						</div>
					</div>

					<div className='hero__image'>
						<img src={ heroImage } />
					</div>
				</section>
			</div>

			<CompaniesWorkedWith />

			<Services />


			<ContactBottom />

			<section className='services'>
				<div className='services__img'>
					<img src={ serviceImage } />
				</div>

				<div className='services__content'>
					<h2>
					Your Shopify Development Advantage</h2>
					<p>
					I specialize in high-performance Shopify development, helping established stores reach new levels of growth. With deep expertise in both front-end and back-end development, I lead projects that optimize conversions, enhance site speed, and deliver a seamless user experience. My approach turns complex challenges into tailored solutions that drive measurable results.					</p>


					<div className='button home-service-button'>
						<a href='#contact-bottom'>
							<FontAwesomeIcon icon={ faArrowRight } className='faIcon' /> Get Started
						</a>
					</div>
				</div>
			</section>
			

			<footer style={{"padding": "2em 0"}}>
      © {new Date().getFullYear()} Carson Cobb. All rights reserved.
    </footer>
		</div>
	);
};

export default Home;
