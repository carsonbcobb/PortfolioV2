import React from 'react';
import './Header.styles.scss';

const EMAIL_URL = 'mailto:carson@carsoncobb.com?subject=Shopify%20store%20inquiry';

const Header = () => {
	return (
		<div id='header'>
			<div className='header__logo'>
				<span className='header__logo-text'>CARSON COBB</span>
			</div>

			<nav className='header__nav'>
				<ul>
					<li><a href="#services">Services</a></li>
					<li><a href="#results">Results</a></li>
					<li><a href="#process">Process</a></li>
					<li><a href="#faq">FAQ</a></li>
				</ul>
			</nav>

			<div className='header__cta'>
				<a
					href={EMAIL_URL}
					className='btn-primary'
				>
					Get in touch
				</a>
			</div>
		</div>
	);
};

export default Header;
