import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CtaStrip } from "@/components/sections/cta-strip";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { getGalleryImages, getSiteSettings } from "@/lib/data";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Curtains, blackout panels, blinds and installations completed by Janjua Curtain House across UAE.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const [settings, images] = await Promise.all([getSiteSettings(), getGalleryImages()]);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Our recent <span className="text-gilded italic">work</span>
          </>
        }
        description="Curtains, blackout treatments, blinds and installations — filter by the type of work you are planning."
        image="/images/gallery/01.svg"
      />

      <section className="bg-cream">
        <div className="container-x py-16 lg:py-20">
          <GalleryGrid images={images} />
        </div>
      </section>

      <CtaStrip
        settings={settings}
        title="Want something similar?"
        description="Show us the look you like and we will match the fabric, the length and the fitting."
      />
    </>
  );
}
