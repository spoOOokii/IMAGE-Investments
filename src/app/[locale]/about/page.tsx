import { notFound } from "next/navigation";

import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { buildMetadata } from "@/lib/seo";
import { aboutContent, trustPoints } from "@/lib/site-data";
import { getUiCopy, isLocale, pickLocale } from "@/lib/i18n";

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
    path: "/about",
    title:
      locale === "ar"
        ? "من نحن | ايمدج للاستثمارات"
        : "About Image Investments",
    description:
      locale === "ar"
        ? "تعرف على إيمدج للاستثمارات كشركة تسويق واستشارات عقارية تركز على المعرفة السوقية، الشفافية، والدعم الحقيقي للعميل."
        : "Learn about Image Investments as a trusted Egyptian real estate marketing and advisory company focused on transparency and market intelligence.",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getUiCopy(locale);

  return (
    <>
      <PageHero
        eyebrow={locale === "ar" ? "عن الشركة" : "About Us"}
        title={
          locale === "ar"
            ? "شريك عقاري موثوق يقرأ السوق قبل أن يوصي بالفرصة"
            : "A trusted real estate partner that reads the market before recommending the opportunity"
        }
        description={pickLocale(aboutContent.story, locale)}
      />

      <section className="container-shell pt-18">
        <div className="luxury-surface p-8">
          <SectionHeading
            eyebrow={locale === "ar" ? "قصتنا" : "Our Story"}
            title={
              locale === "ar"
                ? "خبرة سوقية تركّز على القرار الصحيح"
                : "Market experience focused on the right decision"
            }
            description={pickLocale(aboutContent.story, locale)}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[rgba(255,255,255,0.05)] p-5">
              <h3 className="text-xl font-bold text-[var(--color-ink)]">
                {locale === "ar" ? "رسالتنا" : "Mission"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                {pickLocale(aboutContent.mission, locale)}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[rgba(255,255,255,0.05)] p-5">
              <h3 className="text-xl font-bold text-[var(--color-ink)]">
                {locale === "ar" ? "رؤيتنا" : "Vision"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                {pickLocale(aboutContent.vision, locale)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pt-18">
        <SectionHeading
          eyebrow={locale === "ar" ? "قيمنا" : "Values"}
          title={
            locale === "ar"
              ? "احترافية وشفافية ودعم قوي للعميل"
              : "Professionalism, transparency, and strong client support"
          }
          description={
            locale === "ar"
              ? "قيمنا تحدد طريقة التوصية، التفاوض، والمتابعة مع كل عميل."
              : "Our values shape how we advise, negotiate, and follow through with every client."
          }
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {aboutContent.values.map((value) => (
            <div key={value.title.en} className="luxury-surface p-6">
              <h3 className="text-xl font-bold text-[var(--color-ink)]">
                {pickLocale(value.title, locale)}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                {pickLocale(value.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell pt-18">
        <SectionHeading
          eyebrow={locale === "ar" ? "لماذا يثق العملاء بنا" : "Why Clients Trust Us"}
          title={
            locale === "ar"
              ? "الفرق ليس في عدد الوحدات، بل في جودة التوصية"
              : "The difference is not volume, but recommendation quality"
          }
          description={
            locale === "ar"
              ? "نقدم رؤية أوضح للسوق وترشيحات أقرب لأهداف العميل الفعلية."
              : "We provide clearer market visibility and recommendations closer to the client's real objective."
          }
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trustPoints.map((point) => (
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

      <section className="container-shell py-18">
        <LeadForm
          locale={locale}
          source="about-page"
          title={
            locale === "ar"
              ? "تحدث مع فريقنا عن أهدافك العقارية"
              : "Talk to our team about your property goals"
          }
          description={
            locale === "ar"
              ? "إذا كنت تبحث عن سكن أو فرصة استثمارية، سنرشح لك الخيارات الأنسب بشكل واضح وسريع."
              : "Whether you are buying a home or an investment unit, we will shortlist the strongest options clearly and quickly."
          }
          submitLabel={copy.actions.bookConsultation}
        />
      </section>
    </>
  );
}
