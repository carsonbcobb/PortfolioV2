import React from 'react';

import './About.styles.scss';
import SelectHeader from '../../components/SelectHeader/SelectHeader';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import SocialFooter from '../../components/SocialFooter/SocialFooter';

import aboutBanner from '../../assets/about/about-banner.png';
import serviceImage from '../../assets/home/service_img.png';

const About = () => {
	return (
		<div id='about'>
			<SelectHeader />
			<section className='about-banner'>
				<img src={aboutBanner} />
			</section>
			<section className='services'>
				<div className='services__img'>
					<img src={serviceImage} />
				</div>

				<div className='services__content'>
					<h2>My Services</h2>
					<p>
						I would like to introduce myself as a tech-savvy professional with
						<br />
						progressive experience determining structure and design of web
						pages,
						<br /> while ensuring user experience determines design choices.
					</p>

					<p>
						Employers recognize me for my expertise in developing features to
						enhance
						<br /> user experience, while striking a balance between functional{' '}
						and aesthetic design. <br />
						My skills in building reusable code for future use and optimizing
						web pages
						<br /> for maximum speed/scalability set me apart from the
						res/crowd.
					</p>

					<p>
						Based on my credible exposure, I am proven as an expert in utilizing{' '}
						<br />
						various markup languages to write web pages. I am an articulate
						communicator
						<br /> with a credible history of cultivating and maintaining
						positive collaborations
						<br /> with clients, key stakeholders, and senior management to
						realize
						<br /> organizational goals.
					</p>
				</div>
			</section>
			<div className='service-addition'>
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
					Please feel free to contact me at carson@carson-cobb.com with any
					thoughts, comments, or questions about my work—I’m always interested
					in making new professional acquaintances.
				</p>
			</div>

			<ContactBottom />
			<SocialFooter />
		</div>
	);
};

export default About;
