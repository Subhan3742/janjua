export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * The site is designed to render completely without a database so it can be
 * previewed and deployed before Supabase is wired up. Every data helper checks
 * this first and falls back to the static content in `lib/content.ts`.
 */
export function isSupabaseConfigured() {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}
