import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { WHATSAPP_MESSAGES } from "@/lib/site";
import { formatPhone, telHref, whatsappHref } from "@/lib/utils";
import type { SiteSettings } from "@/types/database";

/** Closing conversion band used at the foot of most pages. */
export function CtaStrip({
  settings,
  title = "Ready to dress your windows?",
  description = "Send us a message and we will arrange a free measurement visit at a time that suits you.",
}: {
  settings: SiteSettings;
  title?: string;
  description?: string;
}) {
  return (
    <section className="border-y border-gold/15 bg-charcoal">
      <div className="container-x py-16 lg:py-20">
        <Reveal className="flex flex-col items-center gap-10 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-xl">
            <h2 className="font-display text-[2rem] leading-tight font-light text-cream balance sm:text-[2.6rem]">
              {title}
            </h2>
            <p className="mt-4 text-[15px] leading-[1.85] text-cream/55">{description}</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild variant="gold" size="lg">
              <a
                href={whatsappHref(settings.whatsapp, WHATSAPP_MESSAGES.measurement)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp Us
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={telHref(settings.phone)}>
                <Phone className="h-4 w-4" strokeWidth={1.4} />
                {formatPhone(settings.phone)}
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-cream hover:text-gold">
              <Link href="/contact">Contact Form</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
