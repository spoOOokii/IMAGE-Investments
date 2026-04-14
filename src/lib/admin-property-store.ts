import "server-only";

import { randomUUID } from "node:crypto";
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
  PropertyAnalytics,
  PropertyHistoryAction,
  PropertyHistoryEntry,
  PropertyStatus,
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
  propertyAnalytics: {},
  propertyHistory: {},
};
const DEFAULT_PROPERTY_IMAGE = "/media/property-placeholder.svg";
const DEFAULT_PROPERTY_ANALYTICS: PropertyAnalytics = {
  views: 0,
  leads: 0,
};
const DEFAULT_BASE_UPDATED_AT = "2026-01-01T00:00:00.000Z";

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

function normalizeStatus(value: unknown): PropertyStatus {
  return value === "draft" || value === "archived" ? value : "published";
}

function normalizeManagedRecord(
  record: Partial<ManagedPropertyRecord>,
): ManagedPropertyRecord {
  return {
    ...record,
    slug: `${record.slug ?? ""}`.trim(),
    address: `${record.address ?? ""}`.trim(),
    description: `${record.description ?? ""}`.trim(),
    contactPhone: normalizePhoneForDisplay(`${record.contactPhone ?? ""}`),
    imageUrls: Array.isArray(record.imageUrls)
      ? record.imageUrls.filter((image): image is string => typeof image === "string")
      : [],
    tags: Array.isArray(record.tags)
      ? record.tags.filter((tag): tag is ManagedPropertyRecord["tags"][number] => typeof tag === "string")
      : [],
    status: normalizeStatus(record.status),
    createdAt: `${record.createdAt ?? DEFAULT_BASE_UPDATED_AT}`,
    updatedAt: `${record.updatedAt ?? DEFAULT_BASE_UPDATED_AT}`,
  } as ManagedPropertyRecord;
}

function normalizeAnalytics(value: unknown): PropertyAnalytics {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_PROPERTY_ANALYTICS };
  }

  const source = value as Partial<PropertyAnalytics>;

  return {
    views:
      typeof source.views === "number" && Number.isFinite(source.views) && source.views > 0
        ? source.views
        : 0,
    leads:
      typeof source.leads === "number" && Number.isFinite(source.leads) && source.leads > 0
        ? source.leads
        : 0,
    lastViewedAt:
      typeof source.lastViewedAt === "string" && source.lastViewedAt
        ? source.lastViewedAt
        : undefined,
    lastLeadAt:
      typeof source.lastLeadAt === "string" && source.lastLeadAt
        ? source.lastLeadAt
        : undefined,
  };
}

function normalizeHistoryEntries(value: unknown): PropertyHistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is PropertyHistoryEntry => {
    if (!entry || typeof entry !== "object") {
      return false;
    }

    const source = entry as Partial<PropertyHistoryEntry>;
    return (
      typeof source.id === "string" &&
      typeof source.at === "string" &&
      typeof source.action === "string" &&
      typeof source.actor === "string" &&
      typeof source.description === "string"
    );
  });
}

function normalizeStore(store: Partial<PropertyAdminStore>): PropertyAdminStore {
  return {
    managedProperties: Array.isArray(store.managedProperties)
      ? store.managedProperties.map(normalizeManagedRecord)
      : [],
    propertyOverrides: Array.isArray(store.propertyOverrides)
      ? store.propertyOverrides.map(normalizeManagedRecord)
      : [],
    hiddenPropertySlugs: Array.isArray(store.hiddenPropertySlugs)
      ? store.hiddenPropertySlugs.filter((slug): slug is string => typeof slug === "string")
      : [],
    propertyAnalytics: Object.fromEntries(
      Object.entries(store.propertyAnalytics ?? {}).map(([slug, analytics]) => [
        slug,
        normalizeAnalytics(analytics),
      ]),
    ),
    propertyHistory: Object.fromEntries(
      Object.entries(store.propertyHistory ?? {}).map(([slug, entries]) => [
        slug,
        normalizeHistoryEntries(entries),
      ]),
    ),
  };
}

function getEffectiveStatus(
  store: PropertyAdminStore,
  slug: string,
  fallbackStatus: PropertyStatus,
) {
  if (fallbackStatus === "published" && store.hiddenPropertySlugs.includes(slug)) {
    return "archived" as const;
  }

  return fallbackStatus;
}

function getAnalyticsForSlug(store: PropertyAdminStore, slug: string): PropertyAnalytics {
  return normalizeAnalytics(store.propertyAnalytics[slug]);
}

function getHistoryForSlug(
  store: PropertyAdminStore,
  slug: string,
): PropertyHistoryEntry[] {
  return [...(store.propertyHistory[slug] ?? [])].sort(
    (first, second) =>
      new Date(second.at).getTime() - new Date(first.at).getTime(),
  );
}

function syncHiddenSlugForStatus(
  store: PropertyAdminStore,
  slug: string,
  status: PropertyStatus,
) {
  store.hiddenPropertySlugs = store.hiddenPropertySlugs.filter(
    (hiddenSlug) => hiddenSlug !== slug,
  );

  if (status !== "published") {
    store.hiddenPropertySlugs.push(slug);
  }
}

function createHistoryEntry(
  action: PropertyHistoryAction,
  description: string,
  actor: "admin" | "system" = "admin",
): PropertyHistoryEntry {
  return {
    id: randomUUID(),
    at: new Date().toISOString(),
    action,
    actor,
    description,
  };
}

function appendHistory(
  store: PropertyAdminStore,
  slug: string,
  entry: PropertyHistoryEntry,
) {
  store.propertyHistory[slug] = [entry, ...(store.propertyHistory[slug] ?? [])].slice(
    0,
    50,
  );
}

function getCustomDescription(record: ManagedPropertyRecord) {
  return `${record.description ?? ""}`.trim();
}

function getCustomAddress(record: ManagedPropertyRecord) {
  return `${record.address ?? ""}`.trim();
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
  const customAddress = getCustomAddress(record);

  return {
    slug: record.slug,
    title: buildManagedTitle(record),
    summary: buildManagedSummary(record),
    description: buildManagedDescription(record),
    address: customAddress
      ? { ar: customAddress, en: customAddress }
      : undefined,
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
    address: property.address?.ar ?? "",
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
    status: "published",
    createdAt: DEFAULT_BASE_UPDATED_AT,
    updatedAt: DEFAULT_BASE_UPDATED_AT,
  };
}

function mergeAllProperties(store: PropertyAdminStore) {
  const overrideMap = new Map(
    sortManagedProperties(store.propertyOverrides).map((record) => [record.slug, record]),
  );
  const managedEntries = sortManagedProperties(store.managedProperties).map((record) => ({
    property: buildManagedProperty(record),
    source: "managed" as const,
    status: getEffectiveStatus(store, record.slug, record.status),
    updatedAt: record.updatedAt,
    analytics: getAnalyticsForSlug(store, record.slug),
    history: getHistoryForSlug(store, record.slug),
  }));
  const baseEntries = baseProperties.map((property) => {
    const override = overrideMap.get(property.slug);
    const mergedProperty = override
      ? {
          ...buildManagedProperty(override),
          source: "built-in" as const,
        }
      : {
          ...property,
          source: property.source ?? "built-in",
          contactPhone: property.contactPhone ?? companyProfile.phoneDisplay,
        };

    return {
      property: mergedProperty,
      source: "built-in" as const,
      status: getEffectiveStatus(store, property.slug, override?.status ?? "published"),
      updatedAt: override?.updatedAt ?? DEFAULT_BASE_UPDATED_AT,
      analytics: getAnalyticsForSlug(store, property.slug),
      history: getHistoryForSlug(store, property.slug),
    };
  });

  return [...managedEntries, ...baseEntries].sort(
    (first, second) =>
      new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
  );
}

export async function getVisiblePropertiesWithAdminStore() {
  const store = await readPropertyAdminStore();
  return mergeAllProperties(store)
    .filter((entry) => entry.status === "published")
    .map((entry) => entry.property);
}

function toAdminSummary(
  property: Property,
  source: "built-in" | "managed",
  status: PropertyStatus,
  updatedAt: string,
  analytics: PropertyAnalytics,
  history: PropertyHistoryEntry[],
): AdminPropertySummary {
  const compoundSlug = resolveCoastalVillageKey(property);

  return {
    slug: property.slug,
    source,
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
    hidden: status !== "published",
    status,
    analytics,
    updatedAt,
    history,
  };
}

export async function getAdminPropertyResponse(): Promise<PropertyAdminResponse> {
  const store = await readPropertyAdminStore();
  const merged = mergeAllProperties(store).map((entry) =>
    toAdminSummary(
      entry.property,
      entry.source,
      entry.status,
      entry.updatedAt,
      entry.analytics,
      entry.history,
    ),
  );

  return {
    visibleProperties: merged.filter((property) => property.status === "published"),
    hiddenProperties: merged.filter((property) => property.status !== "published"),
  };
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
    address: (payload.address ?? "").trim(),
    contactPhone: normalizePhoneForDisplay(payload.contactPhone),
    imageUrls: payload.imageUrls.length ? payload.imageUrls : [DEFAULT_PROPERTY_IMAGE],
    tags: payload.tags?.length ? payload.tags : ["prime"],
    status: payload.status ?? "published",
    createdAt: now,
    updatedAt: now,
  });
  syncHiddenSlugForStatus(store, slug, payload.status ?? "published");
  appendHistory(
    store,
    slug,
    createHistoryEntry("created", "تمت إضافة الوحدة من لوحة الإدارة."),
  );

  await writePropertyAdminStore(store);

  return getAdminPropertyResponse();
}

export async function importManagedProperties(
  payloads: CreateManagedPropertyPayload[],
) {
  const store = await readPropertyAdminStore();
  const existingSlugs = new Set([
    ...baseProperties.map((property) => property.slug),
    ...store.managedProperties.map((property) => property.slug),
  ]);
  let importedCount = 0;

  for (const payload of payloads) {
    const slug = createUniqueSlug(payload, existingSlugs);
    const now = new Date().toISOString();
    existingSlugs.add(slug);
    store.managedProperties.unshift({
      ...payload,
      slug,
      address: (payload.address ?? "").trim(),
      contactPhone: normalizePhoneForDisplay(payload.contactPhone),
      imageUrls: payload.imageUrls.length ? payload.imageUrls : [DEFAULT_PROPERTY_IMAGE],
      tags: payload.tags?.length ? payload.tags : ["prime"],
      status: payload.status ?? "published",
      createdAt: now,
      updatedAt: now,
    });
    syncHiddenSlugForStatus(store, slug, payload.status ?? "published");
    appendHistory(
      store,
      slug,
      createHistoryEntry("imported", "تمت إضافة الوحدة عبر الاستيراد الجماعي.", "system"),
    );
    importedCount += 1;
  }

  await writePropertyAdminStore(store);

  return {
    importedCount,
    ...(await getAdminPropertyResponse()),
  };
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
      address: getCustomAddress(managedMatch),
      description: getCustomDescription(managedMatch),
      size: managedMatch.size,
      bathrooms: managedMatch.bathrooms,
      finishing: managedMatch.finishing,
      furnishing: managedMatch.furnishing,
      listingType: managedMatch.listingType,
      price: managedMatch.price,
      contactPhone: managedMatch.contactPhone,
      imageUrls: managedMatch.imageUrls,
      status: getEffectiveStatus(store, slug, managedMatch.status),
      analytics: getAnalyticsForSlug(store, slug),
      history: getHistoryForSlug(store, slug),
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
      address: getCustomAddress(overrideMatch),
      description: getCustomDescription(overrideMatch),
      size: overrideMatch.size,
      bathrooms: overrideMatch.bathrooms,
      finishing: overrideMatch.finishing,
      furnishing: overrideMatch.furnishing,
      listingType: overrideMatch.listingType,
      price: overrideMatch.price,
      contactPhone: overrideMatch.contactPhone,
      imageUrls: overrideMatch.imageUrls,
      status: getEffectiveStatus(store, slug, overrideMatch.status),
      analytics: getAnalyticsForSlug(store, slug),
      history: getHistoryForSlug(store, slug),
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
    address: getCustomAddress(record),
    description: getCustomDescription(record),
    size: record.size,
    bathrooms: record.bathrooms,
    finishing: record.finishing,
    furnishing: record.furnishing,
    listingType: record.listingType,
    price: record.price,
    contactPhone: record.contactPhone,
    imageUrls: record.imageUrls,
    status: getEffectiveStatus(store, slug, "published"),
    analytics: getAnalyticsForSlug(store, slug),
    history: getHistoryForSlug(store, slug),
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
    address: (payload.address ?? "").trim(),
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
    status: payload.status ?? "published",
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
    syncHiddenSlugForStatus(
      store,
      slug,
      payload.status ?? existing.status ?? "published",
    );
    appendHistory(store, slug, createHistoryEntry("updated", "تم تعديل بيانات الوحدة."));
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
    status:
      payload.status ??
      (existingOverrideIndex >= 0
        ? store.propertyOverrides[existingOverrideIndex].status
        : baseRecord.status),
  };

  if (existingOverrideIndex >= 0) {
    store.propertyOverrides[existingOverrideIndex] = overrideRecord;
  } else {
    store.propertyOverrides.unshift(overrideRecord);
  }

  syncHiddenSlugForStatus(store, slug, overrideRecord.status);
  appendHistory(store, slug, createHistoryEntry("updated", "تم تعديل بيانات الوحدة."));
  await writePropertyAdminStore(store);
  return getAdminPropertyResponse();
}

export async function updatePropertyStatus(slug: string, status: PropertyStatus) {
  const store = await readPropertyAdminStore();
  const managedIndex = store.managedProperties.findIndex((property) => property.slug === slug);

  if (managedIndex >= 0) {
    store.managedProperties[managedIndex] = {
      ...store.managedProperties[managedIndex],
      status,
      updatedAt: new Date().toISOString(),
    };
  } else {
    const overrideIndex = store.propertyOverrides.findIndex(
      (property) => property.slug === slug,
    );

    if (overrideIndex >= 0) {
      store.propertyOverrides[overrideIndex] = {
        ...store.propertyOverrides[overrideIndex],
        status,
        updatedAt: new Date().toISOString(),
      };
    } else {
      const baseMatch = baseProperties.find((property) => property.slug === slug);

      if (!baseMatch) {
        throw new Error("Property not found");
      }

      store.propertyOverrides.unshift({
        ...propertyToEditableRecord(baseMatch),
        slug,
        status,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  syncHiddenSlugForStatus(store, slug, status);
  appendHistory(
    store,
    slug,
    createHistoryEntry(
      "status_changed",
      status === "published"
        ? "تم نشر الوحدة على الموقع."
        : status === "draft"
          ? "تم نقل الوحدة إلى المسودة."
          : "تمت أرشفة الوحدة وإخفاؤها من الموقع.",
    ),
  );
  await writePropertyAdminStore(store);

  return getAdminPropertyResponse();
}

export async function hidePropertyFromSite(slug: string) {
  return updatePropertyStatus(slug, "archived");
}

export async function restorePropertyToSite(slug: string) {
  return updatePropertyStatus(slug, "published");
}

export async function recordPropertyView(slug: string) {
  const store = await readPropertyAdminStore();
  const current = getAnalyticsForSlug(store, slug);
  store.propertyAnalytics[slug] = {
    ...current,
    views: current.views + 1,
    lastViewedAt: new Date().toISOString(),
  };
  await writePropertyAdminStore(store);
}

export async function recordPropertyLead(slug: string) {
  const store = await readPropertyAdminStore();
  const current = getAnalyticsForSlug(store, slug);
  store.propertyAnalytics[slug] = {
    ...current,
    leads: current.leads + 1,
    lastLeadAt: new Date().toISOString(),
  };
  await writePropertyAdminStore(store);
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
