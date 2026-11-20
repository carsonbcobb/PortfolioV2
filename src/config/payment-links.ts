// Payment links for the "Continue to payment" button on /start.
//
// Paste each Stripe Payment Link over its placeholder value. A link that still starts with PAYMENT_LINK_
// is treated as missing, and the button falls back to an email to carson@carsoncobb.com instead.
//
// In Stripe, set each link's "After payment" redirect to:
//   Close the Gap links:     https://www.carsoncobb.com/welcome
//   Full Store Audit link:   https://www.carsoncobb.com/welcome?offer=full-store-audit

export const PAYMENT_LINKS = {
  // Close the Gap: Focus
  focus3mo: 'PAYMENT_LINK_FOCUS_3MO', // $2,500/month, 3 month commitment
  focusUpfront: 'PAYMENT_LINK_FOCUS_UPFRONT', // $7,000 paid upfront for 3 months
  focusFlexible: 'PAYMENT_LINK_FOCUS_FLEXIBLE', // $3,000/month, no commitment

  // Close the Gap: Full
  full3mo: 'PAYMENT_LINK_FULL_3MO', // $5,000/month, 3 month commitment
  fullUpfront: 'PAYMENT_LINK_FULL_UPFRONT', // $13,500 paid upfront for 3 months
  fullFlexible: 'PAYMENT_LINK_FULL_FLEXIBLE', // $6,000/month, no commitment

  // Full Store Audit
  fullStoreAudit: 'PAYMENT_LINK_FULL_STORE_AUDIT', // $1,997 one time
} as const;

export type PaymentKey = keyof typeof PAYMENT_LINKS;

/** The real link, or a mailto that starts the offer by email while the link is still a placeholder. */
export function paymentHref(key: PaymentKey, offerName: string): string {
  const link = PAYMENT_LINKS[key].trim();
  if (/^https:\/\//.test(link)) return link;
  return `mailto:carson@carsoncobb.com?subject=${encodeURIComponent(`Start ${offerName}`)}`;
}
