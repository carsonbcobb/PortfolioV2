---
title: "Shopify Structured Data Gaps 2026: 107 Stores Checked"
description: "12% of Shopify product pages have no Product structured data, 22% have two or more copies and 16% of homepages have none. What breaks and how to fix it."
slug: "/reports/shopify-structured-data-gaps-2026"
h1: "Missing, doubled or broken: structured data on 107 Shopify stores"
answer: "Shopify structured data is often missing or doubled. In my November 2026 check of 107 Shopify brand stores, 12% of product pages had no Product structured data and 22% had two or more Product blocks, usually one from the theme and one from an app. 16% of homepages had no structured data at all, and broken code was rare."
datePublished: 2026-11-16
dateModified: 2026-11-23
reportStores: 107
faq:
  - question: "Do all Shopify product pages have Product structured data?"
    answer: "No. In November 2026, 12 of 104 Shopify brand product pages I checked (12%) had no Product structured data, and 7 had no structured data of any kind."
  - question: "How common is duplicate Product structured data on Shopify?"
    answer: "Common. 23 of 104 product pages (22%) had two or more Product blocks, usually one from the theme and another from a review or SEO app. Duplicates can show different names, prices or review counts."
  - question: "Do Shopify homepages have Organization structured data?"
    answer: "Not always. 17 of 107 homepages (16%) had no structured data at all, and 27 (25%) had no Organization or store name in their structured data."
  - question: "Does structured data help with AI search?"
    answer: "It helps AI get the facts right. In my earlier test, ChatGPT gave the correct price for all 20 products that had Product structured data, and couldn't find a price for 2 of the 4 that didn't. It doesn't by itself make AI recommend you."
---

**By Carson Cobb. Data collected November 16, 2026.**

Structured data is the code on a page that states its facts in a format machines read: this is a product, this is its price, this is the brand. On Shopify, most of it comes from your theme, with more added by apps.

It's easy to assume it's handled. I checked the homepage and one product page of 107 Shopify brand stores to see how often it's missing, doubled or broken.

## The short version

- **12% of product pages have no Product structured data.** 12 of 104.
- **22% have two or more copies.** 23 of 104, usually theme plus app.
- **16% of homepages have no structured data at all.** 17 of 107.
- **25% don't state the store's name** in Organization structured data. 27 of 107.
- **Broken code is rare.** 3 product pages and 1 homepage had structured data that wouldn't parse.
- **11 product pages added FAQ structured data.** 11%.

## Product pages

| | Product pages | Share of 104 |
| --- | --- | --- |
| No structured data of any kind | 7 | 7% |
| No Product structured data | 12 | 12% |
| Two or more Product blocks | 23 | 22% |
| Structured data that fails to parse | 3 | 3% |
| FAQ structured data | 11 | 11% |

## Homepages

| | Homepages | Share of 107 |
| --- | --- | --- |
| No structured data of any kind | 17 | 16% |
| No Organization or store name stated | 27 | 25% |
| Structured data that fails to parse | 1 | 1% |

For what homepage Organization data says about a brand, see [Organization schema on Shopify](/reports/shopify-organization-schema-2026).

## Why missing data matters

Product structured data is where price, availability and brand are stated in one clean place. In my earlier test, ChatGPT gave the right price for every product that had it, and couldn't find a price for half of those that didn't. See [does schema change what ChatGPT says](/reports/does-schema-change-what-chatgpt-says).

Missing Product data usually traces back to the theme: a heavily customized or older theme, or a custom storefront, where the standard markup was removed or never added. It's worth checking after any redesign.

## Why doubles matter

When the theme publishes one Product block and a review app publishes another, the two often disagree: a different name, a different review count, a rating in one and not the other. AI has to choose, and it doesn't always choose right. In my earlier test, Gemini got the rating right on only 2 of 8 products with duplicate data. See [duplicate product data and AI visibility](/reports/duplicate-product-schema-ai-visibility).

22% of product pages in this sample had duplicates, close to the 29% I found in a different sample of 94 stores earlier this month.

## What to do with this

1. **Test your top product pages.** Paste the URL into Google's Rich Results Test or the Schema Markup Validator.
2. **Make sure there's exactly one Product block.** If the theme and an app both add one, turn one off or merge them, so name, price, rating and review count appear once.
3. **Check the facts inside it.** Price, currency, availability, brand and image should match the page.
4. **Add Organization data to the homepage.** Your store name, logo and social profiles, so AI connects your brand to your site. See [product schema completeness](/reports/shopify-product-schema-completeness-2026).
5. **Re-test after theme or app changes.** Most problems arrive with a new app or theme update.

Structured data and the rest of your product data are part of [Close the Gap](/close-the-gap). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Stores:** 107 Shopify brand stores, 17 to 18 in each of six product areas (supplements, beauty, food and drink, pet, home, apparel), drawn at random from my dataset of 620 Shopify brand stores. Client stores were excluded.
- **Pages:** each store's homepage, loaded in a browser, and one available product page per store (the first in its public product list), fetched November 16, 2026. 104 product pages loaded.
- **Structured data:** every JSON-LD block on the page was parsed and walked, including `@graph` lists. Counted: blocks that failed to parse, blocks with the Product or ProductGroup type, Organization or OnlineStore names, and FAQPage.
- **Limits:** JSON-LD only. Microdata, used by some older themes, wasn't counted, so a few pages counted as missing Product data may have it in that older format. One product page per store.

No store or brand is named in this report.
