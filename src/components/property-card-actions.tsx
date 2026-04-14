"use client";

import { useCompare, useFavorites } from "@/lib/client-storage";
import type { Locale } from "@/lib/i18n";

type PropertyCardActionsProps = {
  slug: string;
  locale: Locale;
};

export function PropertyCardActions({ slug, locale }: PropertyCardActionsProps) {
  const favorites = useFavorites();
  const compare = useCompare();
  const isFavorite = favorites.has(slug);
  const isComparing = compare.has(slug);

  function stop(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={
          isFavorite
            ? locale === "ar"
              ? "إزالة من المفضلة"
              : "Remove from favorites"
            : locale === "ar"
              ? "إضافة للمفضلة"
              : "Add to favorites"
        }
        aria-pressed={isFavorite}
        onClick={(event) => {
          stop(event);
          favorites.toggle(slug);
        }}
        className={`grid h-9 w-9 place-items-center rounded-full border border-[rgba(255,255,255,0.2)] backdrop-blur transition ${
          isFavorite
            ? "bg-rose-500 text-white"
            : "bg-black/40 text-white hover:bg-black/60"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s-7.5-4.5-9.5-9a5 5 0 0 1 9.5-2 5 5 0 0 1 9.5 2c-2 4.5-9.5 9-9.5 9Z"
          />
        </svg>
      </button>

      <button
        type="button"
        aria-label={
          isComparing
            ? locale === "ar"
              ? "إزالة من المقارنة"
              : "Remove from compare"
            : locale === "ar"
              ? "إضافة للمقارنة"
              : "Add to compare"
        }
        aria-pressed={isComparing}
        onClick={(event) => {
          stop(event);
          compare.toggle(slug);
        }}
        className={`grid h-9 w-9 place-items-center rounded-full border border-[rgba(255,255,255,0.2)] backdrop-blur transition ${
          isComparing
            ? "bg-[var(--color-gold)] text-[var(--color-navy)]"
            : "bg-black/40 text-white hover:bg-black/60"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h12M3 12h18M3 17h8" />
        </svg>
      </button>
    </div>
  );
}
