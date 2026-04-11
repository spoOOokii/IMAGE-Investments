import Link from "next/link";

type HeroAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: HeroAction[];
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions = [],
}: PageHeroProps) {
  return (
    <section className="container-shell pt-12 md:pt-16">
      <div className="luxury-dark gold-outline theme-on-dark relative overflow-hidden px-6 py-10 md:px-10 md:py-14">
        <div className="hero-grid absolute inset-0 opacity-35" />
        <div className="relative max-w-4xl">
          <span className="section-kicker">{eyebrow}</span>
          <h1 className="display-heading mt-6 text-4xl font-bold leading-tight md:text-6xl">
            {title}
          </h1>
          <p className="theme-on-dark-soft mt-5 max-w-3xl text-base leading-8 md:text-xl">
            {description}
          </p>
          {actions.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={[
                    "rounded-full px-6 py-3 text-sm font-semibold md:text-base",
                    action.variant === "secondary"
                      ? "theme-secondary-button border"
                      : "bg-[var(--color-gold)] text-[var(--color-navy)] hover:-translate-y-0.5 hover:bg-[var(--color-gold-bright)]",
                  ].join(" ")}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
