"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { ManagedBlogPost } from "@/lib/admin-blog-types";

export function AdminBlogDashboard() {
  const [posts, setPosts] = useState<ManagedBlogPost[]>([]);
  const [error, setError] = useState("");

  async function loadPosts() {
    setError("");
    const response = await fetch("/api/admin/blog", { cache: "no-store" });
    const result = (await response.json()) as
      | { ok: true; posts: ManagedBlogPost[] }
      | { ok: false; error?: string };

    if (!response.ok || !result.ok) {
      setError(result.ok ? "تعذر تحميل المقالات" : result.error || "تعذر تحميل المقالات");
      return;
    }

    setPosts(result.posts);
  }

  async function updateStatus(slug: string, status: ManagedBlogPost["status"]) {
    const response = await fetch(`/api/admin/blog/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      void loadPosts();
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  return (
    <div className="space-y-8" dir="rtl">
      <section className="luxury-dark theme-on-dark rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-kicker">إدارة المدونة</span>
            <h1 className="display-heading mt-3 text-3xl font-bold md:text-5xl">
              المقالات
            </h1>
          </div>
          <Link
            href="/admin/blog/new"
            className="rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-[var(--color-navy)]"
          >
            مقال جديد
          </Link>
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <div key={post.slug} className="luxury-surface rounded-[1.75rem] p-5">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
                {post.status === "published"
                  ? "منشور"
                  : post.status === "draft"
                    ? "مسودة"
                    : "مؤرشف"}
              </span>
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1">
                {post.publishedAt}
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold text-[var(--color-ink)]">
              {post.title.ar}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-ink-soft)]">
              {post.excerpt.ar}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/admin/blog/${post.slug}/edit`}
                className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-xs font-bold text-[var(--color-navy)]"
              >
                تعديل
              </Link>
              <button
                type="button"
                onClick={() => void updateStatus(post.slug, "published")}
                className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white"
              >
                نشر
              </button>
              <button
                type="button"
                onClick={() => void updateStatus(post.slug, "draft")}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-bold text-[var(--color-ink)]"
              >
                مسودة
              </button>
              <button
                type="button"
                onClick={() => void updateStatus(post.slug, "archived")}
                className="rounded-full bg-rose-500 px-4 py-2 text-xs font-bold text-white"
              >
                أرشفة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
