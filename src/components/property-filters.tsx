"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

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
import { AnimatedSelect } from "@/components/animated-select";
import { PropertyCard } from "@/components/property-card";

type PropertyFiltersProps = {
  locale: Locale;
  properties: Property[];
  mode?: "compact" | "full";
};

export function PropertyFilters({
  locale,
  properties,
  mode = "full",
}: PropertyFiltersProps) {
  const copy = getUiCopy(locale);
  const [filters, setFilters] =
    useState<PropertyFilterState>(defaultPropertyFilters);
  const deferredFilters = useDeferredValue(filters);

  const locationOptions = buildLocationOptions(locale);
  const typeOptions = buildTypeOptions(locale);
  const coastalVillageOptions = buildCoastalVillageOptions(locale);

  const filteredProperties = filterProperties(properties, deferredFilters);
  const selectTriggerClassName =
    "w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition-colors duration-300 ease-in-out focus-visible:border-[var(--color-gold)]";
  const selectMenuClassName =
    "border border-[rgba(235,210,165,0.16)] bg-[image:var(--dark-select-menu)] shadow-[0_20px_45px_rgba(4,12,24,0.52)] backdrop-blur-xl";
  const selectOptionClassName =
    "w-full px-4 py-3 text-start text-sm font-medium text-[var(--color-ink)] transition-colors duration-200 ease-in-out hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-gold-bright)]";
  const selectedOptionClassName =
    "bg-[rgba(205,168,109,0.22)] text-[var(--color-gold-bright)]";

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
  const bedroomFilterOptions = [
    { value: "", label: copy.filters.bedrooms },
    { value: "2", label: copy.filters.twoPlus },
    { value: "3", label: copy.filters.threePlus },
    { value: "4", label: copy.filters.fourPlus },
    { value: "5", label: copy.filters.fivePlus },
    { value: "6", label: copy.filters.sixPlus },
  ];

  function updateFilter(key: keyof PropertyFilterState, value: string) {
    setFilters((current) => ({
      ...current,
      coastalVillage:
        key === "location" && value !== "north-coast"
          ? ""
          : current.coastalVillage,
      [key]: value,
    }));
  }

  const showCoastalVillageFilter =
    !filters.location || filters.location === "north-coast";

  const visibleProperties =
    mode === "compact" ? filteredProperties.slice(0, 3) : filteredProperties;

  return (
    <section className="space-y-6">
      <div className="luxury-surface p-4 md:p-6">
        <div
          className={[
            "grid gap-3 md:grid-cols-2",
            showCoastalVillageFilter ? "xl:grid-cols-4" : "xl:grid-cols-3",
          ].join(" ")}
        >
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
      </div>

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

      {visibleProperties.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleProperties.map((property) => (
            <PropertyCard
              key={property.slug}
              locale={locale}
              property={property}
            />
          ))}
        </div>
      ) : (
        <div className="luxury-surface px-6 py-10 text-center text-[var(--color-ink-soft)]">
          {copy.labels.noResults}
        </div>
      )}
    </section>
  );
}
