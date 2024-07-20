import React from 'react';

import './Portfolio.styles.scss';
import SelectHeader from '../../components/SelectHeader/SelectHeader';
import ContactBottom from '../../components/ContactBottom/ContactBottom';
import SocialFooter from '../../components/SocialFooter/SocialFooter';

import portBanner from '../../assets/portfolio/portBanner.png';
import port from '../../assets/portfolio/portfolio-work.png';
import ccc from '../../assets/portfolio/ccc-work.png';
import kelpieImage from '../../assets/portfolio/kelpiecoin.png';
import homesImage from '../../assets/portfolio/homes.png';

const Portfolio=() =>
{
	return (
		<div id='portfolio'>
			<SelectHeader />
			<div className='portfolio__img desktop'>
				<img src={ portBanner } />
			</div>
			<section className='portfolio--mobile mobile'>
				<div className='portfolio--name'>
					<h3>Portfolio</h3>
				</div>
			</section>
			<section className='portfolio__work'>

				<div className='portfolio__work--list'>
					<div className='slide port-slide'>
						<img src={ ccc } />
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
						<img src={ kelpieImage } />
						<h4>Kelpie Coin</h4>
						<div className='button-container'>
							<div className='button button-slider'>
								<a href='https://master.d3fllip99yi3o5.amplifyapp.com' target='_blank'>
									View Live
								</a>
							</div>

							<div className='button button-git button-slider'>
								<a
									href='https://github.com/carsonbcobb/KelpieCoin'
									target='_blank'
								>
									View on Github
								</a>
							</div>
						</div>
					</div>

					<div className='slide port-slide'>
						<img src={ port } />
						<h4>Portfolio (This Website)</h4>
						<div className='button-container'>
							<div className='button button-slider button-inactive'>
								<a className='button-inactive'>View Live</a>
							</div>

							<div className='button button-git button-slider'>
								<a
									href='https://github.com/carsonbcobb/PortfolioV2'
									target='_blank'
								>
									View on Github
								</a>
							</div>
						</div>
					</div>
					<div className='slide port-slide'>
						<img src={ homesImage } />
						<h4>Homes Not Sold Yet (TBC)</h4>
						<div className='button-container'>
							<div className='button button-slider button-inactive'>
								<a href='#' target='_blank'>
									View Live
								</a>
							</div>

							<div className='button button-git button-slider button-inactive'>
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
