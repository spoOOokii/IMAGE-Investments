import { pickLocale, type Locale } from "@/lib/i18n";
import type { Property } from "@/lib/site-data";

export type PropertyFilterState = {
  location: string;
  type: string;
  bedrooms: string;
  coastalVillage: string;
};

export const defaultPropertyFilters: PropertyFilterState = {
  location: "",
  type: "",
  bedrooms: "",
  coastalVillage: "",
};

export const staticLocationOptions = [
  {
    value: "north-coast",
    label: { ar: "الساحل الشمالي", en: "North Coast" },
  },
  {
    value: "new-cairo",
    label: { ar: "القاهرة الجديدة", en: "New Cairo" },
  },
  {
    value: "6th-of-october",
    label: { ar: "أكتوبر", en: "October" },
  },
  {
    value: "sheikh-zayed",
    label: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
  },
  {
    value: "new-capital",
    label: { ar: "العاصمه الادارية", en: "New Capital" },
  },
];

export const staticTypeOptions = [
  { value: "apartment", label: { ar: "شقة", en: "Apartment" } },
  { value: "chalet", label: { ar: "شالية", en: "Chalet" } },
  { value: "villa", label: { ar: "فيلا", en: "Villa" } },
  { value: "townhouse", label: { ar: "تاون هاوس", en: "Townhouse" } },
  { value: "twinhouse", label: { ar: "توين هاوس", en: "Twin House" } },
  { value: "penthouse", label: { ar: "بنتا هاوس", en: "Penthouse" } },
  { value: "duplex", label: { ar: "دوبلكس", en: "Duplex" } },
  { value: "ivilla", label: { ar: "اي فيلا", en: "iVilla" } },
  { value: "cabana", label: { ar: "كبانه", en: "Cabana" } },
  { value: "studio", label: { ar: "استوديو", en: "Studio" } },
];

export const staticCoastalVillageOptions = [
  { value: "hacienda-bay", label: { ar: "هايسندا باي", en: "Hacienda Bay" } },
  { value: "hacienda-white", label: { ar: "هايسندا وايت", en: "Hacienda White" } },
  { value: "hacienda-west", label: { ar: "هايسندا ويست", en: "Hacienda West" } },
  { value: "marassi", label: { ar: "مراسي", en: "Marassi" } },
  { value: "amwaj", label: { ar: "امواج", en: "Amwaj" } },
  { value: "telal", label: { ar: "تلال", en: "Telal" } },
  { value: "mountain-view", label: { ar: "ماونتن فيو", en: "Mountain View" } },
  { value: "seashell", label: { ar: "سي شيل", en: "Seashell" } },
  { value: "other", label: { ar: "اخري", en: "Other" } },
];

const villageTokens: Record<string, string[]> = {
  "hacienda-bay": ["haciendabay", "hasiendabai", "هاسينداباي", "هايسنداباي"],
  "hacienda-white": ["haciendawhite", "هاسينداوايت", "هايسنداوايت"],
  "hacienda-west": ["haciendawest", "هاسينداويست", "هايسنداويست"],
  marassi: ["marassi", "مراسي"],
  amwaj: ["amwaj", "امواج", "أمواج"],
  telal: ["telal", "تلال"],
  "mountain-view": ["mountainview", "ماونتنفيو"],
  seashell: ["seashell", "سيشيل"],
};

export function getLocationOption(value: string) {
  return staticLocationOptions.find((item) => item.value === value);
}

export function getTypeOption(value: string) {
  return staticTypeOptions.find((item) => item.value === value);
}

export function getCoastalVillageOption(value: string) {
  return staticCoastalVillageOptions.find((item) => item.value === value);
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

export function resolveCoastalVillageKey(property: Property) {
  if (property.locationSlug !== "north-coast") {
    return "";
  }

  const compound = normalizeText(
    `${property.compound.ar} ${property.compound.en}`,
  );

  const matchedEntry = Object.entries(villageTokens).find(([, tokens]) =>
    tokens.some((token) => compound.includes(normalizeText(token))),
  );

  return matchedEntry ? matchedEntry[0] : "other";
}

export function buildLocationOptions(locale: Locale) {
  return staticLocationOptions.map((item) => ({
    value: item.value,
    label: pickLocale(item.label, locale),
  }));
}

export function buildTypeOptions(locale: Locale) {
  return staticTypeOptions.map((item) => ({
    value: item.value,
    label: pickLocale(item.label, locale),
  }));
}

export function buildCoastalVillageOptions(locale: Locale) {
  return staticCoastalVillageOptions.map((item) => ({
    value: item.value,
    label: pickLocale(item.label, locale),
  }));
}

export function filterProperties(
  properties: Property[],
  filters: PropertyFilterState,
) {
  return properties.filter((property) => {
    const matchesLocation =
      !filters.location || property.locationSlug === filters.location;
    const matchesType = !filters.type || property.propertyType === filters.type;
    const matchesBedrooms =
      !filters.bedrooms || property.bedrooms >= Number(filters.bedrooms);
    const matchesCoastalVillage =
      !filters.coastalVillage ||
      resolveCoastalVillageKey(property) === filters.coastalVillage;

    return (
      matchesLocation &&
      matchesType &&
      matchesBedrooms &&
      matchesCoastalVillage
    );
  });
}
