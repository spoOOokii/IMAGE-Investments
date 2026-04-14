"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  if (pathname === "/admin/login") {
    return null;
  }

  async function handleLogout() {
    setIsLoading(true);
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-xs font-semibold text-[var(--color-ink)] transition hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-60"
    >
      {isLoading ? "جاري الخروج..." : "تسجيل الخروج"}
    </button>
  );
}
