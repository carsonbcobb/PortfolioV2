---
title: "AI Search Checklist for Shopify 2026: 25 Checks and How Many Stores Pass | Carson Cobb"
description: "A 25 point AI search checklist for Shopify stores, with the share of 617 brand stores that pass each check. From crawler access and agents.md to GTINs, policies and product page content."
slug: "/reports/ai-search-checklist-shopify-2026"
h1: "The AI search checklist for Shopify, with pass rates from 617 stores"
datePublished: 2026-11-17
dateModified: 2026-11-17
reportStores: 617
faq:
  - question: "What should a Shopify store check for AI search?"
    answer: "Access (AI crawlers allowed, agent files on), structured data (one complete Product block with GTIN, variants and policies), product page content (who it's for, proof, how to use, comparisons), brand data (Organization with description and profiles), publishing, and measurement."
  - question: "What do most Shopify stores fail on AI search?"
    answer: "Return and shipping terms in structured data (11% pass), a rewritten agents.md (3%), a GTIN in product structured data (23%), ProductGroup variant data (23%), and an Organization description (30% of stores with Organization data)."
  - question: "What do most Shopify stores already pass?"
    answer: "Access. 99% allow the major AI crawlers, 97% have agents.md and 86% have Product structured data on product pages, thanks largely to Shopify's defaults and modern themes."
---

**By Carson Cobb. Data collected November 16 and 17, 2026.**

A checklist is only useful if you know which items actually separate you from everyone else. So next to each check is the share of 617 Shopify brand stores that pass it. Low pass rates are where the opportunity is.

## Access

| Check | Pass rate |
| --- | --- |
| No major AI crawler fully blocked in robots.txt | 99% |
| agents.md responds | 97% |
| agents.md rewritten with your policies and product guidance | 3% |
| llms.txt responds | 98% |

## Brand data on the homepage

| Check | Pass rate |
| --- | --- |
| Organization structured data | 75% |
| Organization data with a description | 30% of those with Organization data |
| Organization data with sameAs profile links | 79% of those with Organization data |
| Exactly one H1 | 54% |
| Meta description under 160 characters | 52% |

## Product page structured data

| Check | Pass rate |
| --- | --- |
| Product structured data | 86% |
| Only one Product block | 79% |
| Structured data parses without errors | 95% |
| Price and availability | 96% and 97% of pages with Product data |
| GTIN | 23% of pages with Product data |
| Variant data with ProductGroup | 23% of pages with Product data |
| Return or shipping terms | 11% of pages with Product data |

## Product page content

| Check | Pass rate |
| --- | --- |
| Mentions shipping | 93% |
| Has FAQ content | 83% |
| Says what it's made of | 75% |
| Mentions returns | 67% |
| Says who it's for | 38% |
| Explains how to use it | 31% |
| Mentions testing or certification | 30% |
| Compares options | 25% |

## Catalog, images and publishing

| Check | Pass rate |
| --- | --- |
| Product type on every product | 33% of stores |
| Alt text on every sampled product image | 25% of stores |
| Blog post in the last 90 days | 51% of stores |

## What to do first

Skip what you already pass. For most stores the highest value fixes, in order:

1. **Say who each product is for, and back it with proof.** Content AI repeats. ([What AI named brands have in common](/reports/what-ai-named-shopify-brands-have-in-common-2026))
2. **One clean Product block with GTIN and variants.** So AI gets the facts right. ([GTINs](/reports/shopify-gtin-product-identifiers-2026), [variants](/reports/shopify-productgroup-variant-schema-2026), [review apps](/reports/shopify-review-apps-2026))
3. **Return and shipping terms in Merchant Center and structured data.** ([Policy schema](/reports/shopify-shipping-return-policy-schema-2026))
4. **Rewrite agents.md.** ([Agentic commerce readiness](/reports/shopify-agentic-commerce-readiness-2026))
5. **Describe your brand in Organization data.** ([Organization schema](/reports/shopify-organization-schema-2026))
6. **Measure AI traffic.** ([Analytics and AI traffic](/reports/shopify-analytics-attribution-ai-traffic-2026))

Running this checklist on your store, and fixing what matters, is my [AI Search and Conversion Audit](/ai-search). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

The conversion side of the same work is in [the Shopify CRO checklist](/reports/shopify-cro-checklist-2026).

## How this was done

- **Stores:** 617 Shopify brand stores in six product areas: supplements (123), beauty (127), food and drink (154), pet (41), home (76) and apparel (96). This is my full dataset of 620 Shopify brand stores, minus client stores and one store that blocked automated reads.
- **When:** November 16 and 17, 2026.
- **How:** robots.txt, agent files, homepage source, the public product feed, and the page source of the first product in each feed, read before JavaScript runs. Content checks are keyword based and show whether a topic is mentioned, not how well.
- **Limits:** one product page per store, usually a recent product.

No store or brand is named in this report.
