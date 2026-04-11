import type { Metadata } from "next";
import { Cairo, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const themeInitScript = `
  (() => {
    try {
      const storedTheme = window.localStorage.getItem("image-investments-theme");
      const theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.style.colorScheme = "dark";
    }
  })();
`;

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.imageinvestments-eg.com"),
  title: {
    default: "Image Investments | ايمدج للاستثمارات",
    template: "%s | Image Investments",
  },
  description:
    "Premium Arabic-first real estate platform for Image Investments, covering New Cairo, New Capital, Sheikh Zayed, 6th of October, North Coast, and Ain Sokhna.",
  applicationName: "Image Investments",
  keywords: [
    "عقارات للبيع في مصر",
    "شقق للبيع في القاهرة الجديدة",
    "فيلات للبيع في الشيخ زايد",
    "شاليهات للبيع في الساحل الشمالي",
    "فرص استثمار عقاري في مصر",
  ],
  openGraph: {
    title: "Image Investments | ايمدج للاستثمارات",
    description:
      "Luxurious Egyptian real estate website for investment opportunities and featured properties.",
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Investments | ايمدج للاستثمارات",
    description:
      "Trusted real estate advisor for premium Egyptian property investments and high-conversion property discovery.",
  },
  icons: {
    icon: "/media/logo.png",
    apple: "/media/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${cairo.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body className="min-h-full bg-[var(--color-cream)] text-[var(--color-ink)]">
        {children}
      </body>
    </html>
  );
}
