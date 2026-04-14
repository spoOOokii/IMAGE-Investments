import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { getBlogPosts } from "@/lib/cms";
import { isLocale, localizedPath, pickLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return buildMetadata({
    locale,
    path: "/blog",
    title:
      locale === "ar"
        ? "المدونة | نصائح واستثمار عقاري"
        : "Blog | Real Estate Tips and Market Insights",
    description:
      locale === "ar"
        ? "محتوى عن الاستثمار العقاري، اتجاهات السوق، أدلة المناطق، ونصائح الشراء في مصر."
        : "Read about Egyptian real estate investment, market trends, area guides, and smarter property buying advice.",
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const posts = await getBlogPosts();

  return (
    <>
      <PageHero
        eyebrow={locale === "ar" ? "المدونة" : "Blog / News"}
        title={
          locale === "ar"
            ? "رؤى عقارية تساعد على قرار شراء واستثمار أفضل"
            : "Real estate insights that sharpen buying and investment decisions"
        }
        description={
          locale === "ar"
            ? "مقالات مركزة عن السوق المصري، أدلة المناطق، ونصائح عملية للمشتري والمستثمر."
            : "Focused editorial content on the Egyptian market, area guides, and practical buying advice."
        }
      />

      <section className="container-shell py-18">
        <SectionHeading
          eyebrow={locale === "ar" ? "أحدث المقالات" : "Latest Articles"}
          title={
            locale === "ar"
              ? "محتوى مبني على السوق وليس على الكلام العام"
              : "Content grounded in market reality, not generic advice"
          }
          description={
            locale === "ar"
              ? "إدارة المدونة أصبحت من لوحة الأدمن مباشرة."
              : "The blog is now managed directly from the admin panel."
          }
        />

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug} className="luxury-surface overflow-hidden">
              <div
                className="aspect-[1.45] bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(8,23,40,0.14), rgba(8,23,40,0.55)), url(${post.image})`,
                }}
              />
              <div className="p-6">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.25em] text-[var(--color-gold)]">
                  <span>{pickLocale(post.category, locale)}</span>
                  <span>{post.publishedAt}</span>
                </div>
                <h2 className="mt-3 text-2xl font-bold text-[var(--color-ink)]">
                  {pickLocale(post.title, locale)}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {pickLocale(post.excerpt, locale)}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-[var(--color-muted)]">{post.slug}</span>
                  <Link
                    href={localizedPath(locale, `/blog/${post.slug}`)}
                    className="text-sm font-semibold text-[var(--color-gold)]"
                  >
                    {locale === "ar" ? "اقرأ المزيد" : "Read More"}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
