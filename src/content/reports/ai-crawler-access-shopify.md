---
title: "AI Crawler Access on Shopify 2026: Who Blocks ChatGPT?"
description: "Do Shopify stores block ChatGPT or Perplexity? I checked robots.txt and JavaScript only product data across 94 stores. Blocking is rare. Invisible data is not."
slug: "/reports/ai-crawler-access-shopify"
h1: "AI crawler access on Shopify"
datePublished: 2026-11-04
dateModified: 2026-11-04
reportStores: 94
faq:
  - question: "Does Shopify block ChatGPT by default?"
    answer: "No. Shopify's default robots.txt has no rules for AI crawlers, so ChatGPT's search crawler is allowed. In November 2026, none of 94 stores I checked blocked OpenAI's search crawler in robots.txt."
  - question: "Which AI crawler matters for showing up in ChatGPT?"
    answer: "OAI-SearchBot. OpenAI says only that crawler's robots.txt setting decides whether a site can appear in ChatGPT search answers. GPTBot is for model training and blocking it does not remove you from ChatGPT search."
  - question: "What is the bigger access problem for Shopify stores?"
    answer: "Product data that only exists after JavaScript runs. AI crawlers from OpenAI, Anthropic and Perplexity don't run JavaScript, so data added by scripts can be invisible to them. 11% of stores had at least one product data block that only appeared after scripts ran."
---

**By Carson Cobb. Data checked November 2026.**

"Is my store blocking AI?" is one of the first questions brands ask, usually after reading that some publishers block ChatGPT. For Shopify brands the answer is almost always no. The more common problem is quieter: part of the product information exists only after JavaScript runs in a browser, and the crawlers behind most AI answers don't run JavaScript.

## The short version

- **No store blocked ChatGPT's search crawler.** 0 of 94 stores blocked OAI-SearchBot in robots.txt. Shopify's default file has no AI rules at all.
- **Only 11% have any AI specific rules.** 10 stores added rules for AI crawlers. Most of them explicitly allow OpenAI's search crawler.
- **One store blocks AI training through its CDN.** It uses a managed robots.txt that blocks training crawlers like GPTBot and ClaudeBot, while leaving search crawlers alone. That's a reasonable setup, as long as someone chose it on purpose.
- **The real gap is JavaScript.** 11% of stores had product data that only appeared after scripts ran. For 3 stores, that was the only product data on the page.

## Which crawler does what

This is the part most brands get wrong, so it's worth being precise.

| Crawler | Company | What it's for | Blocking it removes you from AI answers? |
| --- | --- | --- | --- |
| OAI-SearchBot | OpenAI | Finding pages to show in ChatGPT search | Yes. OpenAI says opted out sites won't appear in ChatGPT search answers |
| GPTBot | OpenAI | Collecting content for model training | No, per OpenAI |
| ChatGPT-User | OpenAI | Visiting a page when a user asks ChatGPT to | Not used for search, and may not follow robots.txt |
| ClaudeBot, PerplexityBot | Anthropic, Perplexity | Crawling for their AI products | Varies by product |
| Google-Extended | Google | Controls use in Gemini training | No effect on Google Search or AI Overviews |

If you only remember one line: blocking GPTBot keeps your content out of training, and blocking OAI-SearchBot keeps you out of ChatGPT's answers. Those are very different decisions.

## What the robots.txt files say

| Finding | Stores | Share |
| --- | --- | --- |
| Shopify default rules only, no AI specific rules | 84 | 89% |
| Rules that explicitly allow AI crawlers | 7 | 7% |
| Rules that block AI training crawlers only | 1 | 1% |
| Rules with AI entries that change nothing (empty disallow) | 2 | 2% |
| Rules that block ChatGPT's search crawler | 0 | 0% |
| Rules that block every crawler | 0 | 0% |

Two of the files listed AI crawlers with an empty disallow line, which allows everything. They read like a block at a glance, but they don't block anything. One file listed several AI crawlers in a group with dozens of allow lines copied from Shopify's defaults. It works, but it's the kind of file that breaks quietly when someone edits it later.

## The bigger problem: data that only exists after JavaScript

A 2024 study of crawler traffic across Vercel's network found that the crawlers from OpenAI, Anthropic and Perplexity download JavaScript files but don't run them. Google's crawler and Apple's do. So anything a script adds to the page after it loads can be invisible to ChatGPT, Claude and Perplexity.

On Shopify, review apps and some SEO apps often add product data with scripts. When I compared each product page as delivered by the server with the same page after scripts ran:

- **10 stores (11%)** had at least one product data block that only appeared after scripts ran. Usually it was the block carrying the star rating.
- **3 stores (3%)** had no product data at all until scripts ran. To a crawler that doesn't run JavaScript, those product pages had no machine readable price, availability or rating.

This matters most for ratings. If your stars come from a review app that injects them with a script, the AI crawler may see a product with no reviews.

## What to do with this

1. **Check one line in robots.txt.** Make sure OAI-SearchBot is not disallowed. If you've added AI rules, make sure each block means what you think it means.
2. **Decide on training separately.** Blocking training crawlers is a business decision. It doesn't affect whether ChatGPT can recommend you, as long as the search crawler is allowed.
3. **Ask your CDN or firewall team what they block.** Bot protection can challenge AI crawlers even when robots.txt allows them. I couldn't test that from a browser, so it's not counted here, and it's the check most worth running on your own store.
4. **Make sure product data is in the page the server sends.** Price, availability and rating should not depend on a script. The [schema completeness report](/reports/shopify-product-schema-completeness-2026) covers which fields matter.

## How this was done

- **Stores:** 94 US Shopify stores across apparel, beauty and skincare, food and beverage, home, pet and supplements, 15 or 16 per category.
- **robots.txt:** fetched from each store in November 2026. I recorded every group naming an AI crawler (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot, Google-Extended, Applebot-Extended, CCBot and others) and whether the store blocked all crawlers.
- **JavaScript only data:** on one best selling product page per store, I counted Product structured data blocks in the HTML the server returned, then counted them again after the page finished loading in a browser. Blocks present only after loading were counted as JavaScript only.
- **Not measured:** firewall or bot protection challenges for specific crawlers, which can't be tested reliably from a browser.
- **Crawler roles:** from OpenAI's crawler documentation and Vercel's "The rise of the AI crawler" (December 2024).

No store is named in this report. [Run the free AI Visibility Check](/ai-visibility-check) to see whether AI can read your product pages.
