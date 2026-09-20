"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  galleryItemSchema,
  inquiryStatusSchema,
  promotionSchema,
  serviceSchema,
  settingsSchema,
} from "@/lib/validations/admin";
import type { InquiryStatus } from "@/types/database";

export type ActionResult = { ok: true } | { ok: false; message: string };

const GENERIC_ERROR = "Something went wrong. Please try again.";

/**
 * Every mutation goes through the cookie-bound server client, so Postgres RLS
 * — not this file — is the thing that actually enforces admin access.
 */
async function getAuthedClient() {
  if (!isSupabaseConfigured()) {
    return { client: null, error: "Supabase is not configured." as const };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { client: null, error: "You are not signed in." as const };
  return { client: supabase, error: null };
}

function refreshPublic(paths: string[] = []) {
  for (const path of ["/admin", ...paths]) revalidatePath(path);
}

/* ------------------------------------------------------------- inquiries */

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<ActionResult> {
  const parsed = inquiryStatusSchema.safeParse(status);
  if (!parsed.success) return { ok: false, message: "Unknown status." };

  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  const { error: dbError } = await client
    .from("inquiries")
    .update({ status: parsed.data })
    .eq("id", id);

  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/inquiries"]);
  return { ok: true };
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  const { error: dbError } = await client.from("inquiries").delete().eq("id", id);
  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/inquiries"]);
  return { ok: true };
}

/* --------------------------------------------------------------- gallery */

export async function createGalleryItem(input: {
  title: string;
  description?: string;
  category: string;
  is_featured: boolean;
  image_url: string;
  storage_path: string;
}): Promise<ActionResult> {
  const parsed = galleryItemSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? GENERIC_ERROR };
  }

  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  const { error: dbError } = await client.from("gallery").insert({
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    category: parsed.data.category,
    is_featured: parsed.data.is_featured,
    image_url: input.image_url,
    storage_path: input.storage_path,
  });

  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/gallery", "/gallery", "/"]);
  return { ok: true };
}

export async function toggleGalleryFeatured(
  id: string,
  isFeatured: boolean,
): Promise<ActionResult> {
  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  const { error: dbError } = await client
    .from("gallery")
    .update({ is_featured: isFeatured })
    .eq("id", id);

  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/gallery", "/gallery", "/"]);
  return { ok: true };
}

/** Removes the row and the underlying object so storage does not leak files. */
export async function deleteGalleryItem(
  id: string,
  storagePath: string | null,
): Promise<ActionResult> {
  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  if (storagePath) {
    await client.storage.from("gallery").remove([storagePath]);
  }

  const { error: dbError } = await client.from("gallery").delete().eq("id", id);
  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/gallery", "/gallery", "/"]);
  return { ok: true };
}

/* -------------------------------------------------------------- services */

export async function saveService(
  id: string | null,
  input: unknown,
): Promise<ActionResult> {
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? GENERIC_ERROR };
  }

  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description ?? null,
    image_url: parsed.data.image_url || null,
    category: parsed.data.category,
    icon: parsed.data.icon || null,
    is_active: parsed.data.is_active,
    sort_order: parsed.data.sort_order,
  };

  const { error: dbError } = id
    ? await client.from("services").update(payload).eq("id", id)
    : await client.from("services").insert(payload);

  if (dbError) {
    return {
      ok: false,
      message: dbError.code === "23505" ? "That slug is already in use." : GENERIC_ERROR,
    };
  }

  refreshPublic(["/admin/services", "/services", "/"]);
  return { ok: true };
}

export async function toggleServiceActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  const { error: dbError } = await client
    .from("services")
    .update({ is_active: isActive })
    .eq("id", id);

  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/services", "/services", "/"]);
  return { ok: true };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  const { error: dbError } = await client.from("services").delete().eq("id", id);
  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/services", "/services", "/"]);
  return { ok: true };
}

/* ------------------------------------------------------------ promotions */

export async function savePromotion(
  id: string | null,
  input: unknown,
): Promise<ActionResult> {
  const parsed = promotionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? GENERIC_ERROR };
  }

  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  const payload = {
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    discount: parsed.data.discount,
    cta_label: parsed.data.cta_label,
    is_active: parsed.data.is_active,
    start_date: parsed.data.start_date || null,
    end_date: parsed.data.end_date || null,
  };

  // Only one promotion should ever be live on the site at a time.
  if (payload.is_active) {
    await client.from("promotions").update({ is_active: false }).eq("is_active", true);
  }

  const { error: dbError } = id
    ? await client.from("promotions").update(payload).eq("id", id)
    : await client.from("promotions").insert(payload);

  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/promotions", "/", "/curtains-blinds"]);
  return { ok: true };
}

export async function togglePromotionActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  if (isActive) {
    await client.from("promotions").update({ is_active: false }).eq("is_active", true);
  }

  const { error: dbError } = await client
    .from("promotions")
    .update({ is_active: isActive })
    .eq("id", id);

  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/promotions", "/", "/curtains-blinds"]);
  return { ok: true };
}

export async function deletePromotion(id: string): Promise<ActionResult> {
  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  const { error: dbError } = await client.from("promotions").delete().eq("id", id);
  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/promotions", "/", "/curtains-blinds"]);
  return { ok: true };
}

/* --------------------------------------------------------------- settings */

export async function saveSettings(input: unknown): Promise<ActionResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? GENERIC_ERROR };
  }

  const { client, error } = await getAuthedClient();
  if (!client) return { ok: false, message: error };

  const { error: dbError } = await client.from("site_settings").upsert({
    id: 1,
    business_name: parsed.data.business_name,
    tagline: parsed.data.tagline,
    phone: parsed.data.phone,
    whatsapp: parsed.data.whatsapp,
    location: parsed.data.location,
    email: parsed.data.email || null,
    instagram: parsed.data.instagram || null,
    facebook: parsed.data.facebook || null,
  });

  if (dbError) return { ok: false, message: GENERIC_ERROR };

  refreshPublic(["/admin/settings", "/", "/contact"]);
  return { ok: true };
}
