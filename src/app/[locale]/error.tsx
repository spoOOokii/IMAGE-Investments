"use client";

type LocaleErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: LocaleErrorProps) {
  return (
    <div className="container-shell py-16">
      <div
        dir="rtl"
        className="luxury-surface mx-auto max-w-2xl rounded-[2rem] p-8 text-center"
      >
        <div className="text-sm font-semibold text-rose-500">حدث خطأ غير متوقع</div>
        <h1 className="mt-4 text-3xl font-bold text-[var(--color-ink)]">
          تعذر تحميل الصفحة
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
          {error.message || "حاول تحديث الصفحة أو إعادة المحاولة خلال لحظات."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-[var(--color-navy)]"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
