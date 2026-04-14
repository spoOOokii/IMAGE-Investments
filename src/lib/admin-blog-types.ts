import type { LocalizedText } from "@/lib/site-data";

export type BlogStatus = "draft" | "published" | "archived";

export type ManagedBlogPost = {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  category: LocalizedText;
  content: LocalizedText;
  image: string;
  publishedAt: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
};

export type BlogAdminStore = {
  posts: ManagedBlogPost[];
};
