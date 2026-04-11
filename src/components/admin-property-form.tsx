"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { AnimatedSelect } from "@/components/animated-select";
import type { AdminEditableProperty } from "@/lib/admin-property-types";
import {
  buildCoastalVillageOptions,
  buildLocationOptions,
  buildTypeOptions,
} from "@/lib/property-search";

type FormState = {
  locationSlug: string;
  propertyType: string;
  bedrooms: string;
  coastalVillage: string;
  description: string;
  size: string;
  bathrooms: string;
  finishing: string;
  furnishing: string;
  listingType: string;
  price: string;
  contactPhone: string;
};

type AdminPropertyFormProps = {
  mode?: "create" | "edit";
  initialProperty?: AdminEditableProperty;
};

const defaultState: FormState = {
  locationSlug: "",
  propertyType: "",
  bedrooms: "",
  coastalVillage: "",
  description: "",
  size: "",
  bathrooms: "",
  finishing: "",
  furnishing: "",
  listingType: "",
  price: "",
  contactPhone: "",
};

export function AdminPropertyForm({
  mode = "create",
  initialProperty,
}: AdminPropertyFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(
    initialProperty
        ? {
            locationSlug: initialProperty.locationSlug,
            propertyType: initialProperty.propertyType,
            bedrooms: `${initialProperty.bedrooms}`,
            coastalVillage: initialProperty.coastalVillage,
            description: initialProperty.description,
            size: `${initialProperty.size}`,
            bathrooms: `${initialProperty.bathrooms}`,
            finishing: initialProperty.finishing,
            furnishing: initialProperty.furnishing,
          listingType: initialProperty.listingType,
          price: initialProperty.price ? `${initialProperty.price}` : "",
          contactPhone: initialProperty.contactPhone,
        }
      : defaultState,
  );
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    initialProperty?.imageUrls ?? [],
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const locationOptions = [{ value: "", label: "المنطقة" }, ...buildLocationOptions("ar")];
  const typeOptions = [{ value: "", label: "النوع" }, ...buildTypeOptions("ar")];
  const coastalVillageOptions = [
    { value: "", label: "القري الساحلية" },
    ...buildCoastalVillageOptions("ar"),
  ];
  const bedroomOptions = [
    { value: "", label: "عدد الغرف" },
    { value: "2", label: "2+غرف" },
    { value: "3", label: "3+غرف" },
    { value: "4", label: "4+غرف" },
    { value: "5", label: "5+غرف" },
    { value: "6", label: "6+غرف" },
  ];
  const bathroomOptions = [
    { value: "", label: "عدد الحمامات" },
    { value: "2", label: "2+حمام" },
    { value: "3", label: "3+حمام" },
    { value: "4", label: "4+حمام" },
    { value: "5", label: "5+حمام" },
    { value: "6", label: "6+حمام" },
    { value: "7", label: "7+حمام" },
    { value: "8", label: "8+حمام" },
  ];
  const finishingOptions = [
    { value: "", label: "التشطيب" },
    { value: "full", label: "كامل" },
    { value: "semi", label: "نص كامل" },
    { value: "unfinished", label: "غير كامل" },
  ];
  const furnishingOptions = [
    { value: "", label: "الفرش" },
    { value: "furnished", label: "مفروش" },
    { value: "semi-furnished", label: "نص مفروش" },
    { value: "unfurnished", label: "غير مفروش" },
  ];
  const listingTypeOptions = [
    { value: "", label: "نوع العرض" },
    { value: "sale", label: "للبيع" },
    { value: "rent", label: "للإيجار" },
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

  const showCoastalVillage = formState.locationSlug === "north-coast";
  const showPrice = formState.listingType === "sale";
  const descriptionLimit = 2000;

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setFormState((current) => ({
      ...current,
      coastalVillage:
        key === "locationSlug" && value !== "north-coast"
          ? ""
          : current.coastalVillage,
      price: key === "listingType" && value !== "sale" ? "" : current.price,
      [key]: value,
    }));
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = new FormData();
      payload.set("locationSlug", formState.locationSlug);
      payload.set("propertyType", formState.propertyType);
      payload.set("bedrooms", formState.bedrooms);
      payload.set("coastalVillage", showCoastalVillage ? formState.coastalVillage : "");
      payload.set("description", formState.description);
      payload.set("size", formState.size);
      payload.set("bathrooms", formState.bathrooms);
      payload.set("finishing", formState.finishing);
      payload.set("furnishing", formState.furnishing);
      payload.set("listingType", formState.listingType);
      payload.set("price", showPrice ? formState.price : "");
      payload.set("contactPhone", formState.contactPhone);
      payload.set("existingImageUrls", JSON.stringify(existingImageUrls));
      selectedFiles.forEach((file) => {
        payload.append("images", file);
      });

      const response = await fetch(
        mode === "edit" && initialProperty
          ? `/api/admin/properties/${initialProperty.slug}`
          : "/api/admin/properties",
        {
          method: mode === "edit" ? "PUT" : "POST",
          body: payload,
        },
      );
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "تعذر حفظ الوحدة");
      }

      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.push("/admin");
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر حفظ الوحدة",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 10) {
      setError("يمكن رفع 10 صور كحد أقصى");
      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setError("");
    setSelectedFiles(files);
  }

  function removeExistingImage(imageUrl: string) {
    setExistingImageUrls((current) =>
      current.filter((currentImage) => currentImage !== imageUrl),
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <section className="luxury-dark theme-on-dark rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <span className="section-kicker">
              {mode === "edit" ? "تعديل وحدة" : "إضافة وحدة"}
            </span>
            <h1 className="display-heading text-3xl font-bold md:text-5xl">
              {mode === "edit" ? "تعديل الوحدة" : "إضافة وحدة جديدة"}
            </h1>
            <p className="max-w-3xl text-sm leading-8 text-[var(--theme-dark-copy)] md:text-base">
              {mode === "edit"
                ? "عدّل بيانات الوحدة الحالية واحفظ التغييرات مباشرة على الموقع ولوحة الإدارة."
                : "اختر البيانات المطلوبة للوحدة، وسيتم إضافتها إلى الموقع ولوحة الإدارة مباشرة. في حال عدم إدخال صور سيتم استخدام صورة افتراضية مؤقتًا."}
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(235,210,165,0.26)] px-5 py-3 text-sm font-semibold text-[var(--theme-dark-heading)]"
          >
            العودة للوحة الإدارة
          </Link>
        </div>
      </section>

      <form onSubmit={submitForm} className="luxury-surface rounded-[2rem] p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatedSelect
            value={formState.locationSlug}
            onChange={(value) => updateField("locationSlug", value)}
            options={locationOptions}
            placeholder="المنطقة"
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />
          <AnimatedSelect
            value={formState.propertyType}
            onChange={(value) => updateField("propertyType", value)}
            options={typeOptions}
            placeholder="النوع"
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />
          <AnimatedSelect
            value={formState.bedrooms}
            onChange={(value) => updateField("bedrooms", value)}
            options={bedroomOptions}
            placeholder="عدد الغرف"
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />

          {showCoastalVillage ? (
            <AnimatedSelect
              value={formState.coastalVillage}
              onChange={(value) => updateField("coastalVillage", value)}
              options={coastalVillageOptions}
              placeholder="القري الساحلية"
              triggerClassName={selectTriggerClassName}
              menuClassName={selectMenuClassName}
              optionClassName={selectOptionClassName}
              selectedOptionClassName={selectedOptionClassName}
            />
          ) : null}

          <input
            type="number"
            min="1"
            required
            value={formState.size}
            onChange={(event) => updateField("size", event.target.value)}
            placeholder="المساحة بالمتر"
            className={inputClassName}
          />
          <AnimatedSelect
            value={formState.bathrooms}
            onChange={(value) => updateField("bathrooms", value)}
            options={bathroomOptions}
            placeholder="عدد الحمامات"
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />
          <AnimatedSelect
            value={formState.finishing}
            onChange={(value) => updateField("finishing", value)}
            options={finishingOptions}
            placeholder="التشطيب"
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />
          <AnimatedSelect
            value={formState.furnishing}
            onChange={(value) => updateField("furnishing", value)}
            options={furnishingOptions}
            placeholder="الفرش"
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />
          <AnimatedSelect
            value={formState.listingType}
            onChange={(value) => updateField("listingType", value)}
            options={listingTypeOptions}
            placeholder="نوع العرض"
            triggerClassName={selectTriggerClassName}
            menuClassName={selectMenuClassName}
            optionClassName={selectOptionClassName}
            selectedOptionClassName={selectedOptionClassName}
          />

          {showPrice ? (
            <input
              type="number"
              min="1"
              required
              value={formState.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="السعر"
              className={inputClassName}
            />
          ) : null}

          <input
            type="tel"
            required
            value={formState.contactPhone}
            onChange={(event) => updateField("contactPhone", event.target.value)}
            placeholder="رقم الهاتف الخاص بالوحدة"
            className={inputClassName}
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="property-description"
            className="mb-3 block text-sm font-semibold text-[var(--color-ink)]"
          >
            وصف الوحدة
          </label>
          <textarea
            id="property-description"
            rows={6}
            maxLength={descriptionLimit}
            value={formState.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="اكتب وصف الوحدة بالتفصيل، وسيظهر في صفحة الوحدة على الموقع."
            className={`${inputClassName} min-h-[170px] resize-y`}
          />
          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[var(--color-ink-soft)]">
            <span>الحد الأقصى 2000 حرف.</span>
            <span>
              {formState.description.length}/{descriptionLimit}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="property-images"
            className="mb-3 block text-sm font-semibold text-[var(--color-ink)]"
          >
            صور الوحدة
          </label>
          {existingImageUrls.length ? (
            <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {existingImageUrls.map((imageUrl) => (
                <div
                  key={imageUrl}
                  className="rounded-[1.5rem] border border-[var(--color-border)] p-3"
                >
                  <div className="text-sm font-semibold text-[var(--color-ink)]">
                    صورة حالية
                  </div>
                  <div className="mt-2 truncate text-xs text-[var(--color-ink-soft)]">
                    {imageUrl}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(imageUrl)}
                    className="mt-3 rounded-full bg-rose-500 px-3 py-2 text-xs font-bold text-white"
                  >
                    إزالة الصورة
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <input
            id="property-images"
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            multiple
            onChange={handleFilesChange}
            className="block w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-4 text-sm text-[var(--color-ink)] file:ml-4 file:rounded-full file:border-0 file:bg-[var(--color-gold)] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[var(--color-navy)]"
          />
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            ارفع الصور مباشرة من جهازك. الحد الأقصى 10 صور، وحجم كل صورة حتى 8
            ميجابايت. إذا لم تضف صورًا جديدة سيتم الاحتفاظ بالصور الحالية.
          </p>
          {selectedFiles.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedFiles.map((file) => (
                <span
                  key={`${file.name}-${file.size}`}
                  className="rounded-full bg-[rgba(205,168,109,0.14)] px-3 py-2 text-xs font-semibold text-[var(--color-ink)]"
                >
                  {file.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-[1.25rem] border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-[var(--color-navy)] transition hover:bg-[var(--color-gold-bright)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? "جاري الحفظ..."
              : mode === "edit"
                ? "حفظ التعديلات"
                : "حفظ الوحدة"}
          </button>
          <Link
            href="/admin"
            className="theme-neutral-button rounded-full px-6 py-3 text-sm font-semibold"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
