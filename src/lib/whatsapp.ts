import type { Locale } from "@/lib/i18n";

type PropertyInquiryMessageOptions = {
  locale: Locale;
  propertyTitle: string;
  propertyType?: string;
  propertyDetails?: string[];
  fullName?: string;
  phone?: string;
  message?: string;
};

function compactLines(lines: Array<string | undefined>) {
  return lines
    .map((line) => line?.trim())
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

function normalizePhoneDigits(phoneNumber: string) {
  return phoneNumber.replace(/[^\d+]/g, "").replace(/^\+/, "");
}

export function normalizeWhatsAppPhone(phoneNumber: string) {
  const digits = normalizePhoneDigits(phoneNumber);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("20")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `2${digits}`;
  }

  return digits;
}

export function buildWhatsAppHref(phoneNumber: string, text: string) {
  return `https://wa.me/${normalizeWhatsAppPhone(phoneNumber)}?text=${encodeURIComponent(text)}`;
}

export function buildPhoneHref(phoneNumber: string) {
  const digits = normalizePhoneDigits(phoneNumber);
  return `tel:${phoneNumber.trim().startsWith("+") ? `+${digits}` : digits}`;
}

export function buildPropertyInquiryMessage({
  locale,
  propertyTitle,
  propertyType,
  propertyDetails,
  fullName,
  phone,
  message,
}: PropertyInquiryMessageOptions) {
  if (locale === "ar") {
    return compactLines([
      "مرحبًا، أرغب في الاستفسار عن هذه الوحدة.",
      "",
      propertyType ? `نوع الوحدة: ${propertyType}` : undefined,
      `اسم الوحدة: ${propertyTitle}`,
      ...(propertyDetails ?? []),
      fullName ? `الاسم: ${fullName}` : undefined,
      phone ? `رقم الهاتف: ${phone}` : undefined,
      message ? `الرسالة: ${message}` : undefined,
    ]);
  }

  return compactLines([
    "Hello, I would like to inquire about this property.",
    "",
    propertyType ? `Property type: ${propertyType}` : undefined,
    `Property title: ${propertyTitle}`,
    ...(propertyDetails ?? []),
    fullName ? `Name: ${fullName}` : undefined,
    phone ? `Phone: ${phone}` : undefined,
    message ? `Message: ${message}` : undefined,
  ]);
}
