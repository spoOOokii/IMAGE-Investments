import { NextResponse } from "next/server";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifyPassword,
} from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit({
    key: `admin-login:${ip}`,
    limit: 5,
    windowMs: 60_000,
  });

  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "محاولات كثيرة. حاول مرة أخرى بعد قليل." },
      { status: 429, headers: { "Retry-After": `${Math.ceil(rate.retryAfterMs / 1000)}` } },
    );
  }

  let password = "";

  try {
    const body = (await request.json()) as { password?: string };
    password = `${body.password ?? ""}`;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 },
    );
  }

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "كلمة المرور غير صحيحة" },
      { status: 401 },
    );
  }

  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return response;
}
