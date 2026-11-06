---
title: "Shopify Product Data for AI Shopping 2026 | Carson Cobb"
description: "Barcodes, product types, images and descriptions on 94 Shopify stores: 30% of products had no barcode, 43% passed four basic checks."
slug: "/reports/shopify-catalog-data-ai-shopping-2026"
h1: "Is your Shopify product data ready for AI shopping?"
datePublished: 2026-11-06
dateModified: 2026-11-06
reportStores: 94
faq:
  - question: "Do Shopify products need barcodes (GTINs) for AI shopping?"
    answer: "They help. Barcodes are how Google Shopping, and the AI tools that draw on product feeds, match your product to the same product elsewhere and to its reviews. In my November 2026 check of 94 Shopify stores, 30% of sampled products had no barcode on any variant, rising to 63% for food and beverage."
  - question: "What product data do AI shopping tools use?"
    answer: "Product title, description, price, availability, variants, images, product type, brand and identifiers like barcodes. Shopify Catalog, which feeds Shopify products to ChatGPT, Perplexity and Microsoft Copilot, is built from this same product data."
  - question: "How long should Shopify product descriptions be for AI?"
    answer: "Long enough to answer the questions shoppers ask about the product. The median sampled product had a 366 character description, about 60 words. 15% had under 150 characters and 6% had none at all. At the store level, 36% of stores had more than half their products under 300 characters."
  - question: "How many Shopify stores have AI ready product data?"
    answer: "Only 43% of sampled products passed four basic checks: a barcode on every variant, a product type, at least 3 images and a description of at least 150 characters."
---

**By Carson Cobb. Data checked November 2026.**

AI shopping runs on product data. When ChatGPT, Gemini or Google AI Mode show a product card, compare two items or answer "does this come in a larger size?", they're reading the same fields your store publishes for every product: title, description, variants, price, images, product type and identifiers like barcodes.

Shopify now sends that data to AI tools directly. Its Agentic Storefronts, announced in December 2025, publish merchant catalogs to ChatGPT, Perplexity and Microsoft Copilot through Shopify Catalog. Google's AI Mode draws on Google's own shopping data. Either way, what AI knows about your product starts with what your store publishes.

So I checked it. For 94 US Shopify stores, I pulled the public product data for one product page and for up to 250 products from each store's catalog.

## The short version

- **30% of sampled products had no barcode on any variant.** In food and beverage it was 63%.
- **21% of sampled products had no product type.** 6% of stores had no product types anywhere in their catalog.
- **Descriptions were short.** The median sampled product had 366 characters, about 60 words. 15% had under 150 characters. 6% had none.
- **Images were the strongest field.** The median sampled product had 6 images, and only 12% had fewer than 3.
- **Only 43% passed four basic checks:** barcodes on every variant, a product type, 3 or more images and a description of at least 150 characters.

## The sampled product on each store

| Check | Stores passing |
| --- | --- |
| SKU on every variant | 93% |
| Product type set | 79% |
| 3 or more images | 88% |
| Description of 150 characters or more | 85% |
| Barcode on every variant | 63% |
| All four of barcode, type, images and description | 43% |

**Barcodes were the most common gap.** A barcode, usually a UPC or EAN, is the field Google uses to recognize that your product is the same product a retailer or review site is talking about. Without it, your listing is harder to match to reviews and comparisons, and Google Merchant Center flags products that have a manufacturer barcode but don't provide it.

Among sampled products with more than one variant, 69% had a barcode on every variant, 16% on none, and the rest on some. Partial coverage matters because shoppers often ask about a specific size or flavor, and that's the variant AI needs to identify.

## Barcodes by product type

| Product type | Stores | Every variant has a barcode | No barcode at all |
| --- | --- | --- | --- |
| Apparel | 16 | 88% | 6% |
| Beauty and skincare | 16 | 81% | 19% |
| Pet | 15 | 67% | 20% |
| Home | 16 | 63% | 31% |
| Supplements | 15 | 40% | 40% |
| Food and beverage | 16 | 38% | 63% |

Apparel and beauty brands usually sell through retailers that require barcodes, so the data is already there. Food and supplement brands, many of them direct to consumer first, were the most likely to skip it, even though food and supplements are where shoppers ask AI the most specific questions: ingredients, sugar, testing, dosage.

## Descriptions

| Description length on the sampled product | Stores |
| --- | --- |
| None | 6% |
| Under 150 characters | 15% |
| 150 to 1,000 characters | 67% |
| Over 1,000 characters | 18% |

The median sampled description was 366 characters. Across each store's catalog, the median store's typical product had 395 characters, and the median store had 28% of its products under 300 characters. For 36% of stores, more than half the catalog was under 300 characters.

A few sentences can't answer the questions people now type into AI. In my research, the questions that change AI recommendations most are long and specific: who it's for, what it's made of, how it fits, what it's tested for. See [how question wording changes AI recommendations](/reports/how-question-wording-changes-ai-recommendations). A description is where the answers to those questions live in your product data.

One caution: some stores put most of their product content in theme sections or apps instead of the description field. Those sections may show on the page, but they don't travel with your product data into feeds and catalogs. If AI tools read your catalog instead of your page, that content isn't there.

## Product types and images across the catalog

| Across up to 250 products per store | Median store |
| --- | --- |
| Products with a product type | 94% |
| Products with 3 or more images | 86% |
| Products with tags | 99% |

Half the stores (49%) set a product type on at least 95% of their products. 6% set none at all. Product type is a simple field, but it's one of the ways your catalog tells an AI what a product is before it reads the description.

Images were the strongest part of most catalogs. AI product cards lead with an image, so this is good news, but 6% of sampled products had only one image.

## What to do with this

1. **Add barcodes to every variant that has one.** If your products have UPCs, put them in the barcode field for every size and flavor, not just the default variant.
2. **Set a product type on every product.** Use plain names a shopper would use.
3. **Move key product facts into the description.** Who it's for, what it's made of, sizing and fit, ingredients, testing and what's in the box. Content that only lives in theme sections or apps doesn't travel to feeds.
4. **Give every product at least 3 images,** including one that shows scale or the product in use.
5. **Check your feed, not just your page.** Look at what Google Merchant Center and your Shopify catalog actually contain for your best sellers.

Product data and feed findings for Google and ChatGPT are part of my [AI Search and Conversion Audit](/ai-search). For a quick read on one page, run the free [AI Visibility Check](/ai-visibility-check).

## How this was done

- **Stores:** the 94 US Shopify stores in my [AI Readiness Index](/reports/shopify-ai-readiness-index-2026), across apparel, beauty and skincare, food and beverage, home, pet and supplements.
- **Sampled product:** one product page per store. Data came from that product's public Shopify product data: variants, barcodes, SKUs, product type, images and description.
- **Catalog:** up to the first 250 products from each store's public product listing, excluding gift cards. 29% of stores had 250 or more products, so for those stores this is a sample of the catalog.
- **Barcode:** a barcode field with at least 8 characters.
- **Description length:** visible text characters in the product description field, after removing formatting.
- **Date:** checked November 5, 2026.
- **Limits:** one product per store for the product level checks. Barcodes only apply to products that have one, so some products without a barcode, like custom or handmade goods, may be correct.

No store or brand is named in this report.
