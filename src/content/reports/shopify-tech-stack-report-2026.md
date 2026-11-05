---
title: "Shopify Tech Stack Report 2026: What Growing Brands Load"
description: "The email, reviews, testing and analytics tools growing Shopify brands load on their homepage, plus themes and free shipping lines. Data from 153 stores."
slug: "/reports/shopify-tech-stack-report-2026"
h1: "Shopify Tech Stack Report 2026"
datePublished: 2026-11-01
dateModified: 2026-11-01
reportStores: 153
faq:
  - question: "What email platform do Shopify brands use most?"
    answer: "Klaviyo, by a wide margin. 87% of 153 growing Shopify brands loaded Klaviyo on their homepage. 31% also loaded a dedicated SMS tool such as Attentive or Postscript."
  - question: "How many outside services does a Shopify homepage load?"
    answer: "The typical homepage in this study loaded code from 20 outside companies, not counting Shopify itself. 18% loaded 30 or more."
  - question: "What is a typical free shipping threshold on Shopify?"
    answer: "Among 92 stores that showed a free shipping threshold on their homepage, the typical threshold was $60, about 2 times the typical product price. $50 was the most common single threshold."
  - question: "Which Shopify theme is most common?"
    answer: "Dawn, Shopify's free theme, was the most common base theme at 14% of stores. Most other stores used a paid theme or a custom build."
---

**By Carson Cobb, Fractional Head of Ecommerce. Data checked November 2026.**

App vendors publish case studies. Agencies publish their favorite stacks. Neither tells you what growing brands actually run. For this report I loaded the homepages of 153 Shopify stores in a real browser and recorded every outside service each page called: email, reviews, support, testing, analytics, ads and more.

## The short version

- **Klaviyo is close to universal.** 87% of stores load it. 31% also run a separate SMS tool.
- **82% load a reviews app.** Yotpo and Okendo lead. 9% load two reviews apps at once.
- **The typical homepage calls 20 outside companies.** 18% call 30 or more.
- **Testing is still rare.** Only 23% load an A/B testing tool. 44% load a session recording tool.
- **1 in 5 load an accessibility overlay**, a tool that doesn't make a site compliant on its own.
- **The typical free shipping line is $60**, about 2 times the typical product price.

## What growing brands load

Share of stores whose homepage loaded each type of tool.

| Tool | All stores | Supplements | Beauty | Food | Pet | Home | Apparel |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Klaviyo | 87% | 85% | 92% | 82% | 88% | 83% | 92% |
| Reviews app | 82% | 88% | 88% | 86% | 69% | 91% | 72% |
| Session recording (Clarity, Hotjar) | 44% | 38% | 48% | 29% | 46% | 48% | 56% |
| Gorgias support | 33% | 23% | 44% | 25% | 15% | 35% | 56% |
| SMS tool (Attentive, Postscript) | 31% | 42% | 36% | 29% | 23% | 30% | 28% |
| Attribution (Triple Whale, Northbeam) | 25% | 35% | 12% | 7% | 35% | 22% | 40% |
| A/B testing tool | 23% | 35% | 12% | 7% | 23% | 22% | 40% |
| Rebuy upsells | 22% | 31% | 16% | 18% | 35% | 26% | 8% |
| Accessibility overlay | 21% | 27% | 12% | 32% | 19% | 22% | 12% |
| Loyalty program | 17% | 31% | 20% | 14% | 19% | 4% | 12% |

Supplement brands run some of the most complete stacks, with the most SMS and loyalty programs of any category, and apparel leads on testing and attribution. Food brands run the leanest, with the fewest tools of any category.

## Reviews apps

| App | Share of stores |
| --- | --- |
| Yotpo | 33% |
| Okendo | 24% |
| Judge.me | 11% |
| Bazaarvoice | 10% |
| Stamped | 9% |
| Loox | 3% |

9% of stores load two reviews apps on the same homepage. That often happens during a switch that never finished, and it means paying twice and loading twice.

## How heavy the homepage is

| Category | Outside companies called (typical) | Tools detected (typical) | Page size (typical HTML) |
| --- | --- | --- | --- |
| Supplements | 26 | 8 | 930 KB |
| Apparel | 23 | 10 | 967 KB |
| Home | 22 | 8 | 811 KB |
| Beauty | 21 | 9 | 671 KB |
| Pet | 18 | 8 | 741 KB |
| Food | 17 | 7 | 594 KB |

Every outside service is another script competing for the shopper's phone while the page loads. The typical store calls 20 outside companies from the homepage alone. A third of stores ship more than 1 MB of HTML before a single image loads.

Most of that weight builds up over time: an app installed for a test, a pixel for a channel you stopped running, a widget that was replaced but never removed. A yearly app audit is one of the cheapest speed wins there is.

## Themes

Dawn, Shopify's free theme, was the most common base theme at 14% of stores, followed by Impulse, Expanse, Palo Alto and Horizon at 3% each. The rest were spread across dozens of paid themes and custom builds. There is no single "right" theme among growing brands; what matters is how much has been bolted on top.

## Free shipping thresholds

92 of the 153 homepages showed a free shipping threshold in a banner or cart message.

| Category | Typical threshold | Threshold compared with typical product price |
| --- | --- | --- |
| Apparel | $100 | 1.9 times |
| Supplements | $75 | 1.9 times |
| Home | $75 | 1.2 times |
| Beauty | $60 | 1.8 times |
| Pet | $50 | 2.3 times |
| Food | $50 | 3.5 times |

$50 was the most common threshold (22% of stores showing one), then $75 and $100. Food brands set the line highest relative to what they sell, at 3.5 times the typical product price. That means a shopper needs three or four items to get free shipping, which works if the bundle is obvious and fails if it isn't. The [free shipping calculator](/tools/free-shipping-calculator) works out where yours should sit.

## What to do with this

1. **List every outside service your homepage calls.** Open your site, then your browser's network panel, and filter by third party. Anything you don't recognize is a question for your team.
2. **Remove duplicates.** Two reviews apps, two session recorders or two pop up tools is common and costly.
3. **Add testing before adding more tools.** Only 23% of brands test. A testing tool tells you which of your other tools are worth keeping.
4. **Don't rely on an accessibility overlay.** Fix the theme instead.
5. **Check your free shipping line against your typical cart,** especially if you sell lower priced products.

## How this was done

- **Stores:** 153 US Shopify stores from the 606 store dataset, sampled across supplements (26), beauty and skincare (25), food and beverage (28), pet (26), home (23) and apparel (25).
- **Method:** each homepage was loaded in a real Chrome based browser in November 2026. After the page settled, I recorded the address of every script, stylesheet, frame and network request, and every Shopify app embed, then matched the domains against known vendors.
- **Limits:** this is the homepage only. Some tools load only on product, cart or account pages, or only after a click, so every share here is a lower bound. Ad pixels that run inside Shopify's sandboxed pixel system may not show up. Subscription apps are covered more accurately in the [subscription benchmarks](/reports/shopify-subscription-benchmarks-2026), which reads plans directly.
- **Outside companies:** distinct domains called from the homepage, excluding the store's own domain and Shopify.
- **Free shipping:** dollar amounts in homepage text that mention free shipping, such as an announcement bar or "you're $50 away" cart message, excluding international offers.

No store is named in this report. Want the scripts that slow your store cut back? Mobile speed is part of my [conversion work](/shopify-conversion-optimization).
