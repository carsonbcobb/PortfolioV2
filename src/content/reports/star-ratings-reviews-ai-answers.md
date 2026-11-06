---
title: "Do Star Ratings Decide AI Recommendations? | Carson Cobb"
description: "96% of rated products on Google AI Mode's cards had 4.0 stars or more, but the top rated product came first only 5 times in 21."
slug: "/reports/star-ratings-reviews-ai-answers"
h1: "Do star ratings decide who AI recommends?"
datePublished: 2026-11-06
dateModified: 2026-11-06
reportStores: 94
faq:
  - question: "Does Google AI Mode show star ratings?"
    answer: "Yes. In November 2026, Google AI Mode showed product cards in 23 of 48 buyer questions I tested, and 71% of those cards showed a star rating. The median rating shown was 4.6."
  - question: "Do higher rated products get recommended first by AI?"
    answer: "Not in my data. In 21 AI Mode answers that showed at least two rated products, the first product was the highest rated only 5 times. Products below 4.0 stars were rare, 3 of 82 cards, so ratings worked more like a minimum bar than a ranking."
  - question: "Does AI get my product's star rating right?"
    answer: "Often not. When I asked ChatGPT, Gemini and Google AI Mode for the rating and review count of 24 Shopify products, all three were right for only 7 of 22 products. Common errors were store wide ratings used for one product and ratings Google holds that the product page doesn't show."
  - question: "Do reviews on my product page help with AI search?"
    answer: "Yes, in two ways. They're one of the places AI learns who your product suits, because customers describe their own situation in reviews, and a visible, consistent rating gives AI one number to quote. 67% of the 94 Shopify product pages I checked showed a review count."
---

**By Carson Cobb. Data collected November 2026.**

Ask a founder what gets a product recommended by AI and many will say reviews. It makes sense: AI tools show star ratings, and shoppers trust them. But is a higher rating what puts a product at the top of the answer?

I looked at it from three sides: the ratings Google AI Mode shows on its product cards, how often each AI talks about reviews in its answers, and whether AI gets a product's rating right when asked directly.

## The short version

- **AI Mode shows ratings on most product cards.** 23 of 48 answers had product cards, and 71% of the cards showed a star rating.
- **Almost every rated product was 4.0 or higher.** 79 of 82 rated cards. The median was 4.6. The lowest was 3.8.
- **But the highest rated product usually wasn't first.** In 21 answers with at least two rated products, the first one was the highest rated only 5 times.
- **Ratings work like a minimum bar, not a ranking.** Below 4.0 you're rarely shown. Above it, other things decide the order.
- **AI often gets ratings wrong.** Asked directly about 24 products, ChatGPT, Gemini and AI Mode all got the rating right for only 7 of 22.

## What AI Mode's product cards show

| | |
| --- | --- |
| Answers with product cards | 23 of 48 |
| Product cards | 115 |
| Cards showing a star rating | 82 (71%) |
| Median rating shown | 4.6 |
| Rated 4.5 or higher | 57 of 82 (70%) |
| Rated 4.0 to 4.4 | 22 of 82 (27%) |
| Rated below 4.0 | 3 of 82 (4%) |

Products under 4 stars almost never made it onto a card. That's the clearest signal in the data: a weak rating keeps a product out of the shortlist shoppers see.

## Higher rated doesn't mean first

| AI Mode answers with 2 or more rated product cards | 21 |
| --- | --- |
| First card was the highest rated | 5 |
| First card was not the highest rated | 16 |

If ratings decided the order, the first card would be the highest rated most of the time. It was the highest rated in fewer than a quarter of answers. Lower rated products regularly sat above higher rated ones.

What decides the order is everything else AI weighs: whether review sites and testing roundups recommend the product, whether Reddit and video reviews back it up, and whether the product information clearly matches what the shopper asked. See [where AI sends shoppers](/reports/where-ai-sends-shoppers-2026) and [the sources ChatGPT cites](/reports/sources-chatgpt-cites-2026).

## How often each AI talks about reviews

| AI | Answers that mention reviews or ratings |
| --- | --- |
| Google AI Mode | 26 of 48 |
| ChatGPT | 15 of 48 |
| Gemini | 10 of 48 |

AI Mode brought up reviews or ratings in more than half its answers, partly through its product cards. ChatGPT and Gemini mentioned them far less, and almost never quoted a star rating in the text. Two of 48 ChatGPT answers quoted one. Gemini quoted none.

That fits how each tool works. AI Mode draws on Google's shopping data, which carries ratings. ChatGPT and Gemini lean on what review sites, testers and editors say about a product. For them, reviews matter as a source of evidence more than as a number.

## When AI quotes your rating, it's often wrong

I asked all three AIs for the rating and review count of 24 Shopify products and checked the answers against each product page. Full results are in [what AI gets wrong about your products](/reports/what-ai-gets-wrong-about-products-2026).

| | ChatGPT | Gemini | Google AI Mode |
| --- | --- | --- | --- |
| Rating and review count right | 17 of 23 | 14 of 23 | 12 of 22 |
| Price right | 22 of 24 | 22 of 24 | 19 of 24 |

Ratings were wrong far more often than prices. The errors I saw most:

- **A store wide rating quoted as the product's rating.** The whole store's average and total review count, presented as if they belonged to one product.
- **A rating the product page doesn't show.** For one product with no rating on its page, AI Mode quoted a star rating with several hundred reviews, most likely from Google's own shopping data.
- **Two versions of the truth.** When a review app adds its own copy of the product data next to the theme's, the two often disagree on the review count, and AI picks one. Gemini got the rating right on only 2 of 8 such products. See [duplicate product data and AI visibility](/reports/duplicate-product-schema-ai-visibility).

## What Shopify stores show

Of the 94 Shopify product pages I checked, 67% showed a review count on the page. A third didn't, which leaves AI to find your rating somewhere else, or quote one you didn't choose.

## What to do with this

1. **Get every key product above 4.0, then keep it there.** Below 4.0, AI Mode rarely shows you. Above it, reviews alone won't move you up, but they keep you eligible.
2. **Ask for reviews that describe the buyer.** "I have sensitive skin and this didn't sting" helps AI match your product to the next shopper with sensitive skin. Prompt for it in your review request emails.
3. **Show one rating per product, on the product page.** Make sure the visible rating, the review count and your product's structured data all match, and that a store wide badge never sits where the product rating should.
4. **Remove duplicate product data from your review app or theme.** One product, one rating, one review count.
5. **Keep Google Merchant Center in line with your site.** AI Mode can show ratings and prices from Google's shopping data, not just your page.
6. **Earn the sources that decide the order.** Reviews get you on the shortlist. Review sites, testing roundups, Reddit and video reviews decide where you land on it.

Reviews, ratings and what AI says about your products are part of my [AI Search and Conversion Audit](/ai-search). The free [AI Visibility Check](/ai-visibility-check) is a quick first look.

## How this was done

- **Product cards:** recorded from Google AI Mode's answers to the 48 buyer questions in [Who ChatGPT recommends](/reports/who-chatgpt-recommends-2026), each asked in a new thread on November 5, 2026, signed in with no apps connected. A card counted as rated when it showed a star rating. Card prices and merchants were not analyzed, because they depend on the shopper's location.
- **Mentions of reviews:** answers that mentioned reviews, ratings or stars anywhere in the text. ChatGPT answers from November 4, 2026, Gemini and AI Mode from November 5, 2026, all in fresh sessions.
- **Rating accuracy:** from [what AI gets wrong about your products](/reports/what-ai-gets-wrong-about-products-2026), 24 products from 24 Shopify stores.
- **Store data:** one product page from each of the 94 US Shopify stores in my [AI Readiness Index](/reports/shopify-ai-readiness-index-2026), checked November 5, 2026 for a visible review count.
- **Limits:** product cards appeared in fewer than half the answers, so card figures come from 23 answers. Card order may reflect Google Shopping signals that aren't visible.

No store or brand is named in this report.
