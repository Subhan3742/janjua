import { z } from "zod";
import { GALLERY_CATEGORIES, INQUIRY_STATUSES } from "@/lib/site";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const galleryItemSchema = z.object({
  title: z.string().trim().min(2, "Add a short title.").max(120),
  description: z.string().trim().max(500).optional(),
  category: z.enum(GALLERY_CATEGORIES),
  is_featured: z.boolean().default(false),
});
export type GalleryItemValues = z.infer<typeof galleryItemSchema>;

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Add a service title.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Add a slug.")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only."),
  description: z.string().trim().max(600).optional(),
  image_url: z.string().trim().max(500).optional(),
  category: z.string().trim().min(2).max(60),
  icon: z.string().trim().max(60).optional(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
});
export type ServiceValues = z.infer<typeof serviceSchema>;

export const promotionSchema = z.object({
  title: z.string().trim().min(2, "Add a promotion title.").max(120),
  description: z.string().trim().max(300).optional(),
  discount: z.coerce.number().int().min(0, "0 or more.").max(100, "100 or less."),
  cta_label: z.string().trim().min(2).max(60).default("Claim Your Offer"),
  is_active: z.boolean().default(false),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});
export type PromotionValues = z.infer<typeof promotionSchema>;

export const settingsSchema = z.object({
  business_name: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(25),
  whatsapp: z.string().trim().min(7).max(25),
  location: z.string().trim().min(2).max(120),
  email: z.union([z.literal(""), z.email("Enter a valid email.")]).optional(),
  instagram: z.union([z.literal(""), z.url("Enter a full URL.")]).optional(),
  facebook: z.union([z.literal(""), z.url("Enter a full URL.")]).optional(),
});
export type SettingsValues = z.infer<typeof settingsSchema>;

export const inquiryStatusSchema = z.enum(INQUIRY_STATUSES);
