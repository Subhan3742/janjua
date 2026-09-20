import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Cookie-free anon client for reading public content. Because it does not
 * touch request cookies, pages that use it can still be statically rendered
 * and revalidated on a timer.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
