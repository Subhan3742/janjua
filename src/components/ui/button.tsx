import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-sans font-medium uppercase tracking-[0.16em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Solid gold — the primary conversion action. */
        gold:
          "bg-gold text-ink hover:bg-gold-light shadow-[0_10px_30px_-14px_rgba(201,154,61,0.9)] hover:shadow-[0_14px_36px_-12px_rgba(201,154,61,0.95)]",
        /** Solid black — used on cream backgrounds. */
        ink: "bg-ink text-cream hover:bg-charcoal",
        /** Hairline gold outline — the quiet secondary action. */
        outline:
          "border border-gold/55 text-gold hover:border-gold hover:bg-gold hover:text-ink",
        /** Hairline dark outline for light backgrounds. */
        outlineDark:
          "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream",
        /** WhatsApp green, reserved for WhatsApp actions only. */
        whatsapp: "bg-[#1faa59] text-white hover:bg-[#189a4f]",
        ghost: "text-ink hover:text-gold",
      },
      size: {
        sm: "h-10 px-5 text-[11px]",
        md: "h-12 px-7 text-[12px]",
        lg: "h-14 px-9 text-[12.5px]",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
