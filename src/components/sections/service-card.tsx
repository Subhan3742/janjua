import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BrandIcon } from "@/components/ui/icon";
import { WHATSAPP_MESSAGES } from "@/lib/site";
import { cn, whatsappHref } from "@/lib/utils";
import type { Service } from "@/types/database";

export function ServiceCard({
  service,
  whatsapp,
  className,
}: {
  service: Service;
  whatsapp: string;
  className?: string;
}) {
  const message = `Hello Janjua Curtain House, I would like to request a consultation for ${service.title}.`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col border border-ink/10 bg-cream transition-colors duration-500 hover:border-gold/45",
        className,
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={service.image_url ?? "/images/services/custom-curtains.svg"}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40" />
        <span className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center border border-gold/50 bg-ink/80 text-gold backdrop-blur-sm">
          <BrandIcon name={service.icon} className="h-5 w-5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <p className="eyebrow text-gold-dark/80">{service.category}</p>
        <h3 className="mt-3 font-display text-[1.6rem] leading-tight font-normal text-ink">
          {service.title}
        </h3>
        <p className="mt-3 flex-1 text-[14.5px] leading-[1.8] text-ink/60">
          {service.description}
        </p>

        <a
          href={whatsappHref(whatsapp, message || WHATSAPP_MESSAGES.consultation)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 border-t border-ink/10 pt-5 text-[11.5px] font-medium tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:text-gold-dark"
        >
          Request a Consultation
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.4}
          />
        </a>
      </div>
    </article>
  );
}
