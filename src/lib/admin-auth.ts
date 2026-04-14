import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_LIFETIME_MS = 1000 * 60 * 60 * 12; // 12 hours

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 16) {
    // Fallback in dev; production MUST set this.
    return "dev-only-admin-secret-change-me-please";
  }

  return secret;
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "changeme";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionToken() {
  const expires = Date.now() + SESSION_LIFETIME_MS;
  const nonce = randomBytes(12).toString("hex");
  const payload = `${expires}.${nonce}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [expiresRaw, nonce, signature] = parts;
  const expires = Number(expiresRaw);

  if (!Number.isFinite(expires) || expires < Date.now()) {
    return false;
  }

  const expected = sign(`${expiresRaw}.${nonce}`);
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  try {
    return timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export function verifyPassword(attempt: string) {
  const expected = getAdminPassword();
  if (!attempt || attempt.length !== expected.length) {
    // Still perform a compare to avoid trivial timing leaks.
    try {
      timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(expected.length === (attempt?.length ?? 0) ? attempt! : expected),
      );
    } catch {
      // noop
    }
    return false;
  }

  try {
    return timingSafeEqual(Buffer.from(attempt), Buffer.from(expected));
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = SESSION_COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_LIFETIME_MS / 1000);
