import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  GalleryImage,
  Inquiry,
  Promotion,
  Service,
  SiteSettings,
} from "@/types/database";
import { FALLBACK_SETTINGS } from "@/lib/content";

/** Every dashboard page starts here: no session, no page. */
export async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return { supabase, user };
}

export async function getAdminInquiries(): Promise<Inquiry[]> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminGallery(): Promise<GalleryImage[]> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminServices(): Promise<Service[]> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAdminPromotions(): Promise<Promotion[]> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("promotions")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminSettings(): Promise<SiteSettings> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? FALLBACK_SETTINGS;
}

export type DashboardStats = {
  totalInquiries: number;
  newInquiries: number;
  galleryImages: number;
  activeServices: number;
  activePromotion: Promotion | null;
  recentInquiries: Inquiry[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const { supabase } = await requireAdmin();

  const [total, fresh, gallery, services, promotion, recent] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("gallery").select("id", { count: "exact", head: true }),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  return {
    totalInquiries: total.count ?? 0,
    newInquiries: fresh.count ?? 0,
    galleryImages: gallery.count ?? 0,
    activeServices: services.count ?? 0,
    activePromotion: promotion.data ?? null,
    recentInquiries: recent.data ?? [],
  };
}
