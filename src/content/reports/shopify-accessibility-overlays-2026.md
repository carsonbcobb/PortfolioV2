---
title: "Accessibility Overlays on Shopify 2026: 1 in 4 Brands Still Use One | Carson Cobb"
description: "26% of Shopify brand homepages load an accessibility overlay widget, most often accessiBe. Data from 609 stores, and what overlays do and don't fix."
slug: "/reports/shopify-accessibility-overlays-2026"
h1: "Accessibility overlays on Shopify: one in four brands still load one"
datePublished: 2026-11-17
dateModified: 2026-11-17
cta: cro
reportStores: 617
faq:
  - question: "How many Shopify stores use an accessibility overlay?"
    answer: "In November 2026, 157 of 609 Shopify brand homepages I checked (26%) loaded code from an accessibility overlay. accessiBe was the most common at 18%, then UserWay at 6% and AudioEye at 3%."
  - question: "Does an accessibility overlay make a Shopify store compliant?"
    answer: "No tool can guarantee that on its own. In 2025 the FTC finalized an order requiring accessiBe to pay $1 million over claims that its tool could make any website compliant with accessibility guidelines. Accessible themes, real alt text, labels and keyboard support do the work."
  - question: "Which Shopify stores use accessibility overlays most?"
    answer: "Supplements (32%) and beauty (31%) stores were most likely to load one in my data, apparel (18%) least likely."
  - question: "Do accessibility fixes help AI search?"
    answer: "Many of the same fixes do. Descriptive alt text, real headings, labeled buttons and readable text in the page source help screen readers and also help machines understand a page. An overlay that changes the page after it loads doesn't change what a crawler reads."
---

**By Carson Cobb. Data collected November 16 and 17, 2026.**

Accessibility overlays are the small widget in the corner that promises to make a site accessible with one line of code. I checked how many Shopify brand homepages still load one.

## The short version

- **26% load an accessibility overlay.** 157 of 609 homepages.
- **accessiBe is the most common**, at 18%. UserWay is at 6% and AudioEye at 3%.
- **Supplements and beauty use them most**, at 32% and 31%.
- **The underlying fixes are often missing anyway.** Across all stores, 35% had no alt text on any of the product images I sampled.

## Overlay code on homepages

| Overlay | Homepages | Share of 609 |
| --- | --- | --- |
| accessiBe | 107 | 18% |
| UserWay | 37 | 6% |
| AudioEye | 16 | 3% |
| Any of these | 157 | 26% |

## By product area

| Product area | Homepages | Any overlay |
| --- | --- | --- |
| Supplements | 121 | 32% |
| Beauty | 127 | 31% |
| Food and drink | 153 | 24% |
| Pet | 41 | 22% |
| Home | 75 | 23% |
| Apparel | 92 | 18% |

## What overlays do and don't do

An overlay runs in the browser after the page loads. It can add a menu to change contrast or font size, and it may try to guess labels for images and buttons. It doesn't change your page source, your product images' alt text, or how your theme is built.

In January 2025 the FTC announced an order, finalized that April, requiring accessiBe to pay $1 million over claims that its tool could make any website compliant with accessibility guidelines ([TechCrunch](https://techcrunch.com/2025/01/03/ftc-orders-ai-accessibility-startup-accessibe-to-pay-1m-for-misleading-advertising)). Overlays still have users, but they aren't a substitute for an accessible store.

The overlap with AI search is real. Alt text, real headings, labeled buttons and text that exists in the page source are what a screen reader needs, and they're also what a crawler reads. An overlay's guesses happen after the crawler has left. I covered alt text in detail in [Shopify image alt text](/reports/shopify-image-alt-text-2026).

Only 18% of 598 Shopify brand homepages passed five basic accessibility checks ([Shopify accessibility statistics](/reports/shopify-accessibility-statistics-2026)).

## What to do with this

1. **Write real alt text** for product images: what the product is, the variant, what's shown.
2. **Check headings and labels.** One H1, buttons with text, form fields with labels.
3. **Test with a keyboard.** Can you add to cart and check out without a mouse?
4. **Treat any overlay as an extra, not the fix.** If you keep one, don't rely on it for compliance.

What shoppers and machines can read on your pages is part of my [AI Search and Conversion Audit](/ai-search). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Stores:** 617 Shopify brand stores in six product areas: supplements (123), beauty (127), food and drink (154), pet (41), home (76) and apparel (96). This is my full dataset of 620 Shopify brand stores, minus client stores and one store that blocked automated reads. 609 homepages were readable.
- **When:** November 16 and 17, 2026.
- **How:** overlay code detected from known script patterns in each homepage's source. Alt text checked on the images of up to four products per store through the public product data.
- **Limits:** overlays loaded only through tag managers or app embeds after load may be missed. This isn't legal advice, and I'm not a lawyer.

No store or brand is named in this report.
