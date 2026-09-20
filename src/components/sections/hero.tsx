"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { WHATSAPP_MESSAGES } from "@/lib/site";
import { whatsappHref } from "@/lib/utils";
import type { Promotion, SiteSettings } from "@/types/database";

const ease = [0.22, 1, 0.36, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, delay, ease },
  }),
};

const HIGHLIGHTS = [
  "Free measurement visit",
  "Custom stitching",
  "Professional fitting",
] as const;

export function Hero({
  settings,
  promotion,
}: {
  settings: SiteSettings;
  promotion: Promotion | null;
}) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink">
      {/* Backdrop ------------------------------------------------------- */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease }}
      >
        <Image
          src="/images/hero.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/78 to-ink/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/55" />
      <div className="bg-weave absolute inset-0" />

      {/* Content -------------------------------------------------------- */}
      <div className="container-x relative z-10 pt-32 pb-24 sm:pt-36 lg:pt-40 lg:pb-28">
        <div className="max-w-2xl">
          <motion.p
            className="eyebrow flex items-center gap-3 text-gold"
            variants={rise}
            initial="hidden"
            animate="visible"
            custom={0.15}
          >
            <span className="h-px w-10 bg-gold/70" aria-hidden />
            {settings.location} · Curtains &amp; Blinds
          </motion.p>

          <motion.h1
            className="mt-7 font-display text-[2.6rem] leading-[1.05] font-light text-cream balance sm:text-[3.6rem] lg:text-[4.5rem]"
            variants={rise}
            initial="hidden"
            animate="visible"
            custom={0.28}
          >
            Transform Your Space With{" "}
            <span className="text-gilded italic">Elegant Curtains</span>
          </motion.h1>

          <motion.p
            className="mt-7 max-w-xl text-[15.5px] leading-[1.9] text-cream/65 sm:text-[17px]"
            variants={rise}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            Custom curtains and blinds designed, stitched and professionally fitted to suit your
            space and style.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            variants={rise}
            initial="hidden"
            animate="visible"
            custom={0.52}
          >
            <Button asChild variant="gold" size="lg">
              <a
                href={whatsappHref(settings.whatsapp, WHATSAPP_MESSAGES.measurement)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Get Free Measurement
              </a>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/curtains-blinds">
                Explore Our Curtains
                <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
              </Link>
            </Button>
          </motion.div>

          {promotion ? (
            <motion.div
              className="mt-12 inline-flex items-center gap-4 border border-gold/30 bg-ink/50 px-5 py-4 backdrop-blur-sm"
              variants={rise}
              initial="hidden"
              animate="visible"
              custom={0.66}
            >
              <span className="font-display text-[2.4rem] leading-none text-gilded">
                {promotion.discount}%
              </span>
              <span className="h-10 w-px bg-gold/25" aria-hidden />
              <span className="text-[12px] leading-relaxed tracking-[0.18em] text-cream/75 uppercase">
                Off
                <br />
                All Curtains
              </span>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Bottom rail ---------------------------------------------------- */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-cream/8 bg-ink/55 backdrop-blur-sm lg:block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.85, ease }}
      >
        <div className="container-x grid grid-cols-3 divide-x divide-cream/8">
          {HIGHLIGHTS.map((item) => (
            <p
              key={item}
              className="px-6 py-5 text-center text-[11.5px] tracking-[0.24em] text-cream/55 uppercase first:pl-0 last:pr-0"
            >
              {item}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
