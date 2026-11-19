---
title: "Shopify Homepage Weight 2026: HTML Size, Scripts and Third Party Tools | Carson Cobb"
description: "The median Shopify brand homepage sends 604 KB of HTML before images, loads 28 scripts in the page source and calls 6 outside script hosts. 21% send over 1 MB. Data from 609 stores."
slug: "/reports/shopify-homepage-page-weight-scripts-2026"
h1: "How heavy is a Shopify homepage? HTML size, scripts and outside tools across 609 brands"
datePublished: 2026-11-17
dateModified: 2026-11-17
cta: cro
reportStores: 617
faq:
  - question: "How big is a typical Shopify homepage?"
    answer: "In November 2026, the median Shopify brand homepage's HTML was 604 KB before any images, scripts or styles loaded. A quarter were under 365 KB and a quarter over 920 KB. 21% were over 1 MB."
  - question: "How many scripts does a Shopify homepage load?"
    answer: "The median homepage had 28 script tags with a source in its page source, and scripts from 6 outside hosts that aren't Shopify. 6% had 60 or more. Apps that load through Shopify app embeds or pixels can add more after the page loads."
  - question: "Why is my Shopify homepage HTML so large?"
    answer: "Usually inline data and code: product and collection data for menus and quick view, app settings, JSON for sections, and inline styles. Mega menus and many homepage sections add up fast."
  - question: "Does page weight affect AI search?"
    answer: "Indirectly. A heavy page is slower for shoppers, especially on mobile, and AI referred shoppers land straight on a page and decide fast. Crawlers also have to work through more code to reach the text that describes your products."
---

**By Carson Cobb. Data collected November 16 and 17, 2026.**

Every app a store installs promises more conversions. Each one also adds code to the page. I measured how much code Shopify brand homepages send before a single image loads.

## The short version

- **The median homepage sends 604 KB of HTML.** That's the document alone, before images, scripts or styles.
- **21% send over 1 MB of HTML.** 126 of 609.
- **The median homepage has 28 script tags in its source.** 6% have 60 or more.
- **Scripts come from a median of 6 outside hosts.** The most I found was 20.
- **Apparel and home are heaviest. Food and drink is lightest.**

## HTML size

| Homepage HTML | Homepages | Share of 609 |
| --- | --- | --- |
| Under 250 KB | 65 | 11% |
| 250 to 499 KB | 183 | 30% |
| 500 to 999 KB | 235 | 39% |
| 1 MB or more | 126 | 21% |

## By product area

| Product area | Homepages | Median HTML | Median scripts | Median outside script hosts |
| --- | --- | --- | --- | --- |
| Supplements | 121 | 567 KB | 33 | 6 |
| Beauty | 127 | 647 KB | 28 | 7 |
| Food and drink | 153 | 454 KB | 25 | 4 |
| Pet | 41 | 574 KB | 24 | 5 |
| Home | 75 | 701 KB | 29 | 6 |
| Apparel | 92 | 762 KB | 31 | 6 |

## What's on the page

The most common tools in homepage code were Klaviyo (87%), Google Tag Manager (37%), Gorgias (35%), Rebuy (34%), Microsoft Clarity (31%), Attentive (24%), Triple Whale (23%) and Intelligems (19%). Almost half of stores had code from two or more review tools. Some of that code can belong to apps that were uninstalled. I break the tools down in [review apps](/reports/shopify-review-apps-2026), [the wider app stack](/reports/shopify-tech-stack-report-2026) and [testing tools](/reports/shopify-ab-testing-tools-2026).

## Why it matters

Shoppers who arrive from AI tend to land on one page and decide quickly. Adobe reported in 2026 that AI referred visitors to US retail sites now convert better than other traffic ([Digital Commerce 360, August 2026](https://www.digitalcommerce360.com/2026/08/19/adobe-ai-referral-traffic-data-july-2026/)). A page that's slow to become usable wastes that intent, and the cost lands hardest on mobile.

Heavy HTML is also more for a crawler to wade through before it reaches the words that describe your products.

34% of Shopify brand product pages lazy load the first product image ([Shopify image loading](/reports/shopify-image-loading-speed-2026)).

## What to do with this

1. **List every outside script host.** Open the page source, search "script src", and match each one to an app you actually use.
2. **Remove leftover app code.** Uninstalling an app doesn't always remove its snippets from the theme.
3. **Trim the homepage.** Fewer sections, a lighter menu, and no product data for quick view you don't use.
4. **Test on a real phone on mobile data.** Not on office wifi.

Speed and app weight are part of my [Full Store Audit](/full-store-audit). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Stores:** 617 Shopify brand stores in six product areas: supplements (123), beauty (127), food and drink (154), pet (41), home (76) and apparel (96). This is my full dataset of 620 Shopify brand stores, minus client stores and one store that blocked automated reads. 609 homepages were readable.
- **When:** November 16 and 17, 2026.
- **How:** each homepage's HTML as the server first sends it. HTML size is the document length. Scripts are script tags with a source. Outside hosts are script domains that aren't the store or Shopify.
- **Limits:** this measures the page source, not full load time. Scripts injected later by apps, app embeds or pixels weren't counted, so real totals are higher. Tool detection is pattern based.

No store or brand is named in this report.
