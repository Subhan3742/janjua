import Image from "next/image";
import Link from "next/link";
import { Ornament } from "@/components/ui/ornament";

/** Compact dark masthead used at the top of every inner page. */
export function PageHero({
  eyebrow,
  title,
  description,
  image = "/images/hero.png",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <Image src={image} alt="" fill sizes="100vw" priority className="object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
      <div className="bg-weave absolute inset-0" />

      <div className="container-x relative pt-36 pb-16 text-center sm:pt-40 lg:pt-44 lg:pb-20">
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h1 className="mt-6 font-display text-[2.3rem] leading-[1.1] font-light text-cream balance sm:text-[3rem] lg:text-[3.6rem]">
          {title}
        </h1>

        {description ? (
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-[1.9] text-cream/60 balance sm:text-base">
            {description}
          </p>
        ) : null}

        <Ornament className="mt-9" tone="dark" />

        <nav aria-label="Breadcrumb" className="mt-8">
          <ol className="flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] text-cream/35 uppercase">
            <li>
              <Link href="/" className="transition-colors hover:text-gold">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-gold/80">{eyebrow}</li>
          </ol>
        </nav>
      </div>
    </section>
  );
}
