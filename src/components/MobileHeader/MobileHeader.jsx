import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import logo from '../../assets/header/logo.png';
import logoDropdown from '../../assets/header/logoslide.png';


import './MobileHeader.styles.scss';

const MobileHeader=() =>
{
	return (
		<nav role='navigation' id='mobile-nav'>
			<div className='mobile-logo'>
				<img src={ logo } />
			</div>
			<div id='menuToggle'>
				<input type='checkbox' />

				<span></span>
				<span></span>
				<span></span>

				<ul id='menu'>
					<div class='nav__links--mobile'>
						<Link to='/' class='nav__links--mobile-link'>
							HOME
						</Link>
						<Link to='/about' class='nav__links--mobile-link'>
							ABOUT
						</Link>

						<Link to='/portfolio' class='nav__links--mobile-link'>
							PORTFOLIO
						</Link>
						<Link to='/contact' class='nav__links--mobile-link'>
							CONTACT
						</Link>
						<br />
						<img src={ logoDropdown } class='nav__links--mobile-logo' />
					</div>
				</ul>
			</div>
		</nav>
	);
};

export default MobileHeader;
