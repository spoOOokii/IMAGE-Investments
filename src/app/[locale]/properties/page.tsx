import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { PropertyFilters } from "@/components/property-filters";
import { buildMetadata } from "@/lib/seo";
import { getAllProperties } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";

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
        ? "تصفح عقارات مميزة في القاهرة الجديدة، الشيخ زايد، العاصمة الإدارية، الساحل الشمالي، والعين السخنة مع فلاتر متقدمة."
        : "Browse premium Egyptian properties with advanced filters across New Cairo, Sheikh Zayed, the New Capital, the North Coast, and Ain Sokhna.",
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
            ? "تصفح عقارات مصرية مميزة بفلاتر متقدمة"
            : "Browse premium Egyptian property inventory with advanced filters"
        }
        description={
          locale === "ar"
            ? "اعرض الوحدات بحسب الموقع، النوع، وعدد الغرف."
            : "Filter listings by location, property type, and bedrooms."
        }
      />

      <section className="container-shell py-18">
        <PropertyFilters locale={locale} properties={properties} />
      </section>
    </>
  );
}
