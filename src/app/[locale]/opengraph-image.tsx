import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
            "linear-gradient(135deg, #081728 0%, #10243b 55%, #1d3f62 100%)",
          color: "#f5f7fb",
        }}
      >
        <div style={{ fontSize: 24, color: "#ebd2a5" }}>Image Investments</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            {locale === "ar"
              ? "فرص عقارية مختارة بعناية"
              : "Curated Egyptian property opportunities"}
          </div>
          <div style={{ fontSize: 28, color: "#c6d0dc", maxWidth: 920 }}>
            {locale === "ar"
              ? "شقق وفيلات وشاليهات للبيع والاستثمار في أهم الأسواق المصرية."
              : "Premium apartments, villas, and chalets across Egypt's strongest markets."}
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#ebd2a5" }}>imageinvestments-eg.com</div>
      </div>
    ),
    size,
  );
}
