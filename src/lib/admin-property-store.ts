import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  AdminEditableProperty,
  AdminPropertySummary,
  CreateManagedPropertyPayload,
  ManagedPropertyRecord,
  ManagedFurnishing,
  ManagedListingType,
  PropertyAdminResponse,
  PropertyAdminStore,
} from "@/lib/admin-property-types";
import { pickLocale } from "@/lib/i18n";
import {
  getCoastalVillageOption,
  getLocationOption,
  resolveCoastalVillageKey,
} from "@/lib/property-search";
import {
  companyProfile,
  properties as baseProperties,
  propertyTypeLabels,
  type LocalizedText,
  type Property,
} from "@/lib/site-data";

const STORE_PATH = path.join(process.cwd(), "data", "property-admin-store.json");
const DEFAULT_STORE: PropertyAdminStore = {
  managedProperties: [],
  propertyOverrides: [],
  hiddenPropertySlugs: [],
};
const DEFAULT_PROPERTY_IMAGE = "/media/property-placeholder.svg";

const locationCoordinates: Record<string, { lat: number; lng: number }> = {
  "north-coast": { lat: 30.9828, lng: 28.7308 },
  "new-cairo": { lat: 30.0176, lng: 31.4913 },
  "6th-of-october": { lat: 29.9853, lng: 30.9502 },
  "sheikh-zayed": { lat: 30.0341, lng: 30.9786 },
  "new-capital": { lat: 30.0089, lng: 31.7284 },
};

const coastalVillageCoordinates: Record<string, { lat: number; lng: number }> = {
  "almaza-bay": { lat: 31.1244, lng: 27.7364 },
  "hacienda-heneish": { lat: 31.0393, lng: 28.5054 },
  summer: { lat: 31.0451, lng: 28.6114 },
  "silver-sand": { lat: 31.0766, lng: 28.7994 },
  "fouka-bay": { lat: 30.9434, lng: 28.9648 },
  "marsellia-5": { lat: 30.9956, lng: 28.6644 },
  "hacienda-west": { lat: 30.9964, lng: 28.5987 },
  "hyde-park-north-coast": { lat: 31.0109, lng: 28.7024 },
  "la-vista-ras-hekma": { lat: 31.0893, lng: 28.0654 },
  "mountain-view": { lat: 30.9998, lng: 28.7062 },
  "swan-lake": { lat: 31.0407, lng: 28.4577 },
  solare: { lat: 31.0831, lng: 28.1378 },
  gaia: { lat: 31.0724, lng: 28.2695 },
  june: { lat: 31.0079, lng: 28.7223 },
  "cali-coast": { lat: 31.0344, lng: 28.5352 },
  "direction-white": { lat: 31.1092, lng: 27.9786 },
  marasem: { lat: 31.0308, lng: 28.4942 },
  "the-med": { lat: 31.0838, lng: 28.1532 },
  jefaira: { lat: 31.0279, lng: 28.5481 },
  "azzar-island": { lat: 31.0184, lng: 28.6123 },
  horizon: { lat: 31.0052, lng: 28.6889 },
  soul: { lat: 31.0357, lng: 28.5119 },
  lvls: { lat: 31.0145, lng: 28.6264 },
  dose: { lat: 31.1151, lng: 27.9042 },
  "water-way": { lat: 31.0019, lng: 28.7036 },
  seazen: { lat: 31.0242, lng: 28.5707 },
  "la-vista-bay-east": { lat: 31.1003, lng: 28.0098 },
  "la-vista-bay": { lat: 31.0959, lng: 28.0224 },
  "d-bay": { lat: 31.0664, lng: 28.2911 },
  "la-sirena": { lat: 31.0271, lng: 28.5538 },
  zoya: { lat: 31.0508, lng: 28.3859 },
  playa: { lat: 31.0195, lng: 28.5976 },
  "ghazala-bay": { lat: 31.0477, lng: 28.4278 },
  telal: { lat: 31.1014, lng: 28.0008 },
  "hacienda-red": { lat: 31.0382, lng: 28.4744 },
  "hacienda-white": { lat: 31.0586, lng: 28.3371 },
  blumar: { lat: 31.0086, lng: 28.6735 },
  amwaj: { lat: 31.0455, lng: 28.4229 },
  "sea-shell": { lat: 31.0734, lng: 28.2361 },
  "stella-heights": { lat: 31.0303, lng: 28.5296 },
  "la-vista-cascada": { lat: 31.0241, lng: 28.5689 },
  marassi: { lat: 30.9912, lng: 28.7425 },
  diplo: { lat: 31.0677, lng: 28.2828 },
  "hacienda-bay": { lat: 30.9904, lng: 28.7068 },
  zahra: { lat: 30.9855, lng: 28.7329 },
  "palm-hills-alamein": { lat: 30.9721, lng: 28.7795 },
};

const finishingLabels: Record<string, LocalizedText> = {
  full: { ar: "تشطيب كامل", en: "Fully finished" },
  semi: { ar: "نصف تشطيب", en: "Semi-finished" },
  unfinished: { ar: "غير كامل", en: "Unfinished" },
};

const furnishingLabels: Record<ManagedFurnishing, LocalizedText> = {
  furnished: { ar: "مفروش", en: "Furnished" },
  "semi-furnished": { ar: "نصف مفروش", en: "Semi-furnished" },
  unfurnished: { ar: "غير مفروش", en: "Unfurnished" },
};

const listingTypeLabels: Record<ManagedListingType, LocalizedText> = {
  sale: { ar: "للبيع", en: "For Sale" },
  rent: { ar: "للإيجار", en: "For Rent" },
};

function normalizeStore(store: Partial<PropertyAdminStore>): PropertyAdminStore {
  return {
    managedProperties: Array.isArray(store.managedProperties)
      ? store.managedProperties
      : [],
    propertyOverrides: Array.isArray(store.propertyOverrides)
      ? store.propertyOverrides
      : [],
    hiddenPropertySlugs: Array.isArray(store.hiddenPropertySlugs)
      ? store.hiddenPropertySlugs
      : [],
  };
}

function getCustomDescription(record: ManagedPropertyRecord) {
  return `${record.description ?? ""}`.trim();
}

function formatPrice(value: number) {
  return value.toLocaleString("en-US");
}

function normalizeDigits(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function normalizePhoneForDisplay(value: string) {
  return normalizeDigits(value);
}

function ensureEgyptCountryCode(value: string) {
  const digits = normalizeDigits(value).replace(/^\+/, "");

  if (!digits) {
    return companyProfile.whatsappNumber;
  }

  if (digits.startsWith("20")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `2${digits}`;
  }

  return digits;
}

async function ensureStoreFile() {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), "utf8");
  }
}

export async function readPropertyAdminStore() {
  await ensureStoreFile();

  try {
    const content = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(content) as Partial<PropertyAdminStore>;

    return normalizeStore(parsed);
  } catch {
    return DEFAULT_STORE;
  }
}

async function writePropertyAdminStore(store: PropertyAdminStore) {
  await ensureStoreFile();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function getLocationLabel(locationSlug: string) {
  return (
    getLocationOption(locationSlug)?.label ?? {
      ar: "منطقة غير محددة",
      en: "Unspecified location",
    }
  );
}

function getCompoundLabel(record: ManagedPropertyRecord) {
  if (record.locationSlug === "north-coast" && record.coastalVillage) {
    return (
      getCoastalVillageOption(record.coastalVillage)?.label ?? {
        ar: "قرية ساحلية",
        en: "Coastal village",
      }
    );
  }

  return record.listingType === "sale"
    ? { ar: "عرض بيع مباشر", en: "Direct sale listing" }
    : { ar: "عرض إيجار مباشر", en: "Direct rent listing" };
}

function getManagedCoordinates(record: ManagedPropertyRecord) {
  if (record.locationSlug === "north-coast" && record.coastalVillage) {
    return (
      coastalVillageCoordinates[record.coastalVillage] ??
      locationCoordinates["north-coast"]
    );
  }

  return (
    locationCoordinates[record.locationSlug] ??
    locationCoordinates["new-cairo"]
  );
}

function buildManagedTitle(record: ManagedPropertyRecord) {
  const propertyTypeLabel = propertyTypeLabels[record.propertyType];
  const locationLabel = getLocationLabel(record.locationSlug);
  const compoundLabel = getCompoundLabel(record);
  const displayArea =
    record.locationSlug === "north-coast" && record.coastalVillage
      ? compoundLabel
      : locationLabel;

  return {
    ar: `${pickLocale(propertyTypeLabel, "ar")} ${
      pickLocale(listingTypeLabels[record.listingType], "ar")
    } في ${pickLocale(displayArea, "ar")}`,
    en: `${pickLocale(propertyTypeLabel, "en")} ${
      pickLocale(listingTypeLabels[record.listingType], "en")
    } in ${pickLocale(displayArea, "en")}`,
  } satisfies LocalizedText;
}

function buildManagedSummary(record: ManagedPropertyRecord) {
  const propertyTypeLabel = propertyTypeLabels[record.propertyType];
  const finishingLabel = finishingLabels[record.finishing];
  const furnishingLabel = furnishingLabels[record.furnishing];
  const locationLabel = getLocationLabel(record.locationSlug);

  return {
    ar: `${pickLocale(propertyTypeLabel, "ar")} ${pickLocale(
      listingTypeLabels[record.listingType],
      "ar",
    )} بمساحة ${record.size} م²، ${record.bedrooms} غرف و${record.bathrooms} حمام في ${pickLocale(
      locationLabel,
      "ar",
    )}، ${pickLocale(finishingLabel, "ar")} و${pickLocale(furnishingLabel, "ar")}.`,
    en: `${pickLocale(propertyTypeLabel, "en")} ${pickLocale(
      listingTypeLabels[record.listingType],
      "en",
    )} with ${record.size} sqm, ${record.bedrooms} bedrooms, and ${record.bathrooms} bathrooms in ${pickLocale(
      locationLabel,
      "en",
    )}, ${pickLocale(finishingLabel, "en")} and ${pickLocale(furnishingLabel, "en")}.`,
  } satisfies LocalizedText;
}

function buildManagedDescription(record: ManagedPropertyRecord) {
  const locationLabel = getLocationLabel(record.locationSlug);
  const compoundLabel = getCompoundLabel(record);
  const furnishingLabel = furnishingLabels[record.furnishing];
  const customDescription = getCustomDescription(record);

  if (customDescription) {
    return {
      ar: customDescription,
      en: customDescription,
    } satisfies LocalizedText;
  }

  return {
    ar:
      record.locationSlug === "north-coast" && record.coastalVillage
        ? `وحدة متاحة ${pickLocale(
            listingTypeLabels[record.listingType],
            "ar",
          )} داخل ${pickLocale(compoundLabel, "ar")} في ${pickLocale(
            locationLabel,
            "ar",
          )}، مناسبة للعميل الباحث عن مساحة عملية وتجهيز واضح مع ${pickLocale(
            furnishingLabel,
            "ar",
          )}.`
        : `وحدة متاحة ${pickLocale(
            listingTypeLabels[record.listingType],
            "ar",
          )} داخل ${pickLocale(
            locationLabel,
            "ar",
          )} بمواصفات مناسبة للعرض المباشر والتواصل السريع مع المالك أو المسؤول عن الوحدة.`,
    en:
      record.locationSlug === "north-coast" && record.coastalVillage
        ? `An available ${pickLocale(
            listingTypeLabels[record.listingType],
            "en",
          )} unit inside ${pickLocale(compoundLabel, "en")} in ${pickLocale(
            locationLabel,
            "en",
          )}, built for clients seeking clear specs and ${pickLocale(
            furnishingLabel,
            "en",
          )}.`
        : `An available ${pickLocale(
            listingTypeLabels[record.listingType],
            "en",
          )} unit in ${pickLocale(
            locationLabel,
            "en",
          )} with direct-contact readiness and practical specifications for fast viewings.`,
  } satisfies LocalizedText;
}

function buildManagedProperty(record: ManagedPropertyRecord): Property {
  const locationLabel = getLocationLabel(record.locationSlug);
  const compoundLabel = getCompoundLabel(record);
  const finishingLabel = finishingLabels[record.finishing];
  const furnishingLabel = furnishingLabels[record.furnishing];
  const listingTypeLabel = listingTypeLabels[record.listingType];
  const imageUrls = record.imageUrls.length
    ? record.imageUrls
    : [DEFAULT_PROPERTY_IMAGE];

  return {
    slug: record.slug,
    title: buildManagedTitle(record),
    summary: buildManagedSummary(record),
    description: buildManagedDescription(record),
    locationSlug: record.locationSlug,
    locationName: locationLabel,
    compound: compoundLabel,
    propertyType: record.propertyType,
    price: record.price ?? 0,
    priceLabel:
      record.listingType === "sale" && record.price
        ? {
            ar: `${formatPrice(record.price)} جنيه`,
            en: `EGP ${formatPrice(record.price)}`,
          }
        : { ar: "عند الطلب", en: "On request" },
    size: record.size,
    bedrooms: record.bedrooms,
    bathrooms: record.bathrooms,
    finishing: finishingLabel,
    paymentPlan:
      record.listingType === "sale"
        ? { ar: "بيع مباشر", en: "Direct sale" }
        : { ar: "إيجار مباشر", en: "Direct rent" },
    delivery: { ar: "متاح الآن", en: "Available now" },
    deliveryYear: new Date(record.createdAt).getFullYear(),
    isReady: true,
    installmentYears: 0,
    tags: record.tags.length ? record.tags : ["prime"],
    gallery: imageUrls,
    amenities: [
      {
        ar: `${record.bedrooms} غرف نوم`,
        en: `${record.bedrooms} bedrooms`,
      },
      {
        ar: `${record.bathrooms} حمام`,
        en: `${record.bathrooms} bathrooms`,
      },
      {
        ar: pickLocale(finishingLabel, "ar"),
        en: pickLocale(finishingLabel, "en"),
      },
      {
        ar: pickLocale(furnishingLabel, "ar"),
        en: pickLocale(furnishingLabel, "en"),
      },
    ],
    nearby: [],
    investmentAngle:
      record.listingType === "sale"
        ? {
            ar: `وحدة ${pickLocale(
              listingTypeLabel,
              "ar",
            )} مع تواصل مباشر ومعلومات محدثة من خلال الرقم المخصص للوحدة.`,
            en: `A ${pickLocale(
              listingTypeLabel,
              "en",
            )} listing with direct contact through the dedicated unit phone number.`,
          }
        : {
            ar: `وحدة ${pickLocale(
              listingTypeLabel,
              "ar",
            )} متاحة الآن مع إمكانية تواصل مباشر وترتيب المعاينة سريعًا.`,
            en: `A ${pickLocale(
              listingTypeLabel,
              "en",
            )} unit available now with direct contact and fast viewing coordination.`,
          },
    coordinates: getManagedCoordinates(record),
    contactPhone: normalizePhoneForDisplay(record.contactPhone),
    listingType: record.listingType,
    source: "managed",
  };
}

function sortManagedProperties(records: ManagedPropertyRecord[]) {
  return [...records].sort(
    (first, second) =>
      new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
  );
}

function inferListingType(property: Property): ManagedListingType {
  const haystack = [
    property.slug,
    property.title.ar,
    property.title.en,
    property.summary.ar,
    property.summary.en,
  ]
    .join(" ")
    .toLowerCase();

  if (haystack.includes("rent") || haystack.includes("إيجار") || haystack.includes("للإيجار")) {
    return "rent";
  }

  return "sale";
}

function inferFinishing(property: Property): ManagedPropertyRecord["finishing"] {
  const haystack = `${property.finishing.ar} ${property.finishing.en}`.toLowerCase();

  if (haystack.includes("نصف") || haystack.includes("semi")) {
    return "semi";
  }

  if (
    haystack.includes("غير كامل") ||
    haystack.includes("core") ||
    haystack.includes("shell") ||
    haystack.includes("عظم") ||
    haystack.includes("unfinished")
  ) {
    return "unfinished";
  }

  return "full";
}

function inferFurnishing(property: Property): ManagedFurnishing {
  const haystack = `${property.finishing.ar} ${property.finishing.en} ${property.summary.ar} ${property.summary.en}`.toLowerCase();

  if (haystack.includes("نص مفروش") || haystack.includes("semi furnished")) {
    return "semi-furnished";
  }

  if (haystack.includes("مفروش") || haystack.includes("furnished")) {
    return "furnished";
  }

  return "unfurnished";
}

function propertyToEditableRecord(property: Property): ManagedPropertyRecord {
  return {
    slug: property.slug,
    locationSlug: property.locationSlug,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    coastalVillage: resolveCoastalVillageKey(property),
    description: property.description.ar,
    size: property.size,
    bathrooms: property.bathrooms,
    finishing: inferFinishing(property),
    furnishing: inferFurnishing(property),
    listingType: property.listingType ?? inferListingType(property),
    price: property.listingType === "rent" ? null : property.price || null,
    contactPhone: normalizePhoneForDisplay(
      property.contactPhone ?? companyProfile.phoneDisplay,
    ),
    imageUrls: property.gallery.length ? property.gallery : [DEFAULT_PROPERTY_IMAGE],
    tags: property.tags.length ? property.tags : ["prime"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function mergeVisibleProperties(store: PropertyAdminStore) {
  const hiddenSlugs = new Set(store.hiddenPropertySlugs);
  const overrideMap = new Map(
    sortManagedProperties(store.propertyOverrides).map((record) => [
      record.slug,
      buildManagedProperty(record),
    ]),
  );
  const managedProperties = sortManagedProperties(store.managedProperties)
    .filter((record) => !hiddenSlugs.has(record.slug))
    .map(buildManagedProperty);
  const visibleBaseProperties = baseProperties
    .filter((property) => !hiddenSlugs.has(property.slug))
    .map((property) => {
      const override = overrideMap.get(property.slug);

      if (override) {
        return {
          ...override,
          source: "built-in" as const,
        };
      }

      return {
        ...property,
        source: property.source ?? "built-in",
        contactPhone: property.contactPhone ?? companyProfile.phoneDisplay,
      };
    });

  return [...managedProperties, ...visibleBaseProperties];
}

export async function getVisiblePropertiesWithAdminStore() {
  const store = await readPropertyAdminStore();
  return mergeVisibleProperties(store);
}

function toAdminSummary(property: Property, hidden: boolean): AdminPropertySummary {
  const compoundSlug = resolveCoastalVillageKey(property);

  return {
    slug: property.slug,
    source: property.source ?? "built-in",
    title: pickLocale(property.title, "ar"),
    locationSlug: property.locationSlug,
    location: pickLocale(property.locationName, "ar"),
    compoundSlug,
    compound: pickLocale(property.compound, "ar"),
    propertyTypeValue: property.propertyType,
    propertyType: pickLocale(propertyTypeLabels[property.propertyType], "ar"),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    size: property.size,
    image: property.gallery[0] ?? DEFAULT_PROPERTY_IMAGE,
    contactPhone: property.contactPhone ?? companyProfile.phoneDisplay,
    listingType: property.listingType ?? null,
    hidden,
  };
}

export async function getAdminPropertyResponse(): Promise<PropertyAdminResponse> {
  const store = await readPropertyAdminStore();
  const hiddenSlugs = new Set(store.hiddenPropertySlugs);
  const allProperties = mergeVisibleProperties({
    ...store,
    hiddenPropertySlugs: [],
  });

  const visibleProperties = allProperties
    .filter((property) => !hiddenSlugs.has(property.slug))
    .map((property) => toAdminSummary(property, false));
  const hiddenProperties = allProperties
    .filter((property) => hiddenSlugs.has(property.slug))
    .map((property) => toAdminSummary(property, true));

  return { visibleProperties, hiddenProperties };
}

function createUniqueSlug(
  payload: CreateManagedPropertyPayload,
  existingSlugs: Set<string>,
) {
  const village = payload.coastalVillage ? `-${payload.coastalVillage}` : "";
  const baseSlug = `managed-${payload.locationSlug}-${payload.propertyType}${village}-${payload.listingType}-${payload.bedrooms}br`;
  let slug = baseSlug;
  let counter = 2;

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function createManagedProperty(payload: CreateManagedPropertyPayload) {
  const store = await readPropertyAdminStore();
  const existingSlugs = new Set([
    ...baseProperties.map((property) => property.slug),
    ...store.managedProperties.map((property) => property.slug),
  ]);
  const slug = createUniqueSlug(payload, existingSlugs);
  const now = new Date().toISOString();

  store.managedProperties.unshift({
    ...payload,
    slug,
    contactPhone: normalizePhoneForDisplay(payload.contactPhone),
    imageUrls: payload.imageUrls.length ? payload.imageUrls : [DEFAULT_PROPERTY_IMAGE],
    tags: payload.tags?.length ? payload.tags : ["prime"],
    createdAt: now,
    updatedAt: now,
  });
  store.hiddenPropertySlugs = store.hiddenPropertySlugs.filter(
    (hiddenSlug) => hiddenSlug !== slug,
  );

  await writePropertyAdminStore(store);

  return getAdminPropertyResponse();
}

export async function getEditablePropertyBySlug(
  slug: string,
): Promise<AdminEditableProperty | null> {
  const store = await readPropertyAdminStore();
  const managedMatch = store.managedProperties.find((property) => property.slug === slug);

  if (managedMatch) {
    return {
      slug: managedMatch.slug,
      source: "managed",
      locationSlug: managedMatch.locationSlug,
      propertyType: managedMatch.propertyType,
      bedrooms: managedMatch.bedrooms,
      coastalVillage: managedMatch.coastalVillage,
      description: getCustomDescription(managedMatch),
      size: managedMatch.size,
      bathrooms: managedMatch.bathrooms,
      finishing: managedMatch.finishing,
      furnishing: managedMatch.furnishing,
      listingType: managedMatch.listingType,
      price: managedMatch.price,
      contactPhone: managedMatch.contactPhone,
      imageUrls: managedMatch.imageUrls,
    };
  }

  const overrideMatch = store.propertyOverrides.find((property) => property.slug === slug);

  if (overrideMatch) {
    return {
      slug: overrideMatch.slug,
      source: "built-in",
      locationSlug: overrideMatch.locationSlug,
      propertyType: overrideMatch.propertyType,
      bedrooms: overrideMatch.bedrooms,
      coastalVillage: overrideMatch.coastalVillage,
      description: getCustomDescription(overrideMatch),
      size: overrideMatch.size,
      bathrooms: overrideMatch.bathrooms,
      finishing: overrideMatch.finishing,
      furnishing: overrideMatch.furnishing,
      listingType: overrideMatch.listingType,
      price: overrideMatch.price,
      contactPhone: overrideMatch.contactPhone,
      imageUrls: overrideMatch.imageUrls,
    };
  }

  const baseMatch = baseProperties.find((property) => property.slug === slug);

  if (!baseMatch) {
    return null;
  }

  const record = propertyToEditableRecord({
    ...baseMatch,
    source: "built-in",
    contactPhone: baseMatch.contactPhone ?? companyProfile.phoneDisplay,
  });

  return {
    slug: record.slug,
    source: "built-in",
    locationSlug: record.locationSlug,
    propertyType: record.propertyType,
    bedrooms: record.bedrooms,
    coastalVillage: record.coastalVillage,
    description: getCustomDescription(record),
    size: record.size,
    bathrooms: record.bathrooms,
    finishing: record.finishing,
    furnishing: record.furnishing,
    listingType: record.listingType,
    price: record.price,
    contactPhone: record.contactPhone,
    imageUrls: record.imageUrls,
  };
}

export async function updatePropertyRecord(
  slug: string,
  payload: CreateManagedPropertyPayload,
) {
  const store = await readPropertyAdminStore();
  const now = new Date().toISOString();
  const normalizedRecord: ManagedPropertyRecord = {
    slug,
    locationSlug: payload.locationSlug,
    propertyType: payload.propertyType,
    bedrooms: payload.bedrooms,
    coastalVillage: payload.coastalVillage,
    description: payload.description.trim(),
    size: payload.size,
    bathrooms: payload.bathrooms,
    finishing: payload.finishing,
    furnishing: payload.furnishing,
    listingType: payload.listingType,
    price: payload.price,
    contactPhone: normalizePhoneForDisplay(payload.contactPhone),
    imageUrls: payload.imageUrls.length ? payload.imageUrls : [DEFAULT_PROPERTY_IMAGE],
    tags: payload.tags?.length ? payload.tags : ["prime"],
    createdAt: now,
    updatedAt: now,
  };
  const managedIndex = store.managedProperties.findIndex((property) => property.slug === slug);

  if (managedIndex >= 0) {
    const existing = store.managedProperties[managedIndex];
    store.managedProperties[managedIndex] = {
      ...normalizedRecord,
      createdAt: existing.createdAt,
      tags: payload.tags?.length ? payload.tags : existing.tags,
    };
    await writePropertyAdminStore(store);
    return getAdminPropertyResponse();
  }

  const baseMatch = baseProperties.find((property) => property.slug === slug);

  if (!baseMatch) {
    throw new Error("Property not found");
  }

  const existingOverrideIndex = store.propertyOverrides.findIndex(
    (property) => property.slug === slug,
  );
  const baseRecord = propertyToEditableRecord(baseMatch);
  const overrideRecord: ManagedPropertyRecord = {
    ...normalizedRecord,
    createdAt:
      existingOverrideIndex >= 0
        ? store.propertyOverrides[existingOverrideIndex].createdAt
        : baseRecord.createdAt,
    tags: payload.tags?.length ? payload.tags : baseRecord.tags,
  };

  if (existingOverrideIndex >= 0) {
    store.propertyOverrides[existingOverrideIndex] = overrideRecord;
  } else {
    store.propertyOverrides.unshift(overrideRecord);
  }

  await writePropertyAdminStore(store);
  return getAdminPropertyResponse();
}

export async function hidePropertyFromSite(slug: string) {
  const store = await readPropertyAdminStore();

  if (!store.hiddenPropertySlugs.includes(slug)) {
    store.hiddenPropertySlugs.push(slug);
    await writePropertyAdminStore(store);
  }

  return getAdminPropertyResponse();
}

export async function restorePropertyToSite(slug: string) {
  const store = await readPropertyAdminStore();
  store.hiddenPropertySlugs = store.hiddenPropertySlugs.filter(
    (hiddenSlug) => hiddenSlug !== slug,
  );
  await writePropertyAdminStore(store);

  return getAdminPropertyResponse();
}

export function getDefaultPropertyImage() {
  return DEFAULT_PROPERTY_IMAGE;
}

export function normalizePropertyContactPhone(value: string) {
  return normalizePhoneForDisplay(value);
}

export function getWhatsAppReadyPhone(value: string) {
  return ensureEgyptCountryCode(value);
}

export function getTelReadyPhone(value: string) {
  return normalizeDigits(value);
}
