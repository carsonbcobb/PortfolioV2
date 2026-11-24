---
title: "Do AI Shopping Answers Show Prices? ChatGPT, Gemini, AI Mode"
description: "ChatGPT showed prices in 79% of shopping answers, Google AI Mode in 63% and Gemini in 25%. Asked directly, ChatGPT and Gemini priced 22 of 24 right."
slug: "/reports/prices-in-ai-shopping-answers-2026"
h1: "Do AI shopping answers show your price?"
answer: "Most AI shopping answers show prices, but it depends on the tool. In 48 shopping questions I asked in November 2026, ChatGPT showed at least one price in 38 answers (79%), Google AI Mode in 30 (63%) and Gemini in only 12 (25%). Asked for the price of 24 specific Shopify products, ChatGPT and Gemini were right for 22."
datePublished: 2026-11-16
dateModified: 2026-11-23
faq:
  - question: "Does ChatGPT show product prices?"
    answer: "Usually. In 48 shopping questions I asked in November 2026, ChatGPT showed at least one price in 38 answers (79%), with a median of 4 prices per answer."
  - question: "Does Google AI Mode show prices?"
    answer: "Often. Google AI Mode showed prices in 30 of 48 answers (63%), mostly on product cards drawn from Google's shopping data."
  - question: "Does Gemini show prices?"
    answer: "Rarely. Gemini showed a price in only 12 of 48 answers (25%). It tended to describe products and point to stores without quoting a price."
  - question: "Are AI prices accurate?"
    answer: "Mostly. When I asked for the price of 24 specific Shopify products, ChatGPT and Gemini were right for 22 and Google AI Mode for 19. In a separate test, ChatGPT gave the right price for all 20 products that had product structured data."
  - question: "How do I make sure AI shows the right price for my product?"
    answer: "Publish one clear price per product in your product structured data, keep Google Merchant Center in sync with your site, and avoid conflicting prices from duplicate product data or old retailer listings."
---

**By Carson Cobb. Data collected November 4 and 5, 2026.**

Price is one of the first things a shopper weighs, and AI answers increasingly put it right next to the recommendation. If the price shown is wrong, or missing while a competitor's is there, that changes the click.

I went back to 48 buyer questions asked in ChatGPT, Gemini and Google AI Mode for my [Who ChatGPT recommends](/reports/who-chatgpt-recommends-2026) research and counted how often each AI showed prices, and how.

## The short version

- **ChatGPT shows prices most.** 38 of 48 answers (79%), with a median of 4 prices per answer.
- **Google AI Mode is close behind.** 30 of 48 (63%), mostly on product cards.
- **Gemini rarely does.** 12 of 48 (25%).
- **Price ranges and unit prices are less common.** A few answers per AI compared price per serving, per ounce or per month.
- **When asked directly, AI usually gets the price right.** ChatGPT and Gemini were right for 22 of 24 products, AI Mode for 19.

## How often each AI shows prices

| | ChatGPT | Gemini | Google AI Mode |
| --- | --- | --- | --- |
| Answers showing at least one price | 38 of 48 (79%) | 12 of 48 (25%) | 30 of 48 (63%) |
| Median prices per answer | 4 | 0 | 2 |
| Answers with a price range ("$20 to $40") | 11 | 8 | 4 |
| Answers with a unit price (per serving, per ounce, per month) | 6 | 7 | 7 |

The three tools work differently. ChatGPT puts a price under each pick, often with the retailer it found. AI Mode's prices come mostly from its product cards, drawn from Google's shopping data. Gemini describes products and links out, and gives a price range when it gives one at all.

## How accurate are the prices?

From two earlier tests:

| Test | Result |
| --- | --- |
| Price of 24 specific Shopify products, asked directly | ChatGPT 22 of 24, Gemini 22 of 24, AI Mode 19 of 24 right |
| ChatGPT price for 20 products with product structured data | 20 of 20 right |
| ChatGPT price for 4 products without it | couldn't find a price for 2 |

Sources: [what AI gets wrong about your products](/reports/what-ai-gets-wrong-about-products-2026) and [does schema change what ChatGPT says](/reports/does-schema-change-what-chatgpt-says).

Price was the most reliable fact AI reported, far more reliable than ratings. The price errors I did see came mostly from products with many variants, packs or editions, where the AI quoted a different size or a limited edition instead of the standard product, and from pages where the theme and a review app each published their own version of the product.

## Why the price shown might not be yours

ChatGPT reads your product page, but also the review sites, roundups and retailer listings it finds. If those carry a different price than your store, the answer can too. In AI Mode, the price on the card comes from Google's shopping data, so a gap between Merchant Center and your site shows up directly in the answer.

## What to do with this

1. **Publish one clear price in your product structured data.** Every product page, current price, correct currency, availability. See [product schema completeness](/reports/shopify-product-schema-completeness-2026).
2. **Remove duplicate product data.** Review apps and themes that each add their own product markup can show two different prices. See [duplicate product data](/reports/duplicate-product-schema-ai-visibility).
3. **Keep Merchant Center in sync with your site.** Same price, same sale dates.
4. **Watch your retailer listings.** Check the price on Amazon and other retailers that carry you, since AI may show that one.
5. **Show unit price where it helps you.** If you're cheaper per serving or per use, say so on the page in a way AI can quote.
6. **Check the answer.** Ask each AI "how much does [your product] cost" and compare.

Prices, product data and what AI says about your products are part of [Close the Gap](/close-the-gap). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Answers:** the 48 short buyer questions from [Who ChatGPT recommends](/reports/who-chatgpt-recommends-2026), 8 in each of six product areas, asked in ChatGPT on November 4, 2026 and in Gemini and Google AI Mode on November 5, 2026, each in a fresh session.
- **Prices:** dollar amounts in the answer text, including product cards for AI Mode. A range counted when two dollar amounts were joined ("$20 to $40"). Unit prices counted when a price was given per serving, ounce, pound, month or similar.
- **Accuracy:** from my earlier accuracy and structured data tests, linked above.
- **Limits:** prices on product cards can vary with the shopper's location and signed in state. This counts whether prices appear, not whether each one was correct.

No store or brand is named in this report.
