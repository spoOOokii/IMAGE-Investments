"use client";

import Link from "next/link";

import { useCompare, useFavorites } from "@/lib/client-storage";
import { localizedPath, type Locale } from "@/lib/i18n";

export function HeaderShortcuts({ locale }: { locale: Locale }) {
  const favorites = useFavorites();
  const compare = useCompare();

  const linkClass =
    "relative grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] text-[var(--header-text)] transition hover:bg-[rgba(255,255,255,0.1)]";
  const badgeClass =
    "absolute -end-1 -top-1 min-w-[18px] rounded-full bg-[var(--color-gold)] px-1 text-center text-[10px] font-bold text-[var(--color-navy)]";

  return (
    <div className="flex items-center gap-2">
      <Link
        href={localizedPath(locale, "/favorites")}
        aria-label={locale === "ar" ? "المفضلة" : "Favorites"}
        className={linkClass}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
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
        {favorites.items.length > 0 ? (
          <span className={badgeClass}>{favorites.items.length}</span>
        ) : null}
      </Link>
      <Link
        href={localizedPath(locale, "/compare")}
        aria-label={locale === "ar" ? "مقارنة" : "Compare"}
        className={linkClass}
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
        {compare.items.length > 0 ? (
          <span className={badgeClass}>{compare.items.length}</span>
        ) : null}
      </Link>
    </div>
  );
}
