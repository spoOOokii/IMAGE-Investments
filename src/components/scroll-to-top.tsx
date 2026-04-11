"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/lib/i18n";

type ScrollToTopProps = {
  locale: Locale;
};

export function ScrollToTop({ locale }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label={locale === "ar" ? "الرجوع لأعلى الصفحة" : "Scroll to top"}
      className={[
        "theme-neutral-button fixed bottom-20 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 16V4m0 0l-5 5m5-5l5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
