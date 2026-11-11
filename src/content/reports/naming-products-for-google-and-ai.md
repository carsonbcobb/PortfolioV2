---
title: "How to Name Products for Google and AI at the Same Time | Carson Cobb"
description: "29% of Shopify product pages use a different name in their SEO title than on the product itself. Here's how to rank in Google and stay recognizable to AI without picking one."
slug: "/reports/naming-products-for-google-and-ai"
h1: "How to name products for Google and AI at the same time"
datePublished: 2026-11-11
dateModified: 2026-11-11
reportStores: 128
faq:
  - question: "Should my product title be written for SEO or for AI search?"
    answer: "Both, in different places. Keep one consistent product name on the page, in your structured data and everywhere else the product is listed, because that's how AI tools recognize it as one product. Put search friendly wording, like size, type and key benefits, in the SEO title tag and in your Google Shopping feed title, which can differ from the name on the page."
  - question: "Is it bad to put the size first in a product title?"
    answer: "In a Google Shopping feed title, leading with the attribute shoppers search for can be fine, and Google itself suggests putting things like petite or plus size at the start of apparel titles. On the product page and in structured data, keep the product's real name first and add size and color after it, the way Google's own variant markup examples do."
  - question: "Can my Google Shopping title be different from my product page title?"
    answer: "Yes. Google Merchant Center asks that your feed title describes the product you link to, not that it matches the page word for word. Many brands write feed titles with more search terms than the on page name."
  - question: "How do AI tools tell that two listings are the same product?"
    answer: "They lean on consistent signals: the same product name, the same brand and, where it exists, the same GTIN or manufacturer part number. In my sample of 128 Shopify stores, only 33% of product pages included a GTIN in their structured data, so for most products the name is doing most of that work."
  - question: "What did you find about how Shopify stores name products?"
    answer: "Across 382 product pages from 128 Shopify stores, checked in November 2026, 55% used the same name in the SEO title as on the product, 15% added extra keywords after the name, and 29% changed the name itself. Structured data almost always matched the product name, and only about 1% of product names started with a size or pack count."
---

**By Carson Cobb. Data collected November 2026.**

A question I keep hearing from large brands: Google rewards product titles written around what people search for, like "Men's Size 11 Wide Trail Runner." AI search seems to reward the opposite: one product name, used the same way everywhere, so the AI knows every mention is the same product. So which do you optimize for?

You don't have to pick. The two goals live in different fields. To show how stores handle this today, I checked 382 product pages across 128 Shopify stores in six product types: supplements, beauty, food and drink, pet, home and apparel.

## The short version

- **29% of product pages rename the product in their SEO title.** The title tag says something different from the product name, usually to add search terms.
- **Another 15% keep the name and add keywords after it.** That's the safest way to do it.
- **Structured data almost never strays.** When a page had Product markup, the name in it matched the product name every time.
- **Only 33% of pages gave Google and AI a GTIN.** For most products, the name is the main thing tying every listing together.
- **Almost nobody leads with size.** About 1% of product names started with a size, pack count or piece count.
- **The fix:** one consistent product name for identity, plus search friendly wording in the SEO title and the Shopping feed title.

## Why the two goals seem to conflict

**Google search and Google Shopping** match a product to a search. Titles that contain the words people type, like the size, the type of product and who it's for, get matched to more searches. Google's own Merchant Center guidance says to put the most important details in the first 70 characters, because that's often all a shopper sees.

**AI search** works differently. Before ChatGPT, Gemini or Google AI Mode can recommend a product, it has to recognize that the product on your site, the one in a review and the one in a retailer listing are the same thing. A product that goes by three different names across those places is harder to connect into one picture.

The conflict is real only if you try to use one field for both jobs.

## What I found on 128 Shopify stores

### SEO titles vs product names

| How the SEO title compares to the product name | Products | Share |
| --- | --- | --- |
| Exactly the same | 209 | 55% |
| Same name, extra keywords added after it | 58 | 15% |
| Same name, cut off | 6 | 2% |
| Name changed | 109 | 29% |

The renamed titles were at 55 of the 128 stores. Most of them turned a brand style product name into a search phrase. A product called something like "Daily Chews" became "Cholesterol Supplement Chews, 900 mg Plant Sterols" in the title tag. A product called "Anti Everything Pads" became "Men's Exfoliating Face Wipes" in the title tag.

That's a reasonable SEO move. Shoppers don't search for a brand's clever product name. They search for what the product does.

### By product type

| Product type | Products | Name changed in SEO title | Keywords added after the name |
| --- | --- | --- | --- |
| Apparel | 66 | 21 | 5 |
| Home | 63 | 22 | 13 |
| Pet | 66 | 18 | 9 |
| Beauty | 61 | 17 | 13 |
| Food and drink | 66 | 16 | 9 |
| Supplements | 60 | 15 | 9 |

### The visible heading

About 1 in 10 product pages showed a different name in the main heading than the product's actual name (37 of 348 pages with a readable heading). Some dropped the brand. Some showed only a color or a scent. One showed the name of a different bundle altogether.

The visible heading matters because Google can use it to rewrite your title in search results, and AI tools read the page the way a shopper does.

### Structured data and identifiers

| Product markup check | Result |
| --- | --- |
| Pages with Product structured data | 330 of 382 (86%) |
| Structured data name matched the product name | 330 of 330 |
| Brand included | 325 of 330 (98%) |
| GTIN included | 108 of 330 (33%) |
| Products with variants using ProductGroup markup | 60 of 120 (50%) |
| Pages with two conflicting Product names | 7 pages at 3 stores |

The structured data side is in good shape on naming, because Shopify themes pull the product name straight into the markup. The gap is identifiers. Two out of three products gave AI no GTIN to match on, which leaves the name to carry the product's identity across the web.

### Size first names are rare

Only 5 of 382 product names started with an attribute, and all five were pack or piece counts like "12 Piece Set." The median product name was 28 characters long. Just 6 were longer than 70.

## What Google and OpenAI actually ask for

**Google Merchant Center** says your feed title should describe the product you link to. It doesn't have to match the page word for word. For apparel, Google suggests a structure of brand, then product type, then other important attributes, and says to put strong brand names first. It also says attributes like petite, plus size or maternity can go at the start of the title. Titles can be up to 150 characters, and promotional text like prices or "free shipping" doesn't belong in them.

**Google's product variant markup** keeps the group name general and makes each variant's name more specific, with the example "Wool winter coat, green, size small." That's the product name first, then the attributes.

**OpenAI's product feed specification for ChatGPT shopping** asks for the product name, including the selected variant when relevant, with an example like "Trail running shoes, black, size 10." It requires a brand as shown on the product page, and accepts GTIN and manufacturer part number as optional identifiers. It says not to invent a part number to replace a missing GTIN.

**Google search title links** can come from your title tag, your main visible heading, other prominent text and links pointing to the page. Google may rewrite a title that doesn't reflect the page, and it suggests putting the main title in the first visible heading.

## How to set it up

Think of it as two layers.

**Layer 1: identity. Keep this the same everywhere.**

- **The product name** on the page and in the main heading.
- **The name in your structured data.** Shopify themes usually handle this.
- **The brand,** spelled the same way on your site, on retailers and in your feeds.
- **A GTIN or manufacturer part number** wherever you have one, on every variant.
- **Variants marked up as one product group,** so size 9 and size 11 are clearly the same shoe.

**Layer 2: discovery. Write this for search.**

- **The SEO title tag.** Start with the product name, then add the words people search for, like "Daily Chews: Cholesterol Supplement with 900 mg Plant Sterols." This keeps the name recognizable and adds the search terms after it, the way 15% of the stores I checked already do.
- **The Google Shopping feed title.** This is the place for attribute heavy, search led titles. If size or fit is what shoppers search for, it can lead here. In Merchant Center you can set feed titles separately from the product page, for example with a supplemental feed.
- **The product description and FAQs.** Plain language about what the product does, who it's for and what problem it solves gives both Google and AI the search terms without touching the name.

**What to avoid:**

- Renaming the product in the title tag so that the brand's product name disappears completely.
- A visible heading that says something different from the product name.
- Different spellings of the brand or product across your site, retailers and feeds.
- Inventing identifiers. Leave the GTIN out if you don't have one.

## What this means for a large catalog

For a brand with hundreds of products and paid Shopping campaigns, the search led title is real money. Attribute led feed titles often match cheaper, higher intent searches. Keeping those titles in the feed, where they belong, means you don't have to rename products on the site to get that benefit. Your product pages, structured data, retailer listings and reviews keep one name, and the feed does the search work.

## Method

In November 2026 I took a random sample of 132 Shopify stores, 22 from each of six product types, from a larger set of stores I track. 128 returned usable product data. For each store I checked up to three products from its public product list, skipping gift cards and add ons, for 382 products in total.

For each product I compared the product name in Shopify with the page's title tag (with the store name removed), the main visible heading and the name in its Product structured data. Differences were coded as the same, keywords added after the name, cut off, or changed. I also recorded whether the structured data included a brand, a GTIN and product group markup for variants. This is a snapshot of each store's public pages on the day I checked them. Store names aren't published.

Sources: [Google Merchant Center title guidance](https://support.google.com/merchants/answer/6324415), [Google Merchant Center title tips for apparel](https://support.google.com/merchants/answer/7348545), [Google product variant structured data](https://developers.google.com/search/docs/appearance/structured-data/product-variants), [Google title links](https://developers.google.com/search/docs/appearance/title-link), [OpenAI product feed specification](https://developers.openai.com/commerce/product-feeds/spec).

Related: [Shopify product data for AI shopping](/reports/shopify-catalog-data-ai-shopping-2026), [What AI gets wrong about products](/reports/what-ai-gets-wrong-about-products-2026), [Shopify product schema completeness](/reports/shopify-product-schema-completeness-2026).
