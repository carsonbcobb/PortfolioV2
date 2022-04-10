import React from 'react';

import './About.styles.scss';
import SelectHeader from '../../components/SelectHeader/SelectHeader';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import SocialFooter from '../../components/SocialFooter/SocialFooter';

import aboutBanner from '../../assets/about/about-banner.png';

import serviceImage from '../../assets/home/service_img.png';

const About=() =>
{
	return (
		<div id='about'>
			<SelectHeader />
			<section className='about-banner desktop'>
				<img src={ aboutBanner } />

			</section>
			<section className='about-banner--mobile mobile'>
				<div className='about-name'>
					<h3>About <br /><span>Carson Cobb</span></h3>
				</div>
			</section>
			<section className='services'>
				<div className='services__img'>
					<img src={ serviceImage } />
				</div>

				<div className='services__content'>
					<h2>My Services</h2>
					<p>
						I would like to introduce myself as a tech-savvy professional with
						progressive experience determining structure and design of web
						pages, while ensuring user experience determines design choices.
					</p>

					<p>
						Employers recognize me for my expertise in developing features to
						enhance
						 user experience, while striking a balance between functional{ ' ' }
						and aesthetic design.
						My skills in building reusable code for future use and optimizing
						web pages
					 for maximum speed/scalability set me apart from the
						res/crowd.
					</p>

					<p>
						Based on my credible exposure, I am proven as an expert in utilizing{ ' ' }

						various markup languages to write web pages. I am an articulate
						communicator
						 with a credible history of cultivating and maintaining
						positive collaborations
						 with clients, key stakeholders, and senior management to
						realize
						 organizational goals.
					</p>
					<p>
						Throughout my career, I have made it my priority to utilize current
						technologies and new techniques to drive elegant, creative solutions
						across a range of projects. Comfortable in both collaborative and
						independent roles, I offer refined analytical and critical thinking
						skills, and I can adapt and revise my strategies to meet evolving
						priorities, shifting needs, and emergent issues.
				</p>

					<p>Moreover, I am technically proficient in the following:</p>

					<p>
						HTML | CSS | SCSS | Bootstrap | JQuery | JavaScript | TypeScript |
						React | Vue | Liquid | Figma
				</p>

					<p>
						Please feel free to contact me at carson@carsoncobb.com with any
						thoughts, comments, or questions about my work—I’m always interested
						in making new professional acquaintances.
				</p>
				</div>
			</section>
			<div className='service-addition'>

			</div>

			<ContactBottom />
			<SocialFooter />
		</div>
	);
};

export default About;
