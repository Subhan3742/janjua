"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { PROCESS_STEPS } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Horizontal on desktop, vertical on mobile. The connecting rule draws itself
 * once the section scrolls into view.
 */
export function ProcessTimeline() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-weave relative overflow-hidden bg-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{ backgroundImage: "url(/images/pattern.svg)", backgroundSize: "120px" }}
        aria-hidden
      />

      <div className="container-x relative py-20 lg:py-28">
        <SectionHeading
          tone="dark"
          eyebrow="Our Process"
          title={
            <>
              We Measure. We Stitch. <span className="text-gilded italic">We Fit.</span>
            </>
          }
          description="Five steps from the first visit to the finished window — with no handovers to third parties in between."
        />

        <div className="relative mt-16 lg:mt-20">
          {/* Desktop rule */}
          <motion.div
            className="absolute top-[26px] right-0 left-0 hidden h-px origin-left bg-gradient-to-r from-transparent via-gold/45 to-transparent lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: reduceMotion ? 0.2 : 1.6, ease }}
          />
          {/* Mobile rule */}
          <motion.div
            className="absolute top-0 bottom-0 left-[26px] w-px origin-top bg-gradient-to-b from-gold/45 via-gold/25 to-transparent lg:hidden"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: reduceMotion ? 0.2 : 1.6, ease }}
          />

          <ol className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {PROCESS_STEPS.map((step, index) => (
              <motion.li
                key={step.number}
                className="relative flex gap-6 lg:block"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: reduceMotion ? 0.2 : 0.8,
                  delay: reduceMotion ? 0 : 0.2 + index * 0.12,
                  ease,
                }}
              >
                <span className="relative z-10 grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-gold/35 bg-ink font-display text-[1.15rem] text-gold">
                  {step.number}
                </span>

                <div className="lg:mt-7 lg:pr-4">
                  <h3 className="font-display text-[1.45rem] leading-snug font-normal text-cream">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-[1.8] text-cream/50">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
