import {
  Blinds,
  Building2,
  Hammer,
  Home,
  Layers,
  MoonStar,
  PackageCheck,
  PenTool,
  Ruler,
  Scissors,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Names are stored as plain strings in Supabase (`services.icon`) so the admin
 * can pick one without the dashboard shipping the whole icon set.
 */
const ICONS: Record<string, LucideIcon> = {
  Blinds,
  Building2,
  Hammer,
  Home,
  Layers,
  MoonStar,
  PackageCheck,
  PenTool,
  Ruler,
  Scissors,
  Sparkles,
  Wrench,
};

export const ICON_NAMES = Object.keys(ICONS);

export function BrandIcon({
  name,
  className,
}: {
  name: string | null | undefined;
  className?: string;
}) {
  const Icon = (name && ICONS[name]) || Sparkles;
  return <Icon className={className} strokeWidth={1.1} aria-hidden />;
}
