import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Wordmark. The gold lozenge and hairline rules echo the geometric detailing
 * on the brand's printed material.
 */
export function Logo({
  tone = "dark",
  className,
  businessName = "Janjua Curtain House",
  onClick,
}: {
  tone?: "dark" | "light";
  className?: string;
  businessName?: string;
  onClick?: () => void;
}) {
  const [first, ...rest] = businessName.split(" ");

  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label={`${businessName} — home`}
      onClick={onClick}
    >
      <span className="relative grid h-10 w-10 shrink-0 place-items-center border border-gold/50 transition-colors duration-500 group-hover:border-gold">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" aria-hidden>
          <path
            d="M12 1.6 17.6 7.2 22.4 12 17.6 16.8 12 22.4 6.4 16.8 1.6 12 6.4 7.2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <path d="M12 6.5 15.4 12 12 17.5 8.6 12Z" fill="currentColor" opacity="0.9" />
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[19px] whitespace-nowrap tracking-[0.01em] sm:text-[21px]",
            tone === "dark" ? "text-cream" : "text-ink",
          )}
        >
          {first}{" "}
          <span className="text-gold">{rest.join(" ")}</span>
        </span>
        <span
          className={cn(
            "mt-1 whitespace-nowrap text-[8.5px] tracking-[0.34em] uppercase",
            tone === "dark" ? "text-cream/45" : "text-ink/45",
          )}
        >
          Style · Comfort · Elegance
        </span>
      </span>
    </Link>
  );
}
