---
title: "Shopify AI Readiness Index 2026: 94 Stores Scored"
description: "How ready are Shopify stores for AI search? I scored 94 stores on 11 checks AI relies on. The typical store scores 70 of 100, and the gaps are fixable."
slug: "/reports/shopify-ai-readiness-index-2026"
h1: "Shopify AI Readiness Index 2026"
datePublished: 2026-11-04
dateModified: 2026-11-04
reportStores: 94
faq:
  - question: "What is the Shopify AI Readiness Index?"
    answer: "A 100 point score built from 11 checks on how readable a Shopify store is to AI systems: crawler access, product structured data, ratings, identifiers, shipping and returns, brand identity, FAQ markup, breadcrumbs and product description depth. I scored 94 US Shopify stores in November 2026."
  - question: "What is a typical AI readiness score for a Shopify store?"
    answer: "The median store scored 70 out of 100. 25% of stores scored 80 or higher, and 11% scored under 40, usually because their product pages had no readable product data at all."
  - question: "What do most Shopify stores miss?"
    answer: "Shipping and return details in structured data (89% of stores miss them), FAQ markup (78%), breadcrumbs (63%), and a single clean Product entity, since 39% of stores either duplicate their product data or don't publish it."
  - question: "Does a high score guarantee ChatGPT will recommend my brand?"
    answer: "No. Readiness makes your store easy for AI to read and describe correctly. Whether AI recommends you also depends on what other sources say about your brand, like reviews, lists and forums."
---

**By Carson Cobb. Data checked November 2026.**

AI assistants are becoming a real way shoppers find products. Shopify reported that orders from AI referrals grew nearly 13 times year over year in early 2026, and that AI referred visitors who land on a product page convert about 50% better than organic search visitors.

Getting recommended depends on two things: whether AI can read and trust your own site, and what the rest of the internet says about you. This index measures the first part, the part you control completely.

I scored 94 Shopify stores on 11 checks.

## The short version

- **The typical store scores 70 out of 100.** Most stores have the basics. Few have the details.
- **1 in 4 stores score 80 or more.** 11% score under 40, almost always because their product pages have no readable product data.
- **Nobody is blocking ChatGPT.** Every store passed the crawler access check. Access isn't the problem.
- **The common gaps are details, not foundations.** Shipping and returns, FAQ markup, breadcrumbs, and one clean product entity per page.
- **Pet brands lead, food brands trail.** Median 80 for pet, 60 for food and beverage.

## The score

| Check | What it means | Points | Stores passing |
| --- | --- | --- | --- |
| Search crawler access | ChatGPT's search crawler is not blocked | 10 | 100% |
| Product data without scripts | Product structured data is in the page the server sends | 15 | 86% |
| Core product fields | Name, image, description, brand, price and availability | 10 | 74% |
| Description depth | The typical product has at least 300 characters of description | 15 | 65% |
| One product entity | Exactly one Product block, no duplicates | 10 | 61% |
| Brand identity | Homepage Organization data linked to social profiles | 10 | 61% |
| Identifiers | GTIN or manufacturer part number | 5 | 55% |
| Rating | Aggregate rating in the structured data | 10 | 55% |
| Breadcrumbs | Breadcrumb data on the product page | 5 | 37% |
| FAQ markup | FAQ structured data on the product page or FAQ page | 5 | 22% |
| Shipping or returns | Shipping or return policy in the structured data | 5 | 11% |

Weights reflect how directly each check affects what an AI system can say about a product. llms.txt is deliberately left out. Almost every store has one, and [there's no evidence it changes anything](/reports/does-llms-txt-do-anything).

## How stores scored

| Score | Stores | Share | What it usually looks like |
| --- | --- | --- | --- |
| 80 to 100 | 23 | 25% | Clean product data, ratings, brand identity. Missing one or two details. |
| 60 to 79 | 46 | 49% | Solid basics, but duplicates, missing ratings or thin descriptions. |
| 40 to 59 | 15 | 16% | Several gaps, often duplicate product data and no identifiers. |
| Under 40 | 10 | 11% | No readable product data on the product page. |

The bottom group is where the biggest wins are. Most of those stores sell good products with real reviews, but their product pages give a machine nothing structured to read. Some rely on microdata from an older theme, some lost their structured data in a theme customization, and some load everything with scripts.

## By category

| Category | Stores | Median score | Lowest | Highest |
| --- | --- | --- | --- | --- |
| Pet | 15 | 80 | 25 | 90 |
| Apparel | 16 | 70 | 10 | 90 |
| Supplements | 15 | 70 | 45 | 95 |
| Home | 16 | 68 | 25 | 85 |
| Beauty and skincare | 16 | 65 | 10 | 95 |
| Food and beverage | 16 | 60 | 25 | 80 |

Pet brands score well because their product pages tend to be detailed and most run review apps that publish ratings. Food and beverage brands score lowest, mostly on description depth, ratings and identifiers. Apparel and beauty have the widest spread, with some of the best and worst stores in the study.

## The five most common gaps

1. **No shipping or return details in the data (89% of stores).** These answer "how fast" and "can I return it," which are among the last questions before a purchase.
2. **No FAQ markup (78%).** Most stores have written FAQs. Few label them for machines.
3. **No breadcrumbs (63%).** Breadcrumbs tell a machine where a product sits in the catalog.
4. **Duplicate or missing product data (39%).** Either two or three Product blocks that compete, or none at all. See the [duplicate schema report](/reports/duplicate-product-schema-ai-visibility).
5. **No rating in the data (45%).** Often the store has reviews, but the stars only exist for shoppers. See the [schema completeness report](/reports/shopify-product-schema-completeness-2026).

The catalog behind the structured data matters too. Barcodes, product types, images and descriptions are covered in [Is your Shopify product data ready for AI shopping?](/reports/shopify-catalog-data-ai-shopping-2026)

## What to do with this

1. **Score your own store against the 11 checks.** Most can be checked in a few minutes with Google's Rich Results Test and your robots.txt.
2. **Fix duplicates and missing ratings first.** They affect what AI says about price and quality, which are the facts shoppers ask about most.
3. **Add the details next.** Shipping, returns, breadcrumbs and FAQ markup are small changes with no design work.
4. **Then work on what others say about you.** Readiness gets your own site right. The [ChatGPT recommendations report](/reports/who-chatgpt-recommends-2026) shows which outside sources decide who gets named.

## How this was done

- **Stores:** 94 US Shopify stores priced in US dollars, 15 or 16 each in apparel, beauty and skincare, food and beverage, home, pet and supplements. Drawn from the 606 store dataset behind my other reports, with two stores removed because they didn't fit their category.
- **Pages:** one best selling product page per store, plus the homepage, one collection, the FAQ page, the blog index, one article and the about page, checked in November 2026 in a desktop browser.
- **Product data:** JSON-LD structured data read after the page finished loading, and again from the HTML the server returned, to separate data that needs scripts. A field counts if any block included it with a value.
- **Description depth:** the median text length of each store's product descriptions, from up to 250 products per store.
- **Crawler access:** each store's robots.txt checked for rules affecting OAI-SearchBot and for blanket blocks. Firewall and bot protection were not tested.
- **Scoring:** points as listed above, total 100. Each check is pass or fail.

No store is named in this report. Want your store's score? [Run the free AI Visibility Check](/ai-visibility-check).
