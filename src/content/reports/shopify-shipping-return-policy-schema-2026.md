---
title: "Shopify Shipping and Return Schema 2026: 89% Leave It Out"
description: "Only 8% of 516 Shopify product pages put shipping details in structured data and 11% a return policy, yet 93% mention shipping in the page text."
slug: "/reports/shopify-shipping-return-policy-schema-2026"
h1: "Shipping and return policy schema: the product page data almost every Shopify store skips"
answer: "Almost every Shopify store leaves shipping and return policy schema out. In my November 2026 check of 516 Shopify product pages with Product structured data, only 43 (8%) included shippingDetails and 57 (11%) a return policy, and 89% had neither. Yet 93% of product pages mention shipping in the page text, so the information exists but isn't machine readable."
datePublished: 2026-11-17
dateModified: 2026-11-23
reportStores: 617
faq:
  - question: "How many Shopify stores have shipping and return policy structured data?"
    answer: "Very few. In November 2026, 43 of 516 Shopify product pages with Product structured data (8%) included shippingDetails, and 57 (11%) included a merchant return policy. 89% had neither."
  - question: "Why does return policy schema matter for AI shopping?"
    answer: "Shoppers ask AI about delivery time and returns before they buy, and AI shopping agents compare stores on those terms. Structured shipping and return data states the terms in a format machines can read and repeat without guessing from page text."
  - question: "Can I set return policy data without editing every product page?"
    answer: "Yes. Google accepts a store wide return policy in Merchant Center and as MerchantReturnPolicy nested in your Organization structured data. Product level data is still useful when products have different terms."
  - question: "Do Shopify themes add shipping and return schema by default?"
    answer: "Not usually. Most themes output name, price, availability and brand, but not shipping details or return policy. In my data, supplements stores were most likely to have them, at 14% and 16%."
---

**By Carson Cobb. Data collected November 16 and 17, 2026.**

"How fast will it get here?" and "Can I send it back?" are two of the last questions a shopper asks before buying, and they're questions shoppers now ask AI. Product pages answer them in text. Almost none answer them in structured data, the format a machine can read without interpreting a paragraph.

I checked 516 Shopify product pages for shipping and return data.

## The short version

- **8% include shipping details in structured data.** 43 of 516.
- **11% include a return policy.** 57 of 516.
- **89% have neither.**
- **93% of product pages mention shipping in the page text, and 67% mention returns.** The information exists. It just isn't machine readable.
- **27% include a price valid until date**, another small field most skip.

## By product area

| Product area | Product pages with schema | Shipping details | Return policy | Shipping mentioned in page text | Returns mentioned in page text |
| --- | --- | --- | --- | --- | --- |
| Supplements | 106 | 14% | 16% | 94% | 67% |
| Beauty | 108 | 8% | 9% | 97% | 78% |
| Food and drink | 121 | 3% | 5% | 86% | 40% |
| Pet | 36 | 3% | 8% | 93% | 49% |
| Home | 59 | 10% | 15% | 96% | 79% |
| Apparel | 86 | 9% | 14% | 97% | 96% |
| **All** | **516** | **8%** | **11%** | **93%** | **67%** |

Page text shares are of all 598 product pages that loaded.

## Why it matters now

AI is becoming a real sales channel. Shopify said in its Q3 2026 results that AI traffic to its merchants' stores grew 2.6 times year over year and orders from AI searches 3.3 times ([PPC Land](https://ppc.land/shopify-revenue-gains-32-to-3-7bn-as-ai-referred-orders-rise-3-3x/)). An agent comparing two stores on "arrives by Friday, free returns" can read that from structured data with certainty. From page text it has to guess, and from a policy page linked in the footer it may not look at all.

My earlier [return policy benchmarks](/reports/shopify-return-policy-benchmarks-2026) and [shipping policy benchmarks](/reports/shopify-shipping-policy-benchmarks-2026) cover what the policies say. This report covers whether machines can read them.

## What to do with this

1. **Set shipping and returns in Google Merchant Center first.** It covers your whole catalog in one place.
2. **Add MerchantReturnPolicy to your Organization data.** Return window, method, fees, and which countries it applies to.
3. **Add shippingDetails to product offers** if delivery times or costs vary by product.
4. **Keep every source the same.** The policy page, the product page text, Merchant Center and the structured data should all say the same window and cost.

Making your policies readable to AI is part of [Close the Gap](/close-the-gap). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Stores:** 617 Shopify brand stores in six product areas: supplements (123), beauty (127), food and drink (154), pet (41), home (76) and apparel (96). This is my full dataset of 620 Shopify brand stores, minus client stores and one store that blocked automated reads.
- **When:** November 16 and 17, 2026.
- **Pages:** the product page of the first product in each store's public product feed, usually one of the most recently added. 598 loaded and 516 had Product structured data.
- **How:** page source as first sent by the server, before JavaScript runs. Shipping counted from shippingDetails on the offer. Returns counted from hasMerchantReturnPolicy on the offer or product. Page text mentions are keyword checks for "shipping" and "return".
- **Limits:** a store wide return policy set only in Merchant Center or only on the Organization block wasn't counted here.

No store or brand is named in this report.
