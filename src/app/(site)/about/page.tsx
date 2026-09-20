import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { CtaStrip } from "@/components/sections/cta-strip";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Ornament } from "@/components/ui/ornament";
import { ABOUT_POINTS } from "@/lib/content";
import { getSiteSettings } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Janjua Curtain House provides custom curtain and blind solutions in UAE — measurement, fabric selection, stitching and professional fitting.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Style. Comfort. <span className="text-gilded italic">Elegance.</span>
          </>
        }
        description="Custom curtain solutions tailored to your space, your interior style and the way you use each room."
        image="/images/about.svg"
      />

      <section className="bg-cream">
        <div className="container-x py-20 lg:py-28">
          <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal from="left">
              <div className="relative">
                <span
                  className="absolute -top-5 -left-5 hidden h-full w-full border border-gold/35 sm:block"
                  aria-hidden
                />
                <div className="relative aspect-4/5 overflow-hidden">
                  <Image
                    src="/images/collections/custom.svg"
                    alt="Custom stitched curtain panels"
                    fill
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal from="right" delay={0.1}>
              <SectionHeading
                align="left"
                eyebrow="Who We Are"
                title={
                  <>
                    Curtains made for <span className="text-gilded italic">your space</span>
                  </>
                }
              />

              <div className="mt-7 space-y-5 text-[15px] leading-[1.9] text-ink/65">
                <p>
                  Janjua Curtain House provides custom curtain solutions tailored to the
                  customer&apos;s space, interior style and requirements. Rather than selling
                  ready-made panels, we start at your window — measuring it properly, then
                  building the curtain around it.
                </p>
                <p>
                  We guide you through fabric selection, stitch the panels to the measurements we
                  have taken, and fit everything ourselves. Blackout curtains, sheers, layered
                  treatments and blinds are all handled the same way, for homes and for offices.
                </p>
                <p>
                  Because measurement, stitching and fitting sit with one team, there is nobody to
                  pass the problem to if something does not hang the way it should.
                </p>
              </div>

              <div className="mt-10 border-t border-ink/10 pt-8">
                <p className="eyebrow text-gold-dark">What we handle</p>
                <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
                  {ABOUT_POINTS.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-[14.5px] text-ink/75">
                      <Check className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.6} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-20 text-center">
            <Ornament />
            <p className="mx-auto mt-8 max-w-2xl font-display text-[1.7rem] leading-[1.5] font-light text-ink/80 italic balance sm:text-[2rem]">
              &ldquo;Every window is measured before a single metre of fabric is cut.&rdquo;
            </p>
            <p className="mt-5 text-[11px] tracking-[0.28em] text-gold-dark uppercase">
              {settings.business_name} — {settings.location}
            </p>
          </Reveal>
        </div>
      </section>

      <ProcessTimeline />
      <WhyChooseUs />
      <CtaStrip settings={settings} />
    </>
  );
}
