"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Expand } from "lucide-react";
import { Lightbox } from "@/components/gallery/lightbox";
import { GALLERY_CATEGORIES } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/database";

const FILTERS = ["All", ...GALLERY_CATEGORIES] as const;

/** Masonry grid with category filtering and a full-screen lightbox. */
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState<string>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === "All" ? images : images.filter((image) => image.category === filter)),
    [images, filter],
  );

  const availableFilters = useMemo(
    () =>
      FILTERS.filter(
        (item) => item === "All" || images.some((image) => image.category === item),
      ),
    [images],
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {availableFilters.map((item) => {
          const active = filter === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                setFilter(item);
                setActiveIndex(null);
              }}
              className={cn(
                "border px-4 py-2 text-[11px] font-medium tracking-[0.18em] uppercase transition-all duration-300",
                active
                  ? "border-gold bg-gold text-ink"
                  : "border-ink/15 text-ink/55 hover:border-gold/60 hover:text-ink",
              )}
              aria-pressed={active}
            >
              {item}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-ink/50">No images in this category yet.</p>
      ) : (
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((image, index) => (
              <motion.button
                key={image.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(index * 0.05, 0.4),
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => setActiveIndex(index)}
                className="group relative mb-5 block w-full break-inside-avoid overflow-hidden border border-ink/8 text-left lg:mb-6"
                aria-label={`Open ${image.title}`}
              >
                <Image
                  src={image.image_url}
                  alt={image.title}
                  width={800}
                  height={1000}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-auto w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />

                <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="eyebrow block text-gold">{image.category}</span>
                  <span className="mt-1.5 block font-display text-lg leading-snug font-light text-cream">
                    {image.title}
                  </span>
                </span>

                <span className="absolute top-4 right-4 grid h-10 w-10 scale-90 place-items-center border border-gold/50 bg-ink/70 text-gold opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                  <Expand className="h-4 w-4" strokeWidth={1.3} />
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Lightbox
        images={visible}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
      />
    </>
  );
}
