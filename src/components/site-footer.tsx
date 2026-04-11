import Link from "next/link";

import { getUiCopy, pickLocale, type Locale } from "@/lib/i18n";
import { getFooterRoutes, getRouteHref } from "@/lib/site-routes";
import { companyProfile } from "@/lib/site-data";

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  const copy = getUiCopy(locale);
  const quickLinks = getFooterRoutes().map((route) => ({
    label: copy.nav[route.key],
    href: getRouteHref(locale, route),
  }));

  return (
    <footer className="site-footer mt-20">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.9fr_0.9fr]">
        <div>
          <div className="english-accent text-xs uppercase tracking-[0.45em] text-[var(--color-gold-bright)]">
            Image Investments
          </div>
          <h3 className="mt-3 text-2xl font-bold">ايمدج للاستثمارات</h3>
          <p className="site-footer-copy mt-4 max-w-xl text-sm leading-8">
            {copy.footerNote}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {companyProfile.socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="site-footer-link rounded-full border px-4 py-2 text-sm font-semibold"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold">{copy.labels.quickLinks}</h4>
          <div className="mt-4 flex flex-col gap-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="site-footer-copy text-sm hover:text-[var(--color-gold-bright)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold">{copy.nav.contact}</h4>
          <div className="site-footer-copy mt-4 space-y-4 text-sm leading-7">
            <div>
              <div className="site-footer-heading font-semibold">{copy.labels.phone}</div>
              <a href={companyProfile.phoneHref}>{companyProfile.phoneDisplay}</a>
            </div>
            <div>
              <div className="site-footer-heading font-semibold">{copy.labels.email}</div>
              <a href={`mailto:${companyProfile.email}`}>{companyProfile.email}</a>
            </div>
            <div>
              <div className="site-footer-heading font-semibold">{copy.labels.location}</div>
              <p>{pickLocale(companyProfile.officeAddress, locale)}</p>
            </div>
            <div>
              <div className="site-footer-heading font-semibold">
                {copy.labels.businessHours}
              </div>
              <p>{pickLocale(companyProfile.hours, locale)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-copyright container-shell">
        {locale === "ar"
          ? `© ${new Date().getFullYear()} إيمدج للاستثمارات. جميع الحقوق محفوظة.`
          : `© ${new Date().getFullYear()} Image Investments. All rights reserved.`}
      </div>
    </footer>
  );
}
