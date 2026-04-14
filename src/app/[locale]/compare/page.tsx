import { notFound } from "next/navigation";

import { CompareView } from "@/components/compare-view";
import { PageHero } from "@/components/page-hero";
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
    path: "/compare",
    title:
      locale === "ar"
        ? "مقارنة وحدات | Image Investments"
        : "Compare Properties | Image Investments",
    description:
      locale === "ar"
        ? "قارن بين عدة وحدات جنباً إلى جنب لاختيار الأنسب."
        : "Compare multiple properties side-by-side to pick the best fit.",
  });
}

export default async function ComparePage({
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
        eyebrow={locale === "ar" ? "المقارنة" : "Compare"}
        title={
          locale === "ar"
            ? "قارن بين الوحدات جنباً إلى جنب"
            : "Compare properties side-by-side"
        }
        description={
          locale === "ar"
            ? "أضف حتى ثلاث وحدات لمقارنتها في نفس الشاشة."
            : "Add up to three properties to compare on the same screen."
        }
      />
      <section className="container-shell py-10 md:py-14">
        <CompareView locale={locale} properties={properties} />
      </section>
    </>
  );
}
