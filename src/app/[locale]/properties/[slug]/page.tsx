import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { PropertyCard } from "@/components/property-card";
import { PropertyGallery } from "@/components/property-gallery";
import { SectionHeading } from "@/components/section-heading";
import { getPropertyBySlug, getRelatedProperties } from "@/lib/cms";
import { getUiCopy, isLocale, pickLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { companyProfile, properties, propertyTypeLabels } from "@/lib/site-data";
import {
  buildPhoneHref,
  buildPropertyInquiryMessage,
  buildWhatsAppHref,
} from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
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

  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {};
  }

  return buildMetadata({
    locale,
    path: `/properties/${slug}`,
    title: pickLocale(property.title, locale),
    description: pickLocale(property.summary, locale),
    image: property.gallery[0],
  });
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const copy = getUiCopy(locale);
  const relatedProperties = await getRelatedProperties(
    property.slug,
    property.locationSlug,
  );
  const propertyTypeLabel = pickLocale(
    propertyTypeLabels[property.propertyType],
    locale,
  );
  const propertyContactPhone = property.contactPhone ?? companyProfile.phoneDisplay;
  const propertyDescription = pickLocale(property.description, locale).trim();
  const isRentListing = property.listingType === "rent";
  const isFurnished =
    pickLocale(property.summary, "ar").includes("مفروش") ||
    pickLocale(property.summary, "en").toLowerCase().includes("furnished");
  const propertyWhatsAppDetails = [
    locale === "ar"
      ? `نوع العرض: ${isRentListing ? "للإيجار" : "للبيع"}`
      : `Listing type: ${isRentListing ? "For Rent" : "For Sale"}`,
    locale === "ar"
      ? `المشروع: ${pickLocale(property.compound, locale)}`
      : `Compound: ${pickLocale(property.compound, locale)}`,
    locale === "ar"
      ? `الموقع: ${pickLocale(property.locationName, locale)}`
      : `Location: ${pickLocale(property.locationName, locale)}`,
    locale === "ar"
      ? `المساحة: ${property.size} متر`
      : `Size: ${property.size} sqm`,
    locale === "ar"
      ? `غرف النوم: ${property.bedrooms}`
      : `Bedrooms: ${property.bedrooms}`,
    locale === "ar"
      ? `الحمامات: ${property.bathrooms}`
      : `Bathrooms: ${property.bathrooms}`,
    locale === "ar"
      ? `التشطيب: ${pickLocale(property.finishing, locale)}`
      : `Finishing: ${pickLocale(property.finishing, locale)}`,
    locale === "ar"
      ? `الفرش: ${isFurnished ? "مفروش" : "غير مفروش"}`
      : `Furnishing: ${isFurnished ? "Furnished" : "Unfurnished"}`,
    locale === "ar"
      ? `${isRentListing ? "الحجز والاستعلام" : "السعر"}: ${
          isRentListing ? "تواصل معنا" : pickLocale(property.priceLabel, locale)
        }`
      : `${isRentListing ? "Booking & Inquiry" : "Price"}: ${
          isRentListing ? "Contact us" : pickLocale(property.priceLabel, locale)
        }`,
  ];
  const propertyWhatsAppHref = buildWhatsAppHref(
    propertyContactPhone,
    buildPropertyInquiryMessage({
      locale,
      propertyTitle: pickLocale(property.title, locale),
      propertyType: propertyTypeLabel,
      propertyDetails: propertyWhatsAppDetails,
    }),
  );
  const propertyPhoneHref = buildPhoneHref(propertyContactPhone);
  const surroundingItems = [
    {
      label: locale === "ar" ? "نوع العرض" : "Listing Type",
      value:
        locale === "ar"
          ? isRentListing
            ? "للإيجار"
            : "للبيع"
          : isRentListing
            ? "For Rent"
            : "For Sale",
    },
    {
      label: copy.labels.bedrooms,
      value:
        locale === "ar"
          ? `${property.bedrooms} غرف نوم`
          : `${property.bedrooms} bedrooms`,
    },
    {
      label: copy.labels.bathrooms,
      value:
        locale === "ar"
          ? `${property.bathrooms} حمامات`
          : `${property.bathrooms} bathrooms`,
    },
    {
      label: copy.labels.finishing,
      value: pickLocale(property.finishing, locale),
    },
    {
      label: locale === "ar" ? "الفرش" : "Furnishing",
      value:
        locale === "ar"
          ? isFurnished
            ? "مفروش"
            : "غير مفروش"
          : isFurnished
          ? "Furnished"
          : "Unfurnished",
    },
    ...(!isRentListing
      ? [
          {
            label: copy.labels.price,
            value: pickLocale(property.priceLabel, locale),
          },
        ]
      : []),
  ];
  const propertySpecs = [
    {
      label: locale === "ar" ? "المشروع" : "Compound",
      value: pickLocale(property.compound, locale),
    },
    {
      label: copy.labels.location,
      value: pickLocale(property.locationName, locale),
    },
    {
      label: copy.labels.propertyType,
      value: propertyTypeLabel,
    },
    {
      label: copy.labels.size,
      value: locale === "ar" ? `${property.size} متر` : `${property.size} sqm`,
    },
  ];

  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title.en,
    description: property.summary.en,
    image: property.gallery,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.size,
      unitText: "SQM",
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.locationName.en,
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.coordinates.lat,
      longitude: property.coordinates.lng,
    },
    offers: {
      "@type": "Offer",
      availability: property.isReady
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />

      <Breadcrumbs
        locale={locale}
        items={[
          { label: copy.nav.home, href: "/" },
          { label: copy.nav.properties, href: "/properties" },
          { label: property.title },
        ]}
      />

      <section className="container-shell pt-6">
        <div className="luxury-surface p-8 md:p-10">
          <div className="text-xs text-[var(--color-muted)]">
            {pickLocale(property.locationName, locale)} • {pickLocale(property.compound, locale)}
          </div>
          <h1 className="display-heading mt-5 max-w-5xl text-4xl font-bold leading-tight text-[var(--color-ink)] md:text-6xl">
            {pickLocale(property.title, locale)}
          </h1>
        </div>
      </section>

      <section className="container-shell pt-10">
        <div className="grid gap-6 xl:grid-cols-[1.45fr_1.05fr]">
          <PropertyGallery
            images={property.gallery}
            alt={pickLocale(property.title, locale)}
          />

          <div className="luxury-surface p-6 md:p-7">
            <div className="grid gap-7">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-ink)]">
                  {locale === "ar" ? "كل ما تحتاجه حول الوحدة" : "Everything around the unit"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {locale === "ar"
                    ? "ملخص سريع يوضح تفاصيل الاستخدام والتشطيب وحالة العرض الحالية."
                    : "A quick summary of livability, finishing, and the current listing status."}
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {surroundingItems.map((item) => (
                    <div
                      key={`${item.label}-${item.value}`}
                      className="rounded-[1.25rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.04)] px-4 py-3"
                    >
                      <div className="text-xs text-[var(--color-muted)]">{item.label}</div>
                      <div className="mt-2 text-sm font-semibold leading-7 text-[var(--color-ink)]">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--color-border)] pt-6">
                <h2 className="text-2xl font-bold text-[var(--color-ink)]">
                  {locale === "ar" ? "مواصفات الوحدة" : "Property Specifications"}
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {propertySpecs.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.25rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] p-4"
                    >
                      <div className="text-xs text-[var(--color-muted)]">{item.label}</div>
                      <div className="mt-2 font-semibold leading-7 text-[var(--color-ink)]">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {propertyDescription ? (
        <section className="container-shell pt-10">
          <div className="luxury-surface p-8 md:p-10">
            <div className="mx-auto max-w-4xl text-center">
              <div className="text-xs text-[var(--color-muted)]">
                {locale === "ar" ? "وصف الوحدة" : "Property Description"}
              </div>
              <p className="mt-5 text-sm leading-8 text-[var(--color-ink-soft)] md:text-base">
                {propertyDescription}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-shell pt-10">
        <div className="grid gap-8 xl:grid-cols-2">
          <div className="space-y-6">
            <LeadForm
              locale={locale}
              source="property-details"
              contactMode="whatsapp"
              propertySlug={property.slug}
              propertyTitle={pickLocale(property.title, locale)}
              propertyTypeLabel={propertyTypeLabel}
              propertyDetails={propertyWhatsAppDetails}
              whatsappPhoneNumber={propertyContactPhone}
              title={
                locale === "ar"
                  ? "استفسر عن هذه الوحدة عبر واتساب"
                  : "Ask about this property on WhatsApp"
              }
              description={
                locale === "ar"
                  ? "اكتب اسمك ورقم هاتفك ورسالتك، وسيتم فتح واتساب برسالة جاهزة توضح نوع الوحدة المطلوبة."
                  : "Enter your name, phone number, and message, and WhatsApp will open with a ready inquiry that includes the property type."
              }
              submitLabel={locale === "ar" ? "إرسال عبر واتساب" : "Send on WhatsApp"}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={propertyWhatsAppHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#25D366] px-5 py-3 text-center text-sm font-bold text-white"
              >
                {copy.actions.askWhatsapp}
              </a>
              <a
                href={propertyPhoneHref}
                className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-5 py-3 text-center text-sm font-bold text-[var(--color-ink)]"
              >
                {locale === "ar" ? "اتصل بمستشار عقاري" : "Call a Property Advisor"}
              </a>
            </div>
          </div>

          <div className="space-y-5">
            <SectionHeading
              eyebrow={copy.labels.map}
              title={
                locale === "ar"
                  ? "موقع استراتيجي داخل المنطقة"
                  : "Strategic location inside the market"
              }
              description={
                locale === "ar"
                  ? "اعرف موقع الوحدة بالنسبة لأهم المحاور والمرافق والخدمات المحيطة."
                  : "Understand the unit's position relative to major roads, amenities, and nearby services."
              }
            />
            <div className="luxury-surface overflow-hidden p-3">
              <iframe
                title={pickLocale(property.title, locale)}
                src={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&z=14&output=embed`}
                className="h-[420px] w-full rounded-[1.5rem] border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {relatedProperties.length ? (
        <section className="container-shell py-18">
          <SectionHeading
            eyebrow={copy.labels.relatedProperties}
            title={
              locale === "ar"
                ? "عقارات مشابهة في نفس المنطقة"
                : "Related properties in the same location"
            }
            description={
              locale === "ar"
                ? "فرص إضافية قد تكون أنسب من حيث المساحة أو الموقع أو نوع العقار."
                : "Additional opportunities that may better match your size, location, or property-type preference."
            }
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {relatedProperties.map((related) => (
              <PropertyCard key={related.slug} locale={locale} property={related} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
