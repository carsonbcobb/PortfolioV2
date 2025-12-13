import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import logo from '../../assets/header/logo.png';
import logoDropdown from '../../assets/header/logoslide.png';
import linkedin from '../../assets/header/linkedin.png';
import github from '../../assets/header/github.png';

import './MobileHeader.styles.scss';

const MobileHeader = () => {
	const [isOpen, setIsOpen] = React.useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav role='navigation' id='mobile-nav'>
			<Link to='/'>
				<div className='mobile-logo'>
					<img src={logo} alt="Carson Cobb Logo" />
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
					<li><a href="#case-studies" onClick={toggleMenu}>Proof</a></li>
					<li><a href="#process" onClick={toggleMenu}>Process</a></li>
					<li><a href="#faq" onClick={toggleMenu}>FAQ</a></li>
				</ul>
				<div className='mobile-cta'>
					<a
						href='https://koalendar.com/e/meet-with-carson-koaUwc9W'
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
