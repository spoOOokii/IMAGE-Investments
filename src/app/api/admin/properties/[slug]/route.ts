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

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
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
