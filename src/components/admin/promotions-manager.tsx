"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { deletePromotion, savePromotion, togglePromotionActive } from "@/app/actions/admin";
import { EmptyState, Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/field";
import { cn, formatDate } from "@/lib/utils";
import type { Promotion } from "@/types/database";

type Draft = {
  title: string;
  description: string;
  discount: number;
  cta_label: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
};

const EMPTY: Draft = {
  title: "",
  description: "",
  discount: 20,
  cta_label: "Claim Your Offer",
  is_active: true,
  start_date: "",
  end_date: "",
};

function toDraft(promotion: Promotion): Draft {
  return {
    title: promotion.title,
    description: promotion.description ?? "",
    discount: promotion.discount,
    cta_label: promotion.cta_label,
    is_active: promotion.is_active,
    start_date: promotion.start_date ?? "",
    end_date: promotion.end_date ?? "",
  };
}

export function PromotionsManager({ promotions }: { promotions: Promotion[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const first = promotions[0];
  const [editingId, setEditingId] = useState<string | null>(first?.id ?? null);
  const [draft, setDraft] = useState<Draft>(first ? toDraft(first) : EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const select = (promotion: Promotion | null) => {
    setMessage(null);
    if (promotion) {
      setEditingId(promotion.id);
      setDraft(toDraft(promotion));
    } else {
      setEditingId(null);
      setDraft(EMPTY);
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await savePromotion(editingId, {
      ...draft,
      description: draft.description || undefined,
      start_date: draft.start_date || undefined,
      end_date: draft.end_date || undefined,
    });

    setSaving(false);

    if (!result.ok) {
      setMessage({ tone: "error", text: result.message });
      return;
    }

    setMessage({ tone: "ok", text: "Promotion saved. The website is updated." });
    router.refresh();
  };

  const toggle = (promotion: Promotion) => {
    setBusyId(promotion.id);
    startTransition(async () => {
      await togglePromotionActive(promotion.id, !promotion.is_active);
      setBusyId(null);
      router.refresh();
    });
  };

  const remove = (promotion: Promotion) => {
    if (!window.confirm(`Delete "${promotion.title}" permanently?`)) return;

    setBusyId(promotion.id);
    startTransition(async () => {
      await deletePromotion(promotion.id);
      setBusyId(null);
      if (editingId === promotion.id) select(null);
      router.refresh();
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <Panel>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-light text-cream">
            {editingId ? "Edit promotion" : "New promotion"}
          </h2>
          {editingId ? (
            <Button variant="outline" size="sm" onClick={() => select(null)}>
              <Plus className="h-3.5 w-3.5" strokeWidth={1.6} />
              New
            </Button>
          ) : null}
        </div>

        <form onSubmit={save} className="mt-7 space-y-6">
          <Field label="Title" htmlFor="promo-title" tone="dark" required>
            <Input
              id="promo-title"
              tone="dark"
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="20% OFF All Curtains"
            />
          </Field>

          <Field label="Supporting text" htmlFor="promo-description" tone="dark">
            <Textarea
              id="promo-description"
              tone="dark"
              rows={2}
              value={draft.description}
              onChange={(event) =>
                setDraft((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Upgrade Your Home With Style & Comfort"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Discount %" htmlFor="promo-discount" tone="dark" required>
              <Input
                id="promo-discount"
                type="number"
                min={0}
                max={100}
                tone="dark"
                value={draft.discount}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, discount: Number(event.target.value) }))
                }
              />
            </Field>

            <Field label="Button label" htmlFor="promo-cta" tone="dark">
              <Input
                id="promo-cta"
                tone="dark"
                value={draft.cta_label}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, cta_label: event.target.value }))
                }
              />
            </Field>

            <Field label="Start date" htmlFor="promo-start" tone="dark">
              <Input
                id="promo-start"
                type="date"
                tone="dark"
                value={draft.start_date}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, start_date: event.target.value }))
                }
              />
            </Field>

            <Field label="End date" htmlFor="promo-end" tone="dark">
              <Input
                id="promo-end"
                type="date"
                tone="dark"
                value={draft.end_date}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, end_date: event.target.value }))
                }
              />
            </Field>
          </div>

          <Checkbox
            tone="dark"
            label="Show this promotion on the website"
            checked={draft.is_active}
            onChange={(event) =>
              setDraft((current) => ({ ...current, is_active: event.target.checked }))
            }
          />
          <p className="-mt-3 text-[12.5px] text-cream/35">
            Activating a promotion deactivates any other one, so only a single offer is ever live.
          </p>

          {message ? (
            <p
              className={cn(
                "border px-4 py-3 text-[13px]",
                message.tone === "ok"
                  ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-300"
                  : "border-red-500/30 bg-red-500/5 text-red-400",
              )}
              role="status"
            >
              {message.text}
            </p>
          ) : null}

          <Button type="submit" variant="gold" size="md" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
                Saving
              </>
            ) : (
              "Save Promotion"
            )}
          </Button>
        </form>
      </Panel>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-light text-cream">All promotions</h2>

        {promotions.length === 0 ? (
          <EmptyState
            title="No promotions yet"
            description="Create one to show the offer banner on the home page."
          />
        ) : (
          promotions.map((promotion) => (
            <Panel
              key={promotion.id}
              className={cn(
                "cursor-pointer transition-colors",
                editingId === promotion.id ? "border-gold/40" : "hover:border-cream/20",
              )}
            >
              <button
                type="button"
                onClick={() => select(promotion)}
                className="w-full text-left"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-[2rem] leading-none text-gilded">
                    {promotion.discount}%
                  </p>
                  <span
                    className={cn(
                      "border px-2 py-0.5 text-[10px] tracking-[0.14em] uppercase",
                      promotion.is_active
                        ? "border-emerald-400/40 text-emerald-300"
                        : "border-cream/20 text-cream/35",
                    )}
                  >
                    {promotion.is_active ? "Live" : "Off"}
                  </span>
                </div>
                <p className="mt-3 text-[14.5px] text-cream">{promotion.title}</p>
                {promotion.start_date || promotion.end_date ? (
                  <p className="mt-1 text-[12px] text-cream/35">
                    {formatDate(promotion.start_date)} → {formatDate(promotion.end_date)}
                  </p>
                ) : null}
              </button>

              <div className="mt-4 flex items-center justify-between border-t border-cream/8 pt-4">
                <Checkbox
                  tone="dark"
                  label={promotion.is_active ? "Live" : "Activate"}
                  checked={promotion.is_active}
                  disabled={pending && busyId === promotion.id}
                  onChange={() => toggle(promotion)}
                />
                <button
                  type="button"
                  onClick={() => remove(promotion)}
                  disabled={pending && busyId === promotion.id}
                  aria-label={`Delete ${promotion.title}`}
                  className="text-cream/30 transition-colors hover:text-red-400 disabled:opacity-40"
                >
                  {pending && busyId === promotion.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.4} />
                  ) : (
                    <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                  )}
                </button>
              </div>
            </Panel>
          ))
        )}
      </div>
    </div>
  );
}
