---
title: "Variant Schema on Shopify 2026: ProductGroup, Size and Color Data | Carson Cobb"
description: "23% of Shopify product pages use ProductGroup structured data for variants, 56% in apparel but 6% in beauty. Only 3% state color and 2% size. Data from 516 product pages."
slug: "/reports/shopify-productgroup-variant-schema-2026"
h1: "Variant schema on Shopify: do product pages tell AI which sizes, colors and flavors exist?"
datePublished: 2026-11-17
dateModified: 2026-11-17
reportStores: 617
faq:
  - question: "What is ProductGroup schema?"
    answer: "ProductGroup is structured data for a product that comes in variants, like sizes, colors or flavors. It lists each variant with its own price, stock and identifiers, and says which attributes vary. Google added support for it in 2024."
  - question: "How many Shopify stores use ProductGroup schema?"
    answer: "In November 2026, 120 of 516 Shopify product pages with Product structured data (23%) used ProductGroup. Apparel was highest at 56%. Beauty was lowest at 6%."
  - question: "Why does variant data matter for AI shopping?"
    answer: "Shoppers ask for a specific variant: the unscented one, the large size, the navy color. If your structured data only describes the default variant, a machine has to guess whether the one they asked for exists and is in stock."
  - question: "How do I add ProductGroup schema to a Shopify store?"
    answer: "Many newer themes output it automatically. If yours doesn't, a developer can update the theme's structured data snippet or you can use a schema app. Each variant should carry its own price, availability, GTIN and the attribute that varies."
---

**By Carson Cobb. Data collected November 16 and 17, 2026.**

Shoppers rarely want "the product". They want the 2 pack, the medium, the fragrance free one, the chicken flavor. When they ask AI for that, the AI needs to know the variant exists, what it costs and whether it's in stock. Structured data can say all of that. Usually it doesn't.

I checked how 516 Shopify product pages describe their variants in structured data.

## The short version

- **23% use ProductGroup.** 120 of 516 product pages with Product structured data.
- **Apparel leads at 56%. Beauty trails at 6%.**
- **3% state a color and 2% a size** in structured data. 1% state a material.
- **32% fill in the product classification field.**
- **21% have two or more Product blocks**, and 5% have structured data that fails to parse.

## By product area

| Product area | Product pages with schema | ProductGroup | Color or size stated |
| --- | --- | --- | --- |
| Supplements | 106 | 20% | 1% |
| Beauty | 108 | 6% | 1% |
| Food and drink | 121 | 19% | 1% |
| Pet | 36 | 31% | 3% |
| Home | 59 | 17% | 5% |
| Apparel | 86 | 56% | 13% |
| **All** | **516** | **23%** | **3%** |

## Other product page structured data

| Item | Share of 598 product pages |
| --- | --- |
| Product structured data present | 86% |
| Breadcrumbs | 37% |
| FAQ structured data | 9% |
| Two or more Product blocks | 21% |
| Structured data that fails to parse | 5% |

## Why this matters

A ProductGroup block without the attribute values is half a job. It tells a machine there are 4 variants, but not that they're 4 sizes. Of the 120 pages using ProductGroup, only 15 (12%) stated a color or size in the product data.

Beauty and supplements are interesting gaps. Shade, scent, flavor and count are exactly what shoppers specify in AI questions, like "fragrance free" or "90 capsules", and those stores are the least likely to describe variants at all.

## What to do with this

1. **Check whether your theme outputs ProductGroup.** Search a product page source for "ProductGroup" and "hasVariant".
2. **Make each variant complete.** Its own price, availability, GTIN and the attribute value (size, color, flavor, scent, count).
3. **Name the attribute.** variesBy should say size, color or the attribute that changes.
4. **Use clear variant names in Shopify.** "Unscented, 8 oz" beats "Option 2". The structured data copies what you type.
5. **Validate after theme updates.** 5% of pages had data that fails to parse, which means none of it is read.

Variant and product data is part of [Close the Gap](/close-the-gap). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Stores:** 617 Shopify brand stores in six product areas: supplements (123), beauty (127), food and drink (154), pet (41), home (76) and apparel (96). This is my full dataset of 620 Shopify brand stores, minus client stores and one store that blocked automated reads.
- **When:** November 16 and 17, 2026.
- **Pages:** the first product in each store's public product feed, usually one of the most recently added. 598 loaded and 516 had Product structured data.
- **How:** page source as first sent by the server, before JavaScript runs. All JSON LD blocks parsed; the first Product or ProductGroup was used for field checks.
- **Limits:** one product per store, and some sampled products only have one variant, so ProductGroup isn't needed on every page.

No store or brand is named in this report.
