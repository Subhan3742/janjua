import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ABOUT_POINTS } from "@/lib/content";

export function AboutIntro() {
  return (
    <section className="bg-cream">
      <div className="container-x py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal from="left">
            <div className="relative">
              {/* Offset gold frame behind the image */}
              <span
                className="absolute -top-5 -left-5 hidden h-full w-full border border-gold/35 sm:block"
                aria-hidden
              />
              <div className="relative aspect-4/5 w-full overflow-hidden">
                <Image
                  src="/images/about.svg"
                  alt="Layered sheer and blackout curtains in a living space"
                  fill
                  sizes="(max-width: 1024px) 100vw, 44vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute right-4 bottom-4 border border-gold/40 bg-ink/85 px-6 py-4 backdrop-blur-sm sm:-right-6">
                <p className="font-script text-4xl leading-none text-gold">Janjua</p>
                <p className="mt-1 text-[10px] tracking-[0.3em] text-cream/60 uppercase">
                  Curtain House
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal from="right" delay={0.1}>
            <SectionHeading
              align="left"
              eyebrow="About Us"
              title={
                <>
                  Style. Comfort. <span className="text-gilded italic">Elegance.</span>
                </>
              }
              description="Janjua Curtain House provides custom curtain solutions built around your space, your interior style and the way you actually use each room. We measure, we advise on fabric, we stitch, and we fit — so the finished window looks the way it was meant to."
            />

            <p className="mt-6 text-[15px] leading-[1.9] text-ink/60">
              From blackout curtains for bedrooms to sheers for a bright living room, and blinds
              for homes and offices, every panel is made to the measurements of your window rather
              than pulled off a shelf.
            </p>

            <ul className="mt-9 grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {ABOUT_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[14.5px] text-ink/75">
                  <Check className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.6} />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="ink" size="md">
                <Link href="/about">More About Us</Link>
              </Button>
              <Button asChild variant="outlineDark" size="md">
                <Link href="/services">Our Services</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
