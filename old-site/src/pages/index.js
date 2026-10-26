import Head from 'next/head';
import {
    generateOrganizationSchema,
    generateWebSiteSchema,
    generateServiceSchema,
    generateFAQSchema,
    getCurrentUrl
} from '../utils/seo';
import { faqs } from '../components/Faq/Faq';
import { services } from '../components/Services/Services';

export default function Home() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            generateOrganizationSchema(),
            generateWebSiteSchema(),
            ...services.map(service => generateServiceSchema(service)),
            generateFAQSchema(faqs)
        ]
    };

    return ( <
        >
        <
        Head >
        <
        title > Carson Cobb | Full-Store Shopify Operator for DTC Brands < /title> <
        meta name = "description"
        content = "One operator to run your entire Shopify store end to end: conversion, development, AI search visibility, retention, and operations. 6+ years across nearly every DTC vertical." / >

        { /* Open Graph */ } <
        meta property = "og:title"
        content = "Carson Cobb | Full-Store Shopify Operator for DTC Brands" / >
        <
        meta property = "og:description"
        content = "One operator to run your entire Shopify store end to end: conversion, development, AI search visibility, retention, and operations. 6+ years across nearly every DTC vertical." / >
        <
        meta property = "og:image"
        content = "https://carsoncobb.com/og-image.jpg" / >
        <
        meta property = "og:url"
        content = { getCurrentUrl() }
        />

        { /* Twitter */ } <
        meta name = "twitter:card"
        content = "summary_large_image" / >
        <
        meta name = "twitter:title"
        content = "Carson Cobb | Full-Store Shopify Operator for DTC Brands" / >
        <
        meta name = "twitter:description"
        content = "One operator to run your entire Shopify store end to end: conversion, development, AI search visibility, retention, and operations. 6+ years across nearly every DTC vertical." / >
        <
        meta name = "twitter:image"
        content = "https://carsoncobb.com/og-image.jpg" / >

        { /* Canonical */ } <
        link rel = "canonical"
        href = { getCurrentUrl() }
        />

        { /* JSON-LD */ } <
        script type = "application/ld+json"
        dangerouslySetInnerHTML = {
            { __html: JSON.stringify(jsonLd) }
        }
        /> < /
        Head >

        <
        main > { /* Your existing components */ } <
        /main> < / >
    );
}
