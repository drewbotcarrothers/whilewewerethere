/** Root-relative file URL. Does not add a trailing slash. */
export function fileUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${withLeading}`;
}

/** Root-relative path that respects Astro's base and a trailing slash. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  const withSlash = withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
  if (withSlash === '/') return `${normalizedBase}/`;
  return `${normalizedBase}${withSlash}`;
}
