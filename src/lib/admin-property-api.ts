import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import type {
  CreateManagedPropertyPayload,
  ManagedFinishing,
  ManagedFurnishing,
  ManagedListingType,
} from "@/lib/admin-property-types";
import {
  staticCoastalVillageOptions,
  staticLocationOptions,
  staticTypeOptions,
} from "@/lib/property-search";

const allowedBedroomValues = new Set([2, 3, 4, 5, 6]);
const allowedBathroomValues = new Set([2, 3, 4, 5, 6, 7, 8]);
const allowedFinishingValues = new Set<ManagedFinishing>([
  "full",
  "semi",
  "unfinished",
]);
const allowedFurnishingValues = new Set<ManagedFurnishing>([
  "furnished",
  "semi-furnished",
  "unfurnished",
]);
const allowedListingTypes = new Set<ManagedListingType>(["sale", "rent"]);
const allowedLocations = new Set(staticLocationOptions.map((item) => item.value));
const allowedTypes = new Set(staticTypeOptions.map((item) => item.value));
const allowedCoastalVillages = new Set(
  staticCoastalVillageOptions.map((item) => item.value),
);
const UPLOADS_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "properties",
);
const MAX_FILES = 10;
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_DESCRIPTION_LENGTH = 2000;
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

export function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function isFile(value: FormDataEntryValue | null): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function getTextValue(
  payload: Record<string, unknown> | FormData,
  key: string,
) {
  if (payload instanceof FormData) {
    return `${payload.get(key) ?? ""}`.trim();
  }

  return `${payload[key] ?? ""}`.trim();
}

export function normalizeImageUrls(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => `${item ?? ""}`.trim())
    .filter(Boolean);
}

export function parseCreatePayload(
  payload: Record<string, unknown> | FormData,
  imageUrls: string[],
) {
  const locationSlug = getTextValue(payload, "locationSlug");
  const propertyType = getTextValue(payload, "propertyType");
  const bedrooms = Number(getTextValue(payload, "bedrooms"));
  const coastalVillage = getTextValue(payload, "coastalVillage");
  const description = getTextValue(payload, "description");
  const size = Number(getTextValue(payload, "size"));
  const bathrooms = Number(getTextValue(payload, "bathrooms"));
  const finishing = getTextValue(payload, "finishing") as ManagedFinishing;
  const furnishing = getTextValue(payload, "furnishing") as ManagedFurnishing;
  const listingType = getTextValue(payload, "listingType") as ManagedListingType;
  const priceInput = getTextValue(payload, "price");
  const contactPhone = getTextValue(payload, "contactPhone");

  if (!allowedLocations.has(locationSlug)) {
    return badRequest("Invalid location");
  }

  if (!allowedTypes.has(propertyType)) {
    return badRequest("Invalid property type");
  }

  if (!allowedBedroomValues.has(bedrooms)) {
    return badRequest("Invalid bedroom count");
  }

  if (locationSlug === "north-coast" && !allowedCoastalVillages.has(coastalVillage)) {
    return badRequest("Invalid coastal village");
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return badRequest("Description must be 2000 characters or less");
  }

  if (!Number.isFinite(size) || size <= 0) {
    return badRequest("Invalid property size");
  }

  if (!allowedBathroomValues.has(bathrooms)) {
    return badRequest("Invalid bathroom count");
  }

  if (!allowedFinishingValues.has(finishing)) {
    return badRequest("Invalid finishing value");
  }

  if (!allowedFurnishingValues.has(furnishing)) {
    return badRequest("Invalid furnishing value");
  }

  if (!allowedListingTypes.has(listingType)) {
    return badRequest("Invalid listing type");
  }

  if (!contactPhone || contactPhone.replace(/[^\d]/g, "").length < 8) {
    return badRequest("Invalid contact phone");
  }

  let price: number | null = null;

  if (listingType === "sale") {
    price = Number(priceInput);

    if (!Number.isFinite(price) || price <= 0) {
      return badRequest("Price is required for sale listings");
    }
  }

  const result: CreateManagedPropertyPayload = {
    locationSlug,
    propertyType: propertyType as CreateManagedPropertyPayload["propertyType"],
    bedrooms,
    coastalVillage: locationSlug === "north-coast" ? coastalVillage : "",
    description,
    size,
    bathrooms,
    finishing,
    furnishing,
    listingType,
    price,
    contactPhone,
    imageUrls,
  };

  return result;
}

export function getUploadedFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter(isFile)
    .filter((file) => file.size > 0);
}

function getExtension(file: File) {
  const mimeExtension = file.type.split("/")[1]?.toLowerCase();

  if (mimeExtension === "jpeg") {
    return "jpg";
  }

  if (mimeExtension) {
    return mimeExtension;
  }

  const fileNameExtension = file.name.split(".").pop()?.toLowerCase();
  return fileNameExtension || "jpg";
}

export async function saveUploadedImages(files: File[]) {
  if (!files.length) {
    return [];
  }

  if (files.length > MAX_FILES) {
    throw new Error("يمكن رفع 10 صور كحد أقصى");
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  const savedPaths = await Promise.all(
    files.map(async (file) => {
      if (!allowedMimeTypes.has(file.type)) {
        throw new Error("صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WEBP");
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error("حجم الصورة كبير جدًا. الحد الأقصى 8 ميجابايت للصورة");
      }

      const bytes = await file.arrayBuffer();
      const extension = getExtension(file);
      const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
      const absolutePath = path.join(UPLOADS_DIR, fileName);

      await fs.writeFile(absolutePath, Buffer.from(bytes));

      return `/uploads/properties/${fileName}`;
    }),
  );

  return savedPaths;
}
