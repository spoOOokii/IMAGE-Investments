import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import {
  getDirection,
  isLocale,
  locales,
  type Locale,
} from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }
  const currentLocale: Locale = locale;

  return (
    <div dir={getDirection(currentLocale)} className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--color-gold)] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-[var(--color-navy)]"
      >
        {locale === "ar" ? "انتقل للمحتوى الرئيسي" : "Skip to main content"}
      </a>
      <SiteHeader locale={currentLocale} />
      <main id="main-content">{children}</main>
      <SiteFooter locale={currentLocale} />
      <WhatsAppFloat locale={currentLocale} />
      <ScrollToTop locale={currentLocale} />
    </div>
  );
}
