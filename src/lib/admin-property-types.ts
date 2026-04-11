import type { PropertyTag, PropertyType } from "@/lib/site-data";

export type ManagedFinishing = "full" | "semi" | "unfinished";
export type ManagedFurnishing = "furnished" | "semi-furnished" | "unfurnished";
export type ManagedListingType = "sale" | "rent";

export type ManagedPropertyRecord = {
  slug: string;
  locationSlug: string;
  propertyType: PropertyType;
  bedrooms: number;
  coastalVillage: string;
  size: number;
  bathrooms: number;
  finishing: ManagedFinishing;
  furnishing: ManagedFurnishing;
  listingType: ManagedListingType;
  price: number | null;
  contactPhone: string;
  imageUrls: string[];
  tags: PropertyTag[];
  createdAt: string;
  updatedAt: string;
};

export type PropertyAdminStore = {
  managedProperties: ManagedPropertyRecord[];
  propertyOverrides: ManagedPropertyRecord[];
  hiddenPropertySlugs: string[];
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
  size: number;
  bathrooms: number;
  finishing: ManagedFinishing;
  furnishing: ManagedFurnishing;
  listingType: ManagedListingType;
  price: number | null;
  contactPhone: string;
  imageUrls: string[];
  tags?: PropertyTag[];
};

export type AdminEditableProperty = {
  slug: string;
  source: AdminPropertySource;
  locationSlug: string;
  propertyType: PropertyType;
  bedrooms: number;
  coastalVillage: string;
  size: number;
  bathrooms: number;
  finishing: ManagedFinishing;
  furnishing: ManagedFurnishing;
  listingType: ManagedListingType;
  price: number | null;
  contactPhone: string;
  imageUrls: string[];
};
