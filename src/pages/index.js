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
        title > Shopify Speed & UX Optimization | Your Company Name < /title> <
        meta name = "description"
        content = "Expert Shopify speed optimization and UX improvements to increase your store's conversion rate. Get a free 5-Point Speed & UX Audit." / >

        { /* Open Graph */ } <
        meta property = "og:title"
        content = "Shopify Speed & UX Optimization | Your Company Name" / >
        <
        meta property = "og:description"
        content = "Expert Shopify speed optimization and UX improvements to increase your store's conversion rate. Get a free 5-Point Speed & UX Audit." / >
        <
        meta property = "og:image"
        content = "https://yourdomain.com/og-image.jpg" / >
        <
        meta property = "og:url"
        content = { getCurrentUrl() }
        />

        { /* Twitter */ } <
        meta name = "twitter:card"
        content = "summary_large_image" / >
        <
        meta name = "twitter:title"
        content = "Shopify Speed & UX Optimization | Your Company Name" / >
        <
        meta name = "twitter:description"
        content = "Expert Shopify speed optimization and UX improvements to increase your store's conversion rate. Get a free 5-Point Speed & UX Audit." / >
        <
        meta name = "twitter:image"
        content = "https://yourdomain.com/og-image.jpg" / >

        { /* Canonical */ } <
        link rel = "canonical"
        href = { getCurrentUrl() }
        />

        { /* JSON-LD */ } <
        script type = "application/ld+json"
        dangerouslySetInnerHTML = {
            { __html: JSON.stringify(jsonLd) } }
        /> <
        /Head>

        <
        main > { /* Your existing components */ } <
        /main> <
        />
    );
}