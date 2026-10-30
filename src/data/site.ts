export const site = {
  name: 'While We Were There',
  tagline: 'Family adventures from Toronto',
  description:
    'Family travel journal from Toronto. Andrew, Michelle, Harrison, Sullivan, and Maeve write about the trips, day trips, and local days they actually take.',
  url: 'https://whilewewerethere.com',
  email: 'hello@whilewewerethere.com',
  youtube: 'https://www.youtube.com/@Whilewewerethere',
  locale: 'en_CA',
  lang: 'en-CA',
  city: 'Toronto',
  policyUpdated: '30 October 2026',
  /**
   * Leave false until an ad snippet is pasted into AdSlot.astro.
   * Off means the slot is not rendered, so published pages have no empty boxes.
   */
  adsEnabled: false,
  /**
   * Leave false until a published post contains a real affiliate link.
   * Off means the disclosure is not rendered.
   */
  affiliatesEnabled: false,
} as const;

export const nav = [
  { href: '/blog/', label: 'Blog' },
  { href: '/destinations/', label: 'Destinations' },
  { href: '/about/', label: 'About' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/contact/', label: 'Contact' },
] as const;
