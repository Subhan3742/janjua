"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { NAV_LINKS, WHATSAPP_MESSAGES } from "@/lib/site";
import { cn, formatPhone, telHref, whatsappHref } from "@/lib/utils";
import type { SiteSettings } from "@/types/database";

export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/";
  /** Only the home hero sits under a transparent bar. */
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          transparent
            ? "bg-transparent py-4"
            : "border-b border-gold/12 bg-ink/95 py-2 backdrop-blur-xl",
        )}
      >
        <div className="container-x flex h-[60px] items-center justify-between gap-6">
          <Logo businessName={settings.business_name} />

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Main">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1 text-[11.5px] font-medium tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-300 xl:text-[12px] xl:tracking-[0.18em]",
                    active ? "text-gold" : "text-cream/70 hover:text-cream",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      active ? "w-full" : "w-0",
                    )}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={telHref(settings.phone)}
              className="hidden items-center gap-2 whitespace-nowrap text-[12.5px] tracking-[0.06em] text-cream/75 transition-colors hover:text-gold xl:flex"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={1.3} />
              {formatPhone(settings.phone)}
            </a>

            <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
              <a
                href={whatsappHref(settings.whatsapp, WHATSAPP_MESSAGES.measurement)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Free Measurement
              </a>
            </Button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center border border-cream/15 text-cream transition-colors hover:border-gold hover:text-gold lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" strokeWidth={1.2} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] bg-ink lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-weave flex h-dvh flex-col">
              <div className="container-x flex h-[76px] shrink-0 items-center justify-between">
                <Logo businessName={settings.business_name} onClick={() => setOpen(false)} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-11 w-11 place-items-center border border-cream/15 text-cream transition-colors hover:border-gold hover:text-gold"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" strokeWidth={1.2} />
                </button>
              </div>

              <nav
                className="container-x flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-6"
                aria-label="Mobile"
              >
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.06 + index * 0.05,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 border-b border-cream/8 py-4 font-display text-3xl font-light text-cream transition-colors hover:text-gold"
                    >
                      <span className="text-[11px] tracking-[0.2em] text-gold/60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="container-x shrink-0 space-y-3 border-t border-cream/8 py-6">
                <Button asChild variant="gold" size="lg" className="w-full">
                  <a
                    href={whatsappHref(settings.whatsapp, WHATSAPP_MESSAGES.measurement)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Get Free Measurement
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href={telHref(settings.phone)}>
                    <Phone className="h-4 w-4" strokeWidth={1.3} />
                    {formatPhone(settings.phone)}
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
