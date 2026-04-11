import { NextResponse } from "next/server";

import type { CreateManagedPropertyPayload } from "@/lib/admin-property-types";
import {
  createManagedProperty,
  getAdminPropertyResponse,
  hidePropertyFromSite,
  restorePropertyToSite,
} from "@/lib/admin-property-store";
import {
  badRequest,
  normalizeImageUrls,
  parseCreatePayload,
  getUploadedFiles,
  saveUploadedImages,
} from "@/lib/admin-property-api";

export const runtime = "nodejs";

export async function GET() {
  const response = await getAdminPropertyResponse();
  return NextResponse.json({ ok: true, ...response });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let parsedPayload: CreateManagedPropertyPayload | NextResponse;

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const uploadedFiles = getUploadedFiles(formData);
      const imageUrls = await saveUploadedImages(uploadedFiles);
      parsedPayload = parseCreatePayload(formData, imageUrls);
    } else {
      const payload = (await request.json()) as Record<string, unknown>;
      parsedPayload = parseCreatePayload(
        payload,
        normalizeImageUrls(payload.imageUrls),
      );
    }
  } catch (error) {
    return badRequest(
      error instanceof Error ? error.message : "تعذر رفع الصور",
    );
  }

  if (parsedPayload instanceof NextResponse) {
    return parsedPayload;
  }

  const response = await createManagedProperty(parsedPayload);
  return NextResponse.json({ ok: true, ...response });
}

export async function DELETE(request: Request) {
  const payload = (await request.json()) as { slug?: string };
  const slug = `${payload.slug ?? ""}`.trim();

  if (!slug) {
    return badRequest("Missing slug");
  }

  const response = await hidePropertyFromSite(slug);
  return NextResponse.json({ ok: true, ...response });
}

export async function PATCH(request: Request) {
  const payload = (await request.json()) as { slug?: string };
  const slug = `${payload.slug ?? ""}`.trim();

  if (!slug) {
    return badRequest("Missing slug");
  }

  const response = await restorePropertyToSite(slug);
  return NextResponse.json({ ok: true, ...response });
}
