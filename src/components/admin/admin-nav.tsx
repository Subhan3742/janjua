"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgePercent,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Tag,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", Icon: MessageSquare },
  { href: "/admin/gallery", label: "Gallery", Icon: Images },
  { href: "/admin/services", label: "Services", Icon: Tag },
  { href: "/admin/promotions", label: "Promotions", Icon: BadgePercent },
  { href: "/admin/settings", label: "Site Settings", Icon: Settings },
] as const;

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const nav = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
      {LINKS.map(({ href, label, Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 border-l-2 px-4 py-3 text-[13.5px] transition-colors duration-300",
              active
                ? "border-l-gold bg-gold/8 text-gold"
                : "border-l-transparent text-cream/55 hover:border-l-cream/20 hover:text-cream",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.3} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-cream/8 p-4">
      <p className="truncate text-[11px] tracking-[0.12em] text-cream/35 uppercase">{email}</p>
      <button
        type="button"
        onClick={signOut}
        className="mt-3 flex w-full items-center gap-2 border border-cream/12 px-3 py-2.5 text-[12px] tracking-[0.14em] text-cream/65 uppercase transition-colors hover:border-gold hover:text-gold"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.3} />
        Sign out
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-cream/8 bg-ink lg:flex">
        <div className="border-b border-cream/8 px-5 py-6">
          <Link href="/" className="block">
            <p className="font-display text-[19px] text-cream">
              Janjua <span className="text-gold">Curtain House</span>
            </p>
            <p className="mt-1 text-[9.5px] tracking-[0.3em] text-cream/35 uppercase">
              Admin Dashboard
            </p>
          </Link>
        </div>
        {nav}
        {footer}
      </aside>

      {/* Mobile bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-cream/8 bg-ink px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-display text-[17px] text-cream">
          Janjua <span className="text-gold">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center border border-cream/12 text-cream"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-5 w-5" strokeWidth={1.2} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.2} />
          )}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-x-0 top-[57px] bottom-0 z-30 flex flex-col bg-ink lg:hidden">
          {nav}
          {footer}
        </div>
      ) : null}
    </>
  );
}
