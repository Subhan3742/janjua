"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { WHATSAPP_MESSAGES } from "@/lib/site";
import { telHref, whatsappHref } from "@/lib/utils";
import type { SiteSettings } from "@/types/database";

/**
 * Persistent conversion rail: WhatsApp on every breakpoint, plus a call
 * button on mobile where tapping to dial is the natural action.
 *
 * Visible from the first paint — including over the hero — so the quickest
 * route to a conversation is never more than one tap away. It only waits long
 * enough for the hero's own entrance to settle before easing in.
 */
export function FloatingActions({ settings }: { settings: SiteSettings }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed right-4 bottom-4 z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6"
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        delay: reduceMotion ? 0 : 1.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <a
        href={telHref(settings.phone)}
        aria-label="Call Janjua Curtain House"
        className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-ink/92 text-gold shadow-[0_12px_30px_-12px_rgba(8,8,8,0.8)] backdrop-blur transition-colors hover:bg-gold hover:text-ink sm:hidden"
      >
        <Phone className="h-5 w-5" strokeWidth={1.4} />
      </a>

      <a
        href={whatsappHref(settings.whatsapp, WHATSAPP_MESSAGES.measurement)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group flex h-14 items-center gap-3 rounded-full bg-[#1faa59] px-4 text-white shadow-[0_16px_38px_-14px_rgba(31,170,89,0.9)] transition-all duration-300 hover:bg-[#189a4f] sm:px-5"
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
        <span className="hidden text-[12px] font-medium tracking-[0.14em] uppercase sm:inline">
          WhatsApp
        </span>
      </a>
    </motion.div>
  );
}
