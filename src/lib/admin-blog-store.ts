import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import type { BlogAdminStore, BlogStatus, ManagedBlogPost } from "@/lib/admin-blog-types";
import { blogPosts as legacyPosts } from "@/lib/site-data";

const STORE_PATH = path.join(process.cwd(), "data", "blog-admin-store.json");

function seedPosts(): ManagedBlogPost[] {
  const now = new Date().toISOString();

  return legacyPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    content: {
      ar: post.excerpt.ar,
      en: post.excerpt.en,
    },
    image: post.image,
    publishedAt: post.publishedAt,
    status: "published",
    createdAt: now,
    updatedAt: now,
  }));
}

const DEFAULT_STORE: BlogAdminStore = {
  posts: seedPosts(),
};

async function ensureStoreFile() {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), "utf8");
  }
}

export async function readBlogAdminStore() {
  await ensureStoreFile();

  try {
    const content = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(content) as Partial<BlogAdminStore>;
    return {
      posts: Array.isArray(parsed.posts) ? parsed.posts : DEFAULT_STORE.posts,
    };
  } catch {
    return DEFAULT_STORE;
  }
}

async function writeBlogAdminStore(store: BlogAdminStore) {
  await ensureStoreFile();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getAllBlogPosts() {
  const store = await readBlogAdminStore();
  return [...store.posts].sort((first, second) =>
    second.publishedAt.localeCompare(first.publishedAt),
  );
}

export async function getPublishedBlogPosts() {
  const posts = await getAllBlogPosts();
  return posts.filter((post) => post.status === "published");
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getAllBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function saveBlogPost(
  input: Omit<ManagedBlogPost, "createdAt" | "updatedAt">,
  existingSlug?: string,
) {
  const store = await readBlogAdminStore();
  const slug = normalizeSlug(input.slug || input.title.en || input.title.ar);
  const existingIndex = store.posts.findIndex((post) =>
    existingSlug ? post.slug === existingSlug : post.slug === slug,
  );
  const now = new Date().toISOString();
  const nextPost: ManagedBlogPost = {
    ...input,
    slug,
    createdAt: existingIndex >= 0 ? store.posts[existingIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    store.posts[existingIndex] = nextPost;
  } else {
    store.posts.unshift(nextPost);
  }

  await writeBlogAdminStore(store);
  return nextPost;
}

export async function updateBlogStatus(slug: string, status: BlogStatus) {
  const store = await readBlogAdminStore();
  const index = store.posts.findIndex((post) => post.slug === slug);

  if (index < 0) {
    throw new Error("Post not found");
  }

  store.posts[index] = {
    ...store.posts[index],
    status,
    updatedAt: new Date().toISOString(),
  };

  await writeBlogAdminStore(store);
  return store.posts[index];
}
