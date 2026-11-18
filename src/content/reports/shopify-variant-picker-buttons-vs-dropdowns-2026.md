---
title: "Shopify Variant Pickers 2026: Buttons vs Dropdowns on 191 Product Pages | Carson Cobb"
description: "On Shopify product pages with real choices, 42% show variant buttons, 28% use dropdowns only and the rest load a custom picker. 41% of food and 47% of pet stores still use dropdowns."
slug: "/reports/shopify-variant-picker-buttons-vs-dropdowns-2026"
h1: "Variant pickers on Shopify: buttons or dropdowns, and why it matters"
datePublished: 2026-11-17
dateModified: 2026-11-17
cta: cro
reportStores: 599
faq:
  - question: "Should Shopify variants be buttons or dropdowns?"
    answer: "Buttons or swatches, in most cases. They show every option at once, so shoppers see what exists and what's sold out without opening a menu. Dropdowns hide options and add a tap on mobile. In November 2026, 42% of Shopify brand product pages with variant choices used buttons and 28% used dropdowns only."
  - question: "Which Shopify stores still use variant dropdowns?"
    answer: "Food and drink (41%), pet (47%) and beauty (50%, from a small sample) stores were most likely to use dropdowns only. Apparel and supplements stores mostly used buttons."
  - question: "What variant options do Shopify brands use most?"
    answer: "Size, by far. Of 191 product pages with a real choice, 102 offered size, 33 color, 12 flavor and 7 scent. The median product with choices had 4 variants."
  - question: "Do color variants on Shopify use swatches?"
    answer: "Mostly. Of 39 product pages offering a color choice, 26% still used a dropdown only. The rest used buttons, swatches or a custom picker."
---

**By Carson Cobb. Data collected November 17, 2026.**

When a product comes in sizes, flavors or colors, the variant picker is the last thing a shopper touches before add to cart. Dropdowns hide the options. Buttons and swatches show them. It's one of the simplest product page changes there is, and one I test often. I checked how Shopify brands handle it.

## The short version

- **191 of 596 sampled product pages offered a real choice.** Size was the most common, on 102.
- **42% use buttons**, rendered in the page source.
- **28% use dropdowns only.**
- **30% show neither in the page source**, usually a custom picker added by an app or JavaScript.
- **Pet, food and beauty stores use dropdowns most.**
- **26% of color choices are still dropdowns.**

## Picker type

| Picker | Product pages | Share of 191 |
| --- | --- | --- |
| Buttons or radio style options | 80 | 42% |
| Dropdown only | 53 | 28% |
| Neither found in the page source (custom picker or added after load) | 58 | 30% |

## By product area

| Product area | Pages with choices | Buttons | Dropdown only |
| --- | --- | --- | --- |
| Supplements | 29 | 55% | 28% |
| Beauty | 16 | 25% | 50% |
| Food and drink | 34 | 29% | 41% |
| Pet | 17 | 29% | 47% |
| Home | 24 | 25% | 17% |
| Apparel | 71 | 55% | 15% |

Beauty and pet samples are small, so read those rows as directional.

## What shoppers choose between

| Option | Product pages |
| --- | --- |
| Size | 102 |
| Color | 33 |
| Flavor | 12 |
| Scent | 7 |
| Gift card amount | 6 |

## Why it matters

A dropdown asks the shopper to open it to learn what exists, and on mobile it opens a system menu that covers the page. Buttons show the full range, make sold out options visible at a glance, and let price differences show next to each choice. For sizes and pack counts, buttons also make it easier to nudge toward the better value option.

It matters for AI shoppers too. A shopper who asked AI for "the 90 count" or "the unscented one" wants to see it immediately when they land. And the variant names you type in Shopify are what structured data and product feeds pass on, which I covered in [variant schema on Shopify](/reports/shopify-productgroup-variant-schema-2026).

## What to do with this

1. **Switch dropdowns to buttons** in your theme's product section settings. Most current themes have the option.
2. **Use swatches for color, shade and scent** with clear names.
3. **Name variants the way shoppers ask.** "90 capsules, 3 month supply" beats "Option 3".
4. **Show the per unit price** when sizes differ, so the bigger size sells itself.
5. **Test it.** On high traffic pages it's one of the fastest tests to run.

Product page tests like this are part of my [AI Search and Conversion Audit](/ai-search). The [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Stores:** 599 Shopify brand stores in six product areas, from my dataset of 620 Shopify brand stores, client stores excluded. 596 product pages were readable, and 191 had a product option with more than one value.
- **When:** November 17, 2026.
- **Pages:** the product page of the first available product in each store's public product feed.
- **How:** page source as first sent by the server. Buttons counted from radio inputs for product options or theme variant button elements. Dropdowns counted from option select elements when no buttons were present.
- **Limits:** one product per store, and pickers built by apps or JavaScript after load couldn't be classified.

No store or brand is named in this report.
