import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/page-hero";
import { CtaStrip } from "@/components/sections/cta-strip";
import { PromoBanner } from "@/components/sections/promo-banner";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { COLLECTIONS } from "@/lib/content";
import { getActivePromotion, getSiteSettings } from "@/lib/data";
import { WHATSAPP_MESSAGES } from "@/lib/site";
import { whatsappHref } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Curtains & Blinds",
  description:
    "Blackout, sheer, custom, modern and luxury curtains plus office, home and modern blinds — measured and fitted across UAE.",
  alternates: { canonical: "/curtains-blinds" },
};

export default async function CurtainsBlindsPage() {
  const [settings, promotion] = await Promise.all([getSiteSettings(), getActivePromotion()]);

  return (
    <>
      <PageHero
        eyebrow="Curtains & Blinds"
        title={
          <>
            Fabrics, styles and <span className="text-gilded italic">finishes</span>
          </>
        }
        description="Every option below is made to measure. Message us for pricing on your specific window sizes."
        image="/images/collections/luxury.svg"
      />

      {COLLECTIONS.map((collection, groupIndex) => (
        <section
          key={collection.group}
          className={groupIndex % 2 === 0 ? "bg-cream" : "bg-cream-dark/45"}
        >
          <div className="container-x py-20 lg:py-24">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow={`0${groupIndex + 1} — Collection`}
                title={collection.group}
              />
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {collection.items.map((item, index) => (
                <Reveal key={item.slug} delay={(index % 3) * 0.08} className="h-full">
                  <article className="group flex h-full flex-col border border-ink/10 bg-cream transition-colors duration-500 hover:border-gold/45">
                    <div className="relative aspect-4/5 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-35" />
                      <span className="absolute top-4 left-4 border border-gold/45 bg-ink/70 px-3 py-1.5 text-[10px] tracking-[0.2em] text-gold uppercase backdrop-blur-sm">
                        {collection.group}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-[1.55rem] leading-tight font-normal text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-3 flex-1 text-[14.5px] leading-[1.8] text-ink/60">
                        {item.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2.5 border-t border-ink/10 pt-5">
                        <Button asChild variant="ink" size="sm">
                          <a
                            href={whatsappHref(
                              settings.whatsapp,
                              WHATSAPP_MESSAGES.price(item.title),
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Request Price
                          </a>
                        </Button>
                        <Button asChild variant="outlineDark" size="sm">
                          <a
                            href={whatsappHref(settings.whatsapp, WHATSAPP_MESSAGES.measurement)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <WhatsAppIcon className="h-3.5 w-3.5" />
                            Free Measurement
                          </a>
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <PromoBanner promotion={promotion} whatsapp={settings.whatsapp} />
      <CtaStrip
        settings={settings}
        title="Pricing depends on your window"
        description="Send us your room sizes or a photo and we will quote for the fabric and fitting you need."
      />
    </>
  );
}
