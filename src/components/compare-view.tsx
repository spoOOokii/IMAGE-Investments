"use client";

import Image from "next/image";
import Link from "next/link";

import { useCompare } from "@/lib/client-storage";
import { localizedPath, pickLocale, type Locale } from "@/lib/i18n";
import { propertyTypeLabels, type Property } from "@/lib/site-data";

type CompareViewProps = {
  locale: Locale;
  properties: Property[];
};

export function CompareView({ locale, properties }: CompareViewProps) {
  const compare = useCompare();
  const selected = compare.items
    .map((slug) => properties.find((property) => property.slug === slug))
    .filter((item): item is Property => Boolean(item));

  if (!selected.length) {
    return (
      <div className="luxury-surface p-8 text-center text-[var(--color-ink-soft)]">
        <p>
          {locale === "ar"
            ? "لم تضف أي وحدات للمقارنة. اضغط على علامة المقارنة في أي وحدة لإضافتها."
            : "No properties in compare yet. Tap the compare icon on any property card to add it."}
        </p>
        <Link
          href={localizedPath(locale, "/properties")}
          className="mt-4 inline-block rounded-full bg-[var(--color-gold)] px-5 py-2 text-sm font-bold text-[var(--color-navy)]"
        >
          {locale === "ar" ? "تصفح الوحدات" : "Browse properties"}
        </Link>
      </div>
    );
  }

  const rows: Array<{ label: string; values: string[] }> = [
    {
      label: locale === "ar" ? "السعر" : "Price",
      values: selected.map((p) => pickLocale(p.priceLabel, locale)),
    },
    {
      label: locale === "ar" ? "المساحة" : "Size",
      values: selected.map((p) =>
        locale === "ar" ? `${p.size} م²` : `${p.size} m²`,
      ),
    },
    {
      label: locale === "ar" ? "غرف النوم" : "Bedrooms",
      values: selected.map((p) => `${p.bedrooms}`),
    },
    {
      label: locale === "ar" ? "الحمامات" : "Bathrooms",
      values: selected.map((p) => `${p.bathrooms}`),
    },
    {
      label: locale === "ar" ? "النوع" : "Type",
      values: selected.map((p) => pickLocale(propertyTypeLabels[p.propertyType], locale)),
    },
    {
      label: locale === "ar" ? "المنطقة" : "Location",
      values: selected.map((p) => pickLocale(p.locationName, locale)),
    },
    {
      label: locale === "ar" ? "المشروع" : "Compound",
      values: selected.map((p) => pickLocale(p.compound, locale)),
    },
    {
      label: locale === "ar" ? "التشطيب" : "Finishing",
      values: selected.map((p) => pickLocale(p.finishing, locale)),
    },
    {
      label: locale === "ar" ? "نوع العرض" : "Listing type",
      values: selected.map((p) =>
        p.listingType === "rent"
          ? locale === "ar"
            ? "للإيجار"
            : "For Rent"
          : locale === "ar"
            ? "للبيع"
            : "For Sale",
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between" dir={locale === "ar" ? "rtl" : "ltr"}>
        <p className="text-sm text-[var(--color-ink-soft)]">
          {locale === "ar"
            ? `${selected.length} وحدة للمقارنة (حتى ${compare.max})`
            : `${selected.length} properties in compare (up to ${compare.max})`}
        </p>
        <button
          type="button"
          onClick={() => compare.clear()}
          className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-xs font-semibold text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.1)]"
        >
          {locale === "ar" ? "مسح الكل" : "Clear all"}
        </button>
      </div>

      <div className="luxury-surface overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm" dir={locale === "ar" ? "rtl" : "ltr"}>
          <thead>
            <tr>
              <th className="w-48 px-4 py-3 text-start text-xs font-semibold text-[var(--color-muted)]">
                {locale === "ar" ? "الخاصية" : "Attribute"}
              </th>
              {selected.map((property) => (
                <th key={property.slug} className="px-4 py-3 text-start">
                  <div className="space-y-3">
                    <div className="relative h-32 overflow-hidden rounded-[1rem]">
                      <Image
                        src={property.gallery[0]}
                        alt={pickLocale(property.title, locale)}
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                    </div>
                    <Link
                      href={localizedPath(locale, `/properties/${property.slug}`)}
                      className="block text-sm font-bold text-[var(--color-ink)] hover:text-[var(--color-gold)]"
                    >
                      {pickLocale(property.title, locale)}
                    </Link>
                    <button
                      type="button"
                      onClick={() => compare.remove(property.slug)}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-ink-soft)] hover:bg-[rgba(255,255,255,0.08)]"
                    >
                      {locale === "ar" ? "إزالة" : "Remove"}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-[var(--color-border)]">
                <td className="px-4 py-3 text-xs font-semibold text-[var(--color-muted)]">
                  {row.label}
                </td>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${index}`}
                    className="px-4 py-3 text-sm text-[var(--color-ink)]"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
