import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { Ornament } from "@/components/ui/ornament";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Admin Sign In" };

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="bg-weave flex min-h-dvh items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="font-display text-[26px] text-cream">
            Janjua <span className="text-gold">Curtain House</span>
          </Link>
          <p className="mt-2 text-[10px] tracking-[0.34em] text-cream/40 uppercase">
            Admin Dashboard
          </p>
          <Ornament className="mt-7" tone="dark" />
        </div>

        <div className="mt-10 border border-cream/10 bg-charcoal/70 p-7 sm:p-9">
          {configured ? (
            <Suspense
              fallback={<p className="text-[13.5px] text-cream/45">Loading sign-in…</p>}
            >
              <LoginForm />
            </Suspense>
          ) : (
            <div className="space-y-4 text-[14px] leading-[1.8] text-cream/60">
              <h1 className="font-display text-2xl font-light text-cream">
                Supabase is not connected
              </h1>
              <p>
                Add <code className="text-gold">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="text-gold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your
                environment, run <code className="text-gold">supabase/schema.sql</code>, then
                create an admin user from the Supabase dashboard.
              </p>
              <p className="text-cream/40">
                Until then the public site runs on its built-in fallback content.
              </p>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-[12.5px] text-cream/35">
          <Link href="/" className="transition-colors hover:text-gold">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
