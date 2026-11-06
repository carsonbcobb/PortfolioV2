---
title: "Does Duplicate Product Schema Hurt AI Visibility?"
description: "29% of Shopify stores publish two or three Product blocks, usually from a review app. Which apps cause it, how to stop it, and what it does to AI answers."
slug: "/reports/duplicate-product-schema-ai-visibility"
h1: "Does duplicate Product schema hurt AI visibility?"
datePublished: 2026-11-04
dateModified: 2026-11-04
reportStores: 94
faq:
  - question: "How common is duplicate Product schema on Shopify?"
    answer: "In November 2026, 27 of 94 Shopify stores (29%) had two or three separate Product structured data blocks on their best selling product page. Apparel stores had it most often, at 44%."
  - question: "What causes duplicate Product schema on Shopify?"
    answer: "Usually a review app. The theme outputs one Product block, and the review app adds its own to carry the star rating. In my sample, Yotpo, Okendo and Judge.me were the most common sources, along with a few SEO apps and theme customizations."
  - question: "Does duplicate schema make ChatGPT get products wrong?"
    answer: "Not by itself, in my test. When duplicate blocks agreed, ChatGPT described the product correctly. Problems came when the rating sat in a separate fragment with no price or product link, or only appeared after a script ran. Then ChatGPT reported the wrong number of reviews."
  - question: "How do I turn off a review app's duplicate schema?"
    answer: "Okendo and Loox have a settings toggle. Judge.me has a documented code flag and a way to merge its block with the theme's using a shared ID. Yotpo asks you to contact support to turn off its automatic markup. Then make sure the rating is added to the theme's single Product block."
---

**By Carson Cobb. Data checked November 2026.**

A common audit finding goes like this: the product page has two Product data blocks. The theme writes one. The review app writes another, to carry the stars. Sometimes a third comes from an SEO app. Nobody notices, because the page looks fine to shoppers.

I wanted to know how common this is, which apps cause it, whether the blocks disagree, and whether it actually changes what AI says.

## The short version

- **29% of stores have duplicate Product data.** 27 of 94 had two or three Product blocks on their best selling product page.
- **Review apps cause most of it.** Yotpo, Okendo and Judge.me were the most common sources.
- **Most duplicates agree with each other.** Only 3 of 27 had conflicting values, like two different product names or prices.
- **The real problem is the rating fragment.** In 9 of 27, one block carried only a rating, with no price, no product link and sometimes no connection to the product at all.
- **ChatGPT handled agreeing duplicates fine.** It got price and rating right for 6 of 8 duplicate products I tested. The misses were a rating fragment and a rating block added by script.

## How common is it?

| Category | Stores | Two or more Product blocks |
| --- | --- | --- |
| Apparel | 16 | 44% |
| Supplements | 15 | 33% |
| Pet | 15 | 27% |
| Food and beverage | 16 | 25% |
| Home | 16 | 25% |
| Beauty and skincare | 16 | 19% |
| **All** | **94** | **29%** |

3 stores had three Product blocks on the same page. 22% of stores had duplicates in the HTML their server sends, and a few more only after scripts ran.

## Where duplicates come from

I traced each duplicate to the block that added it, from its ID, its container on the page or its structure. Some stores had more than one cause.

| Source | Stores with a duplicate from it |
| --- | --- |
| Yotpo's rich snippet block | 9 |
| Okendo's Product block | 7 |
| Judge.me's rating block | 5 |
| Theme or custom code | 4 |
| Other review or SEO apps (one each: Klaviyo Reviews, AIR Reviews, an SEO schema app, a JSON-LD app) | 4 |

## Review apps compared

| App | Stores using it | Had duplicate Product data | Rating in structured data | Can you turn off its schema? |
| --- | --- | --- | --- | --- |
| Yotpo | 25 | 40% | 72% | Contact support. Automatic markup is on by default. |
| Okendo | 24 | 33% | 71% | Yes. A settings toggle, "Include SEO Rich Snippets." |
| Judge.me | 10 | 50% | 80% | Yes, with a documented code flag. Or merge it with the theme's block using a shared ID. |
| Stamped | 10 | 20% | 50% | No self serve setting documented that I could find. |
| Bazaarvoice | 10 | 20% | 50% | No Shopify specific setting documented that I could find. |
| Junip | 4 | 0% | 50% | Not tested. |
| Loox | 1 | 0% | 100% | Yes. A settings toggle for Google ratings. |

The trade off shows up clearly. Apps that inject their own block get the rating into the data more often, at the cost of duplicates. Stores on apps that didn't inject a block, like Bazaarvoice in this sample, had fewer duplicates but often left the rating out of the data entirely. Neither is the right answer. The right answer is one block with the rating inside it.

## Do the blocks disagree?

Mostly not. Of 27 stores with duplicates:

- **3 had conflicting values.** Two had different product names in different blocks. One had different prices, because the blocks picked different sizes as the main offer.
- **9 had a rating fragment.** One block contained only the product name and its rating, with no price or link. In some, it wasn't connected to the main product by an ID.
- **The rest repeated the same facts** in two places, sometimes in slightly different formats.

## Does it change what ChatGPT says?

I asked ChatGPT the price, rating and review count for 8 products with duplicate data, alongside products with clean, partial and no data. Full results are in [Does schema change what ChatGPT says?](/reports/does-schema-change-what-chatgpt-says)

- **6 of 8 duplicate products were described correctly,** including two with three Product blocks.
- **One rating fragment failed.** The rating sat in a separate block with no price. ChatGPT said the product had one review and no displayed rating. It had six reviews and five stars.
- **One script added rating was stale.** The review count was 5% low, likely from an older copy of the page.

So in this test, duplicates that agree didn't hurt. Splitting the rating away from the product did. That matches what review apps' own documentation warns about: separate Product entries that aren't linked to the theme's product. For how ChatGPT, Gemini and Google AI Mode handle prices and ratings across more products, see [what AI gets wrong about your products](/reports/what-ai-gets-wrong-about-products-2026).

## What to do with this

1. **Count your Product blocks.** Open a best selling product page in Google's Rich Results Test. If you see more than one Product, keep reading.
2. **Decide where the rating lives.** Either connect the review app's block to the theme's product with a shared ID, or turn off the app's block and add the rating to the theme's block.
3. **Use your app's setting.** Okendo and Loox have toggles. Judge.me documents a flag and a merge method. Yotpo asks you to contact support.
4. **Don't delete the rating while fixing duplicates.** A clean page with no rating is worse than a duplicate with one. Test again after the change.
5. **Make sure the rating doesn't depend on a script.** It should be in the HTML the server sends.

## How this was done

- **Stores:** 94 US Shopify stores across apparel, beauty and skincare, food and beverage, home, pet and supplements, 15 or 16 per category.
- **Duplicates:** I counted Product and ProductGroup JSON-LD blocks on each store's best selling product page after it finished loading, and in the HTML the server returned, in November 2026. Two or more counts as a duplicate.
- **Sources:** identified from each block's script ID or class, its container on the page, and its structure. Review apps were detected from the scripts and resources each page loaded.
- **Settings:** from each app's help documentation (Judge.me, Okendo, Yotpo, Loox, Bazaarvoice developer docs), checked in November 2026. App settings change, so confirm in your own admin.
- **ChatGPT test:** see [Does schema change what ChatGPT says?](/reports/does-schema-change-what-chatgpt-says)

No store is named in this report. [Run the free AI Visibility Check](/ai-visibility-check) to see how many Product blocks your product page has and what AI says about it.
