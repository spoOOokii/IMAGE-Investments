import { NextResponse } from "next/server";

import type {
  CreateManagedPropertyPayload,
  PropertyStatus,
} from "@/lib/admin-property-types";
import {
  createManagedProperty,
  getAdminPropertyResponse,
  hidePropertyFromSite,
  restorePropertyToSite,
  updatePropertyStatus,
} from "@/lib/admin-property-store";
import {
  badRequest,
  normalizeImageUrls,
  parseCreatePayload,
  getUploadedFiles,
  saveUploadedImages,
} from "@/lib/admin-property-api";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function enforceReadRateLimit(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit({
    key: `admin-read:${ip}`,
    limit: 120,
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

function enforceWriteRateLimit(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit({
    key: `admin-write:${ip}`,
    limit: 30,
    windowMs: 60_000,
  });
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "محاولات كثيرة. حاول لاحقاً." },
      { status: 429 },
    );
  }
  return null;
}

export async function GET(request: Request) {
  const limited = enforceReadRateLimit(request);
  if (limited) return limited;

  const response = await getAdminPropertyResponse();
  return NextResponse.json({ ok: true, ...response });
}

export async function POST(request: Request) {
  const limited = enforceWriteRateLimit(request);
  if (limited) return limited;

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
  const limited = enforceWriteRateLimit(request);
  if (limited) return limited;

  const payload = (await request.json()) as { slug?: string };
  const slug = `${payload.slug ?? ""}`.trim();

  if (!slug) {
    return badRequest("Missing slug");
  }

  const response = await hidePropertyFromSite(slug);
  return NextResponse.json({ ok: true, ...response });
}

export async function PATCH(request: Request) {
  const limited = enforceWriteRateLimit(request);
  if (limited) return limited;

  const payload = (await request.json()) as { slug?: string; status?: PropertyStatus };
  const slug = `${payload.slug ?? ""}`.trim();
  const status = payload.status;

  if (!slug) {
    return badRequest("Missing slug");
  }

  const response = status
    ? await updatePropertyStatus(slug, status)
    : await restorePropertyToSite(slug);
  return NextResponse.json({ ok: true, ...response });
}
