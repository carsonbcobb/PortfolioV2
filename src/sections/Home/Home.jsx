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
							<span className='teal'>Developer</span>
						</h1>
						<p className='bold hero-title-description'>
						Full Stack Developer & E-commerce Expert
						</p>
						<br />
						<p className='desk-text'>
							HTML | CSS | JQuery | JavaScript | TypeScript | React |<br />{ ' ' }
							Vue | Liquid | Python | Node.js | AWS | SQL | + MORE!
						</p>
						<p className='mob-text'>
						HTML | CSS | JQuery | JavaScript | TypeScript | React | Vue | Liquid | Python | Node.js | AWS | SQL | + MORE!
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
						About <span className='pink'>Carson Cobb</span>
					</h2>
					<p>
					Hi there! I'm Carson, a passionate full-stack developer with a focus on front-end and creative development. With years of experience in the health and wellness space, I thrive on creating impactful and user-friendly web applications that make a difference.


					</p>

					<p>
					<ul>
  <li><strong>Front-End Development:</strong> Crafting responsive, visually stunning interfaces.</li>
  <li><strong>Back-End Development:</strong> Building robust, scalable server-side solutions.</li>
  <li><strong>Creative Design:</strong> Delivering unique and engaging user experiences.</li>
</ul>

					</p>

					<p>
					I’m always excited to take on new challenges, lead teams, and collaborate on projects that push the boundaries of technology. Thank you for visiting my website. Let’s connect and explore how we can work together to bring your vision to life.


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
				<h2>Side Work + Personal Projects</h2>
				<HomeSlider />
			</section>
			<ContactBottom />
			<SocialFooter />
		</div>
	);
};

export default Home;
