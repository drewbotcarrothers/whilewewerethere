import { site } from '../data/site';

export function absoluteUrl(pathname = '/'): string {
  const url = new URL(pathname, site.url);
  if (!url.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(url.pathname)) {
    url.pathname += '/';
  }
  return url.href;
}

export function socialImage(hero?: string): string {
  if (hero && /\.(png|jpe?g|webp|gif|avif)$/i.test(hero)) return absoluteUrl(hero);
  return absoluteUrl('/og.png');
}

export function jsonLdScript(graph: Record<string, unknown>[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
    /</g,
    '\\u003c',
  );
}

export function organizationLd(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.email,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon-512.png'),
      width: 512,
      height: 512,
    },
    sameAs: [site.youtube],
  };
}

export function websiteLd(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: site.name,
    url: absoluteUrl('/'),
    description: site.description,
    inLanguage: 'en-CA',
    publisher: { '@id': absoluteUrl('/#organization') },
  };
}

export function breadcrumbLd(
  items: readonly { name: string; href?: string }[],
): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}
