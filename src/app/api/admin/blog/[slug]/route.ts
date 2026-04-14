import { NextResponse } from "next/server";

import { getBlogPostBySlug, saveBlogPost, updateBlogStatus } from "@/lib/admin-blog-store";
import type { ManagedBlogPost } from "@/lib/admin-blog-types";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function enforceRateLimit(request: Request, mode: "read" | "write") {
  const ip = getClientIp(request);
  const rate = checkRateLimit({
    key: `admin-blog-item-${mode}:${ip}`,
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
  return {
    slug: `${payload.slug ?? ""}`.trim(),
    title: {
      ar: `${payload.titleAr ?? ""}`.trim(),
      en: `${payload.titleEn ?? ""}`.trim(),
    },
    excerpt: {
      ar: `${payload.excerptAr ?? ""}`.trim(),
      en: `${payload.excerptEn ?? ""}`.trim(),
    },
    category: {
      ar: `${payload.categoryAr ?? "مقال"}`.trim(),
      en: `${payload.categoryEn ?? "Article"}`.trim(),
    },
    content: {
      ar: `${payload.contentAr ?? ""}`.trim(),
      en: `${payload.contentEn ?? ""}`.trim(),
    },
    image: `${payload.image ?? "/media/logo.png"}`.trim(),
    publishedAt: `${payload.publishedAt ?? new Date().toISOString().slice(0, 10)}`.trim(),
    status: `${payload.status ?? "published"}` as ManagedBlogPost["status"],
  } satisfies Omit<ManagedBlogPost, "createdAt" | "updatedAt">;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const limited = enforceRateLimit(request, "read");
  if (limited) return limited;

  const { slug } = await context.params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return NextResponse.json({ ok: false, error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, post });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const limited = enforceRateLimit(request, "write");
  if (limited) return limited;

  const { slug } = await context.params;
  const payload = (await request.json()) as Record<string, unknown>;
  const post = await saveBlogPost(parsePostPayload(payload), slug);
  return NextResponse.json({ ok: true, post });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const limited = enforceRateLimit(request, "write");
  if (limited) return limited;

  const { slug } = await context.params;
  const payload = (await request.json()) as { status?: ManagedBlogPost["status"] };
  const post = await updateBlogStatus(slug, payload.status ?? "published");
  return NextResponse.json({ ok: true, post });
}
