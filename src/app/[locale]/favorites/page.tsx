import { notFound } from "next/navigation";

import { FavoritesView } from "@/components/favorites-view";
import { PageHero } from "@/components/page-hero";
import { getAllProperties } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({
    locale,
    path: "/favorites",
    title: locale === "ar" ? "المفضلة | Image Investments" : "Favorites | Image Investments",
    description:
      locale === "ar"
        ? "الوحدات التي حفظتها للعودة إليها لاحقًا."
        : "Properties you saved for later review.",
  });
}

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const properties = await getAllProperties();

  return (
    <>
      <PageHero
        eyebrow={locale === "ar" ? "المفضلة" : "Favorites"}
        title={
          locale === "ar"
            ? "الوحدات التي حفظتها"
            : "Properties you've saved"
        }
        description={
          locale === "ar"
            ? "كل الوحدات التي ضغطت على علامة القلب لحفظها — محفوظة على جهازك فقط."
            : "Properties you've hearted — stored on your device only."
        }
      />
      <section className="container-shell py-10 md:py-14">
        <FavoritesView locale={locale} properties={properties} />
      </section>
    </>
  );
}
