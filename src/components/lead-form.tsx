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

type FormErrors = {
  fullName?: string;
  phone?: string;
  message?: string;
};

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-+()]/g, "");
  return digits.length >= 8 && digits.length <= 15 && /^\d+$/.test(digits);
}

export function LeadForm({
  locale,
  title,
  description,
  submitLabel,
  theme = "light",
  propertySlug,
  propertyTitle,
  propertyTypeLabel,
  propertyDetails,
  whatsappPhoneNumber,
}: LeadFormProps) {
  const copy = getUiCopy(locale);
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const fieldClassName =
    theme === "dark"
      ? "dark-form-field rounded-2xl border px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
      : "rounded-2xl border border-[var(--color-border)] bg-[var(--color-cream)] px-4 py-3 text-sm outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-gold)]";
  const errorClassName = "text-xs font-semibold text-rose-500";

  function validate(formData: FormData): FormErrors {
    const nextErrors: FormErrors = {};
    const fullName = `${formData.get("fullName") ?? ""}`.trim();
    const phone = `${formData.get("phone") ?? ""}`.trim();
    const message = `${formData.get("message") ?? ""}`.trim();

    if (fullName.length < 2) {
      nextErrors.fullName =
        locale === "ar" ? "أدخل اسمًا صحيحًا" : "Please enter a valid name";
    }
    if (!validatePhone(phone)) {
      nextErrors.phone =
        locale === "ar"
          ? "أدخل رقم هاتف صحيح (8 إلى 15 رقم)"
          : "Enter a valid phone number (8-15 digits)";
    }
    if (message.length < 5) {
      nextErrors.message =
        locale === "ar"
          ? "اكتب رسالة أطول قليلاً"
          : "Please write a longer message";
    }

    return nextErrors;
  }

  function updateFieldValidation(formData: FormData, field: keyof FormErrors) {
    const nextErrors = validate(formData);
    setErrors((current) => ({
      ...current,
      [field]: nextErrors[field],
    }));
  }

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

    if (propertySlug) {
      void fetch(`/api/properties/${propertySlug}/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "lead" }),
      }).catch(() => undefined);
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
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const validationErrors = validate(formData);
          setErrors(validationErrors);
          if (Object.keys(validationErrors).length > 0) {
            setStatus("idle");
            return;
          }
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
        <div className="flex flex-col gap-1">
          <input
            type="text"
            name="fullName"
            required
            placeholder={copy.form.fullName}
            aria-invalid={Boolean(errors.fullName)}
            onBlur={(event) => {
              const formData = new FormData(event.currentTarget.form!);
              updateFieldValidation(formData, "fullName");
            }}
            onChange={(event) => {
              const formData = new FormData(event.currentTarget.form!);
              updateFieldValidation(formData, "fullName");
            }}
            className={fieldClassName}
          />
          {errors.fullName ? <span className={errorClassName}>{errors.fullName}</span> : null}
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="tel"
            name="phone"
            required
            placeholder={copy.form.phone}
            aria-invalid={Boolean(errors.phone)}
            onBlur={(event) => {
              const formData = new FormData(event.currentTarget.form!);
              updateFieldValidation(formData, "phone");
            }}
            onChange={(event) => {
              const formData = new FormData(event.currentTarget.form!);
              updateFieldValidation(formData, "phone");
            }}
            className={fieldClassName}
          />
          {errors.phone ? <span className={errorClassName}>{errors.phone}</span> : null}
        </div>
        <div className="flex flex-col gap-1 md:col-span-2">
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
            aria-invalid={Boolean(errors.message)}
            onBlur={(event) => {
              const formData = new FormData(event.currentTarget.form!);
              updateFieldValidation(formData, "message");
            }}
            onChange={(event) => {
              const formData = new FormData(event.currentTarget.form!);
              updateFieldValidation(formData, "message");
            }}
            className={fieldClassName}
          />
          {errors.message ? <span className={errorClassName}>{errors.message}</span> : null}
        </div>

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
