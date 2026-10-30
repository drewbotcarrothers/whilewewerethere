/** Public site settings. First names only — never add a surname. */

export const site = {
  name: 'While We Were There',
  tagline: 'Family adventures from Toronto',
  description:
    'The family journal of Andrew, Michelle, Harrison, Sullivan, and Maeve. Real trips and close-to-home days from Toronto, with the films on YouTube.',
  url: 'https://whilewewerethere.com',
  locale: 'en-CA',
  email: 'hello@whilewewerethere.com',
  youtube: 'https://www.youtube.com/@Whilewewerethere',
  youtubeHandle: '@Whilewewerethere',
  city: 'Toronto',
  region: 'Ontario',
  country: 'Canada',
} as const;

/** Ages are a point in time. Update these, and the About page, as the kids grow. */
export const agesAsOf = 2026;

export const family = [
  { name: 'Andrew', role: 'Dad', initial: 'A' },
  { name: 'Michelle', role: 'Mom', initial: 'M' },
  { name: 'Harrison', role: 'Son', age: 9, initial: 'H' },
  { name: 'Sullivan', role: 'Son', age: 6, initial: 'S' },
  { name: 'Maeve', role: 'Daughter', age: 6, initial: 'M' },
] as const;

export const tripTypeIds = ['family-trip', 'day-trip', 'local'] as const;
export type TripType = (typeof tripTypeIds)[number];

export const tripTypes: Record<TripType, { label: string; plural: string; summary: string }> = {
  'family-trip': {
    label: 'Family trip',
    plural: 'Family trips',
    summary: 'Overnights and longer stretches away from home.',
  },
  'day-trip': {
    label: 'Day trip',
    plural: 'Day trips',
    summary: 'A full outing that still ends in our own beds.',
  },
  local: {
    label: 'Local activity',
    plural: 'Local activities',
    summary: 'Parks, museums, neighbourhoods, and other days close to home.',
  },
};

/**
 * Monetization switches. Both stay off until there is something real to show.
 * Turning ads on reveals the reserved slots only — it does not load an ad network.
 * Paste a network snippet into AdSlot.astro when you are ready to serve ads.
 * Turning the disclosure on shows it on stories and on the shop.
 */
export const monetization = {
  ads: false,
  affiliateDisclosure: false,
} as const;

export function isTripType(value: string): value is TripType {
  return (tripTypeIds as readonly string[]).includes(value);
}

export function mailto(subject: string, body = ''): string {
  const query = [`subject=${encodeURIComponent(subject)}`];
  if (body) query.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${site.email}?${query.join('&')}`;
}
