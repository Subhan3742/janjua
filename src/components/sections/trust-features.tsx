import { BrandIcon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { FEATURES } from "@/lib/content";

/** The four promises carried over from the brand's printed material. */
export function TrustFeatures() {
  return (
    <section className="border-b border-ink/8 bg-cream">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08} className="bg-cream">
              <div className="group h-full px-6 py-8 transition-colors duration-500 hover:bg-cream-dark/60 lg:px-8 lg:py-10">
                <BrandIcon
                  name={feature.icon}
                  className="h-8 w-8 text-gold transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5"
                />
                <h3 className="mt-6 font-display text-[1.35rem] leading-snug font-normal text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[13.5px] tracking-[0.04em] text-ink/50">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
