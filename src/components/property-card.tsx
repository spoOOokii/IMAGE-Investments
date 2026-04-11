import Image from "next/image";
import Link from "next/link";

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
  const tagLabels = property.tags
    .filter(
      (tag) =>
        tag !== "underMarket" &&
        tag !== "installments" &&
        tag !== "ready" &&
        tag !== "bestDeal",
    )
    .slice(0, 3)
    .map((tag) => ({
      key: tag,
      label: copy.labels[propertyTagKeyMap[tag]],
    }));

  return (
    <Link
      href={localizedPath(locale, `/properties/${property.slug}`)}
      className="luxury-surface group flex h-full w-full flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1"
    >
      <div className="relative aspect-[1.15] overflow-hidden">
        <Image
          src={property.gallery[0]}
          alt={pickLocale(property.title, locale)}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="property-card-overlay absolute inset-0" />
        <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
          {tagLabels.map((tag) => (
            <span
              key={tag.key}
              className="property-card-tag rounded-full border px-3 py-1 text-xs font-bold backdrop-blur"
            >
              {tag.label}
            </span>
          ))}
        </div>
        <div className="property-card-media-copy absolute bottom-4 left-4 right-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-bright)]">
            {pickLocale(property.locationName, locale)} •{" "}
            {pickLocale(property.compound, locale)}
          </p>
          <h3 className="mt-2 text-2xl font-bold leading-tight">
            {pickLocale(property.title, locale)}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <p className="line-clamp-2 text-sm leading-7 text-[var(--color-ink-soft)]">
          {pickLocale(property.summary, locale)}
        </p>

        <div className="grid grid-cols-3 gap-3 text-sm text-[var(--color-ink)]">
          <div className="property-card-stat rounded-2xl px-3 py-3">
            <div className="text-xs text-[var(--color-muted)]">
              {copy.labels.bedrooms}
            </div>
            <div className="mt-1 font-bold">{property.bedrooms}</div>
          </div>
          <div className="property-card-stat rounded-2xl px-3 py-3">
            <div className="text-xs text-[var(--color-muted)]">
              {copy.labels.bathrooms}
            </div>
            <div className="mt-1 font-bold">{property.bathrooms}</div>
          </div>
          <div className="property-card-stat rounded-2xl px-3 py-3">
            <div className="text-xs text-[var(--color-muted)]">
              {copy.labels.size}
            </div>
            <div className="mt-1 font-bold">{property.size} m²</div>
          </div>
        </div>

        <div className="property-card-details flex flex-1 flex-col rounded-[1.5rem] border border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[var(--color-muted)]">
                {copy.labels.propertyType}
              </div>
              <div className="mt-1 font-semibold text-[var(--color-ink)]">
                {pickLocale(propertyTypeLabels[property.propertyType], locale)}
              </div>
            </div>
            <div className="text-end">
              <div className="text-xs text-[var(--color-muted)]">
                {locale === "ar" ? "التفاصيل" : "Details"}
              </div>
              <div className="mt-1 text-lg font-bold text-[var(--color-ink)]">
                {locale === "ar" ? "اطلبها الآن" : "Request Now"}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm leading-7 text-[var(--color-ink-soft)]">
            <div>
              <span className="font-semibold text-[var(--color-ink)]">
                {copy.labels.finishing}:
              </span>{" "}
              {pickLocale(property.finishing, locale)}
            </div>
            <div>
              <span className="font-semibold text-[var(--color-ink)]">
                {copy.labels.location}:
              </span>{" "}
              {pickLocale(property.locationName, locale)}
            </div>
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
