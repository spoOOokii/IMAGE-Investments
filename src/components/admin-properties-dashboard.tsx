"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type {
  AdminPropertySummary,
  PropertyAdminResponse,
} from "@/lib/admin-property-types";
import {
  buildCoastalVillageOptions,
  buildLocationOptions,
  buildTypeOptions,
} from "@/lib/property-search";
import { AnimatedSelect } from "@/components/animated-select";

type AdminFilters = {
  search: string;
  location: string;
  propertyType: string;
  bedrooms: string;
  coastalVillage: string;
};

const defaultFilters: AdminFilters = {
  search: "",
  location: "",
  propertyType: "",
  bedrooms: "",
  coastalVillage: "",
};

function filterAdminProperties(
  properties: AdminPropertySummary[],
  filters: AdminFilters,
) {
  return properties.filter((property) => {
    const matchesSearch =
      !filters.search ||
      [
        property.title,
        property.location,
        property.compound,
        property.propertyType,
        property.slug,
      ]
        .join(" ")
        .toLowerCase()
        .includes(filters.search.toLowerCase());
    const matchesLocation =
      !filters.location || property.locationSlug === filters.location;
    const matchesType =
      !filters.propertyType || property.propertyTypeValue === filters.propertyType;
    const matchesBedrooms =
      !filters.bedrooms || property.bedrooms >= Number(filters.bedrooms);
    const matchesCoastalVillage =
      !filters.coastalVillage || property.compoundSlug === filters.coastalVillage;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesBedrooms &&
      matchesCoastalVillage
    );
  });
}

export function AdminPropertiesDashboard() {
  const [data, setData] = useState<PropertyAdminResponse | null>(null);
  const [filters, setFilters] = useState<AdminFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState("");
  const [error, setError] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const locationOptions = [{ value: "", label: "المنطقة" }, ...buildLocationOptions("ar")];
  const typeOptions = [{ value: "", label: "النوع" }, ...buildTypeOptions("ar")];
  const coastalVillageOptions = [
    { value: "", label: "القري الساحلية" },
    ...buildCoastalVillageOptions("ar"),
  ];
  const bedroomOptions = [
  { value: "", label: "عدد الغرف" },
  { value: "1", label: "غرفة واحدة" },
  { value: "2", label: "2 غرف" },
  { value: "3", label: "3 غرف" },
  { value: "4", label: "4 غرف" },
  { value: "5", label: "5 غرف" },
  { value: "6", label: "6 غرف" },
  { value: "7", label: "7 غرف" },
  { value: "8", label: "8+ غرف" },
];
  const selectTriggerClassName =
    "w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none transition-colors duration-300 ease-in-out focus-visible:border-[var(--color-gold)]";
  const selectMenuClassName =
    "border border-[rgba(235,210,165,0.16)] bg-[image:var(--dark-select-menu)] shadow-[0_20px_45px_rgba(4,12,24,0.52)] backdrop-blur-xl";
  const selectOptionClassName =
    "w-full px-4 py-3 text-start text-sm font-medium text-[var(--color-ink)] transition-colors duration-200 ease-in-out hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-gold-bright)]";
  const selectedOptionClassName =
    "bg-[rgba(205,168,109,0.22)] text-[var(--color-gold-bright)]";

  async function loadProperties() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/properties", { cache: "no-store" });
      await refreshFromResponse(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر تحميل بيانات الوحدات",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProperties();
  }, []);

  function updateFilter(key: keyof AdminFilters, value: string) {
    setFilters((current) => ({
      ...current,
      coastalVillage:
        key === "location" && value !== "north-coast" ? "" : current.coastalVillage,
      [key]: value,
    }));
  }

  async function refreshFromResponse(response: Response) {
    const result = (await response.json()) as
      | ({ ok: true } & PropertyAdminResponse)
      | { ok: false; error?: string };

    if (!response.ok || !result.ok) {
      throw new Error(result.ok ? "تعذر تنفيذ الطلب" : result.error);
    }

    setData({
      visibleProperties: result.visibleProperties,
      hiddenProperties: result.hiddenProperties,
    });
  }

  async function updateStatus(slug: string, status: "published" | "draft" | "archived") {
    setActiveSlug(slug);
    setError("");

    try {
      const response = await fetch("/api/admin/properties", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, status }),
      });
      await refreshFromResponse(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "تعذر تحديث الحالة",
      );
    } finally {
      setActiveSlug("");
    }
  }

  async function importProperties() {
    if (!importFile) {
      setError("اختر ملف CSV أو Excel أولاً.");
      return;
    }

    setIsImporting(true);
    setError("");

    try {
      const payload = new FormData();
      payload.set("file", importFile);
      const response = await fetch("/api/admin/properties/import", {
        method: "POST",
        body: payload,
      });
      await refreshFromResponse(response);
      setImportFile(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "تعذر استيراد الملف",
      );
    } finally {
      setIsImporting(false);
    }
  }

  async function hideProperty(slug: string) {
    if (!window.confirm("هل تريد إزالة هذه الوحدة من الموقع؟")) {
      return;
    }
    await updateStatus(slug, "archived");
  }

  async function restoreProperty(slug: string) {
    await updateStatus(slug, "published");
  }

  const showCoastalVillageFilter =
    !filters.location || filters.location === "north-coast";
  const visibleProperties = data
    ? filterAdminProperties(data.visibleProperties, filters)
    : [];
  const hiddenProperties = data
    ? filterAdminProperties(data.hiddenProperties, filters)
    : [];

  return (
    <div className="space-y-8" dir="rtl">
      <section className="luxury-dark theme-on-dark rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-kicker">إدارة الوحدات</span>
            <h1 className="display-heading text-3xl font-bold md:text-5xl">
              لوحة إدارة العقارات
            </h1>
            <p className="max-w-3xl text-sm leading-8 text-[var(--theme-dark-copy)] md:text-base">
              أضف وحدات جديدة، اخفِ الوحدات الحالية من الموقع، واستعد أي وحدة مخفية
              بدون تعديل ملفات الكود.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:min-w-[360px]">
            <Link
              href="/admin/new"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-[var(--color-navy)] transition hover:bg-[var(--color-gold-bright)]"
            >
              إضافة وحدة جديدة
            </Link>
            <div className="rounded-[1.5rem] border border-[rgba(235,210,165,0.18)] bg-[rgba(255,255,255,0.05)] p-4">
              <div className="text-sm font-semibold text-[var(--theme-dark-heading)]">
                استيراد CSV / Excel
              </div>
              <p className="mt-2 text-xs leading-6 text-[var(--theme-dark-copy)]">
                الأعمدة المدعومة: locationSlug, propertyType, bedrooms, coastalVillage,
                address, description, size, bathrooms, finishing, furnishing,
                listingType, price, contactPhone, imageUrls, status.
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(event) => setImportFile(event.target.files?.[0] ?? null)}
                className="mt-3 block w-full rounded-2xl border border-[rgba(235,210,165,0.18)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-xs text-[var(--theme-dark-heading)] file:ml-4 file:rounded-full file:border-0 file:bg-[var(--color-gold)] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[var(--color-navy)]"
              />
              <button
                type="button"
                onClick={() => void importProperties()}
                disabled={!importFile || isImporting}
                className="mt-3 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--color-navy)] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isImporting ? "جاري الاستيراد..." : "استيراد الملف"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="luxury-surface rounded-[2rem] p-4 md:p-6">
        <input
          type="search"
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
          placeholder="ابحث بالاسم أو الـ slug أو المنطقة أو نوع العقار"
          className="mb-3 w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-soft)]"
        />
        <div
          className={[
            "grid gap-3 md:grid-cols-2",
            showCoastalVillageFilter ? "xl:grid-cols-4" : "xl:grid-cols-3",
          ].join(" ")}
        >
          <AnimatedSelect
            value={filters.location}
            onChange={(value) => updateFilter("location", value)}
            options={locationOptions}
            placeholder="المنطقة"
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />
          <AnimatedSelect
            value={filters.propertyType}
            onChange={(value) => updateFilter("propertyType", value)}
            options={typeOptions}
            placeholder="النوع"
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />
          <AnimatedSelect
            value={filters.bedrooms}
            onChange={(value) => updateFilter("bedrooms", value)}
            options={bedroomOptions}
            placeholder="عدد الغرف"
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />
          {showCoastalVillageFilter ? (
            <AnimatedSelect
              value={filters.coastalVillage}
              onChange={(value) => updateFilter("coastalVillage", value)}
              options={coastalVillageOptions}
              placeholder="القري الساحلية"
              triggerClassName={selectTriggerClassName}
              menuClassName={selectMenuClassName}
              optionClassName={selectOptionClassName}
              selectedOptionClassName={selectedOptionClassName}
            />
          ) : null}
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)]">
              الوحدات الظاهرة على الموقع
            </h2>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              {isLoading ? "جاري التحميل..." : `${visibleProperties.length} وحدة مطابقة`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => railRef.current?.scrollBy({ left: -380, behavior: "smooth" })}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] text-[var(--color-ink)]"
              aria-label="السابق"
            >
              →
            </button>
            <button
              type="button"
              onClick={() => railRef.current?.scrollBy({ left: 380, behavior: "smooth" })}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] text-[var(--color-ink)]"
              aria-label="التالي"
            >
              ←
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="flex gap-6 overflow-x-auto px-1 pb-4 [scrollbar-width:none]"
        >
          {isLoading ? (
            <div className="luxury-surface min-h-[380px] min-w-full animate-pulse rounded-[2rem]" />
          ) : visibleProperties.length ? (
            visibleProperties.map((property) => (
              <article
                key={property.slug}
                className="luxury-surface relative min-w-[320px] max-w-[360px] overflow-hidden rounded-[2rem]"
              >
                <button
                  type="button"
                  onClick={() => void hideProperty(property.slug)}
                  disabled={activeSlug === property.slug}
                  className="absolute right-4 top-4 z-10 rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {activeSlug === property.slug ? "..." : "إزالة"}
                </button>
                <Link
                  href={`/admin/${property.slug}/edit`}
                  className="absolute left-4 top-4 z-10 rounded-full bg-[var(--color-gold)] px-4 py-2 text-xs font-bold text-[var(--color-navy)] transition hover:bg-[var(--color-gold-bright)]"
                >
                  تعديل
                </Link>
                <div className="relative aspect-[1.15] overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    sizes="360px"
                    className="object-cover"
                  />
                  <div className="property-card-overlay absolute inset-0" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex flex-wrap gap-2">
                      <span className="property-card-tag rounded-full border px-3 py-1 text-xs font-bold backdrop-blur">
                        {property.source === "managed" ? "مضافة من الأدمن" : "وحدة أساسية"}
                      </span>
                      <span className="property-card-tag rounded-full border px-3 py-1 text-xs font-bold backdrop-blur">
                        {property.status === "published"
                          ? "منشورة"
                          : property.status === "draft"
                            ? "مسودة"
                            : "مؤرشفة"}
                      </span>
                      {property.listingType ? (
                        <span className="property-card-tag rounded-full border px-3 py-1 text-xs font-bold backdrop-blur">
                          {property.listingType === "sale" ? "للبيع" : "للإيجار"}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-2xl font-bold leading-tight">
                      {property.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/80">
                      {property.location} • {property.compound}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 p-5 text-sm text-[var(--color-ink)]">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="property-card-stat rounded-2xl px-3 py-3">
                      <div className="text-xs text-[var(--color-muted)]">الغرف</div>
                      <div className="mt-1 font-bold">{property.bedrooms}</div>
                    </div>
                    <div className="property-card-stat rounded-2xl px-3 py-3">
                      <div className="text-xs text-[var(--color-muted)]">الحمامات</div>
                      <div className="mt-1 font-bold">{property.bathrooms}</div>
                    </div>
                    <div className="property-card-stat rounded-2xl px-3 py-3">
                      <div className="text-xs text-[var(--color-muted)]">المساحة</div>
                      <div className="mt-1 font-bold">{property.size} م²</div>
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--color-border)] px-4 py-4">
                    <div className="text-xs text-[var(--color-muted)]">نوع العقار</div>
                    <div className="mt-1 font-semibold">{property.propertyType}</div>
                    <div className="mt-4 text-xs text-[var(--color-muted)]">
                      هاتف التواصل
                    </div>
                    <div className="mt-1 font-semibold">{property.contactPhone}</div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] px-3 py-3">
                        <div className="text-xs text-[var(--color-muted)]">المشاهدات</div>
                        <div className="mt-1 font-bold">{property.analytics.views}</div>
                      </div>
                      <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] px-3 py-3">
                        <div className="text-xs text-[var(--color-muted)]">الـ Leads</div>
                        <div className="mt-1 font-bold">{property.analytics.leads}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void updateStatus(property.slug, "draft")}
                        disabled={activeSlug === property.slug}
                        className="rounded-full border border-[var(--color-border)] px-3 py-2 text-xs font-bold text-[var(--color-ink)]"
                      >
                        مسودة
                      </button>
                      <button
                        type="button"
                        onClick={() => void hideProperty(property.slug)}
                        disabled={activeSlug === property.slug}
                        className="rounded-full bg-rose-500 px-3 py-2 text-xs font-bold text-white"
                      >
                        {activeSlug === property.slug ? "..." : "أرشفة"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="luxury-surface flex min-h-[220px] min-w-full items-center justify-center rounded-[2rem] px-6 text-center text-[var(--color-ink-soft)]">
              لا توجد وحدات مطابقة للفلاتر الحالية.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-ink)]">
            الوحدات غير المنشورة
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            تشمل المسودات والوحدات المؤرشفة.
          </p>
        </div>

        {hiddenProperties.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hiddenProperties.map((property) => (
              <div key={property.slug} className="luxury-surface rounded-[1.75rem] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-ink)]">
                      {property.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
                      {property.location} • {property.compound}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
                        {property.status === "draft" ? "مسودة" : "مؤرشفة"}
                      </span>
                      <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
                        {property.analytics.views} مشاهدة
                      </span>
                      <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
                        {property.analytics.leads} lead
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/${property.slug}/edit`}
                      className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-xs font-bold text-[var(--color-navy)] transition hover:bg-[var(--color-gold-bright)]"
                    >
                      تعديل
                    </Link>
                    <button
                      type="button"
                      onClick={() => void updateStatus(property.slug, "draft")}
                      disabled={activeSlug === property.slug}
                      className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-bold text-[var(--color-ink)] transition disabled:opacity-70"
                    >
                      مسودة
                    </button>
                    <button
                      type="button"
                      onClick={() => void restoreProperty(property.slug)}
                      disabled={activeSlug === property.slug}
                      className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {activeSlug === property.slug ? "..." : "استعادة"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="luxury-surface rounded-[1.75rem] px-6 py-8 text-center text-[var(--color-ink-soft)]">
            لا توجد وحدات مخفية حاليًا.
          </div>
        )}
      </section>
    </div>
  );
}

