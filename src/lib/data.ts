import {
  FALLBACK_GALLERY,
  FALLBACK_PROMOTION,
  FALLBACK_SERVICES,
  FALLBACK_SETTINGS,
} from "@/lib/content";
import { createPublicClient } from "@/lib/supabase/public";
import type { GalleryImage, Promotion, Service, SiteSettings } from "@/types/database";

/**
 * Public read helpers. Each one degrades to the static content in
 * `lib/content.ts` when Supabase is unconfigured, unreachable or empty, so the
 * site always renders something real.
 */

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createPublicClient();
  if (!supabase) return FALLBACK_SETTINGS;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return FALLBACK_SETTINGS;
  return data;
}

export async function getActivePromotion(): Promise<Promotion | null> {
  const supabase = createPublicClient();
  if (!supabase) return FALLBACK_PROMOTION;

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) return FALLBACK_PROMOTION;
  if (!data || data.length === 0) return null;

  const live = data.find(
    (promo) =>
      (!promo.start_date || promo.start_date <= today) &&
      (!promo.end_date || promo.end_date >= today),
  );

  return live ?? null;
}

export async function getServices(): Promise<Service[]> {
  const supabase = createPublicClient();
  if (!supabase) return FALLBACK_SERVICES;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return FALLBACK_SERVICES;

  // Services seeded without artwork still need an image in the grid.
  return data.map((service) => ({
    ...service,
    image_url:
      service.image_url ??
      FALLBACK_SERVICES.find((item) => item.slug === service.slug)?.image_url ??
      "/images/services/custom-curtains.svg",
  }));
}

export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  const supabase = createPublicClient();

  if (!supabase) {
    return category && category !== "All"
      ? FALLBACK_GALLERY.filter((image) => image.category === category)
      : FALLBACK_GALLERY;
  }

  let query = supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return category && category !== "All"
      ? FALLBACK_GALLERY.filter((image) => image.category === category)
      : FALLBACK_GALLERY;
  }

  return data;
}

export async function getFeaturedGallery(limit = 6): Promise<GalleryImage[]> {
  const images = await getGalleryImages();
  const featured = images.filter((image) => image.is_featured);
  return (featured.length > 0 ? featured : images).slice(0, limit);
}
