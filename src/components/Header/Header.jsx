import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import './Header.styles.scss';

import logo from '../../assets/header/logo.png';
import linkedin from '../../assets/header/linkedin.png';
import github from '../../assets/header/github.png';

const Header = () => {
	return (
		<div id='header'>
			<div className='header__logo'>
				<img src={logo} alt="Carson Cobb Logo" />
			</div>

			<nav className='header__nav'>
				<ul>
					<li><a href="#case-studies">Proof</a></li>
					<li><a href="#process">Process</a></li>
					<li><a href="#faq">FAQ</a></li>
				</ul>
			</nav>

			<div className='header__cta'>
				<a
					href='https://koalendar.com/e/meet-with-carson-koaUwc9W'
					target='_blank'
					rel='noopener noreferrer'
					className='btn-primary'
				>
					Book My Free Audit
				</a>
			</div>
		</div>
	);
};

export default Header;
