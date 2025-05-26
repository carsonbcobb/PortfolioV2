export const siteConfig = {
    name: 'Your Company Name',
    url: 'https://yourdomain.com',
    logo: 'https://yourdomain.com/logo.png',
    description: 'Expert Shopify speed optimization and UX improvements to increase your store\'s conversion rate.',
    social: {
        twitter: 'https://twitter.com/yourhandle',
        linkedin: 'https://linkedin.com/company/yourcompany',
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