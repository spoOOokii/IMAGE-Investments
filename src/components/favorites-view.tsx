"use client";

import { PropertyCard } from "@/components/property-card";
import { useFavorites } from "@/lib/client-storage";
import type { Locale } from "@/lib/i18n";
import type { Property } from "@/lib/site-data";

type FavoritesViewProps = {
  locale: Locale;
  properties: Property[];
};

export function FavoritesView({ locale, properties }: FavoritesViewProps) {
  const favorites = useFavorites();
  const favoriteProperties = properties.filter((property) =>
    favorites.items.includes(property.slug),
  );

  if (!favoriteProperties.length) {
    return (
      <div className="luxury-surface p-8 text-center text-[var(--color-ink-soft)]">
        <p>
          {locale === "ar"
            ? "لا توجد وحدات مفضلة بعد. اضغط على علامة القلب في أي وحدة لحفظها هنا."
            : "No favorites yet. Tap the heart icon on any property to save it here."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between" dir={locale === "ar" ? "rtl" : "ltr"}>
        <p className="text-sm text-[var(--color-ink-soft)]">
          {locale === "ar"
            ? `${favoriteProperties.length} وحدة محفوظة`
            : `${favoriteProperties.length} saved properties`}
        </p>
        <button
          type="button"
          onClick={() => favorites.clear()}
          className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-xs font-semibold text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.1)]"
        >
          {locale === "ar" ? "مسح الكل" : "Clear all"}
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {favoriteProperties.map((property) => (
          <PropertyCard key={property.slug} locale={locale} property={property} />
        ))}
      </div>
    </div>
  );
}
