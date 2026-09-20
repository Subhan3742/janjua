import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { getServices, getSiteSettings } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { toDialDigits } from "@/lib/utils";

/** Public site chrome. The admin dashboard deliberately sits outside this. */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);

  /** Structured data is limited to facts the owner actually supplied. */
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: settings.business_name,
    slogan: settings.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: `+${toDialDigits(settings.phone)}`,
    address: { "@type": "PostalAddress", addressCountry: "AE" },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    knowsAbout: [
      "Custom curtains",
      "Blackout curtains",
      "Curtain stitching",
      "Curtain measurement",
      "Curtain fitting",
      "Blinds",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Header settings={settings} />
      <main id="main">{children}</main>
      <Footer settings={settings} services={services} />
      <FloatingActions settings={settings} />
    </>
  );
}
