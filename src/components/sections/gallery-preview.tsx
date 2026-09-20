import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { GalleryImage } from "@/types/database";

/** Featured work teaser on the home page. */
export function GalleryPreview({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <section className="bg-cream-dark/45">
      <div className="container-x py-20 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Our Work"
            title={
              <>
                Recent <span className="text-gilded italic">Installations</span>
              </>
            }
            description="A look at curtains, blackout panels and blinds we have measured, stitched and fitted."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {images.map((image, index) => (
            <Reveal
              key={image.id}
              delay={(index % 3) * 0.08}
              className={index === 0 ? "sm:col-span-2 sm:row-span-2" : undefined}
            >
              <Link
                href="/gallery"
                className="group relative block h-full min-h-[240px] overflow-hidden border border-ink/8"
              >
                <Image
                  src={image.image_url}
                  alt={image.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-6">
                  <span className="eyebrow block text-gold">{image.category}</span>
                  <span className="mt-2 block font-display text-xl leading-snug font-light text-cream">
                    {image.title}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center">
          <Button asChild variant="outlineDark" size="lg">
            <Link href="/gallery">
              View Full Gallery
              <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
