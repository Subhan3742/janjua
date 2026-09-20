import { Hero } from "@/components/sections/hero";
import { TrustFeatures } from "@/components/sections/trust-features";
import { AboutIntro } from "@/components/sections/about-intro";
import { ServicesGrid } from "@/components/sections/services-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { PromoBanner } from "@/components/sections/promo-banner";
import { CtaStrip } from "@/components/sections/cta-strip";
import {
  getActivePromotion,
  getFeaturedGallery,
  getServices,
  getSiteSettings,
} from "@/lib/data";

export const revalidate = 300;

export default async function HomePage() {
  const [settings, promotion, services, gallery] = await Promise.all([
    getSiteSettings(),
    getActivePromotion(),
    getServices(),
    getFeaturedGallery(5),
  ]);

  return (
    <>
      <Hero settings={settings} promotion={promotion} />
      <TrustFeatures />
      <AboutIntro />
      <ServicesGrid services={services} whatsapp={settings.whatsapp} limit={6} showCta />
      <ProcessTimeline />
      <GalleryPreview images={gallery} />
      <WhyChooseUs />
      <PromoBanner promotion={promotion} whatsapp={settings.whatsapp} />
      <CtaStrip settings={settings} />
    </>
  );
}
