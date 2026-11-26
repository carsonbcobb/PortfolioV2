// Client testimonials, shown by Testimonials.astro on the homepage, /results and /pricing. Empty on purpose:
// add only real, approved quotes. The component renders nothing while this list is empty.
//
// An entry with a full name (first and last) and a company also becomes a Review in the JSON-LD, tied to the
// ProfessionalService. Anonymous entries (no last name, or company "Founder, Shopify brand") show on the page
// but never become Review markup.

export interface Testimonial {
  quote: string;
  firstName: string;
  /** Leave empty when the client prefers to stay anonymous */
  lastName?: string;
  title?: string;
  /** The company name, or "Founder, Shopify brand" when the client prefers anonymity */
  company?: string;
  /** Optional link to the client's site or profile */
  link?: string;
}

export const TESTIMONIALS: Testimonial[] = [];

const ANONYMOUS_COMPANY = /^founder, shopify brand$/i;

/** True when an entry is named well enough to publish as a Review: a full name and a real company. */
export const isNamed = (t: Testimonial) =>
  Boolean(t.firstName?.trim() && t.lastName?.trim() && t.company?.trim() && !ANONYMOUS_COMPANY.test(t.company.trim()));

export const NAMED_TESTIMONIALS = TESTIMONIALS.filter(isNamed);
