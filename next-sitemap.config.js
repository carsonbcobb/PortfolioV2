/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://yourdomain.com',
    generateRobotsTxt: false, // We already have a custom robots.txt
    generateIndexSitemap: false,
    changefreq: 'weekly',
    priority: 0.7,
    exclude: ['/admin/*', '/api/*'],
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://yourdomain.com/sitemap.xml',
        ],
        policies: [{
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/*', '/api/*', '/_next/*', '/static/*'],
        }, ],
    },
};