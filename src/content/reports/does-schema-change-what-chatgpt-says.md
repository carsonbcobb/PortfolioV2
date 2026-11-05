---
title: "Does Schema Change What ChatGPT Says About a Product?"
description: "I asked ChatGPT the price and rating of 24 Shopify products with clean, duplicate, partial or no structured data, then checked every answer against the page."
slug: "/reports/does-schema-change-what-chatgpt-says"
h1: "Does schema change what ChatGPT says?"
datePublished: 2026-11-04
dateModified: 2026-11-04
reportStores: 24
faq:
  - question: "Does ChatGPT use structured data when it answers product questions?"
    answer: "In my test of 24 Shopify products, ChatGPT gave the correct price for all 20 products that had Product structured data. For 2 of the 4 products with none, it said it couldn't find a price. Ratings were less predictable and were sometimes wrong even when the data was clean."
  - question: "How accurate is ChatGPT about product ratings and review counts?"
    answer: "It got the rating and review count right for 17 of 23 products where I could verify them. Errors came from ratings that sat in a separate data block, ratings missing from the structured data entirely, and ChatGPT using brand wide numbers instead of the product's own."
  - question: "Is clean schema enough to make ChatGPT accurate?"
    answer: "No. It made prices reliable in this test, but 3 of 8 products with clean, complete data still had a wrong rating or review count. ChatGPT reads the page and other sources too, so the page, the data and outside listings all need to agree."
---

**By Carson Cobb. Data checked November 2026.**

Structured data is often sold as the key to AI visibility. The honest version is narrower: it should help AI get the facts right about a product. So I tested that directly. I asked ChatGPT the price, average rating and review count for 24 real products from Shopify stores, chosen because their structured data fell into four groups, then checked every answer against the live product page.

## The short version

- **Prices were right whenever product data existed.** ChatGPT gave the correct price for all 20 products with Product structured data.
- **Without it, prices went missing.** For 2 of the 4 products with no structured data, ChatGPT said it couldn't find a price. The page showed one for both, though one product was sold out.
- **Ratings were right about 3 times in 4.** 17 of 23 verifiable answers had the right rating and review count.
- **Clean data didn't guarantee accuracy.** 3 of 8 products with clean, complete data still got a wrong rating or count.
- **The worst errors came from ratings the data didn't connect to the product.** A rating in a separate block, a rating only shown by a script, or brand wide numbers.

## The four groups

| Group | What the product page had | Products |
| --- | --- | --- |
| Clean | One complete Product block with price and rating | 8 |
| Duplicate | Two or three Product blocks, usually from a review app | 8 |
| No rating in the data | Product block with price, but the rating only on the page or nowhere | 4 |
| No product data | No Product structured data at all | 4 |

## What ChatGPT got right

| Group | Price correct | Rating and review count correct |
| --- | --- | --- |
| Clean | 8 of 8 | 5 of 8 |
| Duplicate | 8 of 8 | 6 of 8 |
| No rating in the data | 4 of 4 | 2 of 3 verifiable |
| No product data | 2 of 4 | 4 of 4 |
| **All** | **22 of 24** | **17 of 23** |

A rating counts as correct when the stars matched the page to one decimal and the review count was within 5%. "Correct" for a product with no reviews means ChatGPT said there were none.

## What the errors looked like

**The rating lived in a separate block.** One product's rating sat in its own small data block added by a review app, with a name but no price or link to the main product. ChatGPT said the product had one review and no displayed rating. The page showed six reviews and five stars.

**The rating wasn't in the data at all.** One product showed 4.2 stars from 60 reviews on the page, loaded by a review widget. Its structured data had no rating. ChatGPT reported 4.4 stars from 44 reviews, numbers that matched nothing on the page.

**Brand wide numbers replaced product numbers.** For one product with clean data showing 4.2 stars from about 2,500 reviews, ChatGPT reported 4.4 stars from about 7,600, its count of reviews across the whole brand.

**Numbers drifted.** Three answers were close but not right: stars off by 0.1, or a review count 5% to 30% off. These look like older copies of the page or another listing.

**Duplicates mostly didn't matter.** 6 of 8 products with duplicate data were described correctly, including two with three separate Product blocks. When duplicate blocks agreed with each other, ChatGPT handled them fine. The failures in this group came from the rating being split away from the product, not from duplication itself.

## What this means

Structured data looks like it does one job well: it makes the basic facts, like price and availability, easy to get right. Every product that had it got its price right.

Ratings are different. ChatGPT seems to combine the page, the data and outside listings, and when they disagree, it sometimes picks the wrong one. The safest setup is boring: one Product block, with the rating inside it, matching what the page shows, and no separate rating fragments.

This is a small test, 24 products checked once each, so it shows what can go wrong, not how often it goes wrong across all stores. I'll rerun it with more products and repeated questions.

## What to do with this

1. **Ask ChatGPT about your three best sellers.** Price, rating, review count. Compare its answers with your product pages.
2. **Put your rating inside your Product data.** If your review app adds its own separate block, connect it to the product or turn it off and add the rating to the theme's data. See [the duplicate schema report](/reports/duplicate-product-schema-ai-visibility) for each app's setting.
3. **Don't load ratings only with scripts.** Most AI crawlers don't run them.
4. **Keep outside listings consistent.** If your product's rating on a retailer or in a brand wide widget differs a lot from your own page, AI may use the wrong one.

## How this was done

- **Products:** 24 products from 24 US Shopify stores in the 94 store [AI Readiness Index](/reports/shopify-ai-readiness-index-2026) sample, 8 clean, 8 duplicate, 4 with no rating in their structured data and 4 with no Product structured data. Mostly best sellers.
- **Question:** "How much does *product* from *brand* cost on *brand*'s own website, and what is its average customer rating and number of reviews there? Keep it short." Asked once per product in a new temporary ChatGPT chat on a paid plan, default model, November 2026.
- **Truth:** the price and rating shown on the live product page the same day, read in a browser after it finished loading, compared with the structured data.
- **Limits:** one run per product, and ChatGPT can search the web, so it may also read retailer listings and older copies of pages. That's how shoppers use it too.

No store is named in this report. [Run the free AI Visibility Check](/ai-visibility-check) to see what ChatGPT says about your products.
