import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './SocialFooter.styles.scss';

import github from '../../assets/socialFooter/github.png';
import linkedin from '../../assets/socialFooter/linkedin.png';
import supportImage from '../../assets/socialFooter/support.png';
import work from '../../assets/socialFooter/work.png';
import about from '../../assets/socialFooter/about.png';

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
				<Link to='/portfolio' className='socialFooter__block sf-work'>
					<div>
						<img src={work} />
					</div>

					<div>
						<p>
							Look at <br />
							<span className='bold-sf'>My Work</span>
						</p>
					</div>
				</Link>

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
				<Link to='/about' className='socialFooter__block sf-about'>
					<div>
						<img src={about} />
					</div>

					<div>
						<p>
							Learn More <br />
							<span className='bold-sf'>About Me</span>
						</p>
					</div>
				</Link>
				

				
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

					<Link to='/portfolio' className='socialFooter__block sf-work'>
						<div>
							<img src={work} />
						</div>

						<div>
							<p>
								Look at <br />
								<span className='bold-sf'>My Work</span>
							</p>
						</div>
					</Link>
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
					<Link to='/about' className='socialFooter__block sf-about'>
						<div>
							<img src={about} />
						</div>

						<div>
							<p>
								Learn More <br />
								<span className='bold-sf'>About Me</span>
							</p>
						</div>
					</Link>
				</div>
			</div>
		</>
	);
};

export default SocialFooter;
