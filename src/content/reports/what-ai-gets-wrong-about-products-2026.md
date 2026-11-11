---
title: "What AI Gets Wrong About Products (2026) | Carson Cobb"
description: "ChatGPT, Gemini and Google AI Mode on 24 Shopify products: prices mostly right, ratings right on all three for only 7 of 22."
slug: "/reports/what-ai-gets-wrong-about-products-2026"
h1: "What AI gets wrong about your products"
datePublished: 2026-11-06
dateModified: 2026-11-06
reportStores: 24
faq:
  - question: "How accurate is ChatGPT about product prices?"
    answer: "Mostly accurate. In November 2026, ChatGPT gave the right price for 22 of 24 Shopify products I tested, Gemini for 22 and Google AI Mode for 19. All three were right on 17 of 24."
  - question: "Does AI get star ratings and review counts right?"
    answer: "Much less often than prices. ChatGPT gave the right rating and review count for 17 of 23 products, Gemini for 14 of 23 and Google AI Mode for 12 of 22. All three were right for only 7 of 22 products, and at least one was wrong for 15."
  - question: "Why does AI get my product's rating wrong?"
    answer: "The most common causes were a store wide rating used in place of the product's own rating, a different size or edition of the product, a second copy of the product data added by a review app, and ratings Google holds that the product page doesn't show."
  - question: "Which AI is most accurate about products?"
    answer: "In this test, ChatGPT was the most accurate on ratings and tied with Gemini on prices. Google AI Mode made the most errors, often by picking a different version of the product or reporting a rating that isn't on the product page."
---

**By Carson Cobb. Data collected November 2026.**

Getting recommended is half the job. The other half is AI describing your product correctly when a shopper asks about it directly. A wrong price or a weak rating in an AI answer costs the sale before the shopper ever reaches your site.

So I picked 24 products from Shopify stores, recorded the real price, rating and review count from each product page, and asked ChatGPT, Gemini and Google AI Mode the same question about each one: what does it cost on the brand's own site, and what is its rating and number of reviews there?

## The short version

- **Prices were mostly right.** ChatGPT 22 of 24, Gemini 22 of 24, AI Mode 19 of 24.
- **Ratings and review counts were often wrong.** ChatGPT 17 of 23, Gemini 14 of 23, AI Mode 12 of 22.
- **All three got the rating right for only 7 of 22 products.** At least one AI got it wrong for 15.
- **Duplicate product data hurt Gemini and AI Mode most.** On products where a review app added a second copy of the product data, Gemini got the rating right 2 times out of 8 and AI Mode 3 out of 8.
- **The errors follow patterns.** Store wide ratings instead of product ratings, the wrong size or edition, and ratings pulled from somewhere other than the product page.

## Results by AI

| | ChatGPT | Gemini | Google AI Mode |
| --- | --- | --- | --- |
| Price right | 22 of 24 | 22 of 24 | 19 of 24 |
| Rating and review count right | 17 of 23 | 14 of 23 | 12 of 22 |

Products where the right rating couldn't be confirmed from the page were left out of the rating count for that AI, which is why the totals differ.

| Across all three | Products |
| --- | --- |
| Price right on all three | 17 of 24 |
| Price wrong on at least one | 7 of 24 |
| Rating right on all three | 7 of 22 |
| Rating wrong on at least one | 15 of 22 |
| Rating wrong on all three | 3 of 22 |

If a shopper asks two different AIs about your product, the odds that both get your rating right are worse than a coin flip.

## Results by how the product data was set up

I chose the 24 products to cover four setups I see constantly on Shopify. See [duplicate product data and AI visibility](/reports/duplicate-product-schema-ai-visibility) for more on the first one.

| Product data setup | Products | ChatGPT rating right | Gemini rating right | AI Mode rating right |
| --- | --- | --- | --- | --- |
| Duplicate product data, usually from a review app | 8 | 6 of 8 | 2 of 8 | 3 of 8 |
| One clean block of product data with a rating | 8 | 5 of 8 | 5 of 8 | 4 of 8 |
| Product data with no rating in it | 4 | 2 of 3 | 3 of 3 | 3 of 3 |
| No product data at all | 4 | 4 of 4 | 4 of 4 | 2 of 3 |

Two things stand out.

**Duplicate data is where Gemini and AI Mode struggled most.** When the theme and a review app each publish their own version of the product, with different names, prices or review counts, the AIs that lean on Google's index picked the wrong version far more often.

**Clean data didn't guarantee a right answer.** Even with a single, complete block of product data, every AI got about half the ratings wrong. Structured data helps AI read the page. It doesn't stop AI from pulling a number from somewhere else.

Prices behaved differently. On products with no structured product data at all, ChatGPT found the price only 2 times out of 4, while Gemini found it 4 times and AI Mode 3. Google's tools can lean on Google's own copy of the page and its shopping data when the page itself gives no structured price.

## The patterns behind the errors

These are the mistakes I saw more than once, across all three AIs.

**A store wide rating instead of the product's own.** Asked about one product, an AI answered with the average rating and total review count for the whole store. It reads as authoritative and it's wrong.

**The wrong size, pack or edition.** One AI said a product was only sold in a different pack size. Another quoted the price of a limited collaboration edition instead of the standard product. A third gave a price range that mixed in other recipes and box sizes. When a product has many variants, bundles or editions, AI picks one, and not always the one the shopper means.

**A rating that isn't on the page.** For one product whose page shows no rating, AI Mode reported a star rating and several hundred reviews. Those numbers likely come from Google's own shopping data. The shopper sees a rating your page never showed and you never chose to display.

**A product that "isn't sold" when it is.** One AI said a product wasn't listed on the brand's site and gave no price. Another said a product had no price because it was out of stock. Thin or confusing product pages make "I couldn't find it" more likely.

**Close but not right.** Review counts off by a few percent, a 4.8 reported as 4.9, a different price than the page showed that day. These are small, but they're what a shopper compares against your page when they land.

## Why this matters for sales

Shoppers who come from AI tend to arrive ready to buy. In my own client work, AI referred shoppers convert far above average. That only holds when your page confirms what the AI told them. If the AI said 4.8 stars and $29 and the page says something different, trust drops at the moment it matters most.

## What to do with this

1. **Ask each AI about your top products directly.** Price, rating, review count, sizes and what's included. Write down every mismatch.
2. **Make one version of the truth.** One block of product data per product page, with the rating and review count matching what the page shows. Remove the duplicate your review app or theme adds. See [how complete Shopify product data is](/reports/shopify-product-schema-completeness-2026).
3. **Keep store wide ratings away from product ratings.** If a store wide badge sits near the product rating, make the product rating clearly the product's own.
4. **Make variants and editions obvious.** Name each size, pack and edition clearly, with its own price, so AI doesn't guess.
5. **Check what Google holds about your products.** AI Mode can show ratings and prices from Google's shopping data. Keep your Merchant Center data in line with your site.

What AI says about your products, and where those claims come from, is part of my [AI Search and Conversion Audit](/ai-search). The free [AI Visibility Check](/ai-visibility-check) is a quick place to start.

## How this was done

- **Products:** 24 products from 24 US Shopify stores in my AI readiness sample, chosen to cover four product data setups: duplicate product data, one clean block with a rating, product data without a rating, and no product data.
- **The truth:** price, rating and review count recorded from each product page and its structured data on November 4, 2026.
- **The question:** "How much does [product] from [brand] cost on [brand]'s own website, and what is its average customer rating and number of reviews there? Keep it short."
- **How it was asked:** ChatGPT on a paid plan with the default model in a new temporary chat for each product, on November 4, 2026. Gemini in a new temporary chat and Google AI Mode in a new thread for each product, on November 5, 2026.
- **Scoring:** a price counted as right if it matched the product's price on the site, including a correct range for variants. A rating counted as right if the stars matched within 0.1 and the review count within about 5%, or if the AI correctly said the page shows no rating. Where the right rating couldn't be confirmed from the page, that product was left out of the rating count.
- **Limits:** 24 products is a small sample. Review counts change daily, so small count differences were allowed. Answers were collected one day apart from the truth for Gemini and AI Mode.

Related: [How to name products for Google and AI](/reports/naming-products-for-google-and-ai), [Shopify product data for AI shopping](/reports/shopify-catalog-data-ai-shopping-2026), [Shopify product schema completeness](/reports/shopify-product-schema-completeness-2026).

No store or brand is named in this report.
