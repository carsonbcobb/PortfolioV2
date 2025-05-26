import React from 'react';
import './Home.styles.scss';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import Services from '../../components/Services/Services';
import CompaniesWorkedWith from '../../components/CompaniesWorkedWith/CompaniesWorkedWith';
import GrowthProcess from '../../components/GrowthProcess/GrowthProcess';
import HeroBackground from '../../components/HeroBackground/HeroBackground';
import Faq from '../../components/Faq/Faq';
import CaseStudies from '../../components/CaseStudies/CaseStudies';

const Home = () => {
	return (
		<div id='home'>
			<HeroBackground />
			<CompaniesWorkedWith />
			<CaseStudies />
			<GrowthProcess />
			<Services />
			<Faq />
			<ContactBottom />
			<footer style={{"padding": "2em 0"}}>
				© {new Date().getFullYear()} Carson Cobb. All rights reserved.
			</footer>
		</div>
	);
};

export default Home;
