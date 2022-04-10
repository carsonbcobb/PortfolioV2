import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './Home.styles.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import SelectHeader from '../../components/SelectHeader/SelectHeader';
import HomeSlider from '../../components/Slider/Slider';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import SocialFooter from '../../components/SocialFooter/SocialFooter';

import heroImage from '../../assets/home/hero_img.png';
import serviceImage from '../../assets/home/service_img.png';
import howOne from '../../assets/home/how-1.png';
import howTwo from '../../assets/home/how-2.png';
import howThree from '../../assets/home/how-3.png';
import arrow from '../../assets/home/arrow.png';

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
							<span className='teal'>Web Developer</span>
						</h1>
						<p className='bold desk-text'>
							Articulate Communicator | Tech-savvy Professional
						</p>
						<br />
						<p className='desk-text'>
							HTML5 | CSS3 | SCSS | Bootstrap | JQuery | JavaScript |<br />{ ' ' }
							TypeScript | React | Vue | Liquid | Figma | Adobe XD
						</p>
						<p className='mob-text'>
							HTML5 | CSS3 | SCSS | Bootstrap | JQuery | JavaScript | TypeScript
							| React | Vue | Liquid | Figma | Adobe XD
						</p>
						<div className='button'>
							<Link to='/about'>
								<FontAwesomeIcon icon={ faArrowRight } className='faIcon' /> Learn
								More
							</Link>
						</div>
					</div>

					<div className='hero__image'>
						<img src={ heroImage } />
					</div>
				</section>
			</div>

			<section className='services'>
				<div className='services__img'>
					<img src={ serviceImage } />
				</div>

				<div className='services__content'>
					<h2>
						Who Is <span className='pink'>Carson Cobb</span>...?
					</h2>
					<p>
						I would like to introduce myself as a tech-savvy professional with
						progressive experience determining structure and design of web
						pages, while ensuring user experience determines design choices.
					</p>

					<p>
						Employers recognize me for my expertise in developing features to
						enhance user experience, while striking a balance between functional{ ' ' }
						and aesthetic design. My skills in building reusable code for future
						use and optimizing web pages for maximum speed/scalability set me
						apart from the res/crowd.
					</p>

					<p>
						Based on my credible exposure, I am proven as an expert in utilizing{ ' ' }
						various markup languages to write web pages. I am an articulate
						communicator with a credible history of cultivating and maintaining
						positive collaborations with clients, key stakeholders, and senior
						management to realize organizational goals.
					</p>

					<div className='button home-service-button'>
						<Link to='/contact'>
							<FontAwesomeIcon icon={ faArrowRight } className='faIcon' /> Learn
							More
						</Link>
					</div>
				</div>
			</section>
			<section className='home-slider'>
				<h2>Take A Look At My Work</h2>
				<HomeSlider />
			</section>
			<ContactBottom />
			<SocialFooter />
		</div>
	);
};

export default Home;
