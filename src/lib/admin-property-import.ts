import { utils, read } from "xlsx";

type ImportRow = Record<string, unknown>;

const headerAliases: Record<string, string[]> = {
  locationSlug: ["locationslug", "location", "location_slug", "المنطقة"],
  propertyType: ["propertytype", "type", "property_type", "النوع"],
  bedrooms: ["bedrooms", "bedroom", "rooms", "عددالغرف"],
  coastalVillage: [
    "coastalvillage",
    "coastal_village",
    "compoundslug",
    "compound",
    "القريةالساحلية",
    "القرية",
  ],
  address: ["address", "عنوان", "العنوان"],
  description: ["description", "desc", "الوصف"],
  size: ["size", "area", "sqm", "المساحة"],
  bathrooms: ["bathrooms", "bathroom", "عددالحمامات"],
  finishing: ["finishing", "التشطيب"],
  furnishing: ["furnishing", "الفرش"],
  listingType: ["listingtype", "listing_type", "listing", "نوعالعرض"],
  price: ["price", "السعر"],
  contactPhone: ["contactphone", "phone", "contact_phone", "الهاتف", "رقمالهاتف"],
  imageUrls: ["imageurls", "image_urls", "images", "الصور"],
  status: ["status", "الحالة"],
};

function normalizeToken(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

function getCanonicalKey(key: string) {
  const normalized = normalizeToken(key);

  for (const [canonical, aliases] of Object.entries(headerAliases)) {
    if (aliases.some((alias) => normalizeToken(alias) === normalized)) {
      return canonical;
    }
  }

  return key;
}

export function parseImportRows(buffer: Buffer) {
  const workbook = read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return [];
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [getCanonicalKey(key), value]),
    ) satisfies ImportRow,
  );
}

export function splitImportImageUrls(value: unknown) {
  return `${value ?? ""}`
    .split(/[\n|,]+/g)
    .map((item) => item.trim())
    .filter(Boolean);
}
