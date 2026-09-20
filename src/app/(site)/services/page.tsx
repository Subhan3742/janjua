import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { CtaStrip } from "@/components/sections/cta-strip";
import { getServices, getSiteSettings } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom curtains, blackout curtains, curtain stitching, professional fitting, measurement and blinds for homes and offices in UAE.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Complete curtain &amp; <span className="text-gilded italic">blind services</span>
          </>
        }
        description="Measurement, fabric selection, stitching and fitting — handled end to end by our own team."
        image="/images/services/curtain-stitching.svg"
      />

      <ServicesGrid services={services} whatsapp={settings.whatsapp} />
      <ProcessTimeline />
      <CtaStrip
        settings={settings}
        title="Not sure which service you need?"
        description="Send us a photo of your window on WhatsApp and we will tell you what suits it."
      />
    </>
  );
}
