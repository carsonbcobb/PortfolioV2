---
title: "Shopify Product Schema Completeness 2026: What AI Can Read"
description: "Which structured data fields Shopify stores publish, from price and stock to ratings, identifiers, shipping and returns. Field by field, from 94 stores."
slug: "/reports/shopify-product-schema-completeness-2026"
h1: "Product and merchant schema completeness"
datePublished: 2026-11-04
dateModified: 2026-11-04
reportStores: 94
faq:
  - question: "What share of Shopify stores have Product structured data?"
    answer: "89% of 94 stores I checked in November 2026 had Product structured data on their best selling product page. Almost all included name, price and availability. The gaps were ratings, product identifiers, shipping and returns."
  - question: "Do Shopify stores include review ratings in their structured data?"
    answer: "Only 62% of stores with Product structured data included an aggregate rating. Among stores running a review app, 28% still had no rating in their structured data, so the stars shoppers see were not in the data machines read."
  - question: "How many Shopify stores include shipping and return details in structured data?"
    answer: "11%. Shipping and return policy fields were the least common fields in the study, even though they answer questions shoppers ask AI before buying."
---

**By Carson Cobb. Data checked November 2026.**

Structured data is the part of a product page written for machines: the name, price, stock status, rating and policies in a format a crawler can read without guessing. Google has used it for years. Microsoft has said it helps its AI models understand pages. When an AI assistant answers "how much is it" or "is it any good," clean structured data is the most direct source it can use.

I checked which fields Shopify stores actually publish.

## The short version

- **The basics are nearly universal.** 89% of stores had Product structured data, and almost all of those included name, price and availability.
- **Ratings are missing more often than you'd expect.** Only 62% included a rating. 28% of stores running a review app had no rating in their structured data at all.
- **Identifiers are spotty.** 46% included a GTIN barcode number. Without one, a product is harder to match across retailers and reviews.
- **Shipping and returns are almost never included.** 11% each. These are the details shoppers ask AI about right before they buy.
- **About 1 in 8 stores publish the wrong brand name.** A legal entity, a domain, a supplier code or, in one case, a color, instead of the name shoppers know.

## Field by field

Among the 84 stores with Product structured data on their best selling product page:

| Field | What it tells a machine | Stores with it |
| --- | --- | --- |
| Name | What the product is | 100% |
| Price and availability | What it costs and whether it ships | 98% |
| Brand | Who makes it | 96% |
| Image | What it looks like | 92% |
| Description | What it does | 89% |
| SKU | The store's own product code | 86% |
| Aggregate rating | Average stars and review count | 62% |
| GTIN | The barcode number used across retailers | 46% |
| MPN | The manufacturer part number | 25% |
| Individual reviews | Text of specific reviews | 18% |
| Shipping details | Cost and delivery time | 11% |
| Return policy | Return window and method | 11% |

The pattern is clear. Shopify themes output the basics well. Anything that comes from outside the theme, like ratings from a review app, identifiers from the catalog, or policies from the shipping setup, is where the data thins out.

## Ratings: the stars shoppers see aren't always in the data

74 of 94 stores (79%) were running a review app I could detect. But among the stores with both a review app and Product structured data, **28% had no rating in that structured data.** The reviews were on the page for shoppers. They weren't in the data for machines.

There are two common causes. Some review apps load ratings with a script after the page loads, and the crawlers behind ChatGPT, Claude and Perplexity don't run scripts. Others add their rating in a separate structured data block that isn't connected to the product. The [duplicate schema report](/reports/duplicate-product-schema-ai-visibility) covers that second problem.

## Brand names that don't match the brand

10 of 84 stores (12%) published a brand name in their structured data that isn't the name shoppers know. Examples of what I found, with names removed: the company's legal entity name ending in LLC, the store's domain name, a supplier name, an abbreviation, and one store where the brand field contained a product color. These usually come from Shopify's vendor field, which teams fill in for internal reasons and never look at again.

When the brand field is wrong, a machine has to choose between what the page says and what the data says. It's an easy fix that almost nobody checks.

## Beyond the product page

| Page | Structured data checked | Stores with it |
| --- | --- | --- |
| Homepage | Organization | 73% |
| Homepage | Organization with links to social profiles (sameAs) | 61% |
| Homepage | Site search action | 65% |
| Homepage | No structured data at all | 19% |
| Product page | Breadcrumbs | 37% |
| Product page | FAQ markup | 17% |
| Collection page | Collection or item list | 25% |
| FAQ page | FAQ markup | 17% |
| Blog article | Article or BlogPosting | 57% |
| About page | About page markup | 2% |

The homepage Organization block is how a brand tells machines "this site, these social profiles and this logo are the same company." 39% of stores don't make that connection.

## What to do with this

1. **Check that your rating is in your structured data, not just on the page.** If you use a review app, test a product page with Google's Rich Results Test and confirm one product shows a rating.
2. **Fix the brand field.** Make sure it says the name customers know, on every product.
3. **Add GTINs where you have them.** If your products have barcodes, they belong in the catalog and in the data.
4. **Add shipping and return details.** Shopify's newer themes and Google's merchant listing fields support both. They answer the last questions before purchase.
5. **Connect your brand on the homepage.** One Organization block with your logo and social profiles.

## How this was done

- **Stores:** 94 US Shopify stores across apparel, beauty and skincare, food and beverage, home, pet and supplements, 15 or 16 per category, drawn from the same dataset as my other reports.
- **Pages:** for each store, one best selling product page, the homepage, one collection, the FAQ page if one exists, the blog index and one article, and the about page. Checked in November 2026.
- **Product fields:** read from all Product and ProductGroup JSON-LD blocks on the product page after it finished loading, including offers and variants. A field counts if any block on the page included it with a value. Empty values don't count.
- **Review apps:** detected from the scripts and resources each product page loaded.
- **Brand mismatch:** the brand field compared with the store's own name, by hand. Retailers that sell other brands were not counted as mismatches.

No store is named in this report. [Run the free AI Visibility Check](/ai-visibility-check) to see what AI reads from your product pages.
