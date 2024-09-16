import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './Home.styles.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import SelectHeader from '../../components/SelectHeader/SelectHeader';
import HomeSlider from '../../components/Slider/Slider';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import SocialFooter from '../../components/SocialFooter/SocialFooter';

import heroImage from '../../assets/home/me.png';
import serviceImage from '../../assets/home/service_img.png';
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
							Carson Cobb
							<br />
							<span className='teal hide-mobile'>Developer</span>
						</h1>
						<p className='desk-text bold hero-title-description'>
						Full Stack Developer & E-commerce Expert
						</p>
						<p className='mob-text bold hero-title-description'>
						Full Stack Developer &<br/>E-commerce Expert
						</p>
						<br />
						<p className='hero-description'>
						Looking to boost online sales? I create custom e-commerce solutions that enhance user engagement, improve conversion rates, and elevate your brand. From seamless experiences to optimized performance, let’s drive results together.

</p>
						<div className='button'>
							<a href='#service-bundles'>
								<FontAwesomeIcon icon={ faArrowRight } className='faIcon' /> Learn
								More
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

			<section className='services'>
				<div className='services__img'>
					<img src={ serviceImage } />
				</div>

				<div className='services__content'>
					<h2>
						About <span className='pink'>Carson Cobb</span>
					</h2>
					<p>
					Carson Cobb is dedicated to helping businesses grow through custom e-commerce solutions that combine striking design with powerful functionality. Specializing in both front-end and back-end development, I create high-performing websites that engage users and drive results across all industries.
					</p>

					<p>
				
					From crafting intuitive, responsive interfaces to building robust, scalable back-end systems, my work focuses on delivering exceptional user experiences that reflect your brand’s unique value. I take pride in turning complex challenges into effective solutions that elevate your online presence.


					</p>

					<p>
					Let’s work together to transform your digital strategy. Explore my services, and let’s build a website that not only meets your business goals but exceeds your expectations.



					</p>

					<div className='button home-service-button'>
						<a href='#contact-bottom'>
							<FontAwesomeIcon icon={ faArrowRight } className='faIcon' /> Get Started
						</a>
					</div>
				</div>
			</section>
			<section className='home-slider'>
				<h2>Independent Projects & Side Work</h2>
				<HomeSlider />
			</section>
			<ContactBottom />
			<SocialFooter />
		</div>
	);
};

export default Home;
