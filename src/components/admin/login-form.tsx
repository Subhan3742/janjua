"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { loginSchema, type LoginValues } from "@/lib/validations/admin";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setServerError("Those details did not match an account.");
      return;
    }

    const next = params.get("next");
    router.replace(next && next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Field label="Email" htmlFor="email" tone="dark" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          tone="dark"
          invalid={Boolean(errors.email)}
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
      </Field>

      <Field label="Password" htmlFor="password" tone="dark" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          tone="dark"
          invalid={Boolean(errors.password)}
          placeholder="••••••••"
          autoComplete="current-password"
          {...register("password")}
        />
      </Field>

      {serverError ? (
        <p className="border border-red-500/30 bg-red-500/5 px-4 py-3 text-[13px] text-red-400" role="alert">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.6} />
            Signing in
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
