"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/types/database";

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
}) {
  const open = index !== null;
  const image = open ? images[index] : null;

  const step = useCallback(
    (direction: 1 | -1) => {
      if (index === null || images.length === 0) return;
      onIndexChange((index + direction + images.length) % images.length);
    },
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, step]);

  return (
    <AnimatePresence>
      {open && image ? (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-ink/97 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={image.title}
        >
          <div className="flex shrink-0 items-center justify-between px-5 py-4 sm:px-8">
            <p className="text-[11px] tracking-[0.24em] text-cream/45 uppercase">
              {index + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              className="grid h-11 w-11 place-items-center border border-cream/15 text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" strokeWidth={1.2} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className="absolute left-2 z-10 grid h-12 w-12 place-items-center border border-cream/15 bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.2} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={image.id}
                className="relative h-full w-full max-w-5xl"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={image.image_url}
                  alt={image.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className="absolute right-2 z-10 grid h-12 w-12 place-items-center border border-cream/15 bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold sm:right-4"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.2} />
            </button>
          </div>

          <div className="shrink-0 border-t border-cream/8 px-5 py-5 text-center sm:px-8">
            <p className="eyebrow text-gold">{image.category}</p>
            <h2 className="mt-2 font-display text-xl font-light text-cream sm:text-2xl">
              {image.title}
            </h2>
            {image.description ? (
              <p className="mx-auto mt-2 max-w-xl text-[13.5px] text-cream/50">
                {image.description}
              </p>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
