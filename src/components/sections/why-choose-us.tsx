import { BrandIcon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { WHY_CHOOSE_US } from "@/lib/content";

export function WhyChooseUs() {
  return (
    <section className="bg-cream">
      <div className="container-x py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal from="left">
            <SectionHeading
              align="left"
              eyebrow="Why Choose Us"
              title={
                <>
                  A finished window, <span className="text-gilded italic">not just fabric</span>
                </>
              }
              description="One team handles the measurement, the stitching and the installation, so nothing is lost between suppliers."
            />
          </Reveal>

          <div className="grid gap-px bg-ink/10 sm:grid-cols-2">
            {WHY_CHOOSE_US.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08} className="bg-cream">
                <div className="h-full p-7 lg:p-8">
                  <BrandIcon name={item.icon} className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-[1.4rem] leading-snug font-normal text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-[1.8] text-ink/55">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
