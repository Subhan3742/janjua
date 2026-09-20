"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { saveSettings } from "@/app/actions/admin";
import { Panel } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { settingsSchema, type SettingsValues } from "@/lib/validations/admin";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types/database";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      business_name: settings.business_name,
      tagline: settings.tagline,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      location: settings.location,
      email: settings.email ?? "",
      instagram: settings.instagram ?? "",
      facebook: settings.facebook ?? "",
    },
  });

  const onSubmit = async (values: SettingsValues) => {
    setMessage(null);
    const result = await saveSettings(values);

    if (!result.ok) {
      setMessage({ tone: "error", text: result.message });
      return;
    }

    setMessage({ tone: "ok", text: "Settings saved. The website is updated." });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-2xl space-y-6">
      <Panel>
        <h2 className="font-display text-xl font-light text-cream">Business</h2>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <Field
            label="Business name"
            htmlFor="business_name"
            tone="dark"
            required
            error={errors.business_name?.message}
          >
            <Input
              id="business_name"
              tone="dark"
              invalid={Boolean(errors.business_name)}
              {...register("business_name")}
            />
          </Field>

          <Field
            label="Tagline"
            htmlFor="tagline"
            tone="dark"
            required
            error={errors.tagline?.message}
          >
            <Input
              id="tagline"
              tone="dark"
              invalid={Boolean(errors.tagline)}
              {...register("tagline")}
            />
          </Field>

          <Field
            label="Location"
            htmlFor="location"
            tone="dark"
            required
            error={errors.location?.message}
            className="sm:col-span-2"
          >
            <Input
              id="location"
              tone="dark"
              invalid={Boolean(errors.location)}
              {...register("location")}
            />
          </Field>
        </div>
      </Panel>

      <Panel>
        <h2 className="font-display text-xl font-light text-cream">Contact</h2>
        <p className="mt-2 text-[13px] text-cream/40">
          Used for every call button, WhatsApp link and the structured data on the site.
        </p>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <Field
            label="Phone"
            htmlFor="phone"
            tone="dark"
            required
            error={errors.phone?.message}
          >
            <Input
              id="phone"
              tone="dark"
              invalid={Boolean(errors.phone)}
              placeholder="+971547400549"
              {...register("phone")}
            />
          </Field>

          <Field
            label="WhatsApp"
            htmlFor="whatsapp"
            tone="dark"
            required
            error={errors.whatsapp?.message}
          >
            <Input
              id="whatsapp"
              tone="dark"
              invalid={Boolean(errors.whatsapp)}
              placeholder="+971547400549"
              {...register("whatsapp")}
            />
          </Field>

          <Field
            label="Email"
            htmlFor="email"
            tone="dark"
            error={errors.email?.message}
            className="sm:col-span-2"
          >
            <Input
              id="email"
              type="email"
              tone="dark"
              invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </Field>
        </div>
      </Panel>

      <Panel>
        <h2 className="font-display text-xl font-light text-cream">Social links</h2>
        <p className="mt-2 text-[13px] text-cream/40">
          Leave blank to hide the icon. Paste the full profile URL.
        </p>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <Field
            label="Instagram"
            htmlFor="instagram"
            tone="dark"
            error={errors.instagram?.message}
          >
            <Input
              id="instagram"
              tone="dark"
              invalid={Boolean(errors.instagram)}
              placeholder="https://instagram.com/…"
              {...register("instagram")}
            />
          </Field>

          <Field
            label="Facebook"
            htmlFor="facebook"
            tone="dark"
            error={errors.facebook?.message}
          >
            <Input
              id="facebook"
              tone="dark"
              invalid={Boolean(errors.facebook)}
              placeholder="https://facebook.com/…"
              {...register("facebook")}
            />
          </Field>
        </div>
      </Panel>

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

      <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
            Saving
          </>
        ) : (
          "Save Settings"
        )}
      </Button>
    </form>
  );
}
