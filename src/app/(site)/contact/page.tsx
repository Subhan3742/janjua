import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { getSiteSettings } from "@/lib/data";
import { WHATSAPP_MESSAGES } from "@/lib/site";
import { formatPhone, telHref, whatsappHref } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Janjua Curtain House for a free curtain and blind measurement in UAE. Call or WhatsApp +971 54 740 0549.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const socials = [
    settings.instagram
      ? { href: settings.instagram, label: "Instagram", Icon: InstagramIcon }
      : null,
    settings.facebook ? { href: settings.facebook, label: "Facebook", Icon: FacebookIcon } : null,
  ].filter(Boolean) as { href: string; label: string; Icon: typeof InstagramIcon }[];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Book your <span className="text-gilded italic">free measurement</span>
          </>
        }
        description="Tell us about your windows and we will arrange a visit at a time that suits you."
        image="/images/services/curtain-measurement.svg"
      />

      <section className="bg-cream">
        <div className="container-x py-20 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            {/* Details ------------------------------------------------- */}
            <Reveal from="left">
              <SectionHeading
                align="left"
                eyebrow="Get in touch"
                title={
                  <>
                    Talk to <span className="text-gilded italic">Janjua</span>
                  </>
                }
              />

              <div className="mt-10 space-y-8">
                <div>
                  <p className="eyebrow text-ink/40">Business</p>
                  <p className="mt-2 font-display text-2xl font-normal text-ink">
                    {settings.business_name}
                  </p>
                  <p className="mt-1 font-script text-2xl text-gold-dark">{settings.tagline}</p>
                </div>

                <a
                  href={telHref(settings.phone)}
                  className="group flex items-start gap-4 border-t border-ink/10 pt-7"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
                    <Phone className="h-4 w-4" strokeWidth={1.3} />
                  </span>
                  <span>
                    <span className="eyebrow block text-ink/40">Phone</span>
                    <span className="mt-1 block text-[17px] text-ink transition-colors group-hover:text-gold-dark">
                      {formatPhone(settings.phone)}
                    </span>
                  </span>
                </a>

                <a
                  href={whatsappHref(settings.whatsapp, WHATSAPP_MESSAGES.measurement)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 border-t border-ink/10 pt-7"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
                    <WhatsAppIcon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="eyebrow block text-ink/40">WhatsApp</span>
                    <span className="mt-1 block text-[17px] text-ink transition-colors group-hover:text-gold-dark">
                      {formatPhone(settings.whatsapp)}
                    </span>
                  </span>
                </a>

                <div className="flex items-start gap-4 border-t border-ink/10 pt-7">
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-gold/40 text-gold">
                    <MapPin className="h-4 w-4" strokeWidth={1.3} />
                  </span>
                  <span>
                    <span className="eyebrow block text-ink/40">Location</span>
                    <span className="mt-1 block text-[17px] text-ink">{settings.location}</span>
                  </span>
                </div>

                <div className="flex items-start gap-4 border-t border-ink/10 pt-7">
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-gold/40 text-gold">
                    <Clock className="h-4 w-4" strokeWidth={1.3} />
                  </span>
                  <span>
                    <span className="eyebrow block text-ink/40">Measurement visits</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-ink/70">
                      Arranged by appointment — message us for the next available slot.
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild variant="whatsapp" size="md">
                  <a
                    href={whatsappHref(settings.whatsapp, WHATSAPP_MESSAGES.measurement)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
                <Button asChild variant="ink" size="md">
                  <a href={telHref(settings.phone)}>
                    <Phone className="h-4 w-4" strokeWidth={1.4} />
                    Call Now
                  </a>
                </Button>
              </div>

              {socials.length > 0 ? (
                <div className="mt-8 flex gap-3">
                  {socials.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-10 w-10 place-items-center border border-ink/15 text-ink/60 transition-colors hover:border-gold hover:text-gold"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              ) : null}
            </Reveal>

            {/* Form ---------------------------------------------------- */}
            <Reveal from="right" delay={0.1}>
              <div className="border border-ink/10 bg-white/70 p-7 shadow-luxe sm:p-10">
                <p className="eyebrow text-gold-dark">Consultation request</p>
                <h2 className="mt-4 font-display text-[1.9rem] leading-tight font-light text-ink sm:text-[2.2rem]">
                  Request a free measurement
                </h2>
                <p className="mt-3 text-[14.5px] leading-[1.8] text-ink/55">
                  Fill in your details and we will get back to you to confirm a visit.
                </p>

                <div className="mt-9">
                  <InquiryForm whatsapp={settings.whatsapp} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
