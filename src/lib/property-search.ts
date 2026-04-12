import { pickLocale, type Locale } from "@/lib/i18n";
import type { Property } from "@/lib/site-data";

export type PropertyFilterState = {
  location: string;
  type: string;
  listingType: string;
  bedrooms: string;
  coastalVillage: string;
};

export const defaultPropertyFilters: PropertyFilterState = {
  location: "",
  type: "",
  listingType: "",
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
    label: { ar: "العاصمة الإدارية", en: "New Capital" },
  },
];

export const staticTypeOptions = [
  { value: "apartment", label: { ar: "شقة", en: "Apartment" } },
  { value: "chalet", label: { ar: "شاليه", en: "Chalet" } },
  { value: "villa", label: { ar: "فيلا", en: "Villa" } },
  { value: "townhouse", label: { ar: "تاون هاوس", en: "Townhouse" } },
  { value: "twinhouse", label: { ar: "توين هاوس", en: "Twin House" } },
  { value: "penthouse", label: { ar: "بنتهاوس", en: "Penthouse" } },
  { value: "duplex", label: { ar: "دوبلكس", en: "Duplex" } },
  { value: "ivilla", label: { ar: "آي فيلا", en: "iVilla" } },
  { value: "cabana", label: { ar: "كابانا", en: "Cabana" } },
  { value: "studio", label: { ar: "استوديو", en: "Studio" } },
];

const coastalVillages = [
  { en: "Almaza Bay", ar: "ألمازا باي" },
  { en: "Hacienda Heneish", ar: "هاسيندا حنيش" },
  { en: "Summer", ar: "سمر" },
  { en: "Silver Sand", ar: "سيلفر ساند" },
  { en: "Fouka Bay", ar: "فوكا باي" },
  { en: "Marsellia 5", ar: "مارسيليا 5" },
  { en: "Hacienda West", ar: "هاسيندا ويست" },
  { en: "Hyde Park North Coast", ar: "هايد بارك الساحل الشمالي" },
  { en: "La Vista Ras Hekma", ar: "لا فيستا رأس الحكمة" },
  { en: "Mountain View", ar: "ماونتن فيو" },
  { en: "Swan Lake", ar: "سوان ليك" },
  { en: "Solare", ar: "سولاري" },
  { en: "Gaia", ar: "جايا" },
  { en: "June", ar: "جون" },
  { en: "Cali Coast", ar: "كالي كوست" },
  { en: "Direction White", ar: "ديركشن وايت" },
  { en: "Marasem", ar: "مراسم" },
  { en: "The Med", ar: "ذا ميد" },
  { en: "Jefaira", ar: "جيفايرا" },
  { en: "Azzar Island", ar: "أزار آيلاند" },
  { en: "Horizon", ar: "هورايزون" },
  { en: "Soul", ar: "سول" },
  { en: "Lvls", ar: "ليفلز" },
  { en: "Dose", ar: "دوز" },
  { en: "Water Way", ar: "ووتر واي" },
  { en: "Seazen", ar: "سيزن" },
  { en: "La Vista Bay East", ar: "لا فيستا باي إيست" },
  { en: "La Vista Bay", ar: "لا فيستا باي" },
  { en: "D-bay", ar: "دي باي" },
  { en: "La Sirena", ar: "لا سيرينا" },
  { en: "Zoya", ar: "زويا" },
  { en: "Playa", ar: "بلايا" },
  { en: "Ghazala Bay", ar: "غزالة باي" },
  { en: "Telal", ar: "تلال" },
  { en: "Hacienda Red", ar: "هاسيندا ريد" },
  { en: "Hacienda White", ar: "هاسيندا وايت" },
  { en: "Blumar", ar: "بلومار" },
  { en: "Amwaj", ar: "أمواج" },
  { en: "Sea Shell", ar: "سي شيل" },
  { en: "Stella Heights", ar: "ستيلا هايتس" },
  { en: "La Vista Cascada", ar: "لا فيستا كاسكادا" },
  { en: "Marassi", ar: "مراسي" },
  { en: "Diplo", ar: "ديبلو" },
  { en: "Hacienda Bay", ar: "هاسيندا باي" },
  { en: "Zahra", ar: "زهرة" },
  { en: "Palm Hills Alamein", ar: "بالم هيلز العلمين" },
] as const;

function toVillageValue(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const staticCoastalVillageOptions = [
  ...coastalVillages.map((village) => ({
    value: toVillageValue(village.en),
    label: { ar: village.ar, en: village.en },
  })),
  { value: "other", label: { ar: "أخرى", en: "Other" } },
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\u0061-\p{L}\p{N}]+/gu, "");
}

const villageTokens: Record<string, string[]> = Object.fromEntries(
  coastalVillages.map((village) => {
    const compact = village.en.replace(/\s+/g, "");
    const plainHyphen = village.en.replace(/-/g, "");

    return [
      toVillageValue(village.en),
      [village.en, village.ar, compact, plainHyphen, normalizeText(village.en)],
    ];
  }),
);

export function getLocationOption(value: string) {
  return staticLocationOptions.find((item) => item.value === value);
}

export function getTypeOption(value: string) {
  return staticTypeOptions.find((item) => item.value === value);
}

export function getCoastalVillageOption(value: string) {
  return staticCoastalVillageOptions.find((item) => item.value === value);
}

export function resolveCoastalVillageKey(property: Property) {
  if (property.locationSlug !== "north-coast") {
    return "";
  }

  const compound = normalizeText(`${property.compound.ar} ${property.compound.en}`);

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
    const matchesListingType =
      !filters.listingType || property.listingType === filters.listingType;
    const matchesBedrooms =
      !filters.bedrooms || property.bedrooms >= Number(filters.bedrooms);
    const matchesCoastalVillage =
      !filters.coastalVillage ||
      resolveCoastalVillageKey(property) === filters.coastalVillage;

    return (
      matchesLocation &&
      matchesType &&
      matchesListingType &&
      matchesBedrooms &&
      matchesCoastalVillage
    );
  });
}
