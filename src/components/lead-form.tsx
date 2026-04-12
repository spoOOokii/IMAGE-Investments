"use client";

import { useState } from "react";

import { getUiCopy, type Locale } from "@/lib/i18n";
import { companyProfile } from "@/lib/site-data";
import {
  buildPropertyInquiryMessage,
  buildWhatsAppHref,
} from "@/lib/whatsapp";

type LeadFormProps = {
  locale: Locale;
  source: string;
  title: string;
  description: string;
  submitLabel?: string;
  theme?: "light" | "dark";
  propertySlug?: string;
  propertyTitle?: string;
  propertyTypeLabel?: string;
  propertyDetails?: string[];
  contactMode?: "whatsapp";
  whatsappPhoneNumber?: string;
};

export function LeadForm({
  locale,
  title,
  description,
  submitLabel,
  theme = "light",
  propertyTitle,
  propertyTypeLabel,
  propertyDetails,
  whatsappPhoneNumber,
}: LeadFormProps) {
  const copy = getUiCopy(locale);
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const fieldClassName =
    theme === "dark"
      ? "dark-form-field rounded-2xl border px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
      : "rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)] px-4 py-3 text-sm outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-gold)]";

  function openWhatsApp(formData: FormData) {
    const inquiryMessage = buildPropertyInquiryMessage({
      locale,
      propertyTitle:
        propertyTitle ??
        title ??
        (locale === "ar" ? "استشارة عقارية" : "Real estate inquiry"),
      propertyType: propertyTypeLabel,
      propertyDetails,
      fullName: `${formData.get("fullName") ?? ""}`.trim(),
      phone: `${formData.get("phone") ?? ""}`.trim(),
      message: `${formData.get("message") ?? ""}`.trim(),
    });
    const whatsappHref = buildWhatsAppHref(
      whatsappPhoneNumber ?? companyProfile.whatsappNumber,
      inquiryMessage,
    );
    const openedWindow = window.open(whatsappHref, "_blank", "noopener,noreferrer");

    if (!openedWindow) {
      window.location.href = whatsappHref;
    }

    setStatus("success");
  }

  return (
    <div
      className={[
        "rounded-[2rem] p-6 md:p-8",
        theme === "dark"
          ? "luxury-dark theme-on-dark"
          : "luxury-surface text-[var(--color-ink)]",
      ].join(" ")}
    >
      <div className="max-w-xl">
        <h3 className="display-heading text-2xl font-bold md:text-3xl">
          {title}
        </h3>
        <p
          className={[
            "mt-3 text-sm leading-7 md:text-base",
            theme === "dark"
              ? "theme-on-dark-soft"
              : "text-[var(--color-ink-soft)]",
          ].join(" ")}
        >
          {description}
        </p>
      </div>

      <form
        className="mt-6 grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setStatus("idle");
          openWhatsApp(formData);
        }}
      >
        <input
          type="text"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <input
          type="text"
          name="fullName"
          required
          placeholder={copy.form.fullName}
          className={fieldClassName}
        />
        <input
          type="tel"
          name="phone"
          required
          placeholder={copy.form.phone}
          className={fieldClassName}
        />
        <textarea
          name="message"
          required
          rows={5}
          placeholder={
            propertyTypeLabel || propertyTitle
              ? locale === "ar"
                ? "اكتب رسالتك وسيتم إرفاق بيانات الوحدة تلقائيًا في واتساب"
                : "Write your message and the property details will be included automatically on WhatsApp"
              : locale === "ar"
                ? "اكتب تفاصيل طلبك وسيتم إرسالها عبر واتساب"
                : "Write your request details and they will be sent through WhatsApp"
          }
          className={`${fieldClassName} md:col-span-2`}
        />

        <div className="md:col-span-2 flex flex-col gap-3">
          <p
            className={[
              "text-sm leading-7",
              theme === "dark"
                ? "theme-on-dark-soft"
                : "text-[var(--color-ink-soft)]",
            ].join(" ")}
          >
            {locale === "ar"
              ? "سيتم فتح واتساب برسالة جاهزة تشمل بيانات التواصل ورسالتك."
              : "WhatsApp will open with a ready message that includes your contact details and inquiry."}
          </p>
          <button
            type="submit"
            className="rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-[var(--color-navy)] hover:bg-[var(--color-gold-bright)]"
          >
            {submitLabel ??
              (locale === "ar" ? "إرسال عبر واتساب" : "Send on WhatsApp")}
          </button>
          {status === "success" ? (
            <p className="text-sm text-emerald-500">
              {locale === "ar"
                ? "تم تجهيز الرسالة. أكمل الإرسال عبر واتساب."
                : "Your message is ready. Complete sending it on WhatsApp."}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
