// Payment links for the "Continue to payment" button on /start.
//
// Paste each Stripe Payment Link over its placeholder value. A link that still starts with PAYMENT_LINK_
// is treated as missing, and the button falls back to an email to carson@carsoncobb.com instead.
//
// In Stripe, set each link's "After payment" redirect to:
//   Focus links:             https://www.carsoncobb.com/welcome?offer=focus
//   Full links:              https://www.carsoncobb.com/welcome?offer=full
//   Full Store Audit link:   https://www.carsoncobb.com/welcome?offer=full-store-audit

export const PAYMENT_LINKS = {
  // Close the Gap: Focus
  focus: 'https://buy.stripe.com/eVq5kC22C1jvaWH7iaawo0a', // $2,500/month, month to month

  // Close the Gap: Full
  full: 'https://buy.stripe.com/00waEWbDc6DP6Grbyqawo09', // $5,000/month, month to month

  // Full Store Audit
  fullStoreAudit: 'https://buy.stripe.com/6oU9AS6iS8LX6Gr5a2awo08', // $1,997 one time
} as const;

export type PaymentKey = keyof typeof PAYMENT_LINKS;

/** The real link, or a mailto that starts the offer by email while the link is still a placeholder. */
export function paymentHref(key: PaymentKey, offerName: string): string {
  const link = PAYMENT_LINKS[key].trim();
  if (/^https:\/\//.test(link)) return link;
  return `mailto:carson@carsoncobb.com?subject=${encodeURIComponent(`Start ${offerName}`)}`;
}
