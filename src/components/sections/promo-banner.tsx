import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/ui/ornament";
import { Reveal } from "@/components/ui/reveal";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { WHATSAPP_MESSAGES } from "@/lib/site";
import { whatsappHref } from "@/lib/utils";
import type { Promotion } from "@/types/database";

/** Renders nothing when the admin deactivates every promotion. */
export function PromoBanner({
  promotion,
  whatsapp,
}: {
  promotion: Promotion | null;
  whatsapp: string;
}) {
  if (!promotion) return null;

  return (
    <section className="relative overflow-hidden bg-ink">
      <Image
        src="/images/promo.svg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink/90" />
      <div className="bg-weave absolute inset-0" />

      <div className="container-x relative py-20 text-center lg:py-24">
        <Reveal>
          <p className="eyebrow text-gold-light">Limited Time Offer</p>

          <h2 className="mt-6 font-display text-[2.6rem] leading-[1.05] font-light text-cream balance sm:text-[3.6rem] lg:text-[4.2rem]">
            <span className="text-gilded">{promotion.discount}% OFF</span>{" "}
            {promotion.title.replace(/^\s*\d+%\s*off\s*/i, "") || "All Curtains"}
          </h2>

          <Ornament className="mt-8" tone="dark" />

          {promotion.description ? (
            <p className="mx-auto mt-8 max-w-xl text-[15.5px] leading-[1.9] text-cream/65">
              {promotion.description}
            </p>
          ) : null}

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Button asChild variant="gold" size="lg">
              <a
                href={whatsappHref(whatsapp, WHATSAPP_MESSAGES.offer(promotion.discount))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {promotion.cta_label}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href={whatsappHref(whatsapp, WHATSAPP_MESSAGES.measurement)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Free Measurement
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
