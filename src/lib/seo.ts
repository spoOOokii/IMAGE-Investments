import type { Metadata } from "next";

import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";

const baseUrl = "https://www.imageinvestments-eg.com";

export function buildMetadata({
  locale,
  title,
  description,
  path = "",
  image = "/media/logo.png",
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${baseUrl}${localizedPath(locale, path)}`;
  const alternatePath = path || "";

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: `${baseUrl}${localizedPath("ar", alternatePath)}`,
        en: `${baseUrl}${localizedPath("en", alternatePath)}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Image Investments",
      images: [{ url: image }],
      locale: locale === "ar" ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
