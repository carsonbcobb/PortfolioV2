export const siteConfig = {
    name: 'Carson Cobb',
    url: 'https://carsoncobb.com',
    logo: 'https://carsoncobb.com/logo.png',
    description: 'One operator to run your entire Shopify store end to end: conversion, development, AI search visibility, retention, and operations. 6+ years across nearly every DTC vertical.',
    social: {
        twitter: 'https://twitter.com/yourhandle',
        linkedin: 'https://www.linkedin.com/in/carsoncobb',
        github: 'https://github.com/yourusername'
    }
};

export const getCurrentUrl = (path = '') => {
    return `${siteConfig.url}${path}`;
};

export const generateOrganizationSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: siteConfig.logo,
        sameAs: Object.values(siteConfig.social)
    };
};

export const generateWebSiteSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: siteConfig.url,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${siteConfig.url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    };
};

export const generateServiceSchema = (service) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.description,
        provider: {
            '@type': 'Organization',
            name: siteConfig.name
        }
    };
};

export const generateFAQSchema = (faqs) => {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    };
};
