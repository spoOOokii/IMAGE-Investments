import { notFound } from "next/navigation";

import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { PropertyCard } from "@/components/property-card";
import { SectionHeading } from "@/components/section-heading";
import { getLocationBySlug, getLocationProperties } from "@/lib/cms";
import { isLocale, pickLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { locations } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const location = await getLocationBySlug(slug);

  if (!location) {
    return {};
  }

  return buildMetadata({
    locale,
    path: `/locations/${slug}`,
    title: pickLocale(location.name, locale),
    description: pickLocale(location.overview, locale),
    image: location.image,
  });
}

export default async function LocationDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const locationProperties = await getLocationProperties(slug);

  return (
    <>
      <PageHero
        eyebrow={locale === "ar" ? "دليل المنطقة" : "Location Guide"}
        title={pickLocale(location.heroTitle, locale)}
        description={pickLocale(location.heroDescription, locale)}
      />

      <section className="container-shell pt-18">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="luxury-surface p-8">
            <SectionHeading
              eyebrow={pickLocale(location.name, locale)}
              title={
                locale === "ar"
                  ? "لماذا تعتبر هذه المنطقة وجهة قوية؟"
                  : "Why this area matters for buyers and investors"
              }
              description={pickLocale(location.overview, locale)}
            />
            <div className="grid gap-4">
              {location.whyInvest.map((reason) => (
                <div key={reason.en} className="rounded-[1.5rem] bg-[var(--color-cream)] p-5">
                  {pickLocale(reason, locale)}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="luxury-dark theme-on-dark overflow-hidden p-8"
              style={{
                backgroundImage: `var(--image-panel-overlay), url(${location.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="english-accent text-xs uppercase tracking-[0.35em] text-[var(--color-gold-bright)]">
                {locale === "ar" ? "ملخص المنطقة" : "Area Snapshot"}
              </div>
              <div className="mt-6 grid gap-4">
                {location.highlights.map((highlight) => (
                  <div
                    key={highlight.label.en}
                    className="theme-on-dark-card rounded-[1.5rem] border p-4"
                  >
                    <div className="theme-on-dark-muted text-sm">
                      {pickLocale(highlight.label, locale)}
                    </div>
                    <div className="mt-2 font-semibold text-[var(--theme-dark-heading)]">
                      {pickLocale(highlight.value, locale)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pt-18">
        <SectionHeading
          eyebrow={locale === "ar" ? "العقارات المميزة" : "Featured Listings"}
          title={
            locale === "ar"
              ? `أفضل الوحدات داخل ${pickLocale(location.name, locale)}`
              : `Featured listings in ${pickLocale(location.name, locale)}`
          }
          description={
            locale === "ar"
              ? "فرص مختارة تجمع بين الموقع، جودة المشروع، وقوة الطلب."
              : "Curated opportunities that combine address, project quality, and demand strength."
          }
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {locationProperties.map((property) => (
            <PropertyCard key={property.slug} locale={locale} property={property} />
          ))}
        </div>
      </section>

      <section className="container-shell py-18">
        <LeadForm
          locale={locale}
          source={`location-${location.slug}`}
          title={
            locale === "ar"
              ? `اطلب أفضل فرص ${pickLocale(location.name, locale)}`
              : `Request the best ${pickLocale(location.name, locale)} opportunities`
          }
          description={
            locale === "ar"
              ? "شاركنا بميزانيتك ونوع العقار المستهدف لنرسل لك الوحدات الأنسب داخل هذه المنطقة."
              : "Share your budget and target property type and we will send the strongest matches in this area."
          }
        />
      </section>
    </>
  );
}
