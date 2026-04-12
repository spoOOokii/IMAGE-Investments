import Link from "next/link";
import { notFound } from "next/navigation";

import { FeaturedPropertiesSlider } from "@/components/featured-properties-slider";
import { LeadForm } from "@/components/lead-form";
import { SectionHeading } from "@/components/section-heading";
import {
  getAllLocations,
  getAllProperties,
  getHomeCollections,
} from "@/lib/cms";
import { getUiCopy, isLocale, localizedPath, pickLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { companyProfile } from "@/lib/site-data";

export const dynamic = "force-dynamic";

function getRandomProperties<T>(items: T[], count: number) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

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
    title:
      locale === "ar"
        ? "استثمر بذكاء في أفضل العقارات داخل مصر"
        : "Invest smarter in Egypt's best real estate opportunities",
    description:
      locale === "ar"
        ? "اكتشف فرص عقارية مميزة في القاهرة الجديدة، العاصمة الإدارية، الشيخ زايد، الساحل الشمالي، والعين السخنة مع إيمدج للاستثمارات."
        : "Discover premium Egyptian property opportunities across New Cairo, New Capital, Sheikh Zayed, North Coast, and Ain Sokhna with Image Investments.",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getUiCopy(locale);
  const [allProperties, allLocations, homeCollections] =
    await Promise.all([
      getAllProperties(),
      getAllLocations(),
      getHomeCollections(),
    ]);
  const randomProperties = getRandomProperties(allProperties, 8);

  const heroTitle =
    locale === "ar"
      ? "استثمر بذكاء في أفضل العقارات داخل مصر"
      : "Invest smarter in Egypt's most promising real estate opportunities";
  const heroSubtitle =
    locale === "ar"
      ? "اكتشف فرص عقارية مميزة في القاهرة الجديدة، العاصمة الإدارية، الشيخ زايد، الساحل الشمالي، والعين السخنة"
      : "Discover premium property opportunities across New Cairo, New Capital, Sheikh Zayed, North Coast, and Ain Sokhna";

  function removeStatNumbers(value: string) {
    return value.replace(/[+0-9٠-٩]/g, "").trim();
  }

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        name: companyProfile.shortName,
        telephone: companyProfile.phoneDisplay,
        email: companyProfile.email,
        areaServed: "Egypt",
        address: {
          "@type": "PostalAddress",
          streetAddress: companyProfile.officeAddress.en,
          addressCountry: "EG",
        },
      },
      ...randomProperties.slice(0, 3).map((property) => ({
        "@type": "Residence",
        name: property.title.en,
        image: property.gallery[0],
        description: property.summary.en,
        address: {
          "@type": "PostalAddress",
          addressLocality: property.locationName.en,
          addressCountry: "EG",
        },
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />

      <section className="home-hero relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="home-hero-video absolute inset-0 h-full w-full object-cover opacity-72 saturate-[1.16]"
        >
          <source src="/media/hero.mp4" />
        </video>
        <div className="home-hero-overlay absolute inset-0" />

        <div className="home-hero-content container-shell relative grid gap-10 py-18 md:grid-cols-[1.2fr_0.8fr] md:py-24">
          <div className="max-w-3xl py-6">
            <span className="section-kicker">
              {locale === "ar"
                ? "مستشارك العقاري داخل مصر"
                : "Your trusted Egyptian real estate advisor"}
            </span>
            <h1 className="display-heading mt-6 text-4xl font-bold leading-tight md:text-7xl">
              {heroTitle}
            </h1>
            <p className="home-hero-copy-soft mt-6 max-w-2xl text-base leading-8 md:text-xl">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={localizedPath(locale, "/properties")}
                className="rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-[var(--color-navy)] hover:bg-[var(--color-gold-bright)]"
              >
                {copy.actions.browseProperties}
              </Link>
              <Link
                href={localizedPath(locale, "/contact")}
                className="home-hero-outline-button rounded-full border px-6 py-3 text-sm font-bold"
              >
                {copy.actions.contactUs}
              </Link>
              <a
                href={companyProfile.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="home-hero-transparent-button rounded-full border px-6 py-3 text-sm font-bold"
              >
                {copy.actions.whatsapp}
              </a>
            </div>
          </div>

          <div className="luxury-dark gold-outline theme-on-dark self-start p-6 md:p-8">
            <div className="english-accent text-xs uppercase tracking-[0.45em] text-[var(--color-gold-bright)]">
              {locale === "ar" ? "محور التميز" : "Signature Focus"}
            </div>
            <h2 className="mt-4 text-3xl font-bold">
              {locale === "ar"
                ? "عقارات مختارة بعناية للمشتري والمستثمر"
                : "Curated property opportunities for buyers and investors"}
            </h2>
            <div className="theme-on-dark-soft mt-6 space-y-4 text-sm leading-8">
              <p>
                {locale === "ar"
                  ? "نركز على الوحدات التي تمتلك ميزة واضحة: موقع قوي، جودة مشروع، ومساحة مناسبة لاحتياج العميل."
                  : "We focus on listings with a clear edge: strong location, quality project profile, and practical livability."}
              </p>
              <div className="grid gap-3">
                {homeCollections.trustPoints.slice(0, 3).map((point) => (
                  <div
                    key={point.title.en}
                    className="theme-on-dark-card rounded-[1.5rem] border px-4 py-3"
                  >
                    <div className="font-semibold text-[var(--theme-dark-heading)]">
                      {pickLocale(point.title, locale)}
                    </div>
                    <p className="theme-on-dark-card-copy mt-1 text-sm">
                      {pickLocale(point.description, locale)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pt-18">
        <div className="mb-8 pt-12">
          <span className="section-kicker">
            {locale === "ar" ? "وحدات متنوعة" : "Random Properties"}
          </span>
        </div>
        <FeaturedPropertiesSlider locale={locale} properties={randomProperties} />
      </section>

      <section className="container-shell pt-18">
        <SectionHeading
          eyebrow={locale === "ar" ? "أنواع العقارات" : "Property Types"}
          title={
            locale === "ar"
              ? "فئات متنوعة تغطي احتياجات السكن والاستثمار"
              : "Property categories built for living, investing, and seasonal buying"
          }
          description={
            locale === "ar"
              ? "من الشقق وحتى الفيلات والشاليهات، نرتب لك الخيارات حسب الاستخدام والعائد والميزانية."
              : "From apartments to villas and chalets, we organize opportunities by use case, return profile, and budget."
          }
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {homeCollections.categories.map((category) => (
            <div key={category.slug} className="luxury-surface p-6">
              <div className="text-sm font-bold text-[var(--color-gold)]">
                {removeStatNumbers(pickLocale(category.stat, locale))}
              </div>
              <h3 className="mt-3 text-2xl font-bold text-[var(--color-ink)]">
                {pickLocale(category.label, locale)}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                {pickLocale(category.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell pt-18">
        <SectionHeading
          eyebrow={locale === "ar" ? "أفضل المناطق" : "Top Locations"}
          title={
            locale === "ar"
              ? "مناطق قوية داخل مصر بعوائد وسكن عالي الطلب"
              : "High-demand Egyptian locations for lifestyle and investment"
          }
          description={
            locale === "ar"
              ? "القاهرة الجديدة، العاصمة، الشيخ زايد، أكتوبر، الساحل، والسخنة ضمن الأسواق التي نتابعها يوميًا."
              : "New Cairo, the New Capital, Sheikh Zayed, October, the North Coast, and Ain Sokhna are the core markets we actively track."
          }
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {allLocations.map((location) => (
            <Link
              key={location.slug}
              href={localizedPath(locale, `/locations/${location.slug}`)}
              className="luxury-surface group overflow-hidden"
            >
              <div
                className="relative aspect-[1.2] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(8,23,40,0.06), rgba(8,23,40,0.65)), url(${location.image})`,
                }}
              >
                <div className="absolute inset-x-5 bottom-5">
                  <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-bright)]">
                    {locale === "ar" ? "وجهة استثمار" : "Market Focus"}
                  </div>
                  <h3 className="mt-2 text-3xl font-bold text-white">
                    {pickLocale(location.name, locale)}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-7 text-[var(--color-ink-soft)]">
                  {pickLocale(location.overview, locale)}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {location.highlights.map((highlight) => (
                    <span
                      key={highlight.label.en}
                      className="rounded-full bg-[rgba(255,255,255,0.06)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]"
                    >
                      {pickLocale(highlight.label, locale)}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell pt-18">
        <SectionHeading
          eyebrow={locale === "ar" ? "لماذا نحن" : "Why Choose Us"}
          title={
            locale === "ar"
              ? "خبرة سوقية، شفافية، ودعم حقيقي حتى الإغلاق"
              : "Market intelligence, transparency, and real lead support"
          }
          description={
            locale === "ar"
              ? "نعمل كمرشد عقاري موثوق، لا كمجرّد عارض وحدات."
              : "We operate as a trusted real estate advisor, not just a listing broker."
          }
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {homeCollections.trustPoints.map((point) => (
            <div key={point.title.en} className="luxury-surface p-6">
              <h3 className="text-xl font-bold text-[var(--color-ink)]">
                {pickLocale(point.title, locale)}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                {pickLocale(point.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell pt-18">
        <SectionHeading
          eyebrow={locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}
          title={locale === "ar" ? "الأسئلة الشائعة" : "Frequently asked questions"}
          description={
            locale === "ar"
              ? "إجابات سريعة على أكثر الأسئلة شيوعًا لدى المشترين والمستثمرين."
              : "Quick answers to common questions from buyers and investors."
          }
        />
        <div className="grid gap-4">
          {homeCollections.faqs.map((faq) => (
            <details key={faq.question.en} className="faq-item luxury-surface px-6 py-5">
              <summary className="cursor-pointer text-lg font-bold text-[var(--color-ink)]">
                {pickLocale(faq.question, locale)}
              </summary>
              <p className="mt-4 text-sm leading-8 text-[var(--color-ink-soft)]">
                {pickLocale(faq.answer, locale)}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-shell py-18">
        <LeadForm
          locale={locale}
          source="homepage"
          theme="dark"
          title={
            locale === "ar"
              ? "ابدأ مع مستشارك العقاري الآن"
              : "Start with a trusted property advisor now"
          }
          description={
            locale === "ar"
              ? "احجز استشارتك العقارية الآن أو اطلب أفضل فرص السكن والاستثمار المناسبة لميزانيتك."
              : "Book your real estate consultation now and request the best opportunities for your budget and goals."
          }
          submitLabel={copy.actions.requestCall}
        />
      </section>
    </>
  );
}

