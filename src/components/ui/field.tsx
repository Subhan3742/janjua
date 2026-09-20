import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
 * Shared form primitives. `tone` switches between the cream public pages and
 * the charcoal admin dashboard without duplicating components.
 * ---------------------------------------------------------------------- */

const controlVariants = cva(
  "w-full border-0 border-b bg-transparent px-0 py-3 font-sans text-[15px] transition-colors duration-300 outline-none placeholder:text-current/35 disabled:opacity-50",
  {
    variants: {
      tone: {
        light: "border-b-ink/20 text-ink focus:border-b-gold",
        dark: "border-b-cream/20 text-cream focus:border-b-gold",
      },
      invalid: {
        true: "border-b-red-500/70 focus:border-b-red-500",
        false: "",
      },
    },
    defaultVariants: { tone: "light", invalid: false },
  },
);

type ControlVariants = VariantProps<typeof controlVariants>;

export function Label({
  className,
  tone = "light",
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { tone?: "light" | "dark" }) {
  return (
    <label
      className={cn(
        "eyebrow mb-1 block",
        tone === "dark" ? "text-cream/50" : "text-ink/50",
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  tone,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & ControlVariants) {
  return <input className={cn(controlVariants({ tone, invalid }), className)} {...props} />;
}

export function Textarea({
  className,
  tone,
  invalid,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & ControlVariants) {
  return (
    <textarea
      className={cn(controlVariants({ tone, invalid }), "resize-none", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  tone,
  invalid,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & ControlVariants) {
  return (
    <div className="relative">
      <select
        className={cn(
          controlVariants({ tone, invalid }),
          "appearance-none pr-8",
          tone === "dark" ? "[&>option]:bg-charcoal" : "[&>option]:bg-cream",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 12 8"
        className={cn(
          "pointer-events-none absolute top-1/2 right-1 h-2 w-3 -translate-y-1/2",
          tone === "dark" ? "text-cream/40" : "text-ink/40",
        )}
        aria-hidden
      >
        <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="mt-2 text-[12.5px] leading-snug text-red-600" role="alert">
      {children}
    </p>
  );
}

export function Field({
  label,
  htmlFor,
  error,
  tone = "light",
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  tone?: "light" | "dark";
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={htmlFor} tone={tone}>
        {label}
        {required ? <span className="ml-1 text-gold">*</span> : null}
      </Label>
      {children}
      <FieldError>{error}</FieldError>
    </div>
  );
}

/** Small pill used for statuses, categories and counts. */
export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10.5px] font-medium tracking-[0.14em] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Checkbox styled as a small gold tick box. */
export function Checkbox({
  className,
  tone = "light",
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { tone?: "light" | "dark"; label: string }) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-3 text-[13px] select-none",
        tone === "dark" ? "text-cream/75" : "text-ink/75",
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        className={cn(
          "grid h-[18px] w-[18px] shrink-0 place-items-center border transition-colors",
          tone === "dark" ? "border-cream/25" : "border-ink/25",
          "peer-checked:border-gold peer-checked:bg-gold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold",
        )}
      >
        <svg
          viewBox="0 0 12 10"
          className="h-2.5 w-3 scale-0 text-ink transition-transform peer-checked:scale-100"
          aria-hidden
        >
          <path
            d="M1 5.2 4.3 8.5 11 1.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {label}
    </label>
  );
}
