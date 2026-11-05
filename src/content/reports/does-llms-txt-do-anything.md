---
title: "Does llms.txt Do Anything for Shopify Stores? 2026 Evidence"
description: "95% of Shopify stores publish an llms.txt file, mostly one Shopify wrote for them. What Google, OpenAI and crawler logs say it does, and what to do instead."
slug: "/reports/does-llms-txt-do-anything"
h1: "Does llms.txt do anything?"
datePublished: 2026-11-04
dateModified: 2026-11-04
reportStores: 94
faq:
  - question: "Does my Shopify store have an llms.txt file?"
    answer: "Almost certainly. In November 2026, 93 of 94 Shopify stores I checked returned an llms.txt file, and 89 of them were the default file Shopify started generating for stores in May 2026. Only 4 stores had written their own."
  - question: "Does llms.txt help you show up in ChatGPT or Google AI answers?"
    answer: "There is no public evidence that it does. Google's own AI optimization guide lists llms.txt as something you can skip, and no major AI company has said its search product reads the file. Crawler log studies show AI bots rarely request it."
  - question: "Should I delete or edit my llms.txt file?"
    answer: "There is no reason to delete it. If your theme lets you edit it, make sure the store description is accurate. Then spend your time on the things AI systems do read: your product pages, your structured data and the sources that mention you."
---

**By Carson Cobb. Data checked November 2026.**

llms.txt is a plain text file at the root of a website that summarizes the site for AI systems. A year ago it was a niche idea. Now almost every Shopify store has one, because Shopify started generating it automatically. So the useful question is no longer "should I add one." It's "does it change anything, and is there anything worth doing with it."

## The short version

- **95% of stores have one they didn't write.** 89 of 94 Shopify stores returned Shopify's default llms.txt. 4 had a custom file. 1 had none.
- **No major AI search product says it reads the file.** Google's AI optimization guide lists llms.txt as something you can skip. OpenAI's crawler documentation doesn't mention it.
- **AI crawlers rarely ask for it.** The one public log study found about 0.1% of AI bot visits requested llms.txt.
- **It's harmless, so leave it.** The default file is fine. The time you'd spend writing a better one is worth more on your product pages and structured data.

## What's in the file Shopify generates

Around May 2026, according to developer reports at the time, Shopify began serving an llms.txt file on storefronts by default. Opening it on a typical store shows a header that starts "Agent Instructions", a short description of the store, links to browse and search, basic store details like currency and contact information, and a block of links meant for shopping agents. Files run about 5,700 characters.

The 4 custom files in the sample were written by the brands themselves. They describe what the brand sells, list key product lines and link to important pages. One included a "last updated" timestamp, which suggests it is regenerated automatically.

| What I found | Stores | Share |
| --- | --- | --- |
| Shopify's default llms.txt | 89 | 95% |
| A custom llms.txt the brand wrote | 4 | 4% |
| No llms.txt | 1 | 1% |

## What the companies behind AI search have said

| Source | What they said | Status |
| --- | --- | --- |
| Google Search | Its AI optimization guide (May 2026) lists llms.txt among tactics you don't need for AI features in Search. | Not used for Search |
| Google, earlier statements | John Mueller compared llms.txt to the keywords meta tag and said no AI system was using it. Gary Illyes said Google doesn't support it and isn't planning to. | Not used |
| Google Chrome | Lighthouse added an experimental llms.txt check for "agentic browsing" in May 2026, describing it as an emerging convention. | Experimental, for browser agents only |
| OpenAI | Its crawler documentation explains how OAI-SearchBot decides what can appear in ChatGPT search, through robots.txt. It doesn't mention llms.txt. | No stated use |
| Shopify | Generates the file by default and points shopping agents to its agent and checkout endpoints. | Supported by the platform |

The honest reading: llms.txt is a convention a few tools support, not a ranking or recommendation signal for any major AI search product today. Chrome's experiment is the one to watch, because shopping agents that browse stores on a shopper's behalf are a real use case.

## What crawler logs show

The most cited log study (OtterlyAI, 2025) tracked more than 62,000 AI bot visits to one site over 90 days. Only 84 of them requested llms.txt, about 0.1%. An ordinary page on the same site got roughly three times as many AI bot visits as the file did. A separate study of about 300,000 domains (SE Ranking, 2025) found no relationship between having llms.txt and being cited by AI.

These are small, early studies, and I'll add my own server log data when I have enough of it. But nothing published so far shows the file being used at scale.

## What to do with this

1. **Leave the default file alone.** It does no harm, and if shopping agents start reading it, Shopify will keep it current.
2. **If you can edit it, check one thing.** Make sure the store description is accurate and describes what you sell in plain words. That's the part an AI system would quote.
3. **Don't pay anyone to "optimize" it.** If an audit leads with llms.txt, it's leading with the least important item.
4. **Put the time where AI actually looks.** Your product pages, your structured data and the outside sources that mention your brand. The [AI Readiness Index](/reports/shopify-ai-readiness-index-2026) shows where most stores fall short.

## How this was done

- **Stores:** 94 US Shopify stores across apparel, beauty and skincare, food and beverage, home, pet and supplements, 15 or 16 per category, drawn from the same dataset as my other reports.
- **Check:** I requested /llms.txt from each store in November 2026 and recorded whether it returned a real text file, its length and its opening line. Files starting with Shopify's "Agent Instructions" header were counted as the default.
- **Shopify rollout timing:** from developer coverage at the time (Weaverse and others, May 2026), which describes a quiet rollout without a formal announcement.
- **Statements:** taken from Google's Search Central guidance and Search Engine Land and Search Engine Journal coverage of Google staff comments, Chrome Lighthouse documentation, OpenAI's crawler documentation, and the OtterlyAI and SE Ranking studies as reported publicly.

No store is named in this report. Want to know what AI actually says about your brand? [Run the free AI Visibility Check](/ai-visibility-check).
