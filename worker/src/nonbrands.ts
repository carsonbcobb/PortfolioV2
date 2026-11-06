/**
 * Names that are never a competing product brand: retailers, marketplaces, publishers, media and
 * review sites. They sell or review other brands' products, so they never appear as "named X instead".
 * Retailers that mostly sell their own label (Pottery Barn, IKEA) are real competitors and are not listed.
 * Matched on letters and digits only, so "Good Housekeeping", "goodhousekeeping.com" and
 * "GoodHousekeeping" are the same entry.
 */
const DENY = [
  // Retailers and marketplaces
  "amazon", "walmart", "target", "costco", "sams club", "ebay", "etsy", "sephora", "ulta", "ulta beauty", "best buy",
  "home depot", "lowes", "chewy", "petco", "petsmart", "iherb", "vitacost", "cvs", "walgreens", "rite aid", "kohls",
  "macys", "nordstrom", "nordstrom rack", "bloomingdales", "saks", "neiman marcus", "wayfair", "overstock", "rei",
  "dicks sporting goods", "zappos", "thrive market", "whole foods", "trader joes", "kroger", "aldi", "bed bath and beyond", "asos", "zalando", "revolve", "ssense", "farfetch", "net a porter", "mr porter", "shein", "temu",
  "aliexpress", "alibaba", "wish", "poshmark", "depop", "grailed", "stockx", "goat", "faire", "jcpenney", "tj maxx",
  "marshalls", "ross", "burlington", "dillards", "belk", "qvc", "hsn", "boots", "superdrug", "dermstore",
  "lookfantastic", "cult beauty", "credo beauty", "the detox market", "bluemercury", "gnc", "vitamin shoppe",
  "the vitamin shoppe", "holland and barrett", "bodybuilding com", "rakuten", "newegg", "b and h", "staples",
  "office depot", "michaels", "joann", "hobby lobby", "tractor supply", "academy sports", "bass pro shops", "cabelas",
  "backcountry", "moosejaw", "evo", "zulily", "google shopping", "shopify",
  // Publishers, media and review sites
  "good housekeeping", "wirecutter", "new york times", "nytimes", "the new york times", "consumer reports", "cnet",
  "the verge", "verge", "wired", "engadget", "techradar", "toms guide", "tomsguide", "pcmag", "rtings", "the strategist",
  "new york magazine", "nymag", "buzzfeed", "business insider", "insider", "insider reviews", "forbes",
  "forbes vetted", "cnn underscored", "nbc news select", "nbc select", "usa today", "reviewed", "the spruce",
  "the spruce eats", "the spruce pets", "allure", "byrdie", "vogue", "elle", "harpers bazaar", "glamour",
  "cosmopolitan", "marie claire", "instyle", "real simple", "better homes and gardens", "apartment therapy",
  "food and wine", "bon appetit", "serious eats", "epicurious", "runners world", "mens health", "womens health",
  "gq", "esquire", "outside", "outdoor gear lab", "outdoorgearlab", "gear patrol", "healthline", "verywell",
  "verywell health", "verywell fit", "webmd", "mayo clinic", "people", "the guardian", "guardian", "bbc",
  "the independent", "the telegraph", "today", "today show", "oprah daily", "popsugar", "refinery29",
  "the cut", "travel and leisure", "conde nast traveler", "lifehacker", "mashable", "zdnet", "trustpilot",
  "reddit", "quora", "youtube", "tiktok", "instagram", "pinterest", "facebook", "wikipedia", "google", "yelp",
  "labdoor", "examine", "clean label project", "ewg",
].map((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ""));

const DENIED = new Set(DENY);

const key = (s: string) =>
  s
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/\.(com|co|net|org|co\.uk|com\.au)$/, "")
    .replace(/[^a-z0-9]+/g, "");

/** True for a retailer, marketplace, publisher or review site on the deny list. */
export function isNonBrand(name: string): boolean {
  const k = key(name);
  if (!k) return true;
  return DENIED.has(k) || DENIED.has(name.toLowerCase().replace(/[^a-z0-9]+/g, ""));
}
