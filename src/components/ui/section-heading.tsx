import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2" | "h3";
};

/** The typographic lockup used at the top of every section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
  as: Tag = "h2",
}: Props) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col",
        centered ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "eyebrow mb-5 flex items-center gap-3",
            tone === "dark" ? "text-gold-light" : "text-gold-dark",
          )}
        >
          <span className="h-px w-8 bg-current opacity-60" aria-hidden />
          {eyebrow}
          {centered ? <span className="h-px w-8 bg-current opacity-60" aria-hidden /> : null}
        </p>
      ) : null}

      <Tag
        className={cn(
          "font-display text-[2.1rem] leading-[1.12] font-light tracking-[-0.01em] balance sm:text-[2.7rem] lg:text-[3.2rem]",
          tone === "dark" ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </Tag>

      {description ? (
        <p
          className={cn(
            "mt-6 max-w-2xl text-[15px] leading-[1.85] balance sm:text-base",
            tone === "dark" ? "text-cream/60" : "text-ink/65",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
