import Link from "next/link";

import { localizedPath, pickLocale, type Locale } from "@/lib/i18n";
import type { LocalizedText } from "@/lib/site-data";

type BreadcrumbItem = {
  label: string | LocalizedText;
  href?: string;
};

type BreadcrumbsProps = {
  locale: Locale;
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ locale, items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}
      className="container-shell pt-6"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
        {items.map((item, index) => {
          const label =
            typeof item.label === "string"
              ? item.label
              : pickLocale(item.label, locale);

          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-[var(--color-border)]" aria-hidden="true">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={localizedPath(locale, item.href)}
                  className="hover:text-[var(--color-gold-bright)] transition-colors"
                >
                  {label}
                </Link>
              ) : (
                <span className="text-[var(--color-ink-soft)] font-medium">
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
