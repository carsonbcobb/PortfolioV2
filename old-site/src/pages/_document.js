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
        href = "https://carsoncobb.com" / >
        <
        link rel = "sitemap"
        href = "/sitemap.xml" / >

        { /* Default meta tags */ } <
        meta name = "description"
        content = "One operator to run your entire Shopify store end to end: conversion, development, AI search visibility, retention, and operations. 6+ years across nearly every DTC vertical." / >

        { /* Open Graph */ } <
        meta property = "og:type"
        content = "website" / >
        <
        meta property = "og:site_name"
        content = "Carson Cobb" / >
        <
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
        content = "https://carsoncobb.com" / >

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
        <
        /Head> <
        body >
        <
        Main / >
        <
        NextScript / >
        <
        /body> < /
        Html >
    );
}
