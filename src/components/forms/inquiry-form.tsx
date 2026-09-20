"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { submitInquiry } from "@/app/actions/inquiry";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { SERVICE_OPTIONS } from "@/lib/site";
import { inquirySchema, type InquiryInput } from "@/lib/validations/inquiry";
import { whatsappHref } from "@/lib/utils";

type Tone = "light" | "dark";

export function InquiryForm({
  whatsapp,
  tone = "light",
}: {
  whatsapp: string;
  tone?: Tone;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<
    { kind: "success" } | { kind: "error"; message: string } | { kind: "whatsapp"; href: string } | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setError,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: "Curtains",
      preferred_date: "",
      message: "",
    },
  });

  const onSubmit = (values: InquiryInput) => {
    setResult(null);

    startTransition(async () => {
      const response = await submitInquiry(values);

      if (response.status === "success") {
        setResult({ kind: "success" });
        reset();
        return;
      }

      if (response.status === "invalid") {
        for (const [field, message] of Object.entries(response.errors)) {
          setError(field as keyof InquiryInput, { message });
        }
        return;
      }

      if (response.status === "unconfigured") {
        // No database yet — hand the filled-in details to WhatsApp instead of
        // silently dropping them.
        const current = getValues();
        const lines = [
          "Hello Janjua Curtain House, I would like to request a free measurement.",
          "",
          `Name: ${current.name}`,
          `Phone: ${current.phone}`,
          current.email ? `Email: ${current.email}` : null,
          `Service: ${current.service}`,
          current.preferred_date ? `Preferred date: ${current.preferred_date}` : null,
          current.message ? `Message: ${current.message}` : null,
        ].filter(Boolean);

        setResult({ kind: "whatsapp", href: whatsappHref(whatsapp, lines.join("\n")) });
        return;
      }

      setResult({ kind: "error", message: response.message });
    });
  };

  const muted = tone === "dark" ? "text-cream/55" : "text-ink/55";

  if (result?.kind === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={
          tone === "dark"
            ? "border border-gold/30 bg-ink/40 p-10 text-center"
            : "border border-gold/40 bg-cream p-10 text-center"
        }
        role="status"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/50 text-gold">
          <Check className="h-6 w-6" strokeWidth={1.4} />
        </span>
        <h3
          className={`mt-6 font-display text-2xl font-light ${tone === "dark" ? "text-cream" : "text-ink"}`}
        >
          Thank you!
        </h3>
        <p className={`mt-3 text-[15px] leading-[1.85] ${muted}`}>
          Your request has been received. Janjua Curtain House will contact you shortly.
        </p>
        <Button
          variant={tone === "dark" ? "outline" : "outlineDark"}
          size="sm"
          className="mt-7"
          onClick={() => setResult(null)}
        >
          Send Another Request
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="name" tone={tone} required error={errors.name?.message}>
          <Input
            id="name"
            tone={tone}
            invalid={Boolean(errors.name)}
            placeholder="Your name"
            autoComplete="name"
            {...register("name")}
          />
        </Field>

        <Field
          label="Phone Number"
          htmlFor="phone"
          tone={tone}
          required
          error={errors.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            tone={tone}
            invalid={Boolean(errors.phone)}
            placeholder="+971 50 000 0000"
            autoComplete="tel"
            {...register("phone")}
          />
        </Field>

        <Field label="Email" htmlFor="email" tone={tone} error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            tone={tone}
            invalid={Boolean(errors.email)}
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
          />
        </Field>

        <Field label="Service" htmlFor="service" tone={tone} required error={errors.service?.message}>
          <Select id="service" tone={tone} invalid={Boolean(errors.service)} {...register("service")}>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Preferred Date"
          htmlFor="preferred_date"
          tone={tone}
          error={errors.preferred_date?.message}
          className="sm:col-span-2"
        >
          <Input
            id="preferred_date"
            type="date"
            tone={tone}
            invalid={Boolean(errors.preferred_date)}
            {...register("preferred_date")}
          />
        </Field>
      </div>

      <Field label="Message" htmlFor="message" tone={tone} error={errors.message?.message}>
        <Textarea
          id="message"
          rows={4}
          tone={tone}
          invalid={Boolean(errors.message)}
          placeholder="Tell us about your windows, rooms or the look you want."
          {...register("message")}
        />
      </Field>

      {result?.kind === "error" ? (
        <p className="border border-red-500/30 bg-red-500/5 px-4 py-3 text-[13.5px] text-red-600" role="alert">
          {result.message}
        </p>
      ) : null}

      {result?.kind === "whatsapp" ? (
        <div className="border border-gold/35 px-5 py-5" role="status">
          <p className={`text-[14px] leading-[1.8] ${muted}`}>
            Online submissions are not connected yet. Send your details straight to our WhatsApp —
            everything you typed is already in the message.
          </p>
          <Button asChild variant="whatsapp" size="md" className="mt-4">
            <a href={result.href} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" />
              Send on WhatsApp
            </a>
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
        <Button type="submit" variant="gold" size="lg" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
              Sending
            </>
          ) : (
            "Request Free Measurement"
          )}
        </Button>
        <p className={`text-[12.5px] ${muted}`}>
          We reply on WhatsApp or by phone, usually the same day.
        </p>
      </div>
    </form>
  );
}
