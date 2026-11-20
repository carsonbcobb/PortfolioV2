---
title: "Every Shopify Store Now Has an agents.md File. What's in It? | Carson Cobb"
description: "105 of 107 Shopify brand stores serve an agents.md file for AI shopping agents, and 104 use Shopify's default. Only 1 store wrote its own. What it says and what you control."
slug: "/reports/shopify-agents-md-ai-agents-2026"
h1: "Every Shopify store now has an agents.md file. Here's what it says."
datePublished: 2026-11-16
dateModified: 2026-11-16
reportStores: 107
faq:
  - question: "What is agents.md on Shopify?"
    answer: "It's a public file at yourstore.com/agents.md that tells AI shopping agents how to browse and buy from your store. Shopify manages it by default for every store. It lists the store's Universal Commerce Protocol (UCP) and MCP endpoints, read only product and search URLs, the store's published policies and guidance for personal shopping agents."
  - question: "Do I need to create an agents.md file for my Shopify store?"
    answer: "No. In November 2026, 105 of 107 Shopify brand stores I checked already served one, and 104 of them used Shopify's default. Shopify's own documentation recommends adding a custom agents.md.liquid template only when you have advanced requirements the managed file doesn't cover."
  - question: "Can I edit my Shopify agents.md file?"
    answer: "Yes. Add a template named agents.md.liquid in your theme's Templates folder. Once you do, you maintain it yourself, and Shopify stops updating it for you. By default, llms.txt and llms-full.txt mirror the same content."
  - question: "What is UCP on Shopify?"
    answer: "UCP is the Universal Commerce Protocol, an open standard AI agents use to discover a store's products, build carts and prepare checkout. Every one of the 107 Shopify stores I checked answered at /.well-known/ucp, the store's UCP discovery address."
  - question: "Does agents.md help my products get recommended by ChatGPT?"
    answer: "Not on its own. It helps an agent shop your store once it's there. Whether ChatGPT or Google recommends you in the first place still depends on your product data, your pages and what outside sources say about you."
---

**By Carson Cobb. Data collected November 16, 2026.**

Sometime in 2026, without most store teams noticing, Shopify started publishing a set of files on every store that are written for AI agents, not people. There's an `agents.md` file, a protocol endpoint for AI shopping agents, and new lines at the top of `robots.txt` addressed to AI assistants.

I checked 107 Shopify brand stores in six product areas to see how many have these files, how many changed them, and what they actually tell an AI.

## The short version

- **105 of 107 stores serve an agents.md file.** 104 use Shopify's default. One store wrote its own.
- **All 107 answer as a UCP store.** Every store responded at `/.well-known/ucp`, the address AI agents use to find a store's shopping tools.
- **104 of 107 serve an llms.txt file.** By default, Shopify generates it from the same content.
- **76 of 107 robots.txt files now include instructions for AI agents** at the top, pointing them to agents.md and the UCP endpoints.
- **The default file is a template.** It covers how an agent can shop, not what makes your products worth buying.

## What I found

| | Stores | Share of 107 |
| --- | --- | --- |
| Serve `/agents.md` | 105 | 98% |
| Use Shopify's default agents.md | 104 | 97% |
| Wrote a custom agents.md | 1 | 1% |
| Answer at `/.well-known/ucp` | 107 | 100% |
| Serve `/llms.txt` | 104 | 97% |
| robots.txt includes AI agent instructions | 76 | 71% |
| robots.txt has its own rules for GPTBot | 15 | 14% |

The default agents.md files ran about 5,700 characters. The two stores without one returned a not found page.

Shopify gave almost every store the agent files: 100% respond on UCP and 97% have agents.md ([agentic commerce readiness](/reports/shopify-agentic-commerce-readiness-2026)).

## What the default file tells an AI

Shopify's documentation says the managed file covers four things: the store's UCP discovery and MCP endpoints, read only browsing URLs for product, collection and search data, the store's published policies, and guidance for personal shopping agents such as Shopify's Shop skill ([Shopify](https://shopify.dev/docs/storefronts/themes/architecture/templates/agents-md-liquid)). It deliberately leaves out contact details.

In practice, the default file reads like instructions for a checkout robot. It explains how to find products, build a cart and hand off to the buyer for approval. It recommends that agents use the Shop skill so a shopper's Shop Pay details can be used. It says almost nothing about the brand itself.

That's the point worth understanding. agents.md helps an AI agent shop your store once it has decided to. It doesn't help the AI decide your product is the right one. That decision still comes from your product data, your pages and the outside sources AI trusts. See [who ChatGPT recommends](/reports/who-chatgpt-recommends-2026) and [where AI sends shoppers](/reports/where-ai-sends-shoppers-2026).

## The policies are the part you control

Of everything in the default file, your policies matter most, because they're the store specific facts an agent passes to the shopper. 103 of the 105 agents.md files referenced the store's policies, and 104 mentioned returns.

In a 2026 test of 122 Shopify stores by Search Engine Journal, AI agents answered return window questions well, but no store gave a usable answer about shipping cost to a specific city, and only 2 of 88 gave a usable answer about cancellations ([source](https://searchenginejournal.com/your-store-is-agent-ready-by-default-we-tested-122-shopify-stores/591767)). Those answers come from your policy pages. See [Shopify return policies](/reports/shopify-return-policy-benchmarks-2026) and [Shopify shipping policies](/reports/shopify-shipping-policy-benchmarks-2026).

## Should you write your own?

Probably not yet. Shopify's guidance is to add a custom `agents.md.liquid` only for advanced requirements, because once you do, you maintain it yourself ([Shopify](https://shopify.dev/docs/storefronts/themes/architecture/templates/agents-md-liquid)). The managed file updates automatically as Shopify adds protocol versions. A custom file can fall behind.

This is a lot like llms.txt. Having the file isn't what makes AI recommend you. In my earlier test, [llms.txt didn't change what ChatGPT said](/reports/does-llms-txt-do-anything).

## What to do with this

1. **Open yourstore.com/agents.md and read it.** Five minutes. Know what it says about you.
2. **Fix your policies, because that's what agents quote.** State the return window, shipping costs, delivery times and cancellation rules in plain numbers.
3. **Check robots.txt if you edited it.** If your theme has a custom robots.txt, make sure it still lets the AI crawlers you want reach your products. See [AI crawler access on Shopify](/reports/ai-crawler-access-shopify).
4. **Don't replace the default file without a reason.** Keep Shopify's managed version unless you have a specific need it doesn't cover.
5. **Spend the effort on what decides recommendations.** Complete product data, product pages that answer real questions, and the review sites and roundups AI cites.

What AI sees about your store, and what it does with it, is the core of [Close the Gap](/close-the-gap). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Stores:** 107 Shopify brand stores, 17 to 18 in each of six product areas (supplements, beauty, food and drink, pet, home, apparel), drawn at random from my dataset of 620 Shopify brand stores. Client stores were excluded.
- **Files:** for each store, on November 16, 2026, I requested `/agents.md`, `/llms.txt`, `/robots.txt`, `/.well-known/ucp` and `/sitemap.xml` from the store's own domain. A file counted as served when it returned a 200 response with content.
- **Default vs custom:** a file counted as Shopify's default when it began with Shopify's standard "Agent Instructions" heading and matched the default structure. One store's file began with its own heading and text.
- **Robots.txt:** checked for Shopify's "Agent instructions" and "UCP discovery" lines, and for rules naming GPTBot.
- **Limits:** this records whether the files exist and what they contain, not how often AI agents use them.

No store or brand is named in this report.
