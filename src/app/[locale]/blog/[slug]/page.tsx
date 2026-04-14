import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { getBlogPostBySlug } from "@/lib/cms";
import { getUiCopy, isLocale, pickLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title: pickLocale(post.title, locale),
    description: pickLocale(post.excerpt, locale),
    image: post.image,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const copy = getUiCopy(locale);
  const paragraphs = pickLocale(post.content, locale)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.en,
    description: post.excerpt.en,
    image: post.image,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Image Investments",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Breadcrumbs
        locale={locale}
        items={[
          { label: copy.nav.home, href: "/" },
          { label: copy.nav.blog, href: "/blog" },
          { label: post.title },
        ]}
      />

      <PageHero
        eyebrow={pickLocale(post.category, locale)}
        title={pickLocale(post.title, locale)}
        description={pickLocale(post.excerpt, locale)}
      />

      <section className="container-shell py-10 md:py-14">
        <article className="luxury-surface mx-auto max-w-4xl rounded-[2rem] p-8 md:p-10">
          <div className="text-xs font-semibold tracking-[0.2em] text-[var(--color-gold)]">
            {post.publishedAt}
          </div>
          <div className="mt-6 space-y-5 text-sm leading-8 text-[var(--color-ink-soft)] md:text-base">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
