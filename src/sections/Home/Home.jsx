import React from 'react';
import './Home.styles.scss';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import Services from '../../components/Services/Services';
import CompaniesWorkedWith from '../../components/CompaniesWorkedWith/CompaniesWorkedWith';
import GrowthProcess from '../../components/GrowthProcess/GrowthProcess';
import HeroBackground from '../../components/HeroBackground/HeroBackground';
import Faq from '../../components/Faq/Faq';
import CaseStudies from '../../components/CaseStudies/CaseStudies';
import TheProblem from '../../components/TheProblem/TheProblem';
import WhyMe from '../../components/WhyMe/WhyMe';

const Home = () => {
	return (
		<div id='home'>
			<HeroBackground />
			<CompaniesWorkedWith />
			<CaseStudies />
			<TheProblem />
			<Services />
			<GrowthProcess />
			<WhyMe />
			<Faq />
			<ContactBottom />
			<footer style={ { "padding": "2em 0", "background": "#f9f9f9" }}>
				© {new Date().getFullYear()} Carson Cobb. All rights reserved.
			</footer>
		</div>
	);
};

export default Home;
