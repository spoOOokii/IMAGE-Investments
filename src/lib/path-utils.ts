export function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
}

export function isActivePath(currentPath: string, href: string, homeHref: string) {
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedHref = normalizePath(href);

  if (normalizedHref === homeHref) {
    return normalizedCurrent === normalizedHref;
  }

  return (
    normalizedCurrent === normalizedHref ||
    normalizedCurrent.startsWith(`${normalizedHref}/`)
  );
}
