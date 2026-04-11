import { NextResponse } from "next/server";

type InquiryPayload = {
  fullName?: string;
  phone?: string;
  email?: string;
  goal?: string;
  message?: string;
  source?: string;
  locale?: string;
  propertySlug?: string;
  propertyTitle?: string;
  website?: string; // honeypot field — must be empty
};

// Simple in-memory rate limiter (per-IP, 5 requests per minute)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-\+\(\)]/g, "");
  return digits.length >= 8 && digits.length <= 15 && /^\d+$/.test(digits);
}

export async function POST(request: Request) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const payload = (await request.json()) as InquiryPayload;

  // Honeypot check — bots will fill hidden fields
  if (payload.website) {
    // Silently accept but don't process (don't reveal to bots)
    return NextResponse.json({ ok: true });
  }

  // Required fields validation
  if (!payload.fullName || !payload.phone || !payload.email || !payload.message) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 },
    );
  }

  // Field-level validation
  if (payload.fullName.trim().length < 2 || payload.fullName.length > 100) {
    return NextResponse.json(
      { ok: false, error: "Invalid name" },
      { status: 400 },
    );
  }

  if (!isValidEmail(payload.email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email" },
      { status: 400 },
    );
  }

  if (!isValidPhone(payload.phone)) {
    return NextResponse.json(
      { ok: false, error: "Invalid phone number" },
      { status: 400 },
    );
  }

  if (payload.message.trim().length < 5 || payload.message.length > 2000) {
    return NextResponse.json(
      { ok: false, error: "Message too short or too long" },
      { status: 400 },
    );
  }

  // This API shape is intentionally CRM-friendly.
  // Replace this log with HubSpot, Zoho, Salesforce, or webhook integration.
  console.log("Lead inquiry received", {
    fullName: payload.fullName.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim().toLowerCase(),
    goal: payload.goal,
    message: payload.message.trim(),
    source: payload.source,
    locale: payload.locale,
    propertySlug: payload.propertySlug,
    propertyTitle: payload.propertyTitle,
    receivedAt: new Date().toISOString(),
    ip,
  });

  return NextResponse.json({ ok: true });
}
