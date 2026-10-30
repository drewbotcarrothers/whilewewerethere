import { site } from '../config';

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    logo: {
      '@type': 'ImageObject',
      url: `${site.url}/apple-touch-icon.png`,
    },
    sameAs: [site.youtube],
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: `${site.url}/`,
    description: site.description,
    inLanguage: site.locale,
    publisher: { '@id': `${site.url}/#organization` },
  };
}

export function graph(...nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(), websiteNode(), ...nodes],
  };
}

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site.url).href,
    })),
  };
}
