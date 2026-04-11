import Link from "next/link";

export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[var(--color-navy)] px-6 text-center text-white"
    >
      <div className="english-accent text-xs uppercase tracking-[0.45em] text-[var(--color-gold-bright)]">
        404
      </div>
      <h1 className="display-heading text-4xl font-bold md:text-6xl">
        الصفحة غير موجودة
      </h1>
      <p className="max-w-md text-base leading-8 text-white/70">
        يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها. تصفح عقاراتنا
        المميزة أو أرجع إلى الصفحة الرئيسية.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/ar"
          className="rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-[var(--color-navy)] hover:bg-[var(--color-gold-bright)]"
        >
          الصفحة الرئيسية
        </Link>
        <Link
          href="/ar/properties"
          className="rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-bold text-white"
        >
          تصفح العقارات
        </Link>
      </div>
    </div>
  );
}
