import React from 'react';
import './Header.styles.scss';

const KOALENDAR_URL = 'https://koalendar.com/e/ghost-revenue-discovery-call';

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
					href={KOALENDAR_URL}
					target='_blank'
					rel='noopener noreferrer'
					className='btn-primary'
				>
					Schedule a Discovery Call
				</a>
			</div>
		</div>
	);
};

export default Header;
