/** +971547400549 -> +971 54 740 0549 */
export function formatPhone(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("971") && digits.length === 12) {
    return `+971 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return raw;
}

/** Anything -> wa.me / tel: safe digit string. */
export function toDialDigits(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

export function telHref(raw: string) {
  return `tel:+${toDialDigits(raw)}`;
}

export function whatsappHref(raw: string, message?: string) {
  const base = `https://wa.me/${toDialDigits(raw)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
