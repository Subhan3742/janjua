import { cn } from "@/lib/utils";

/** Small gold rule with a centred geometric lozenge — the brand's divider. */
export function Ornament({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const line = tone === "dark" ? "bg-gold/45" : "bg-gold/55";

  return (
    <div className={cn("flex items-center justify-center gap-3", className)} aria-hidden>
      <span className={cn("h-px w-10 sm:w-16", line)} />
      <svg width="16" height="16" viewBox="0 0 16 16" className="text-gold">
        <path
          d="M8 0.8 11.2 4 14.4 8 11.2 12 8 15.2 4.8 12 1.6 8 4.8 4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="8" cy="8" r="1.4" fill="currentColor" />
      </svg>
      <span className={cn("h-px w-10 sm:w-16", line)} />
    </div>
  );
}
