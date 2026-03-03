import React from 'react';
import { Link } from 'react-router-dom';
import './MobileHeader.styles.scss';

const KOALENDAR_URL = 'https://koalendar.com/e/ghost-revenue-discovery-call';

const MobileHeader = () => {
	const [isOpen, setIsOpen] = React.useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav role='navigation' id='mobile-nav'>
			<Link to='/' className='mobile-logo-link'>
				<div className='mobile-logo'>
					<span className='mobile-logo-text'>CARSON COBB</span>
				</div>
			</Link>

			<button 
				className={`hamburger ${isOpen ? 'is-active' : ''}`}
				onClick={toggleMenu}
				aria-label={isOpen ? "Close menu" : "Open menu"}
			>
				<span></span>
				<span></span>
				<span></span>
			</button>

			<div className={`mobile-menu ${isOpen ? 'is-open' : ''}`}>
				<ul className='mobile-nav-list'>
					<li><a href="#services" onClick={toggleMenu}>Services</a></li>
					<li><a href="#results" onClick={toggleMenu}>Results</a></li>
					<li><a href="#process" onClick={toggleMenu}>Process</a></li>
					<li><a href="#faq" onClick={toggleMenu}>FAQ</a></li>
				</ul>
				<div className='mobile-cta'>
					<a
						href={KOALENDAR_URL}
						target='_blank'
						rel='noopener noreferrer'
						className='btn-primary'
						onClick={toggleMenu}
					>
						Schedule a Discovery Call
					</a>
				</div>
			</div>
		</nav>
	);
};

export default MobileHeader;
