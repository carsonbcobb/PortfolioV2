import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SiteHeader.module.scss';
import logo from '../../assets/header/logo.png';

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
                        <li><a href="#services">Services</a></li>
                        <li><a href="#results">Results</a></li>
                        <li><a href="#process">Process</a></li>
                        <li><a href="#faq">FAQ</a></li>
                        <li><Link to="/blog">Blog</Link></li>
                    </ul>
                </nav>

                {/* Right: Primary CTA */}
                <div className={styles['site-header__cta']}>
                    <a 
                        href="https://koalendar.com/e/ghost-revenue-discovery-call"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btn} ${styles['btn-primary']}`}
                    >
                        Schedule a Discovery Call
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
                        <li><a href="#services" onClick={toggleDrawer}>Services</a></li>
                        <li><a href="#results" onClick={toggleDrawer}>Results</a></li>
                        <li><a href="#process" onClick={toggleDrawer}>Process</a></li>
                        <li><a href="#faq" onClick={toggleDrawer}>FAQ</a></li>
                        <li><Link to="/blog" onClick={toggleDrawer}>Blog</Link></li>
                    </ul>
                </nav>
                <div className={styles['site-header__mobile-cta']}>
                    <a 
                        href="https://koalendar.com/e/ghost-revenue-discovery-call"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.btn} ${styles['btn-primary']}`}
                        onClick={toggleDrawer}
                    >
                        Schedule a Discovery Call
                    </a>
                </div>
            </div>
        </header>
    );
};

export default SiteHeader; 