import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { buildMetadata } from "@/lib/seo";
import { getAllLocations, getLocationProperties } from "@/lib/cms";
import { isLocale, localizedPath, pickLocale } from "@/lib/i18n";

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
    path: "/locations",
    title: locale === "ar" ? "المناطق | دليل الاستثمار العقاري في مصر" : "Locations | Egypt Real Estate Area Guide",
    description:
      locale === "ar"
        ? "استكشف القاهرة الجديدة، العاصمة الإدارية، الشيخ زايد، 6 أكتوبر، الساحل الشمالي، والعين السخنة."
        : "Explore New Cairo, the New Capital, Sheikh Zayed, 6th of October, the North Coast, and Ain Sokhna.",
  });
}

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const allLocations = await getAllLocations();

  const listingsCount = await Promise.all(
    allLocations.map(async (location) => ({
      slug: location.slug,
      count: (await getLocationProperties(location.slug)).length,
    })),
  );

  return (
    <>
      <PageHero
        eyebrow={locale === "ar" ? "المناطق" : "Locations"}
        title={
          locale === "ar"
            ? "دليل المناطق العقارية الأكثر جاذبية في مصر"
            : "A guide to Egypt's most attractive real estate markets"
        }
        description={
          locale === "ar"
            ? "لكل منطقة شخصية مختلفة من حيث الطلب، نوع العقار، ومستوى العائد المتوقع. هنا تجد الصورة بشكل أوضح."
            : "Each area has a different demand profile, inventory mix, and return potential. This page gives you the strategic picture."
        }
      />

      <section className="container-shell py-18">
        <SectionHeading
          eyebrow={locale === "ar" ? "أسواق نتابعها يوميًا" : "Markets We Track Daily"}
          title={
            locale === "ar"
              ? "اختر المنطقة ثم ابدأ المقارنة بين الفرص"
              : "Choose the area, then compare the right opportunities"
          }
          description={
            locale === "ar"
              ? "كل منطقة تتضمن نظرة سريعة، أسباب الاستثمار، وأنواع العقارات المتاحة فيها."
              : "Every location includes a quick market overview, investment reasons, and featured property types."
          }
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {allLocations.map((location) => (
            <Link
              key={location.slug}
              href={localizedPath(locale, `/locations/${location.slug}`)}
              className="luxury-surface overflow-hidden"
            >
              <div
                className="aspect-[1.25] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(8,23,40,0.18), rgba(8,23,40,0.62)), url(${location.image})`,
                }}
              />
              <div className="p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
                  {locale === "ar" ? "منطقة" : "Area"}
                </div>
                <h2 className="mt-2 text-3xl font-bold text-[var(--color-ink)]">
                  {pickLocale(location.name, locale)}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {pickLocale(location.overview, locale)}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-[var(--color-muted)]">
                    {
                      listingsCount.find((item) => item.slug === location.slug)
                        ?.count
                    }{" "}
                    {locale === "ar" ? "وحدات حالية" : "current listings"}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-gold)]">
                    {locale === "ar" ? "استكشف المنطقة" : "Explore Area"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
