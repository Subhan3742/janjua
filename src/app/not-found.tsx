import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Ornament } from "@/components/ui/ornament";
import { getServices, getSiteSettings } from "@/lib/data";

/**
 * Root 404. It carries its own chrome because unmatched URLs never enter the
 * (site) route group, so they cannot inherit its layout.
 */
export default async function NotFound() {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);

  return (
    <>
      <Header settings={settings} />
      <main className="bg-weave flex min-h-[80vh] items-center bg-ink">
        <div className="container-x py-32 text-center">
          <p className="font-display text-[5rem] leading-none text-gilded">404</p>
          <Ornament className="mt-6" tone="dark" />
          <h1 className="mt-8 font-display text-[2.2rem] font-light text-cream sm:text-[2.8rem]">
            This page has been drawn closed
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-[1.85] text-cream/55">
            The page you are looking for does not exist. Let us take you back.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="gold" size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer settings={settings} services={services} />
    </>
  );
}
