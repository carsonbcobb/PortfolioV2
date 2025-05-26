import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return ( <
        Html lang = "en" >
        <
        Head >
        <
        meta charSet = "utf-8" / >
        <
        meta name = "viewport"
        content = "width=device-width, initial-scale=1" / >
        <
        link rel = "icon"
        href = "/favicon.ico" / >
        <
        link rel = "canonical"
        href = "https://yourdomain.com" / >
        <
        link rel = "sitemap"
        href = "/sitemap.xml" / >

        { /* Default meta tags */ } <
        meta name = "description"
        content = "Expert Shopify speed optimization and UX improvements to increase your store's conversion rate." / >

        { /* Open Graph */ } <
        meta property = "og:type"
        content = "website" / >
        <
        meta property = "og:site_name"
        content = "Your Company Name" / >
        <
        meta property = "og:title"
        content = "Shopify Speed & UX Optimization" / >
        <
        meta property = "og:description"
        content = "Expert Shopify speed optimization and UX improvements to increase your store's conversion rate." / >
        <
        meta property = "og:image"
        content = "https://yourdomain.com/og-image.jpg" / >
        <
        meta property = "og:url"
        content = "https://yourdomain.com" / >

        { /* Twitter */ } <
        meta name = "twitter:card"
        content = "summary_large_image" / >
        <
        meta name = "twitter:title"
        content = "Shopify Speed & UX Optimization" / >
        <
        meta name = "twitter:description"
        content = "Expert Shopify speed optimization and UX improvements to increase your store's conversion rate." / >
        <
        meta name = "twitter:image"
        content = "https://yourdomain.com/og-image.jpg" / >
        <
        /Head> <
        body >
        <
        Main / >
        <
        NextScript / >
        <
        /body> <
        /Html>
    );
}