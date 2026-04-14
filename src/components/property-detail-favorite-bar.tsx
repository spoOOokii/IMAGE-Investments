"use client";

import { useCompare, useFavorites } from "@/lib/client-storage";
import type { Locale } from "@/lib/i18n";

type PropertyDetailFavoriteBarProps = {
  slug: string;
  locale: Locale;
};

export function PropertyDetailFavoriteBar({
  slug,
  locale,
}: PropertyDetailFavoriteBarProps) {
  const favorites = useFavorites();
  const compare = useCompare();
  const isFavorite = favorites.has(slug);
  const isComparing = compare.has(slug);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => favorites.toggle(slug)}
        aria-pressed={isFavorite}
        className={`rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-semibold transition ${
          isFavorite
            ? "bg-rose-500 text-white"
            : "bg-[rgba(255,255,255,0.05)] text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.1)]"
        }`}
      >
        {isFavorite
          ? locale === "ar"
            ? "محفوظة ♥"
            : "Saved ♥"
          : locale === "ar"
            ? "أضف للمفضلة ♡"
            : "Save ♡"}
      </button>
      <button
        type="button"
        onClick={() => compare.toggle(slug)}
        aria-pressed={isComparing}
        className={`rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-semibold transition ${
          isComparing
            ? "bg-[var(--color-gold)] text-[var(--color-navy)]"
            : "bg-[rgba(255,255,255,0.05)] text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.1)]"
        }`}
      >
        {isComparing
          ? locale === "ar"
            ? "في المقارنة ✓"
            : "In compare ✓"
          : locale === "ar"
            ? "أضف للمقارنة"
            : "Add to compare"}
      </button>
    </div>
  );
}
