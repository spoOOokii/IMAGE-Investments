import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n";
import { getSitemapStaticPaths } from "@/lib/site-routes";
import { properties, locations } from "@/lib/site-data";

const baseUrl = "https://www.imageinvestments-eg.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = getSitemapStaticPaths();

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: now,
      changeFrequency: page === "" ? ("daily" as const) : ("weekly" as const),
      priority: page === "" ? 1.0 : 0.8,
    })),
  );

  const propertyEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    properties.map((property) => ({
      url: `${baseUrl}/${locale}/properties/${property.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  const locationEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    locations.map((location) => ({
      url: `${baseUrl}/${locale}/locations/${location.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  return [...staticEntries, ...propertyEntries, ...locationEntries];
}
