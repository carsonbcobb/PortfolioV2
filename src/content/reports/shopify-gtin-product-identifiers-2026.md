---
title: "GTINs on Shopify 2026: Only 23% of Product Pages Have One"
description: "Only 23% of 516 Shopify product pages put a GTIN in structured data and 41% have a GTIN or MPN. Apparel leads at 40%. Why identifiers matter for AI."
slug: "/reports/shopify-gtin-product-identifiers-2026"
h1: "GTINs on Shopify: most product pages don't tell AI which product they are"
answer: "Most Shopify product pages don't include a GTIN. In my November 2026 check of 516 Shopify product pages with Product structured data, only 23% included a GTIN and 41% had a GTIN or an MPN. Apparel led at 40%, while beauty and food trailed at 15%. Without a GTIN, AI tools have a harder time matching the exact product."
datePublished: 2026-11-17
dateModified: 2026-11-23
reportStores: 617
faq:
  - question: "What is a GTIN and why does it matter for AI search?"
    answer: "A GTIN is the barcode number (UPC, EAN or ISBN) that identifies one exact product everywhere it's sold. AI shopping tools and Google use it to match the same product across your site, retailers and reviews, so prices, ratings and stock line up."
  - question: "How many Shopify stores include GTINs in their product structured data?"
    answer: "Few. In November 2026, 117 of 516 Shopify product pages with Product structured data (23%) included a GTIN in the page source. 41% included a GTIN or an MPN. Apparel was highest at 40%; beauty and food were lowest at 15%."
  - question: "Where do GTINs come from on Shopify?"
    answer: "The Barcode field on each variant. If that field is filled, most current themes output it as a GTIN in the product structured data. If it's empty, nothing is output."
  - question: "Do I need GTINs if I only sell on my own site?"
    answer: "If your products have barcodes, yes. Google Merchant Center asks for them, and AI tools use them to recognize your product when it shows up on retailer pages and in reviews. Products without barcodes, like custom items, can use brand plus MPN instead."
---

**By Carson Cobb. Data collected November 16 and 17, 2026.**

A product name is fuzzy. "Daily Greens, 30 servings" might be your product, a retailer's listing of your product, or a competitor's. A GTIN, the barcode number, is exact. It's how Google, marketplaces and AI shopping tools know that the product on your site, the one on a retailer page and the one in a review are the same thing.

I checked the product structured data on 516 Shopify product pages for identifiers.

## The short version

- **23% include a GTIN.** 117 of 516 product pages with Product structured data.
- **21% include an MPN, and 41% have one or the other.**
- **67% include a SKU.** That's the store's own code. It doesn't help outside the store.
- **98% include a brand.** Identifiers are the gap, not the basics.
- **Apparel leads at 40%. Beauty and food trail at 15%.**

## Identifiers by product area

| Product area | Product pages with schema | GTIN | GTIN or MPN | SKU |
| --- | --- | --- | --- | --- |
| Supplements | 106 | 25% | 47% | 71% |
| Beauty | 108 | 15% | 32% | 67% |
| Food and drink | 121 | 15% | 29% | 59% |
| Pet | 36 | 25% | 50% | 69% |
| Home | 59 | 24% | 37% | 73% |
| Apparel | 86 | 40% | 63% | 69% |
| **All** | **516** | **23%** | **41%** | **67%** |

## Why this matters more now

Shopify's Q3 2026 results said searches that run on its structured product catalog convert at twice the rate of general AI search ([PPC Land, November 2026](https://ppc.land/shopify-revenue-gains-32-to-3-7bn-as-ai-referred-orders-rise-3-3x/)). Shopify also said it has turned more than a billion product pages into structured data. Identifiers are the field that lets that data connect to everything else written about your product.

Most brands with barcodes on the box have them in a spreadsheet somewhere. They just never made it into the Barcode field in Shopify.

## What to do with this

1. **Fill the Barcode field on every variant.** Bulk edit in Shopify admin or import a CSV. One barcode per variant, not per product.
2. **Check one product page source.** Search for "gtin". If it's missing after you've filled the field, your theme isn't outputting it and needs a fix.
3. **Add MPN where there's no barcode.** Brand plus MPN is the fallback for products without one.
4. **Match your feeds.** The same GTIN should appear in Google Merchant Center, on Amazon and in any retailer feed.

Product data that AI and Google can trust is part of [Close the Gap](/close-the-gap). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Stores:** 617 Shopify brand stores in six product areas: supplements (123), beauty (127), food and drink (154), pet (41), home (76) and apparel (96). This is my full dataset of 620 Shopify brand stores, minus client stores and one store that blocked automated reads.
- **When:** November 16 and 17, 2026.
- **Pages:** for each store, the product page of the first product in its public product feed, usually one of the most recently added. 598 pages loaded and 516 had Product structured data.
- **How:** I read the page source as the server first sends it, before JavaScript runs, and parsed every JSON LD block. A GTIN was counted from any gtin, gtin8, gtin12, gtin13 or gtin14 field.
- **Limits:** one product per store. Newer products may have thinner data than best sellers, and some stores add identifiers only to some variants.

No store or brand is named in this report.
