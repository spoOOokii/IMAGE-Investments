import { NextResponse } from "next/server";

import { badRequest, parseCreatePayload } from "@/lib/admin-property-api";
import { parseImportRows, splitImportImageUrls } from "@/lib/admin-property-import";
import { importManagedProperties } from "@/lib/admin-property-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function enforceImportRateLimit(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit({
    key: `admin-import:${ip}`,
    limit: 10,
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

export async function POST(request: Request) {
  const limited = enforceImportRateLimit(request);
  if (limited) return limited;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return badRequest("أرفق ملف CSV أو Excel صالح.");
  }

  const rows = parseImportRows(Buffer.from(await file.arrayBuffer()));

  if (!rows.length) {
    return badRequest("الملف لا يحتوي على صفوف قابلة للاستيراد.");
  }

  const payloads = [];

  for (const [index, row] of rows.entries()) {
    const parsed = parseCreatePayload(row, splitImportImageUrls(row.imageUrls));

    if (parsed instanceof NextResponse) {
      const result = (await parsed.json()) as { error?: string };
      return badRequest(`السطر ${index + 2}: ${result.error ?? "بيانات غير صالحة"}`);
    }

    payloads.push(parsed);
  }

  const response = await importManagedProperties(payloads);
  return NextResponse.json({ ok: true, ...response });
}
