import { ImageResponse } from "next/og";

import { getPropertyBySlug } from "@/lib/cms";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function PropertyOgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const property = await getPropertyBySlug(slug);
  const backgroundImage =
    property?.gallery[0]?.startsWith("/")
      ? `https://www.imageinvestments-eg.com${property.gallery[0]}`
      : property?.gallery[0] ?? "https://www.imageinvestments-eg.com/media/logo.png";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background:
            "linear-gradient(135deg, rgba(8,23,40,0.9), rgba(16,36,59,0.88)), url(" +
            backgroundImage +
            ") center/cover",
          color: "#f5f7fb",
        }}
      >
        <div style={{ fontSize: 24, color: "#ebd2a5" }}>Image Investments</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>
            {property
              ? locale === "ar"
                ? property.title.ar
                : property.title.en
              : locale === "ar"
                ? "عقار مميز"
                : "Featured Property"}
          </div>
          {property ? (
            <div style={{ fontSize: 28, color: "#ebd2a5" }}>
              {locale === "ar" ? property.priceLabel.ar : property.priceLabel.en}
            </div>
          ) : null}
        </div>
        <div style={{ fontSize: 20, color: "#c6d0dc" }}>
          {property
            ? locale === "ar"
              ? `${property.locationName.ar} • ${property.compound.ar}`
              : `${property.locationName.en} • ${property.compound.en}`
            : "imageinvestments-eg.com"}
        </div>
      </div>
    ),
    size,
  );
}
