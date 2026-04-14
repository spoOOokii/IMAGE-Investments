"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import type { ManagedBlogPost } from "@/lib/admin-blog-types";

type AdminBlogFormProps = {
  post?: ManagedBlogPost | null;
};

export function AdminBlogForm({ post }: AdminBlogFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState({
    slug: post?.slug ?? "",
    titleAr: post?.title.ar ?? "",
    titleEn: post?.title.en ?? "",
    excerptAr: post?.excerpt.ar ?? "",
    excerptEn: post?.excerpt.en ?? "",
    categoryAr: post?.category.ar ?? "",
    categoryEn: post?.category.en ?? "",
    contentAr: post?.content.ar ?? "",
    contentEn: post?.content.en ?? "",
    image: post?.image ?? "",
    publishedAt: post?.publishedAt ?? new Date().toISOString().slice(0, 10),
    status: post?.status ?? "published",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        post ? `/api/admin/blog/${post.slug}` : "/api/admin/blog",
        {
          method: post ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        },
      );
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "تعذر حفظ المقال");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "تعذر حفظ المقال");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none";

  return (
    <div className="space-y-8" dir="rtl">
      <section className="luxury-dark theme-on-dark rounded-[2rem] p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="section-kicker">إدارة المدونة</span>
            <h1 className="display-heading mt-3 text-3xl font-bold md:text-5xl">
              {post ? "تعديل المقال" : "مقال جديد"}
            </h1>
          </div>
          <Link
            href="/admin/blog"
            className="rounded-full border border-[rgba(235,210,165,0.26)] px-5 py-3 text-sm font-semibold text-[var(--theme-dark-heading)]"
          >
            العودة للمقالات
          </Link>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="luxury-surface rounded-[2rem] p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <input className={inputClassName} placeholder="Slug" value={formState.slug} onChange={(event) => setFormState((current) => ({ ...current, slug: event.target.value }))} />
          <input className={inputClassName} placeholder="رابط الصورة" value={formState.image} onChange={(event) => setFormState((current) => ({ ...current, image: event.target.value }))} />
          <input className={inputClassName} placeholder="العنوان بالعربية" value={formState.titleAr} onChange={(event) => setFormState((current) => ({ ...current, titleAr: event.target.value }))} />
          <input className={inputClassName} placeholder="Title in English" value={formState.titleEn} onChange={(event) => setFormState((current) => ({ ...current, titleEn: event.target.value }))} />
          <input className={inputClassName} placeholder="التصنيف بالعربية" value={formState.categoryAr} onChange={(event) => setFormState((current) => ({ ...current, categoryAr: event.target.value }))} />
          <input className={inputClassName} placeholder="Category in English" value={formState.categoryEn} onChange={(event) => setFormState((current) => ({ ...current, categoryEn: event.target.value }))} />
          <input className={inputClassName} placeholder="الملخص بالعربية" value={formState.excerptAr} onChange={(event) => setFormState((current) => ({ ...current, excerptAr: event.target.value }))} />
          <input className={inputClassName} placeholder="Excerpt in English" value={formState.excerptEn} onChange={(event) => setFormState((current) => ({ ...current, excerptEn: event.target.value }))} />
          <input className={inputClassName} type="date" value={formState.publishedAt} onChange={(event) => setFormState((current) => ({ ...current, publishedAt: event.target.value }))} />
          <select
            className={inputClassName}
            value={formState.status}
            onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value as ManagedBlogPost["status"] }))}
          >
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <textarea className={`${inputClassName} min-h-[220px]`} placeholder="محتوى المقال بالعربية" value={formState.contentAr} onChange={(event) => setFormState((current) => ({ ...current, contentAr: event.target.value }))} />
          <textarea className={`${inputClassName} min-h-[220px]`} placeholder="Article content in English" value={formState.contentEn} onChange={(event) => setFormState((current) => ({ ...current, contentEn: event.target.value }))} />
        </div>

        {error ? (
          <div className="mt-4 rounded-[1.25rem] border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-[var(--color-navy)]"
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ المقال"}
        </button>
      </form>
    </div>
  );
}
