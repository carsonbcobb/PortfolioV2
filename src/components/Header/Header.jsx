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
				<img src={logo} />
			</div>

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
	);
};

export default Header;
