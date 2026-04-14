import { NextResponse } from "next/server";

import {
  badRequest,
  normalizeImageUrls,
  parseCreatePayload,
  getUploadedFiles,
  saveUploadedImages,
} from "@/lib/admin-property-api";
import {
  getEditablePropertyBySlug,
  updatePropertyRecord,
} from "@/lib/admin-property-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function enforceRateLimit(request: Request, mode: "read" | "write") {
  const ip = getClientIp(request);
  const rate = checkRateLimit({
    key: `admin-property-${mode}:${ip}`,
    limit: mode === "read" ? 120 : 30,
    windowMs: 60_000,
  });

  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "طلبات كثيرة. حاول لاحقاً." },
      { status: 429 },
    );
  }

  return null;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const limited = enforceRateLimit(request, "read");
  if (limited) return limited;

  const { slug } = await context.params;
  const property = await getEditablePropertyBySlug(slug);

  if (!property) {
    return NextResponse.json({ ok: false, error: "Property not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, property });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const limited = enforceRateLimit(request, "write");
  if (limited) return limited;

  const { slug } = await context.params;
  const editableProperty = await getEditablePropertyBySlug(slug);

  if (!editableProperty) {
    return NextResponse.json({ ok: false, error: "Property not found" }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let parsedPayload;

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const uploadedFiles = getUploadedFiles(formData);
      const existingImageUrls = normalizeImageUrls(
        JSON.parse(`${formData.get("existingImageUrls") ?? "[]"}`),
      );
      const uploadedImageUrls = await saveUploadedImages(uploadedFiles);
      parsedPayload = parseCreatePayload(formData, [
        ...existingImageUrls,
        ...uploadedImageUrls,
      ]);
    } else {
      const payload = (await request.json()) as Record<string, unknown>;
      parsedPayload = parseCreatePayload(
        payload,
        normalizeImageUrls(payload.imageUrls),
      );
    }
  } catch (error) {
    return badRequest(
      error instanceof Error ? error.message : "تعذر تحديث الوحدة",
    );
  }

  if (parsedPayload instanceof NextResponse) {
    return parsedPayload;
  }

  const response = await updatePropertyRecord(slug, parsedPayload);
  return NextResponse.json({ ok: true, ...response });
}
