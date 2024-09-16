import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './SocialFooter.styles.scss';

import github from '../../assets/socialFooter/github.png';
import linkedin from '../../assets/socialFooter/linkedin.png';
import email from '../../assets/socialFooter/email.svg';
import work from '../../assets/socialFooter/work.png';
import about from '../../assets/socialFooter/support.png';

const SocialFooter = () => {
	return (
		<>
			<div className='socialFooter'>
				<a
					href='https://www.linkedin.com/in/carsoncobb/'
					target='_blank'
					rel='norefferer'
					className='socialFooter__block sf-linkedin'
				>
					<div>
						<img src={linkedin} />
					</div>

					<div>
						<p>
							Connect on <br />
							<span className='bold-sf'>Linkedin</span>
						</p>
					</div>
				</a>
				<a href='mailto:carson@carsoncobb.com' className='socialFooter__block sf-work'>
					<div>
						<img src={email} />
					</div>

					<div>
						<p>
							Send an <br />
							<span className='bold-sf'>Email</span>
						</p>
					</div>
				</a>

				<a
					href='https://github.com/carsonbcobb'
					target='_blank'
					rel='norefferer'
					className='socialFooter__block sf-github'
				>
					<div>
						<img src={github} />
					</div>

					<div>
						<p>
							Follow on <br />
							<span className='bold-sf'>Github</span>
						</p>
					</div>
				</a>
				<a href="https://wa.me/15599165560?text=Hello%2C%20I%20would%20like%20to%20discuss%20a%20project%21" target="_blank" className='socialFooter__block sf-about'>
					<div>
						<img src={about} />
					</div>

					<div>
						<p>
							Message on <br />
							<span className='bold-sf'>Whatsapp</span>
						</p>
					</div>
				</a>
				

				
			</div>

			<div className='socialFooter--mobile'>
				<div className='mobile__group1'>
					<a
						href='https://www.linkedin.com/in/carsoncobb/'
						target='_blank'
						rel='norefferer'
						className='socialFooter__block sf-linkedin'
					>
						<div>
							<img src={linkedin} />
						</div>

						<div>
							<p>
								Connect on <br />
								<span className='bold-sf'>Linkedin</span>
							</p>
						</div>
					</a>

					<a href='mailto:carson@carsoncobb.com' className='socialFooter__block sf-work'>
					<div>
						<img src={email} />
					</div>

					<div>
						<p>
							Send an <br />
							<span className='bold-sf'>Email</span>
						</p>
					</div>
				</a>
				</div>
				
				<div className='mobile__group2'>
				<a
					href='https://github.com/carsonbcobb'
					target='_blank'
					rel='norefferer'
					className='socialFooter__block sf-github'
				>
					<div>
						<img src={github} />
					</div>

					<div>
						<p>
							Follow on <br />
							<span className='bold-sf'>Github</span>
						</p>
					</div>
				</a>
				<a href="https://wa.me/15599165560?text=Hello%2C%20I%20would%20like%20to%20discuss%20a%20project%21" target="_blank" className='socialFooter__block sf-about'>
					<div>
						<img src={about} />
					</div>

					<div>
						<p>
							Message on <br />
							<span className='bold-sf'>Whatsapp</span>
						</p>
					</div>
				</a>
				</div>
			</div>
		</>
	);
};

export default SocialFooter;
