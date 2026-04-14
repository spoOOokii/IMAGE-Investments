import { notFound } from "next/navigation";

import { AdminBlogForm } from "@/components/admin-blog-form";
import { getBlogPostBySlug } from "@/lib/admin-blog-store";

export default async function AdminEditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <AdminBlogForm post={post} />;
}
