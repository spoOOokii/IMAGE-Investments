export default function LocaleLoading() {
  return (
    <div className="container-shell py-16">
      <div className="space-y-4">
        <div className="h-12 w-48 animate-pulse rounded-full bg-[rgba(255,255,255,0.08)]" />
        <div className="luxury-surface h-64 animate-pulse rounded-[2rem]" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="luxury-surface h-[360px] animate-pulse rounded-[2rem]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
