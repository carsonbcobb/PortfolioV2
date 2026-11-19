---
title: "Shopify Image Loading 2026: A Third Lazy Load the Main Product Image | Carson Cobb"
description: "34% of Shopify brand product pages lazy load the first product image, which delays the largest thing shoppers see. Only 43% mark it high priority. Data from 596 product pages and 598 homepages."
slug: "/reports/shopify-image-loading-speed-2026"
h1: "Shopify image loading: a third of brand stores slow down the first image shoppers see"
datePublished: 2026-11-17
dateModified: 2026-11-17
cta: cro
reportStores: 599
faq:
  - question: "Should the first product image be lazy loaded on Shopify?"
    answer: "No. The first image in view is usually the largest element on the page, and lazy loading tells the browser to wait before fetching it. Google's guidance is to never lazy load the image that's likely to be the largest content. In November 2026, 34% of Shopify brand product pages I checked lazy loaded their first product image."
  - question: "What is fetchpriority high and should Shopify stores use it?"
    answer: "It tells the browser to fetch an image early. It's meant for the main image in view, like the hero on the homepage or the first product photo. 43% of product pages and 51% of homepages I checked used it on at least one image."
  - question: "How many images does a Shopify homepage load?"
    answer: "The median Shopify brand homepage had 69 image tags in its page source, and a third had 100 or more. Most were lazy loaded, which is right for images below the fold."
  - question: "Do Shopify homepages use video?"
    answer: "40% of homepages had a video element or an embedded video in the page source. Video can be worth it, but a hero video should have a lightweight poster image and shouldn't block the first view."
---

**By Carson Cobb. Data collected November 17, 2026.**

On most product pages, the first product photo is the largest thing on screen and the thing Google times for Largest Contentful Paint. How a theme tells the browser to load that one image makes a visible difference on mobile. I checked how 599 Shopify brand stores handle it.

## The short version

- **34% lazy load the first product image.** That tells the browser to wait on the most important image.
- **30% lazy load the first image on the homepage.**
- **Only 43% of product pages mark an image high priority.** 51% of homepages do.
- **12% of product pages preload an image.**
- **11% of homepages with 10 or more images lazy load none of them.** The opposite mistake.
- **The median homepage has 69 images in its source.** A third have 100 or more.

## Product pages

| Check | Product pages | Share of 596 |
| --- | --- | --- |
| First product image lazy loaded | 199 of 591 | 34% |
| Image marked fetchpriority high | 257 | 43% |
| Image preloaded in the head | 74 | 12% |

## Homepages

| Check | Homepages | Share of 598 |
| --- | --- | --- |
| First image lazy loaded | 180 | 30% |
| Image marked fetchpriority high | 302 | 51% |
| 100 or more images in the source | 200 | 33% |
| 10 or more images, none lazy loaded | 64 | 11% |
| Video in the source | 239 | 40% |
| Google Fonts loaded | 187 | 31% |

## By product area

| Product area | First product image lazy | Product page fetchpriority high | Homepage video |
| --- | --- | --- | --- |
| Supplements | 35% | 47% | 38% |
| Beauty | 35% | 50% | 47% |
| Food and drink | 28% | 25% | 35% |
| Pet | 37% | 20% | 29% |
| Home | 36% | 54% | 44% |
| Apparel | 36% | 62% | 43% |

## Why this matters

Lazy loading is good for images further down the page and bad for the first one in view. Google's own guidance says not to lazy load the image likely to be the largest content on the page ([web.dev](https://web.dev/articles/lcp-lazy-loading)). When a theme or app applies lazy loading to every image, the main product photo waits in line behind scripts.

Shoppers arriving from AI answers land straight on a product page, often on mobile, already close to a decision. Adobe found AI referred visitors to US retail sites converted 60% better than other traffic by mid 2026 ([Digital Commerce 360](https://www.digitalcommerce360.com/2026/08/19/adobe-ai-referral-traffic-data-july-2026/)). A slow first image is a bad first second for the most valuable visitor you have.

For HTML size and script counts, see [Shopify homepage weight](/reports/shopify-homepage-page-weight-scripts-2026).

## What to do with this

1. **Load the first product image eagerly**, with fetchpriority high. In most themes this is one setting or one line in the product media snippet.
2. **Do the same for the homepage hero.**
3. **Keep lazy loading for everything below the fold.**
4. **Give hero videos a light poster image** and don't autoplay heavy files on mobile.
5. **Check the result in PageSpeed Insights**, on mobile, for your top product page.

Speed fixes that move conversion are part of my [Full Store Audit](/full-store-audit). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Stores:** 599 Shopify brand stores in six product areas: supplements (118), beauty (125), food and drink (152), pet (41), home (72) and apparel (91), from my dataset of 620 Shopify brand stores, client stores excluded. 598 homepages and 596 product pages were readable.
- **When:** November 17, 2026.
- **Pages:** the homepage and the product page of the first available product in each store's public product feed.
- **How:** page source as first sent by the server. The first product image is the first image tag pointing to a Shopify product or file image. Lazy loading counted from loading="lazy".
- **Limits:** themes that load images with JavaScript, or swap attributes after load, may differ from what the source shows. This measures markup, not actual load times.

No store or brand is named in this report.
