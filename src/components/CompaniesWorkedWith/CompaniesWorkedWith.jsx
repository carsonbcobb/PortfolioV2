import React, { useEffect, useRef } from 'react';
import './CompaniesWorkedWith.scss';

// Importing images as variables
import efLogo from '../../assets/companies/ef-logo-black.png';
import sgLogo from '../../assets/companies/sg.svg';
import gemLogo from '../../assets/companies/EX_LOGO_250x.png';
import organifiLogo from '../../assets/companies/326259791_680747150454524_1406745717201181736_n.png';
import celebrityCruisesLogo from '../../assets/companies/celebrity-cruises-logo-blue-lg.svg';
import saintJaneLogo from '../../assets/companies/saint_jane_logoBlack_420x63.png';
import bioOptimizersLogo from '../../assets/companies/bio-logo-2023-with-tagline-wide.svg';
import dailyEssentialsLogo from '../../assets/companies/gemlogo.png';

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
      <h2>Trusted by Industry Leaders</h2>
      <div className="top-row">
        <div className="company-logo">
          <img src={ saintJaneLogo } alt="Saint Jane logo" />
          
          <div className="result-metric">15% faster load → 7% lower bounce rate</div>
        </div>
        <div className="company-logo">
         
        <img src={organifiLogo} alt="Organifi logo" />
          <div className="result-metric">0.4s LCP reduction → 9% lift in checkout starts</div>
        </div>
        <div className="company-logo">
          <img src={ dailyEssentialsLogo } alt="Daily Essentials logo" />
          <div className="result-metric">+12% add‑to‑cart rate in 3 weeks → +$45K/mo</div>
        </div>
      </div>
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
              <img src={gemLogo} alt="GEM logo" />
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
              <img src={gemLogo} alt="GEM logo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompaniesWorkedWith;
