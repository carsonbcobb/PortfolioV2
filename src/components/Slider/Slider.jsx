import React, { Component } from 'react';
import Slider from 'react-slick';
import './Slider.styles.scss';

import placeholder from '../../assets/slider/placeholder-image.png';
import slideArrow from '../../assets/slider/slide-arrow.png';
import portWork from '../../assets/portfolio/portfolio-work.png';
import cccWork from '../../assets/portfolio/ccc-work.png';

export default class HomeSlider extends Component {
	render() {
		const settings = {
			dots: false,
			prevArrow: <img src={slideArrow} id='slide-arrow' />,
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
				<Slider {...settings}>
					<div className='slide'>
						<img src={cccWork} />
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
					<div className='slide'>
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
					<div className='slide'>
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
					<div className='slide'>
						<img src={portWork} />
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
				</Slider>
			</div>
		);
	}
}
