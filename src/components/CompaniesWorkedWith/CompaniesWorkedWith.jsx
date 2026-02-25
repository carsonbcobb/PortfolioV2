import React, { useEffect, useRef } from 'react';
import './CompaniesWorkedWith.scss';

import efLogo from '../../assets/companies/ef-logo-black.png';
import sgLogo from '../../assets/companies/sg.svg';
import gemLogo from '../../assets/companies/EX_LOGO_250x.png';
import celebrityCruisesLogo from '../../assets/companies/celebrity-cruises-logo-blue-lg.svg';
import bioOptimizersLogo from '../../assets/companies/bio-logo-2023-with-tagline-wide.svg';

const CompaniesWorkedWith = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleAnimationEnd = () => {
      carousel.style.animation = 'none';
      void carousel.offsetHeight;
      carousel.style.animation = 'scroll 30s linear infinite';
    };

    carousel.addEventListener('animationend', handleAnimationEnd);
    return () => carousel.removeEventListener('animationend', handleAnimationEnd);
  }, []);

  return (
    <section className="companies-worked-with">
      <p className="companies-worked-with__eyebrow">Trusted by leading e-commerce brands</p>
      <div className="carousel-container">
        <div className="carousel" ref={carouselRef}>
          <div className="carousel-track">
            <div className="company-logo">
            <img src={bioOptimizersLogo} alt="BiOptimizers logo" />
            </div>
            <div className="company-logo">
              <img src={sgLogo} alt="Single Grain logo" />
            </div>
            <div className="company-logo">
              <img src={efLogo} alt="Echelon Front logo" />
            </div>
            <div className="company-logo">
              <img src={celebrityCruisesLogo} alt="Celebrity Cruises logo" />
            </div>
            <div className="company-logo">
              <img src={gemLogo} alt="Exsurgo Technologies logo" />
            </div>
            {/* Duplicate logos for seamless loop */}
            <div className="company-logo">
            <img src={bioOptimizersLogo} alt="BiOptimizers logo" />
            </div>
            <div className="company-logo">
              <img src={sgLogo} alt="Single Grain logo" />
            </div>
            <div className="company-logo">
              <img src={efLogo} alt="Echelon Front logo" />
            </div>
            <div className="company-logo">
              <img src={celebrityCruisesLogo} alt="Celebrity Cruises logo" />
            </div>
            <div className="company-logo">
              <img src={gemLogo} alt="Exsurgo Technologies logo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompaniesWorkedWith;
