import type { ReactNode } from "react";
import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin-logout-button";

export const metadata = {
  title: "لوحة الإدارة | Image Investments",
  description: "لوحة داخلية لإضافة العقارات وإخفائها من الموقع.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] py-10">
      <div className="container-shell">
        <div className="mb-6 flex items-center justify-between gap-3" dir="rtl">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-xs font-semibold text-[var(--color-ink)]"
            >
              العقارات
            </Link>
            <Link
              href="/admin/blog"
              className="rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.05)] px-4 py-2 text-xs font-semibold text-[var(--color-ink)]"
            >
              المدونة
            </Link>
          </div>
          <AdminLogoutButton />
        </div>
        {children}
      </div>
    </main>
  );
}
