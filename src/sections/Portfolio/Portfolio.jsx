import React from 'react';

import './Portfolio.styles.scss';
import SelectHeader from '../../components/SelectHeader/SelectHeader';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import SocialFooter from '../../components/SocialFooter/SocialFooter';

import portBanner from '../../assets/portfolio/portBanner.png';
import placeholder from '../../assets/slider/placeholder-image.png';
import port from '../../assets/portfolio/portfolio-work.png';
import ccc from '../../assets/portfolio/ccc-work.png';

const Portfolio = () => {
	return (
		<div id='portfolio'>
			<SelectHeader />
			<div className='portfolio__img'>
				<img src={portBanner} />
			</div>
			<section className='portfolio__work'>
				<h2>Take a Look at My Work!</h2>

				<div className='portfolio__work--list'>
					<div className='slide port-slide'>
						<img src={ccc} />
						<h4>Clovis Community Choir</h4>
						<div className='button-container'>
							<div className='button button-slider'>
								<a href='https://www.cloviscommunitychoir.com/' target='_blank'>
									View Live
								</a>
							</div>

							<div className='button button-git button-slider'>
								<a
									href='https://github.com/carsonbcobb/ClovisCommunityChoir'
									target='_blank'
								>
									View on Github
								</a>
							</div>
						</div>
					</div>
					<div className='slide port-slide'>
						<img src={placeholder} />
						<h4>Cobb Coffee (TBC)</h4>
						<div className='button-container'>
							<div className='button button-slider'>
								<a href='#' target='_blank'>
									View Live
								</a>
							</div>

							<div className='button button-git button-slider'>
								<a href='#' target='_blank'>
									View on Github
								</a>
							</div>
						</div>
					</div>
					<div className='slide port-slide'>
						<img src={placeholder} />
						<h4>Kelpie Coin (TBC)</h4>
						<div className='button-container'>
							<div className='button button-slider'>
								<a href='#' target='_blank'>
									View Live
								</a>
							</div>

							<div className='button button-git button-slider'>
								<a href='#' target='_blank'>
									View on Github
								</a>
							</div>
						</div>
					</div>
					<div className='slide port-slide'>
						<img src={placeholder} />
						<h4>(TBC)</h4>
						<div className='button-container'>
							<div className='button button-slider'>
								<a href='#' target='_blank'>
									View Live
								</a>
							</div>

							<div className='button button-git button-slider'>
								<a href='#' target='_blank'>
									View on Github
								</a>
							</div>
						</div>
					</div>
					<div className='slide port-slide'>
						<img src={port} />
						<h4>Portfolio (This Website!)</h4>
						<div className='button-container'>
							<div className='button button-slider button-inactive'>
								<a className='button-inactive'>View Live</a>
							</div>

							<div className='button button-git button-slider'>
								<a href='#' target='_blank'>
									View on Github
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			<ContactBottom />
			<SocialFooter />
		</div>
	);
};

export default Portfolio;
