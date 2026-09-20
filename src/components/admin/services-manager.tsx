"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { deleteService, saveService, toggleServiceActive } from "@/app/actions/admin";
import { EmptyState, Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/field";
import { ICON_NAMES } from "@/components/ui/icon";
import { cn, slugify } from "@/lib/utils";
import type { Service } from "@/types/database";

type Draft = {
  title: string;
  slug: string;
  description: string;
  image_url: string;
  category: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
};

const EMPTY: Draft = {
  title: "",
  slug: "",
  description: "",
  image_url: "",
  category: "Curtains",
  icon: "Scissors",
  is_active: true,
  sort_order: 0,
};

export function ServicesManager({ services }: { services: Service[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Service | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  /** Opening the editor seeds the draft — no effect needed to sync them. */
  const openEditor = (target: Service | "new") => {
    setEditing(target);
    setError(null);
    setDraft(
      target === "new"
        ? { ...EMPTY, sort_order: services.length + 1 }
        : {
            title: target.title,
            slug: target.slug,
            description: target.description ?? "",
            image_url: target.image_url ?? "",
            category: target.category,
            icon: target.icon ?? "Scissors",
            is_active: target.is_active,
            sort_order: target.sort_order,
          },
    );
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const result = await saveService(editing === "new" || !editing ? null : editing.id, {
      ...draft,
      slug: draft.slug || slugify(draft.title),
      description: draft.description || undefined,
      image_url: draft.image_url || undefined,
      icon: draft.icon || undefined,
    });

    setSaving(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setEditing(null);
    router.refresh();
  };

  const toggle = (service: Service) => {
    setBusyId(service.id);
    startTransition(async () => {
      await toggleServiceActive(service.id, !service.is_active);
      setBusyId(null);
      router.refresh();
    });
  };

  const remove = (service: Service) => {
    if (!window.confirm(`Delete "${service.title}" permanently?`)) return;

    setBusyId(service.id);
    startTransition(async () => {
      await deleteService(service.id);
      setBusyId(null);
      router.refresh();
    });
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button variant="gold" size="md" onClick={() => openEditor("new")}>
          <Plus className="h-4 w-4" strokeWidth={1.6} />
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Until you add services here, the website shows its built-in default list."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {services.map((service) => (
            <Panel key={service.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-display text-xl font-light text-cream">
                      {service.title}
                    </h2>
                    <span
                      className={cn(
                        "border px-2 py-0.5 text-[10px] tracking-[0.14em] uppercase",
                        service.is_active
                          ? "border-emerald-400/40 text-emerald-300"
                          : "border-cream/20 text-cream/35",
                      )}
                    >
                      {service.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] text-cream/35">
                    /{service.slug} · {service.category} · order {service.sort_order}
                  </p>
                </div>

                <div className="flex shrink-0 gap-3">
                  <button
                    type="button"
                    onClick={() => openEditor(service)}
                    aria-label={`Edit ${service.title}`}
                    className="text-cream/35 transition-colors hover:text-gold"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.4} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(service)}
                    disabled={pending && busyId === service.id}
                    aria-label={`Delete ${service.title}`}
                    className="text-cream/35 transition-colors hover:text-red-400 disabled:opacity-40"
                  >
                    {pending && busyId === service.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.4} />
                    ) : (
                      <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                    )}
                  </button>
                </div>
              </div>

              {service.description ? (
                <p className="mt-4 flex-1 text-[13.5px] leading-relaxed text-cream/50">
                  {service.description}
                </p>
              ) : null}

              <div className="mt-5 border-t border-cream/8 pt-4">
                <Checkbox
                  tone="dark"
                  label={service.is_active ? "Visible on the website" : "Hidden from the website"}
                  checked={service.is_active}
                  disabled={pending && busyId === service.id}
                  onChange={() => toggle(service)}
                />
              </div>
            </Panel>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/75 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setEditing(null)}
          >
            <motion.form
              onSubmit={save}
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-lg border border-cream/10 bg-charcoal p-6 sm:p-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label={editing === "new" ? "Add service" : "Edit service"}
            >
              <div className="flex items-start justify-between">
                <h2 className="font-display text-2xl font-light text-cream">
                  {editing === "new" ? "Add service" : "Edit service"}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  aria-label="Close"
                  className="grid h-10 w-10 place-items-center border border-cream/12 text-cream/60 transition-colors hover:border-gold hover:text-gold"
                >
                  <X className="h-4 w-4" strokeWidth={1.3} />
                </button>
              </div>

              <div className="mt-7 space-y-6">
                <Field label="Title" htmlFor="service-title" tone="dark" required>
                  <Input
                    id="service-title"
                    tone="dark"
                    value={draft.title}
                    onChange={(event) => {
                      const title = event.target.value;
                      setDraft((current) => ({
                        ...current,
                        title,
                        slug:
                          editing === "new" && (!current.slug || current.slug === slugify(current.title))
                            ? slugify(title)
                            : current.slug,
                      }));
                    }}
                  />
                </Field>

                <Field label="Slug" htmlFor="service-slug" tone="dark" required>
                  <Input
                    id="service-slug"
                    tone="dark"
                    value={draft.slug}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, slug: event.target.value }))
                    }
                  />
                </Field>

                <Field label="Description" htmlFor="service-description" tone="dark">
                  <Textarea
                    id="service-description"
                    tone="dark"
                    rows={3}
                    value={draft.description}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, description: event.target.value }))
                    }
                  />
                </Field>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Category" htmlFor="service-category" tone="dark" required>
                    <Input
                      id="service-category"
                      tone="dark"
                      value={draft.category}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, category: event.target.value }))
                      }
                    />
                  </Field>

                  <Field label="Icon" htmlFor="service-icon" tone="dark">
                    <Select
                      id="service-icon"
                      tone="dark"
                      value={draft.icon}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, icon: event.target.value }))
                      }
                    >
                      {ICON_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <Field
                  label="Image URL"
                  htmlFor="service-image"
                  tone="dark"
                  error={undefined}
                >
                  <Input
                    id="service-image"
                    tone="dark"
                    value={draft.image_url}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, image_url: event.target.value }))
                    }
                    placeholder="/images/services/custom-curtains.svg"
                  />
                </Field>

                <Field label="Sort order" htmlFor="service-order" tone="dark">
                  <Input
                    id="service-order"
                    type="number"
                    min={0}
                    tone="dark"
                    value={draft.sort_order}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        sort_order: Number(event.target.value),
                      }))
                    }
                  />
                </Field>

                <Checkbox
                  tone="dark"
                  label="Show this service on the website"
                  checked={draft.is_active}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, is_active: event.target.checked }))
                  }
                />

                {error ? (
                  <p className="border border-red-500/30 bg-red-500/5 px-4 py-3 text-[13px] text-red-400" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>

              <div className="mt-8 flex gap-3">
                <Button type="submit" variant="gold" size="md" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
                      Saving
                    </>
                  ) : (
                    "Save Service"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
