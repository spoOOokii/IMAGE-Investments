import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  align?: "start" | "center";
  invert?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  invert = false,
}: SectionHeadingProps) {
  return (
    <div
      className={[
        "mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between",
        align === "center" ? "items-center text-center md:flex-col" : "",
      ].join(" ")}
    >
      <div className={align === "center" ? "max-w-3xl" : "max-w-2xl"}>
        <span className="section-kicker">{eyebrow}</span>
        <h2
          className={[
            "display-heading mt-5 text-3xl font-bold leading-tight md:text-5xl",
            invert ? "text-white" : "text-[var(--color-ink)]",
          ].join(" ")}
        >
          {title}
        </h2>
        <p
          className={[
            "mt-4 text-base leading-8 md:text-lg",
            invert ? "text-white/70" : "text-[var(--color-ink-soft)]",
          ].join(" ")}
        >
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
