/**
 * Static brand facts supplied by the business owner.
 * Anything the admin can change at runtime lives in Supabase (`site_settings`)
 * and falls back to these values when the database is unreachable.
 */
export const siteConfig = {
  name: "Janjua Curtain House",
  shortName: "Janjua",
  tagline: "Style | Comfort | Elegance",
  phone: "+971547400549",
  whatsapp: "+971547400549",
  location: "UAE",
  description:
    "Janjua Curtain House provides custom curtains, blackout curtains, blinds, professional measurement, stitching and fitting services in UAE.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://janjuacurtainhouse.com",
} as const;

export const WHATSAPP_MESSAGES = {
  measurement:
    "Hello Janjua Curtain House, I would like to get a free measurement for curtains/blinds.",
  consultation:
    "Hello Janjua Curtain House, I would like to request a consultation for my space.",
  price: (item: string) =>
    `Hello Janjua Curtain House, I would like to request a price for ${item}.`,
  offer: (discount: number) =>
    `Hello Janjua Curtain House, I would like to claim the ${discount}% OFF offer on curtains.`,
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Curtains & Blinds", href: "/curtains-blinds" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const SERVICE_OPTIONS = [
  "Curtains",
  "Blackout Curtains",
  "Blinds",
  "Curtain Stitching",
  "Professional Fitting",
  "General Inquiry",
] as const;

export const GALLERY_CATEGORIES = [
  "Curtains",
  "Blackout",
  "Blinds",
  "Installation",
  "Home",
  "Office",
] as const;

export const INQUIRY_STATUSES = [
  "new",
  "contacted",
  "completed",
  "cancelled",
] as const;
