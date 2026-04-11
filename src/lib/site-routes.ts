import { localizedPath, type Locale } from "@/lib/i18n";

export type SiteRouteKey =
  | "home"
  | "about"
  | "properties"
  | "locations"
  | "investment"
  | "deals"
  | "blog"
  | "contact";

export type SiteRoute = {
  key: SiteRouteKey;
  path: string;
  header: boolean;
  footer: boolean;
  sitemap: boolean;
};

export const siteRoutes: SiteRoute[] = [
  { key: "home", path: "", header: true, footer: true, sitemap: true },
  { key: "about", path: "/about", header: true, footer: true, sitemap: true },
  {
    key: "properties",
    path: "/properties",
    header: true,
    footer: true,
    sitemap: true,
  },
  {
    key: "locations",
    path: "/locations",
    header: true,
    footer: true,
    sitemap: true,
  },
  {
    key: "investment",
    path: "/investment-opportunities",
    header: false,
    footer: false,
    sitemap: false,
  },
  { key: "deals", path: "/deals", header: false, footer: false, sitemap: false },
  { key: "blog", path: "/blog", header: false, footer: false, sitemap: false },
  { key: "contact", path: "/contact", header: true, footer: true, sitemap: true },
];

export function getHeaderRoutes() {
  return siteRoutes.filter((route) => route.header);
}

export function getFooterRoutes() {
  return siteRoutes.filter((route) => route.footer);
}

export function getSitemapStaticPaths() {
  return siteRoutes.filter((route) => route.sitemap).map((route) => route.path);
}

export function getRouteHref(locale: Locale, route: SiteRoute) {
  return localizedPath(locale, route.path);
}
