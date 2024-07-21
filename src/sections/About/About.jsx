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
					
  <div class="service">
    <h3>Web Development</h3>
    <p>I offer comprehensive web development services, creating high-performance websites that are both visually appealing and highly functional. From responsive design to seamless user experiences, I ensure your site stands out.</p>
  </div>

  <div class="service">
    <h3>Front-End Development</h3>
    <p>With a strong focus on front-end technologies, I build dynamic, responsive interfaces that engage users. My expertise includes HTML, CSS, JavaScript, and modern frameworks like React and Angular, ensuring your application is fast and efficient.</p>
  </div>

  <div class="service">
    <h3>Back-End Development</h3>
    <p>I provide robust back-end solutions that support your front-end needs. Utilizing technologies such as Node.js, Express, and various databases, I develop scalable and secure server-side applications that power your business.</p>
  </div>

  <div class="service">
    <h3>Creative Design</h3>
    <p>Combining technical skills with a creative touch, I deliver unique and engaging designs that enhance user interaction. Whether it’s designing a new layout or revamping an existing one, I focus on creating an intuitive and aesthetically pleasing user experience.</p>
  </div>

  <div class="service">
    <h3>E-Commerce Solutions</h3>
    <p>Specializing in e-commerce, I create tailored online stores that drive sales and improve customer satisfaction. From Shopify to custom solutions, I provide everything you need to succeed in the digital marketplace.</p>
  </div>

  <div class="service">
    <h3>Consulting & Team Leadership</h3>
    <p>With extensive experience in leading development teams, I offer consulting services to help guide your project to success. Whether you need strategic planning, team management, or technical guidance, I provide the expertise to drive your project forward.</p>
  </div>
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
