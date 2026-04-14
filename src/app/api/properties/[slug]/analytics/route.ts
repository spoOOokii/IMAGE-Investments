import { NextResponse } from "next/server";

import { recordPropertyLead, recordPropertyView } from "@/lib/admin-property-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const ip = getClientIp(request);
  const rate = checkRateLimit({
    key: `property-analytics:${ip}`,
    limit: 90,
    windowMs: 60_000,
  });

  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  const { slug } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { event?: string };
  const event = `${body.event ?? "view"}`;

  if (event === "lead") {
    await recordPropertyLead(slug);
  } else {
    await recordPropertyView(slug);
  }

  return NextResponse.json({ ok: true });
}
