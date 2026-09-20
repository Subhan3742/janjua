import type { GalleryImage, Promotion, Service, SiteSettings } from "@/types/database";
import { siteConfig } from "@/lib/site";

/**
 * Editorial copy and fallback records.
 * These are used verbatim until the admin populates Supabase, so the site is
 * never empty. Every claim here comes from material supplied by the owner.
 */

export const FEATURES = [
  {
    icon: "Ruler",
    title: "Perfect Measurement",
    description: "Free visit & guide.",
  },
  {
    icon: "Wrench",
    title: "Complete Fitting Service",
    description: "Professional team.",
  },
  {
    icon: "Layers",
    title: "Premium Quality Fabrics",
    description: "Long lasting.",
  },
  {
    icon: "Blinds",
    title: "All Types of Curtains & Blinds",
    description: "Home & office.",
  },
] as const;

export const WHY_CHOOSE_US = [
  {
    icon: "PenTool",
    title: "Custom Designs",
    description: "Designed around your space and style.",
  },
  {
    icon: "Sparkles",
    title: "Premium Fabrics",
    description: "Quality materials selected for comfort and durability.",
  },
  {
    icon: "Hammer",
    title: "Professional Fitting",
    description: "Expert installation for a clean finished look.",
  },
  {
    icon: "PackageCheck",
    title: "Complete Service",
    description: "Measurement, stitching and fitting under one roof.",
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Free Measurement",
    description: "We visit your home or office, measure every window and advise on what suits it.",
  },
  {
    number: "02",
    title: "Fabric & Style Selection",
    description: "Choose fabric, colour, lining and heading style with guidance from our team.",
  },
  {
    number: "03",
    title: "Custom Stitching",
    description: "Your panels are cut and stitched to the exact measurements of your windows.",
  },
  {
    number: "04",
    title: "Professional Fitting",
    description: "Rails, rods and brackets installed straight, level and secure.",
  },
  {
    number: "05",
    title: "Final Installation",
    description: "Panels hung, pleats dressed and the space left clean and finished.",
  },
] as const;

export const COLLECTIONS = [
  {
    group: "Curtains",
    items: [
      {
        slug: "blackout-curtains",
        title: "Blackout Curtains",
        description: "Dense, light-blocking panels for bedrooms and media rooms where darkness and privacy matter.",
        image: "/images/collections/blackout.svg",
      },
      {
        slug: "sheer-curtains",
        title: "Sheer Curtains",
        description: "Light, airy voiles that soften daylight while keeping the room bright and open.",
        image: "/images/collections/sheer.svg",
      },
      {
        slug: "custom-curtains",
        title: "Custom Curtains",
        description: "Made to your measurements, your fabric and your preferred heading style.",
        image: "/images/collections/custom.svg",
      },
      {
        slug: "modern-curtains",
        title: "Modern Curtains",
        description: "Clean lines, contemporary fabrics and understated detailing for modern interiors.",
        image: "/images/collections/modern.svg",
      },
      {
        slug: "luxury-curtains",
        title: "Luxury Curtains",
        description: "Heavier fabrics, layered treatments and refined finishing for a formal, elegant look.",
        image: "/images/collections/luxury.svg",
      },
    ],
  },
  {
    group: "Blinds",
    items: [
      {
        slug: "office-blinds",
        title: "Office Blinds",
        description: "Practical roller and vertical blinds that control glare across large office windows.",
        image: "/images/collections/office-blinds.svg",
      },
      {
        slug: "home-blinds",
        title: "Home Blinds",
        description: "Neat, easy-to-operate blinds for kitchens, bathrooms and compact windows.",
        image: "/images/collections/home-blinds.svg",
      },
      {
        slug: "modern-blinds",
        title: "Modern Blinds",
        description: "Minimal profiles and clean fabrics for a tailored, contemporary window.",
        image: "/images/collections/modern-blinds.svg",
      },
    ],
  },
] as const;

export const ABOUT_POINTS = [
  "Measurement",
  "Fabric selection",
  "Custom stitching",
  "Professional fitting",
  "Curtains",
  "Blinds",
  "Blackout curtains",
  "Home & office solutions",
] as const;

/** Used when Supabase has no rows yet (or is not configured). */
export const FALLBACK_SERVICES: Service[] = [
  {
    id: "custom-curtains",
    title: "Custom Curtains",
    slug: "custom-curtains",
    description:
      "Curtains designed around your windows, your interior and your fabric preference — measured, stitched and fitted to your space.",
    image_url: "/images/services/custom-curtains.svg",
    category: "Curtains",
    icon: "Scissors",
    is_active: true,
    sort_order: 1,
    created_at: "",
  },
  {
    id: "blackout-curtains",
    title: "Blackout Curtains",
    slug: "blackout-curtains",
    description:
      "Light-blocking blackout curtains for bedrooms, living rooms and offices where privacy and darkness matter.",
    image_url: "/images/services/blackout-curtains.svg",
    category: "Curtains",
    icon: "MoonStar",
    is_active: true,
    sort_order: 2,
    created_at: "",
  },
  {
    id: "curtain-stitching",
    title: "Curtain Stitching",
    slug: "curtain-stitching",
    description:
      "Precise in-house stitching with clean pleats, even hems and neat finishing on every panel we make.",
    image_url: "/images/services/curtain-stitching.svg",
    category: "Curtains",
    icon: "Ruler",
    is_active: true,
    sort_order: 3,
    created_at: "",
  },
  {
    id: "professional-fitting",
    title: "Professional Curtain Fitting",
    slug: "professional-fitting",
    description:
      "Rails, rods, brackets and panels installed by our team for a straight, clean and properly hanging finish.",
    image_url: "/images/services/professional-fitting.svg",
    category: "Fitting",
    icon: "Wrench",
    is_active: true,
    sort_order: 4,
    created_at: "",
  },
  {
    id: "curtain-measurement",
    title: "Curtain Measurement",
    slug: "curtain-measurement",
    description:
      "Free visit and guidance. We measure your windows accurately and advise on style, length and fullness.",
    image_url: "/images/services/curtain-measurement.svg",
    category: "Fitting",
    icon: "Ruler",
    is_active: true,
    sort_order: 5,
    created_at: "",
  },
  {
    id: "blinds",
    title: "Blinds",
    slug: "blinds",
    description:
      "Roller, roman and modern blinds for homes and offices — measured and installed to fit the opening exactly.",
    image_url: "/images/services/blinds.svg",
    category: "Blinds",
    icon: "Blinds",
    is_active: true,
    sort_order: 6,
    created_at: "",
  },
  {
    id: "home-curtain-solutions",
    title: "Home Curtain Solutions",
    slug: "home-curtain-solutions",
    description:
      "Complete curtain solutions for villas and apartments — living rooms, bedrooms, majlis and kitchens.",
    image_url: "/images/services/home-curtain-solutions.svg",
    category: "Home",
    icon: "Home",
    is_active: true,
    sort_order: 7,
    created_at: "",
  },
  {
    id: "office-curtain-solutions",
    title: "Office Curtain Solutions",
    slug: "office-curtain-solutions",
    description:
      "Practical, professional window treatments for offices, clinics, salons and commercial spaces.",
    image_url: "/images/services/office-curtain-solutions.svg",
    category: "Office",
    icon: "Building2",
    is_active: true,
    sort_order: 8,
    created_at: "",
  },
];

export const FALLBACK_PROMOTION: Promotion = {
  id: "default-promotion",
  title: "20% OFF All Curtains",
  description: "Upgrade Your Home With Style & Comfort",
  discount: 20,
  cta_label: "Claim Your Offer",
  is_active: true,
  start_date: null,
  end_date: null,
  created_at: "",
};

export const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  business_name: siteConfig.name,
  tagline: siteConfig.tagline,
  phone: siteConfig.phone,
  whatsapp: siteConfig.whatsapp,
  location: siteConfig.location,
  email: null,
  instagram: null,
  facebook: null,
  updated_at: "",
};

/**
 * Placeholder gallery entries shown before the owner uploads real photography
 * through the admin dashboard. Replace the files in /public/images/gallery.
 */
export const FALLBACK_GALLERY: GalleryImage[] = [
  ["Floor-to-ceiling living room drapes", "Curtains", true],
  ["Blackout panels for a master bedroom", "Blackout", true],
  ["Roller blinds in a home office", "Blinds", false],
  ["Rail installation and dressing", "Installation", false],
  ["Layered sheers over blackout lining", "Curtains", true],
  ["Villa majlis curtain treatment", "Home", false],
  ["Meeting room window treatment", "Office", false],
  ["Pleat detail and hem finishing", "Curtains", false],
  ["Bracket fitting above a wide window", "Installation", false],
].map(([title, category, featured], index) => ({
  id: `placeholder-${index + 1}`,
  title: title as string,
  description: null,
  category: category as string,
  image_url: `/images/gallery/${String(index + 1).padStart(2, "0")}.svg`,
  storage_path: null,
  is_featured: featured as boolean,
  sort_order: index,
  created_at: "",
}));
