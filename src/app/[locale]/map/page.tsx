import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { PropertiesMapView } from "@/components/properties-map-view";
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
  if (!isLocale(locale)) return {};
  return buildMetadata({
    locale,
    path: "/map",
    title:
      locale === "ar"
        ? "خريطة الوحدات | Image Investments"
        : "Properties Map | Image Investments",
    description:
      locale === "ar"
        ? "تصفح كل الوحدات على خريطة واحدة وشاهد المنطقة بسرعة."
        : "Browse all listings on a single map for quick area reference.",
  });
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const properties = await getAllProperties();

  return (
    <>
      <PageHero
        eyebrow={locale === "ar" ? "الخريطة" : "Map"}
        title={
          locale === "ar"
            ? "كل الوحدات على خريطة واحدة"
            : "All properties on one map"
        }
        description={
          locale === "ar"
            ? "اضغط على أي منطقة لعرض الوحدات المتاحة فيها."
            : "Tap any area to see the properties available there."
        }
      />
      <section className="container-shell py-10 md:py-14">
        <PropertiesMapView locale={locale} properties={properties} />
      </section>
    </>
  );
}
