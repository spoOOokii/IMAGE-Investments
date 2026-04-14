import Image from "next/image";
import Link from "next/link";

import { PropertyCardActions } from "@/components/property-card-actions";
import { getUiCopy, localizedPath, pickLocale, type Locale } from "@/lib/i18n";
import {
  propertyTypeLabels,
  type Property,
  type PropertyTag,
} from "@/lib/site-data";

const propertyTagKeyMap: Record<
  PropertyTag,
  keyof ReturnType<typeof getUiCopy>["labels"]
> = {
  featured: "featured",
  underMarket: "underMarket",
  ready: "ready",
  installments: "installments",
  prime: "prime",
  bestDeal: "bestDeal",
  limited: "limited",
  exclusive: "exclusive",
};

type PropertyCardProps = {
  locale: Locale;
  property: Property;
};

export function PropertyCard({ locale, property }: PropertyCardProps) {
  const copy = getUiCopy(locale);
  const isRentListing = property.listingType === "rent";
  const propertyTypeLabel = pickLocale(propertyTypeLabels[property.propertyType], locale);
  const locationLabel = pickLocale(property.locationName, locale);
  const compoundLabel = pickLocale(property.compound, locale);
  const finishingLabel = pickLocale(property.finishing, locale);
  const priceLabel = pickLocale(property.priceLabel, locale);
  const sizeUnit = locale === "ar" ? "م²" : "m²";
  const tagLabels = property.tags.map((tag) => copy.labels[propertyTagKeyMap[tag]]);
  const primaryTag = tagLabels[0] ?? (locale === "ar" ? "مميز" : "Featured");
  const furnishingLabel =
    property.amenities.find((item) => {
      const value = `${item.ar} ${item.en}`.toLowerCase();
      return (
        value.includes("مفروش") ||
        value.includes("غير مفروش") ||
        value.includes("نصف مفروش") ||
        value.includes("furnished") ||
        value.includes("unfurnished") ||
        value.includes("semi-furnished")
      );
    }) ?? {
      ar: "غير مفروش",
      en: "Unfurnished",
    };

  return (
    <Link
      href={localizedPath(locale, `/properties/${property.slug}`)}
      className="luxury-surface property-card-shell group flex h-full w-full flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1"
    >
      <div className="relative aspect-[1.08] overflow-hidden">
        <Image
          src={property.gallery[0]}
          alt={pickLocale(property.title, locale)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="property-card-overlay absolute inset-0" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <span className="property-card-tag rounded-full px-3 py-1 text-xs font-bold backdrop-blur">
            {primaryTag}
          </span>
          <PropertyCardActions slug={property.slug} locale={locale} />
        </div>

        <div className="property-card-media-copy absolute bottom-4 left-4 right-4">
          <p className="text-sm text-[var(--color-gold-bright)]">
            {locationLabel} - {compoundLabel}
          </p>
          <h3 className="mt-2 text-2xl font-bold leading-tight">
            {pickLocale(property.title, locale)}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {!isRentListing ? (
          <div className="property-card-price flex items-center justify-between rounded-[1.5rem] px-4 py-3">
            <div>
              <div className="text-xs text-[var(--color-muted)]">{copy.labels.price}</div>
              <div className="mt-1 text-2xl font-bold text-[var(--color-ink)]">{priceLabel}</div>
            </div>
            <span className="rounded-full bg-[rgba(205,168,109,0.16)] px-3 py-1 text-xs font-bold text-[var(--color-gold-bright)]">
              {locale === "ar" ? "للبيع" : "For Sale"}
            </span>
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-3 text-sm text-[var(--color-ink)]">
          <div className="property-card-stat rounded-2xl px-3 py-3 text-center">
            <div className="text-xs text-[var(--color-muted)]">{copy.labels.size}</div>
            <div className="mt-1 font-bold">{property.size} {sizeUnit}</div>
          </div>
          <div className="property-card-stat rounded-2xl px-3 py-3 text-center">
            <div className="text-xs text-[var(--color-muted)]">{copy.labels.bedrooms}</div>
            <div className="mt-1 font-bold">{property.bedrooms}</div>
          </div>
          <div className="property-card-stat rounded-2xl px-3 py-3 text-center">
            <div className="text-xs text-[var(--color-muted)]">{copy.labels.bathrooms}</div>
            <div className="mt-1 font-bold">{property.bathrooms}</div>
          </div>
        </div>

        <div className="property-card-details flex flex-1 flex-col rounded-[1.5rem] p-4">
          <div className="text-lg font-bold text-[var(--color-ink)]">
            {locale === "ar" ? "مواصفات العقار" : "Property Details"}
          </div>
          <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--color-ink-soft)]">
            <div>
              <span className="font-semibold text-[var(--color-ink)]">
                {copy.labels.propertyType}:
              </span>{" "}
              {propertyTypeLabel}
            </div>
            <div>
              <span className="font-semibold text-[var(--color-ink)]">
                {copy.labels.finishing}:
              </span>{" "}
              {finishingLabel}
            </div>
            <div>
              <span className="font-semibold text-[var(--color-ink)]">
                {locale === "ar" ? "الفرش:" : "Furnishing:"}
              </span>{" "}
              {pickLocale(furnishingLabel, locale)}
            </div>
            <div>
              <span className="font-semibold text-[var(--color-ink)]">
                {copy.labels.location}:
              </span>{" "}
              {locationLabel}
            </div>
            {isRentListing ? (
              <div>
                <span className="font-semibold text-[var(--color-ink)]">
                  {locale === "ar" ? "للحجز والاستعلام:" : "Booking & Inquiry:"}
                </span>{" "}
                {locale === "ar" ? "تواصل معنا" : "Contact us"}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex justify-start">
          <span className="property-card-cta rounded-full px-4 py-2 text-sm font-semibold transition group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-navy)]">
            {copy.actions.viewDetails}
          </span>
        </div>
      </div>
    </Link>
  );
}
