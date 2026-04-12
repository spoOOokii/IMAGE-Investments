import { promises as fs } from "node:fs";
import path from "node:path";

const PROJECT_ROOT = process.cwd();
const DESKTOP_SALE_DIR = path.join("C:", "Users", "used", "OneDrive", "Desktop", "بيع");
const STORE_PATH = path.join(PROJECT_ROOT, "data", "property-admin-store.json");
const SOURCE_PATH = path.join(PROJECT_ROOT, "data", "desktop-sale-source.json");
const UPLOAD_ROOT = path.join(
  PROJECT_ROOT,
  "public",
  "uploads",
  "properties",
  "desktop-sale",
);
const FALLBACK_PHONE = "01091096255";
const DEFAULT_TAGS = ["prime"];

const villageFolderMap = {
  amwaj: "امواج",
  "hacienda-bay": "هايسندا باي",
  "hacienda-west": "هايسندا ويست",
};

function normalizeArabicDigits(value) {
  return value.replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function normalizeNumberString(value) {
  return normalizeArabicDigits(value).replace(/[^\d.]/g, "");
}

function parseNumber(value) {
  const normalized = normalizeNumberString(value);

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePhone(value) {
  return normalizeArabicDigits(value).replace(/[^\d+]/g, "");
}

function parsePhone(content) {
  const match = normalizeArabicDigits(content).match(/(?:\+?2?01\d{9})/);
  return match ? normalizePhone(match[0]) : FALLBACK_PHONE;
}

function detectVillage(content, fileName) {
  const haystack = `${content}\n${fileName}`.toLowerCase();

  if (haystack.includes("marassi") || haystack.includes("مراسي")) {
    return "marassi";
  }

  if (
    haystack.includes("hacienda west") ||
    haystack.includes("هاسيندا ويست") ||
    haystack.includes("هايسندا ويست")
  ) {
    return "hacienda-west";
  }

  if (
    haystack.includes("hacienda bay") ||
    haystack.includes("هاسيندا باي") ||
    haystack.includes("هايسندا باي")
  ) {
    return "hacienda-bay";
  }

  if (
    haystack.includes("amwaj") ||
    haystack.includes("أمواج") ||
    haystack.includes("امواج") ||
    haystack.includes("أمواچ")
  ) {
    return "amwaj";
  }

  return "other";
}

function detectPropertyType(content, fileName) {
  const haystack = `${content}\n${fileName}`.toLowerCase();

  if (haystack.includes("villa") || haystack.includes("فيلا")) {
    return "villa";
  }

  if (
    haystack.includes("penthouse") ||
    haystack.includes("بنتهاوس") ||
    haystack.includes("بينتهاس")
  ) {
    return "penthouse";
  }

  if (haystack.includes("duplex") || haystack.includes("دوبلكس")) {
    return "duplex";
  }

  return "chalet";
}

function parseBedrooms(content) {
  const normalized = normalizeArabicDigits(content);
  const patterns = [
    /(\d+)\s*master bedrooms?/i,
    /(\d+)\s*bedrooms?/i,
    /bedrooms?\s*[:：]?\s*(\d+)/i,
    /(\d+)\s*غرف?\s*نوم/i,
    /(\d+)\s*نوم/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);

    if (match) {
      return Number(match[1]);
    }
  }

  return 1;
}

function parseBathrooms(content) {
  const normalized = normalizeArabicDigits(content);
  const patterns = [
    /(\d+)\s*bathrooms?/i,
    /bathrooms?\s*[:：]?\s*(\d+)/i,
    /(\d+)\s*حمام/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);

    if (match) {
      return Number(match[1]);
    }
  }

  return 1;
}

function parseSize(content) {
  const normalized = normalizeArabicDigits(content);
  const patterns = [
    /b\.?\s*u\.?\s*a\.?\s*[:\-]?\s*([\d.,]+)/i,
    /(?:area|مساحه|مساحة)\s*[:\-]?\s*([\d.,]+)/i,
    /land area\s*[:\-]?\s*([\d.,]+)/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);

    if (match) {
      const parsed = parseNumber(match[1]);

      if (parsed) {
        return parsed;
      }
    }
  }

  return 1;
}

function parsePrice(content) {
  const normalized = normalizeArabicDigits(content);
  const patterns = [
    /(?:price|السعر)\s*[:\-]?\s*([\d.,]+)/i,
    /total\s*[:\-]?\s*([\d.,]+)/i,
    /([\d][\d.,]{5,})/,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);

    if (match) {
      const parsed = Number(match[1].replace(/[^\d]/g, ""));

      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return null;
}

function detectFinishing(content) {
  const haystack = content.toLowerCase();

  if (
    haystack.includes("semi finished") ||
    haystack.includes("semi-finished") ||
    haystack.includes("نصف تشطيب")
  ) {
    return "semi";
  }

  if (
    haystack.includes("unfinished") ||
    haystack.includes("core and shell") ||
    haystack.includes("عظم")
  ) {
    return "unfinished";
  }

  if (
    haystack.includes("fully finished") ||
    haystack.includes("full finished") ||
    haystack.includes("تشطيب كامل") ||
    haystack.includes("ready to move")
  ) {
    return "full";
  }

  return "full";
}

function detectFurnishing(content) {
  const haystack = content.toLowerCase();

  if (
    haystack.includes("semi furnished") ||
    haystack.includes("semi-furnished") ||
    haystack.includes("نصف مفروش")
  ) {
    return "semi-furnished";
  }

  if (
    haystack.includes("fully furnished") ||
    haystack.includes("furnished") ||
    haystack.includes("يشمل الفرش") ||
    haystack.includes("مفروش")
  ) {
    return "furnished";
  }

  return "unfurnished";
}

function buildTags(content) {
  const haystack = content.toLowerCase();
  const tags = new Set(DEFAULT_TAGS);

  if (haystack.includes("under market") || haystack.includes("اقل من سعر السوق")) {
    tags.add("underMarket");
  }

  if (haystack.includes("prime location") || haystack.includes("مميز")) {
    tags.add("prime");
  }

  return [...tags];
}

function cleanDescription(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/(?:\+?2?01\d{9})/.test(normalizeArabicDigits(line)))
    .filter((line) => !/للاستفسار/i.test(line))
    .filter((line) => !/for more info/i.test(line))
    .filter((line) => !/for more details/i.test(line))
    .filter((line) => !/اضافه صور مراسي/i.test(line));

  return lines.join("\n").trim();
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw.replace(/^\uFEFF/, ""));
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function listImageFiles(dirPath) {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  return items
    .filter(
      (item) =>
        item.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(item.name),
    )
    .map((item) => path.join(dirPath, item.name))
    .sort((first, second) => first.localeCompare(second));
}

async function copyImageSet(sourceFiles, targetDir, filePrefix) {
  if (!sourceFiles.length) {
    return [];
  }

  await ensureDir(targetDir);

  const copied = [];

  for (let index = 0; index < sourceFiles.length; index += 1) {
    const sourcePath = sourceFiles[index];
    const extension = path.extname(sourcePath).toLowerCase() || ".jpg";
    const targetName = `${filePrefix}-${index + 1}${extension}`;
    const targetPath = path.join(targetDir, targetName);
    await fs.copyFile(sourcePath, targetPath);
    copied.push(
      `/${path
        .relative(path.join(PROJECT_ROOT, "public"), targetPath)
        .replace(/\\/g, "/")}`,
    );
  }

  return copied;
}

function buildMarassiGallery(store) {
  const marassiRecord = store.managedProperties.find(
    (record) => record.coastalVillage === "marassi" && Array.isArray(record.imageUrls),
  );

  return marassiRecord?.imageUrls?.length ? marassiRecord.imageUrls : [];
}

function signatureOf(record) {
  return [
    record.listingType,
    record.locationSlug,
    record.coastalVillage,
    record.propertyType,
    record.size,
    record.bedrooms,
    record.bathrooms,
    record.price ?? "",
    normalizePhone(record.contactPhone),
  ].join("|");
}

async function buildVillageGalleryCache() {
  const cache = new Map();

  for (const [villageSlug, folderName] of Object.entries(villageFolderMap)) {
    const sourceDir = path.join(DESKTOP_SALE_DIR, folderName);
    const sourceFiles = (await listImageFiles(sourceDir)).slice(0, 8);
    const targetDir = path.join(UPLOAD_ROOT, "villages", villageSlug);
    const urls = await copyImageSet(
      sourceFiles,
      targetDir,
      `desktop-sale-village-${villageSlug}`,
    );
    cache.set(villageSlug, urls);
  }

  return cache;
}

async function main() {
  const store = await readJson(STORE_PATH);
  const sourceRecords = await readJson(SOURCE_PATH);
  await fs.rm(UPLOAD_ROOT, { recursive: true, force: true });
  const villageGalleryCache = await buildVillageGalleryCache();
  const marassiGallery = buildMarassiGallery(store);
  const importedRecords = [];

  for (const sourceRecord of sourceRecords) {
    const folder = String(sourceRecord.folder ?? "");
    const txtName = String(sourceRecord.txtName ?? "");
    const content = String(sourceRecord.content ?? "").trim();

    if (!txtName || !content) {
      continue;
    }

    const village = detectVillage(content, txtName);
    const propertyType = detectPropertyType(content, txtName);
    const ownImages = Array.isArray(sourceRecord.ownImages)
      ? sourceRecord.ownImages.map((item) => String(item))
      : [];
    let imageUrls = [];

    if (ownImages.length) {
      imageUrls = await copyImageSet(
        ownImages,
        path.join(UPLOAD_ROOT, "units", folder),
        `desktop-sale-folder-${folder}`,
      );
    } else if (village === "marassi" && marassiGallery.length) {
      imageUrls = marassiGallery;
    } else {
      imageUrls = villageGalleryCache.get(village) ?? [];
    }

    const now = new Date().toISOString();
    importedRecords.push({
      slug: `desktop-sale-${folder}-${village}-${propertyType}`,
      locationSlug: "north-coast",
      propertyType,
      bedrooms: parseBedrooms(content),
      coastalVillage: village,
      description: cleanDescription(content),
      size: parseSize(content),
      bathrooms: parseBathrooms(content),
      finishing: detectFinishing(content),
      furnishing: detectFurnishing(content),
      listingType: "sale",
      price: parsePrice(content),
      contactPhone: parsePhone(content),
      imageUrls,
      tags: buildTags(content),
      createdAt: now,
      updatedAt: now,
    });
  }

  const importedSignatures = new Set(importedRecords.map(signatureOf));
  const keptManaged = (store.managedProperties ?? []).filter(
    (record) =>
      !String(record.slug).startsWith("desktop-sale-") &&
      !importedSignatures.has(signatureOf(record)),
  );

  store.managedProperties = [...importedRecords, ...keptManaged];
  await writeJson(STORE_PATH, store);

  console.log(
    JSON.stringify(
      {
        imported: importedRecords.length,
        skippedWithoutText: sourceRecords.length - importedRecords.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
