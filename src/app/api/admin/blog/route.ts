import { NextResponse } from "next/server";

import { getAllBlogPosts, saveBlogPost } from "@/lib/admin-blog-store";
import type { ManagedBlogPost } from "@/lib/admin-blog-types";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function enforceRateLimit(request: Request, mode: "read" | "write") {
  const ip = getClientIp(request);
  const rate = checkRateLimit({
    key: `admin-blog-${mode}:${ip}`,
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

function parsePostPayload(payload: Record<string, unknown>) {
  const titleAr = `${payload.titleAr ?? ""}`.trim();
  const titleEn = `${payload.titleEn ?? ""}`.trim();
  const excerptAr = `${payload.excerptAr ?? ""}`.trim();
  const excerptEn = `${payload.excerptEn ?? ""}`.trim();
  const categoryAr = `${payload.categoryAr ?? ""}`.trim();
  const categoryEn = `${payload.categoryEn ?? ""}`.trim();
  const contentAr = `${payload.contentAr ?? ""}`.trim();
  const contentEn = `${payload.contentEn ?? ""}`.trim();
  const image = `${payload.image ?? ""}`.trim();
  const publishedAt = `${payload.publishedAt ?? ""}`.trim();
  const status = `${payload.status ?? "published"}` as ManagedBlogPost["status"];
  const slug = `${payload.slug ?? ""}`.trim();

  if (!titleAr || !titleEn || !excerptAr || !excerptEn || !contentAr || !contentEn) {
    throw new Error("بيانات المقال غير مكتملة.");
  }

  return {
    slug,
    title: { ar: titleAr, en: titleEn },
    excerpt: { ar: excerptAr, en: excerptEn },
    category: {
      ar: categoryAr || "مقال",
      en: categoryEn || "Article",
    },
    content: { ar: contentAr, en: contentEn },
    image: image || "/media/logo.png",
    publishedAt: publishedAt || new Date().toISOString().slice(0, 10),
    status,
  } satisfies Omit<ManagedBlogPost, "createdAt" | "updatedAt">;
}

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, "read");
  if (limited) return limited;

  const posts = await getAllBlogPosts();
  return NextResponse.json({ ok: true, posts });
}

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "write");
  if (limited) return limited;

  const payload = (await request.json()) as Record<string, unknown>;
  const post = await saveBlogPost(parsePostPayload(payload));
  return NextResponse.json({ ok: true, post });
}
