"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import { AnimatedSelect } from "@/components/animated-select";
import { PropertyCard } from "@/components/property-card";
import { getUiCopy, localizedPath, type Locale } from "@/lib/i18n";
import {
  buildCoastalVillageOptions,
  buildLocationOptions,
  buildTypeOptions,
  defaultPropertyFilters,
  filterProperties,
  type PropertyFilterState,
} from "@/lib/property-search";
import type { Property } from "@/lib/site-data";

type PropertyFiltersProps = {
  locale: Locale;
  properties: Property[];
  mode?: "compact" | "full";
};

const PAGE_SIZE = 12;

export function PropertyFilters({
  locale,
  properties,
  mode = "full",
}: PropertyFiltersProps) {
  const copy = getUiCopy(locale);
  const [filters, setFilters] = useState<PropertyFilterState>(defaultPropertyFilters);
  const [page, setPage] = useState(1);
  const deferredFilters = useDeferredValue(filters);

  const locationOptions = buildLocationOptions(locale);
  const typeOptions = buildTypeOptions(locale);
  const coastalVillageOptions = buildCoastalVillageOptions(locale);
  const filteredProperties = useMemo(
    () => filterProperties(properties, deferredFilters),
    [properties, deferredFilters],
  );

  const listingTypeFilterOptions = [
    {
      value: "",
      label: locale === "ar" ? "بيع أو إيجار" : "Sale or Rent",
    },
    {
      value: "sale",
      label: locale === "ar" ? "للبيع" : "For Sale",
    },
    {
      value: "rent",
      label: locale === "ar" ? "للإيجار" : "For Rent",
    },
  ];

  const bedroomFilterOptions = [
    { value: "", label: copy.filters.bedrooms },
    { value: "1", label: locale === "ar" ? "غرفة واحدة" : "1 bedroom" },
    { value: "2", label: locale === "ar" ? "2 غرف" : "2 bedrooms" },
    { value: "3", label: locale === "ar" ? "3 غرف" : "3 bedrooms" },
    { value: "4", label: locale === "ar" ? "4 غرف" : "4 bedrooms" },
    { value: "5", label: locale === "ar" ? "5 غرف" : "5 bedrooms" },
    { value: "6", label: locale === "ar" ? "6 غرف" : "6 bedrooms" },
    { value: "7", label: locale === "ar" ? "7 غرف" : "7 bedrooms" },
    { value: "8", label: locale === "ar" ? "8+ غرف" : "8+ bedrooms" },
  ];

  const locationFilterOptions = [
    { value: "", label: copy.filters.location },
    ...locationOptions,
  ];
  const typeFilterOptions = [
    { value: "", label: copy.filters.type },
    ...typeOptions,
  ];
  const coastalVillageFilterOptions = [
    { value: "", label: copy.filters.coastalVillage },
    ...coastalVillageOptions,
  ];

  const selectTriggerClassName =
    "w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition-colors duration-300 ease-in-out focus-visible:border-[var(--color-gold)]";
  const selectMenuClassName =
    "border border-[rgba(235,210,165,0.16)] bg-[image:var(--dark-select-menu)] shadow-[0_20px_45px_rgba(4,12,24,0.52)] backdrop-blur-xl";
  const selectOptionClassName =
    "w-full px-4 py-3 text-start text-sm font-medium text-[var(--color-ink)] transition-colors duration-200 ease-in-out hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-gold-bright)]";
  const selectedOptionClassName =
    "bg-[rgba(205,168,109,0.22)] text-[var(--color-gold-bright)]";
  const inputClassName =
    "w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-gold)]";

  function updateFilter(key: keyof PropertyFilterState, value: string) {
    setFilters((current) => ({
      ...current,
      coastalVillage:
        key === "location" && value !== "north-coast" ? "" : current.coastalVillage,
      [key]: value,
    }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(defaultPropertyFilters);
    setPage(1);
  }

  const showCoastalVillageFilter =
    !filters.location || filters.location === "north-coast";

  const totalPages =
    mode === "compact"
      ? 1
      : Math.max(1, Math.ceil(filteredProperties.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visibleProperties =
    mode === "compact"
      ? filteredProperties.slice(0, 3)
      : filteredProperties.slice(
          (currentPage - 1) * PAGE_SIZE,
          currentPage * PAGE_SIZE,
        );

  const gridColumns = showCoastalVillageFilter
    ? "xl:grid-cols-5"
    : "xl:grid-cols-4";

  const showAdvanced = mode === "full";

  return (
    <section className="space-y-6 rounded-[2rem] bg-[color:var(--page-bg-end)] px-1 py-1">
      <div className="luxury-surface space-y-4 p-4 md:p-6">
        {showAdvanced ? (
          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder={
              locale === "ar"
                ? "ابحث بالاسم، الكومباوند، المنطقة، أو وصف الوحدة..."
                : "Search by title, compound, location, or description..."
            }
            className={inputClassName}
          />
        ) : null}

        <div className={["grid gap-3 md:grid-cols-2", gridColumns].join(" ")}>
          <AnimatedSelect
            value={filters.location}
            onChange={(value) => updateFilter("location", value)}
            options={locationFilterOptions}
            placeholder={copy.filters.location}
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />

          <AnimatedSelect
            value={filters.type}
            onChange={(value) => updateFilter("type", value)}
            options={typeFilterOptions}
            placeholder={copy.filters.type}
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />

          <AnimatedSelect
            value={filters.listingType}
            onChange={(value) => updateFilter("listingType", value)}
            options={listingTypeFilterOptions}
            placeholder={locale === "ar" ? "بيع أو إيجار" : "Sale or Rent"}
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />

          <AnimatedSelect
            value={filters.bedrooms}
            onChange={(value) => updateFilter("bedrooms", value)}
            options={bedroomFilterOptions}
            placeholder={copy.filters.bedrooms}
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />

          {showCoastalVillageFilter ? (
            <AnimatedSelect
              value={filters.coastalVillage}
              onChange={(value) => updateFilter("coastalVillage", value)}
              options={coastalVillageFilterOptions}
              placeholder={copy.filters.coastalVillage}
              triggerClassName={selectTriggerClassName}
              menuClassName={selectMenuClassName}
              optionClassName={selectOptionClassName}
              selectedOptionClassName={selectedOptionClassName}
            />
          ) : null}
        </div>

        {showAdvanced ? (
          <div className="grid gap-3 md:grid-cols-3">
            <input
              type="number"
              min={0}
              value={filters.minPrice}
              onChange={(event) => updateFilter("minPrice", event.target.value)}
              placeholder={locale === "ar" ? "السعر من (جنيه)" : "Min price (EGP)"}
              className={inputClassName}
            />
            <input
              type="number"
              min={0}
              value={filters.maxPrice}
              onChange={(event) => updateFilter("maxPrice", event.target.value)}
              placeholder={locale === "ar" ? "السعر إلى (جنيه)" : "Max price (EGP)"}
              className={inputClassName}
            />
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[rgba(255,255,255,0.1)]"
            >
              {locale === "ar" ? "مسح الفلاتر" : "Reset filters"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="px-2 py-1">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[var(--color-ink)]">
            {copy.labels.searchResults} ({filteredProperties.length})
          </h3>
          {mode === "compact" ? (
            <Link
              href={localizedPath(locale, "/properties")}
              className="text-sm font-semibold text-[var(--color-gold)]"
            >
              {copy.actions.viewAll}
            </Link>
          ) : null}
        </div>
      </div>

      {visibleProperties.length ? (
        <>
          <div className="grid gap-6 px-2 pb-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.slug} locale={locale} property={property} />
            ))}
          </div>

          {showAdvanced && totalPages > 1 ? (
            <div
              className="flex items-center justify-center gap-2 px-2 pb-4"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-50"
              >
                {locale === "ar" ? "السابق" : "Previous"}
              </button>
              <span className="text-sm font-semibold text-[var(--color-ink-soft)]">
                {locale === "ar"
                  ? `صفحة ${currentPage} من ${totalPages}`
                  : `Page ${currentPage} of ${totalPages}`}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-50"
              >
                {locale === "ar" ? "التالي" : "Next"}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="luxury-surface px-6 py-10 text-center text-[var(--color-ink-soft)]">
          {copy.labels.noResults}
        </div>
      )}
    </section>
  );
}
