"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type AdminLoginFormProps = {
  redirectTo: string;
};

export function AdminLoginForm({ redirectTo }: AdminLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "تعذر تسجيل الدخول");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "تعذر تسجيل الدخول",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      dir="rtl"
      onSubmit={handleSubmit}
      className="luxury-surface w-full space-y-5 rounded-[2rem] p-8"
    >
      <div className="space-y-2 text-center">
        <h1 className="display-heading text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
          تسجيل الدخول للوحة الإدارة
        </h1>
        <p className="text-sm text-[var(--color-ink-soft)]">
          أدخل كلمة المرور للدخول إلى لوحة إدارة الوحدات.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="admin-password" className="block text-sm font-semibold text-[var(--color-ink)]">
          كلمة المرور
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
        />
      </div>

      {error ? (
        <div className="rounded-[1.25rem] border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-[var(--color-navy)] transition hover:bg-[var(--color-gold-bright)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "جاري التحقق..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
