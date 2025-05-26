import React from 'react';
import SiteHeader from '../SiteHeader/SiteHeader';
import Hero from '../Hero/Hero';
import styles from './HeroBackground.module.scss';

const HeroBackground = () => {
    return (
        <div className={styles['hero-bg']} aria-label="Hero: boost add-to-cart">
            <SiteHeader />
            <div className={styles['hero-bg__inner']}>
                <Hero />
            </div>
            <div className={styles['hero-bg__divider']} style={{transform: 'rotate(180deg)'}}>
                <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <path d="M0,0 C600,100 600,0 1200,100 L1200,0 L0,0 Z" />
                </svg>
            </div>
        </div>
    );
};

export default HeroBackground; 