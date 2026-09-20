import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/sections/service-card";
import type { Service } from "@/types/database";

export function ServicesGrid({
  services,
  whatsapp,
  limit,
  showCta = false,
}: {
  services: Service[];
  whatsapp: string;
  limit?: number;
  showCta?: boolean;
}) {
  const visible = limit ? services.slice(0, limit) : services;

  return (
    <section className="bg-cream-dark/45">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="What We Do"
            title={
              <>
                Curtain &amp; Blind <span className="text-gilded italic">Services</span>
              </>
            }
            description="Everything from the first measurement to the final fitting, handled by one team."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {visible.map((service, index) => (
            <Reveal key={service.id} delay={(index % 3) * 0.08} as="div" className="h-full">
              <ServiceCard service={service} whatsapp={whatsapp} className="h-full" />
            </Reveal>
          ))}
        </div>

        {showCta ? (
          <Reveal className="mt-14 flex justify-center">
            <Button asChild variant="outlineDark" size="lg">
              <Link href="/services">View All Services</Link>
            </Button>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
