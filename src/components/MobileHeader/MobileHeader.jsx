import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import logo from '../../assets/header/logo.png';
import logoDropdown from '../../assets/header/logoslide.png';


import './MobileHeader.styles.scss';

const MobileHeader=() =>
{
	return (
		<nav role='navigation' id='mobile-nav'>
			<Link to='/'>
			<div className='mobile-logo'>
				<img src={ logo } />
			</div>
			</Link>

			<div id='menuToggle'>
				<input type='checkbox' />

				<span></span>
				<span></span>
				<span></span>

				<ul id='menu'>
					<div className='nav__links--mobile'>
						<Link to='/' className='nav__links--mobile-link'>
							HOME
						</Link>
						<Link to='/about' className='nav__links--mobile-link'>
							ABOUT
						</Link>

						<Link to='/portfolio' className='nav__links--mobile-link'>
							PORTFOLIO
						</Link>
						<Link to='/contact' className='nav__links--mobile-link'>
								CONTACT
						</Link>
						
						<br />
						<img src={ logoDropdown } className='nav__links--mobile-logo' />
					</div>
				</ul>
			</div>
		</nav>
	);
};

export default MobileHeader;
