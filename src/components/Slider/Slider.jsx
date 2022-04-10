import React, { Component } from 'react';
import Slider from 'react-slick';
import './Slider.styles.scss';

import slideArrow from '../../assets/slider/slide-arrow.png';
import portWork from '../../assets/portfolio/portfolio-work.png';
import cccWork from '../../assets/portfolio/ccc-work.png';
import kelpieImage from '../../assets/portfolio/kelpiecoin.png';
import cobbCoffeeImage from '../../assets/portfolio/cobb-coffee.png';
import homesImage from '../../assets/portfolio/homes.png';
export default class HomeSlider extends Component
{
	render ()
	{
		const settings={
			dots: false,
			prevArrow: <img src={ slideArrow } id='slide-arrow' />,
			infinite: true,
			speed: 500,
			slidesToShow: 3,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 1025,
					settings: { slidesToShow: 2 },
				},
				{
					breakpoint: 769,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						autoplay: true,
						autoplaySpeed: 2000,
						dots: true,
						arrows: false,
						pauseOnHover: true,

						cssEase: 'linear',
					},
				},
			],
		};
		return (
			<div id='slider'>
				<Slider { ...settings }>
					<div className='slide'>
						<img src={ cccWork } />
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
					<div className='slide'>
						<img src={ kelpieImage } />
						<h4>Kelpie Coin</h4>
						<div className='button-container'>
							<div className='button button-slider'>
								<a href='https://www.kelpiecoin.finance/' target='_blank'>
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

					<div className='slide'>
						<img src={ portWork } />
						<h4>Portfolio (This Website!)</h4>
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
					<div className='slide'>
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
				</Slider>
			</div>
		);
	}
}
