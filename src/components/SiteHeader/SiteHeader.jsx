import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SiteHeader.module.scss';
import logo from '../../assets/header/logo.png';
import linkedin from '../../assets/header/linkedin.png';
import github from '../../assets/header/github.png';

const SiteHeader = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <header className={styles['site-header']} role="banner" aria-label="Main Navigation">
            <div className={styles['site-header__inner']}>
                {/* Left: Logo */}
                <Link to="/" className={styles['site-header__logo']} aria-label="Home">
                    <img src={logo} alt="Carson Cobb Logo" />
                </Link>

                {/* Center: Anchor Links */}
                <nav className={styles['site-header__nav']} role="navigation" aria-label="Primary">
                    <ul className={styles['nav-list']}>
                        <li><a href="#service-bundles">Packages</a></li>
                        <li><a href="#case-studies">Case Studies</a></li>
                        <li><a href="#process">Process</a></li>
                        <li><a href="#faq">FAQ</a></li>
                    </ul>
                </nav>

                {/* Right: Primary CTA */}
                <div className={styles['site-header__cta']}>
                    <a 
                        href="https://koalendar.com/e/meet-with-carson-koaUwc9W"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btn} ${styles['btn-primary']}`}
                    >
                        Book Free Audit
                    </a>
                </div>

                {/* Mobile hamburger */}
                <button 
                    className={`${styles['site-header__toggle']} ${isDrawerOpen ? styles['is-active'] : ''}`}
                    aria-label={isDrawerOpen ? "Close menu" : "Open menu"} 
                    aria-expanded={isDrawerOpen}
                    onClick={toggleDrawer}
                >
                    <span className={styles['hamburger-box']}>
                        <span className={styles['hamburger-inner']}></span>
                    </span>
                </button>
            </div>

            {/* Mobile menu overlay */}
            <div 
                className={`${styles['site-header__drawer']} ${isDrawerOpen ? styles['is-open'] : ''}`}
                aria-hidden={!isDrawerOpen}
            >
                <nav role="navigation" aria-label="Mobile Primary">
                    <ul className={styles['drawer-list']}>
                        <li><a href="#service-bundles" onClick={toggleDrawer}>Packages</a></li>
                        <li><a href="#case-studies" onClick={toggleDrawer}>Case Studies</a></li>
                        <li><a href="#process" onClick={toggleDrawer}>Process</a></li>
                        <li><a href="#faq" onClick={toggleDrawer}>FAQ</a></li>
                    </ul>
                </nav>
                <div className={styles['site-header__mobile-cta']}>
                    <a 
                        href="https://koalendar.com/e/meet-with-carson-koaUwc9W"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btn} ${styles['btn-primary']}`}
                        onClick={toggleDrawer}
                    >
                        Book Free Audit
                    </a>
                </div>
            </div>
        </header>
    );
};

export default SiteHeader; 