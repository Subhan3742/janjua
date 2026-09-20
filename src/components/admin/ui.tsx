import { cn } from "@/lib/utils";
import type { InquiryStatus } from "@/types/database";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-cream/8 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-[2rem] leading-tight font-light text-cream sm:text-[2.4rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-cream/45">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("border border-cream/8 bg-ink/45 p-5 sm:p-7", className)}>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "border p-6",
        accent ? "border-gold/35 bg-gold/6" : "border-cream/8 bg-ink/45",
      )}
    >
      <p className="eyebrow text-cream/40">{label}</p>
      <p
        className={cn(
          "mt-3 font-display text-[2.6rem] leading-none font-light",
          accent ? "text-gilded" : "text-cream",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-2 text-[12.5px] text-cream/35">{hint}</p> : null}
    </div>
  );
}

const STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "border-gold/45 text-gold",
  contacted: "border-sky-400/40 text-sky-300",
  completed: "border-emerald-400/40 text-emerald-300",
  cancelled: "border-cream/20 text-cream/40",
};

export function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={cn(
        "inline-flex border px-2.5 py-1 text-[10px] font-medium tracking-[0.16em] uppercase",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border border-dashed border-cream/12 px-6 py-16 text-center">
      <p className="font-display text-xl font-light text-cream/70">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-sm text-[13.5px] text-cream/35">{description}</p>
      ) : null}
    </div>
  );
}
