import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { PropertyFilters } from "@/components/property-filters";
import { getAllProperties } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return buildMetadata({
    locale,
    path: "/properties",
    title:
      locale === "ar"
        ? "العقارات | شقق وفيلات وشاليهات للبيع في مصر"
        : "Properties | Apartments, Villas, and Chalets for Sale in Egypt",
    description:
      locale === "ar"
        ? "تصفح عقارات مميزة في القاهرة الجديدة، الشيخ زايد، العاصمة الإدارية، والساحل الشمالي مع فلاتر متقدمة."
        : "Browse premium Egyptian properties with advanced filters across New Cairo, Sheikh Zayed, the New Capital, and the North Coast.",
  });
}

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const properties = await getAllProperties();

  return (
    <>
      <PageHero
        eyebrow={locale === "ar" ? "العقارات" : "Properties"}
        title={
          locale === "ar"
            ? "اكتشف وحدات مختارة تناسب أسلوب حياتك"
            : "Discover curated properties that match your lifestyle"
        }
        description={
          locale === "ar"
            ? "استعرض العقارات المتاحة للبيع والإيجار حسب المنطقة، نوع الوحدة، وعدد الغرف بكل سهولة."
            : "Browse sale and rental listings by area, property type, and bedroom count with ease."
        }
      />

      <section className="container-shell py-10 md:py-14">
        <PropertyFilters locale={locale} properties={properties} />
      </section>
    </>
  );
}
