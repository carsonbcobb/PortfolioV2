import React from 'react';
import './Home.styles.scss';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import Services from '../../components/Services/Services';
import CompaniesWorkedWith from '../../components/CompaniesWorkedWith/CompaniesWorkedWith';
import StatsBar from '../../components/StatsBar/StatsBar';
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
			<StatsBar />
			<Services />
			<CaseStudies />
			<TheProblem />
			<GrowthProcess />
			<WhyMe />
			<Faq />
			<ContactBottom />
			<footer className="site-footer">
				<p>© 2026 Carson Cobb. All rights reserved.</p>
				<p><a href="mailto:carson@carsoncobb.com">carson@carsoncobb.com</a></p>
			</footer>
		</div>
	);
};

export default Home;
