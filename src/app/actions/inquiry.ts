"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { inquirySchema, type InquiryInput } from "@/lib/validations/inquiry";

export type InquiryResult =
  | { status: "success" }
  | { status: "unconfigured" }
  | { status: "error"; message: string }
  | { status: "invalid"; errors: Record<string, string> };

/**
 * Public inquiry submission. Inserts through the anon client, which RLS allows
 * for INSERT only — nothing here can read existing inquiries.
 */
export async function submitInquiry(input: InquiryInput): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(input);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return { status: "invalid", errors };
  }

  if (!isSupabaseConfigured()) {
    // The database is not wired up yet — the form falls back to WhatsApp.
    return { status: "unconfigured" };
  }

  const values = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.from("inquiries").insert({
    name: values.name,
    phone: values.phone,
    email: values.email ?? null,
    service: values.service,
    preferred_date: values.preferred_date ?? null,
    message: values.message ?? null,
  });

  if (error) {
    return {
      status: "error",
      message: "We could not send your request just now. Please try again or message us on WhatsApp.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");

  return { status: "success" };
}
