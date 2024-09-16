import React from 'react';
import './CompaniesWorkedWith.scss';

// Importing images as variables
import efLogo from '../../assets/companies/ef-logo-black.png';
import sgLogo from '../../assets/companies/sg.svg';
import gemLogo from '../../assets/companies/EX_LOGO_250x.png';
import organifiLogo from '../../assets/companies/326259791_680747150454524_1406745717201181736_n.jpg';
import celebrityCruisesLogo from '../../assets/companies/celebrity-cruises-logo-blue-lg.svg';
import saintJaneLogo from '../../assets/companies/saint_jane_logoBlack_420x63.png';
import bioOptimizersLogo from '../../assets/companies/bio-logo-2023-with-tagline-wide.svg';
import dailyEssentialsLogo from '../../assets/companies/gemlogo.png';

const CompaniesWorkedWith = () => {
  return (
    <section className="companies-worked-with">
      <h2>Trusted by Industry Leaders</h2>
      <div className="top-row">
      <div className="company-logo">
          <img src={organifiLogo} alt="Organifi logo" />
        </div>
        <div className="company-logo">
          <img src={saintJaneLogo} alt="Saint Jane logo" />
        </div>
        <div className="company-logo">
          <img src={bioOptimizersLogo} alt="BiOptimizers logo" />
        </div>
        <div className="company-logo">
          <img src={dailyEssentialsLogo} alt="Daily Essentials logo" />
        </div>

      
      </div>
      <div className="bottom-row">
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
    </section>
  );
};

export default CompaniesWorkedWith;
