import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import logo from '../../assets/header/logo.png';
import logoDropdown from '../../assets/header/logoslide.png';
import linkedin from '../../assets/header/linkedin.png';
import github from '../../assets/header/github.png';

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
			<div className='follow-block'>
				<p>Follow Me:</p>
				<a
					href='https://www.linkedin.com/in/carsoncobb/'
					target='_blank'
					rel='norefferer'
				>
					<img src={linkedin} />
				</a>
				<a
					href='https://github.com/carsonbcobb'
					target='_blank'
					rel='norefferer'
				>
					<img src={github} />
				</a>
			</div>
			</div>
		</nav>
	);
};

export default MobileHeader;
