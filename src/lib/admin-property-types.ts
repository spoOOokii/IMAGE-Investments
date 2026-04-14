import type { PropertyTag, PropertyType } from "@/lib/site-data";

export type ManagedFinishing = "full" | "semi" | "unfinished";
export type ManagedFurnishing = "furnished" | "semi-furnished" | "unfurnished";
export type ManagedListingType = "sale" | "rent";
export type PropertyStatus = "draft" | "published" | "archived";

export type PropertyAnalytics = {
  views: number;
  leads: number;
  lastViewedAt?: string;
  lastLeadAt?: string;
};

export type PropertyHistoryAction =
  | "created"
  | "updated"
  | "status_changed"
  | "imported";

export type PropertyHistoryEntry = {
  id: string;
  at: string;
  action: PropertyHistoryAction;
  actor: "admin" | "system";
  description: string;
};

export type ManagedPropertyRecord = {
  slug: string;
  locationSlug: string;
  propertyType: PropertyType;
  bedrooms: number;
  coastalVillage: string;
  address: string;
  description: string;
  size: number;
  bathrooms: number;
  finishing: ManagedFinishing;
  furnishing: ManagedFurnishing;
  listingType: ManagedListingType;
  price: number | null;
  contactPhone: string;
  imageUrls: string[];
  tags: PropertyTag[];
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
};

export type PropertyAdminStore = {
  managedProperties: ManagedPropertyRecord[];
  propertyOverrides: ManagedPropertyRecord[];
  hiddenPropertySlugs: string[];
  propertyAnalytics: Record<string, PropertyAnalytics>;
  propertyHistory: Record<string, PropertyHistoryEntry[]>;
};

export type AdminPropertySource = "built-in" | "managed";

export type AdminPropertySummary = {
  slug: string;
  source: AdminPropertySource;
  title: string;
  locationSlug: string;
  location: string;
  compoundSlug: string;
  compound: string;
  propertyTypeValue: PropertyType;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  image: string;
  contactPhone: string;
  listingType: ManagedListingType | null;
  hidden: boolean;
  status: PropertyStatus;
  analytics: PropertyAnalytics;
  updatedAt: string;
  history: PropertyHistoryEntry[];
};

export type PropertyAdminResponse = {
  visibleProperties: AdminPropertySummary[];
  hiddenProperties: AdminPropertySummary[];
};

export type CreateManagedPropertyPayload = {
  slug?: string;
  locationSlug: string;
  propertyType: PropertyType;
  bedrooms: number;
  coastalVillage: string;
  address: string;
  description: string;
  size: number;
  bathrooms: number;
  finishing: ManagedFinishing;
  furnishing: ManagedFurnishing;
  listingType: ManagedListingType;
  price: number | null;
  contactPhone: string;
  imageUrls: string[];
  tags?: PropertyTag[];
  status?: PropertyStatus;
};

export type AdminEditableProperty = {
  slug: string;
  source: AdminPropertySource;
  locationSlug: string;
  propertyType: PropertyType;
  bedrooms: number;
  coastalVillage: string;
  address: string;
  description: string;
  size: number;
  bathrooms: number;
  finishing: ManagedFinishing;
  furnishing: ManagedFurnishing;
  listingType: ManagedListingType;
  price: number | null;
  contactPhone: string;
  imageUrls: string[];
  status: PropertyStatus;
  analytics: PropertyAnalytics;
  history: PropertyHistoryEntry[];
};
