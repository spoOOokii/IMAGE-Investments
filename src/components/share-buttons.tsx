"use client";

import { useState } from "react";

import type { Locale } from "@/lib/i18n";

type ShareButtonsProps = {
  title: string;
  url: string;
  locale: Locale;
};

export function ShareButtons({ title, url, locale }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-[var(--color-muted)]">
        {locale === "ar" ? "مشاركة:" : "Share:"}
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.1)]"
        >
          {link.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)] hover:bg-[rgba(255,255,255,0.1)]"
      >
        {copied
          ? locale === "ar"
            ? "تم النسخ ✓"
            : "Copied ✓"
          : locale === "ar"
            ? "نسخ الرابط"
            : "Copy link"}
      </button>
    </div>
  );
}
