"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, Trash2, X } from "lucide-react";
import { deleteInquiry, updateInquiryStatus } from "@/app/actions/admin";
import { EmptyState, Panel, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { INQUIRY_STATUSES } from "@/lib/site";
import { cn, formatDate, formatDateTime, telHref, whatsappHref } from "@/lib/utils";
import type { Inquiry, InquiryStatus } from "@/types/database";

export function InquiriesTable({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | InquiryStatus>("all");
  const [active, setActive] = useState<Inquiry | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return inquiries.filter((inquiry) => {
      const matchesStatus = status === "all" || inquiry.status === status;
      if (!matchesStatus) return false;
      if (!needle) return true;

      return [inquiry.name, inquiry.phone, inquiry.email, inquiry.service, inquiry.message]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle));
    });
  }, [inquiries, query, status]);

  const changeStatus = (id: string, next: InquiryStatus) => {
    setBusyId(id);
    startTransition(async () => {
      await updateInquiryStatus(id, next);
      setBusyId(null);
      setActive((current) => (current && current.id === id ? { ...current, status: next } : current));
      router.refresh();
    });
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this inquiry permanently?")) return;

    setBusyId(id);
    startTransition(async () => {
      await deleteInquiry(id);
      setBusyId(null);
      setActive((current) => (current && current.id === id ? null : current));
      router.refresh();
    });
  };

  return (
    <>
      <Panel className="mb-6">
        <div className="grid gap-5 sm:grid-cols-[1.6fr_1fr]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-cream/30"
              strokeWidth={1.4}
            />
            <Input
              tone="dark"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, phone, email or message"
              className="pl-7"
              aria-label="Search inquiries"
            />
          </div>

          <Select
            tone="dark"
            value={status}
            onChange={(event) => setStatus(event.target.value as "all" | InquiryStatus)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            {INQUIRY_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </Select>
        </div>

        <p className="mt-5 text-[12.5px] text-cream/35">
          Showing {filtered.length} of {inquiries.length}
        </p>
      </Panel>

      {filtered.length === 0 ? (
        <EmptyState
          title="No inquiries match"
          description="Try a different search term or status filter."
        />
      ) : (
        <div className="border border-cream/8">
          {/* Desktop table */}
          <table className="hidden w-full border-collapse lg:table">
            <thead>
              <tr className="border-b border-cream/8 bg-ink/50 text-left">
                {["Name", "Service", "Phone", "Received", "Status", ""].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3.5 text-[10.5px] font-medium tracking-[0.16em] text-cream/40 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className="border-b border-cream/6 transition-colors last:border-b-0 hover:bg-cream/3"
                >
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setActive(inquiry)}
                      className="text-left text-[14.5px] text-cream transition-colors hover:text-gold"
                    >
                      {inquiry.name}
                    </button>
                    {inquiry.email ? (
                      <p className="mt-0.5 text-[12.5px] text-cream/35">{inquiry.email}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-[13.5px] text-cream/60">{inquiry.service}</td>
                  <td className="px-4 py-4">
                    <a
                      href={telHref(inquiry.phone)}
                      className="text-[13.5px] text-cream/60 transition-colors hover:text-gold"
                    >
                      {inquiry.phone}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-[13px] text-cream/40">
                    {formatDate(inquiry.created_at)}
                  </td>
                  <td className="px-4 py-4">
                    <Select
                      tone="dark"
                      value={inquiry.status}
                      disabled={pending && busyId === inquiry.id}
                      onChange={(event) =>
                        changeStatus(inquiry.id, event.target.value as InquiryStatus)
                      }
                      aria-label={`Status for ${inquiry.name}`}
                      className="py-1 text-[13px]"
                    >
                      {INQUIRY_STATUSES.map((value) => (
                        <option key={value} value={value}>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => remove(inquiry.id)}
                      disabled={pending && busyId === inquiry.id}
                      aria-label={`Delete inquiry from ${inquiry.name}`}
                      className="text-cream/30 transition-colors hover:text-red-400 disabled:opacity-40"
                    >
                      {pending && busyId === inquiry.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.4} />
                      ) : (
                        <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="divide-y divide-cream/8 lg:hidden">
            {filtered.map((inquiry) => (
              <li key={inquiry.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActive(inquiry)}
                    className="text-left"
                  >
                    <p className="text-[15px] text-cream">{inquiry.name}</p>
                    <p className="mt-1 text-[13px] text-cream/40">
                      {inquiry.service} · {formatDate(inquiry.created_at)}
                    </p>
                  </button>
                  <StatusBadge status={inquiry.status} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={telHref(inquiry.phone)}>Call</a>
                  </Button>
                  <Button asChild variant="whatsapp" size="sm">
                    <a
                      href={whatsappHref(inquiry.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-cream/50" onClick={() => setActive(inquiry)}>
                    Details
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActive(null)}
          >
            <motion.aside
              className="h-full w-full max-w-md overflow-y-auto border-l border-cream/10 bg-charcoal p-6 sm:p-8"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`Inquiry from ${active.name}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-cream/35">Inquiry</p>
                  <h2 className="mt-2 font-display text-2xl font-light text-cream">
                    {active.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Close details"
                  className="grid h-10 w-10 place-items-center border border-cream/12 text-cream/60 transition-colors hover:border-gold hover:text-gold"
                >
                  <X className="h-4 w-4" strokeWidth={1.3} />
                </button>
              </div>

              <dl className="mt-8 space-y-5 text-[14px]">
                {[
                  ["Status", <StatusBadge key="status" status={active.status} />],
                  ["Service", active.service],
                  ["Phone", active.phone],
                  ["Email", active.email || "—"],
                  ["Preferred date", formatDate(active.preferred_date)],
                  ["Received", formatDateTime(active.created_at)],
                ].map(([label, value]) => (
                  <div key={String(label)} className="border-b border-cream/8 pb-4">
                    <dt className="eyebrow text-cream/35">{label}</dt>
                    <dd className="mt-1.5 text-cream/80">{value}</dd>
                  </div>
                ))}

                <div>
                  <dt className="eyebrow text-cream/35">Message</dt>
                  <dd className="mt-2 leading-[1.8] whitespace-pre-line text-cream/70">
                    {active.message || "—"}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-2.5">
                <Button asChild variant="whatsapp" size="sm">
                  <a
                    href={whatsappHref(
                      active.phone,
                      `Hello ${active.name}, thank you for contacting Janjua Curtain House regarding ${active.service}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reply on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={telHref(active.phone)}>Call</a>
                </Button>
              </div>

              <div className="mt-8 border-t border-cream/8 pt-6">
                <p className="eyebrow mb-3 text-cream/35">Change status</p>
                <div className="flex flex-wrap gap-2">
                  {INQUIRY_STATUSES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => changeStatus(active.id, value)}
                      disabled={pending}
                      className={cn(
                        "border px-3 py-2 text-[11px] tracking-[0.14em] uppercase transition-colors disabled:opacity-50",
                        active.status === value
                          ? "border-gold bg-gold text-ink"
                          : "border-cream/15 text-cream/55 hover:border-gold/60 hover:text-cream",
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => remove(active.id)}
                  disabled={pending}
                  className="mt-6 inline-flex items-center gap-2 text-[12px] tracking-[0.14em] text-red-400/80 uppercase transition-colors hover:text-red-400 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                  Delete inquiry
                </button>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
