"use client";

import { useSyncExternalStore } from "react";

import type { Locale } from "@/lib/i18n";

type ThemeMode = "dark" | "light";

type ThemeToggleProps = {
  locale: Locale;
  compact?: boolean;
};

const storageKey = "image-investments-theme";
const themeEvent = "image-investments-theme-change";

function getCurrentTheme(): ThemeMode {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(themeEvent, callback);
  return () => {
    window.removeEventListener(themeEvent, callback);
  };
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(storageKey, theme);
  window.dispatchEvent(new Event(themeEvent));
}

export function ThemeToggle({
  locale,
  compact = false,
}: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getCurrentTheme, () => "dark");
  const isLight = theme === "light";
  const nextTheme: ThemeMode = isLight ? "dark" : "light";
  const label =
    locale === "ar"
      ? isLight
        ? "دارك"
        : "لايت"
      : isLight
        ? "Dark"
        : "Light";
  const ariaLabel =
    locale === "ar"
      ? `التبديل إلى وضع ${label}`
      : `Switch to ${label.toLowerCase()} mode`;

  function toggleTheme() {
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className={[
        "theme-toggle inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
        compact ? "w-full px-4 py-3" : "",
      ].join(" ")}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isLight ? "☾" : "☀"}
      </span>
      <span>{label}</span>
    </button>
  );
}
