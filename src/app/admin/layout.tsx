import type { ReactNode } from "react";

export const metadata = {
  title: "لوحة الإدارة | Image Investments",
  description: "لوحة داخلية لإضافة العقارات وإخفائها من الموقع.",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] py-10">
      <div className="container-shell">{children}</div>
    </main>
  );
}
