import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Ornament } from "@/components/ui/ornament";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { NAV_LINKS, WHATSAPP_MESSAGES } from "@/lib/site";
import { formatPhone, telHref, whatsappHref } from "@/lib/utils";
import type { Service, SiteSettings } from "@/types/database";

export function Footer({
  settings,
  services,
}: {
  settings: SiteSettings;
  services: Service[];
}) {
  const year = new Date().getFullYear();

  const socials = [
    settings.instagram
      ? { href: settings.instagram, label: "Instagram", Icon: InstagramIcon }
      : null,
    settings.facebook ? { href: settings.facebook, label: "Facebook", Icon: FacebookIcon } : null,
  ].filter(Boolean) as { href: string; label: string; Icon: typeof InstagramIcon }[];

  return (
    <footer className="bg-weave border-t border-gold/15 bg-ink text-cream">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-10">
          <div>
            <Logo businessName={settings.business_name} />
            <p className="mt-6 max-w-xs text-[14.5px] leading-[1.85] text-cream/55">
              Custom curtains and blinds — measured, stitched and professionally fitted for homes
              and offices across the {settings.location}.
            </p>
            {socials.length > 0 ? (
              <div className="mt-7 flex gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center border border-cream/12 text-cream/60 transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow mb-6 text-gold">Explore</h2>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14.5px] text-cream/60 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow mb-6 text-gold">Services</h2>
            <ul className="space-y-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    href="/services"
                    className="text-[14.5px] text-cream/60 transition-colors hover:text-gold"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow mb-6 text-gold">Get in touch</h2>
            <ul className="space-y-4 text-[14.5px]">
              <li>
                <a
                  href={telHref(settings.phone)}
                  className="flex items-start gap-3 text-cream/60 transition-colors hover:text-gold"
                >
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.2} />
                  {formatPhone(settings.phone)}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref(settings.whatsapp, WHATSAPP_MESSAGES.measurement)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-cream/60 transition-colors hover:text-gold"
                >
                  <WhatsAppIcon className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  WhatsApp us
                </a>
              </li>
              <li className="flex items-start gap-3 text-cream/60">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={1.2} />
                {settings.location}
              </li>
            </ul>
          </div>
        </div>

        <Ornament className="mt-16" tone="dark" />

        <div className="mt-10 flex flex-col items-center justify-between gap-4 text-[12.5px] text-cream/35 sm:flex-row">
          <p>
            © {year} {settings.business_name}. All rights reserved.
          </p>
          <p className="font-script text-2xl text-gold/70">{settings.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
