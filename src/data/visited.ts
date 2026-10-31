/**
 * Places we've been — drives the homepage map and its text list.
 *
 * To add a place, append an object to `visited`:
 *   { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393, year: 2025, link: '/destinations/lisbon/' }
 * - lat/lng: decimal degrees (right-click the spot in Google Maps to copy them).
 * - link (optional): a site path to a destination or story page. Leave it out until that page exists.
 * - year (optional): the year of the visit.
 * - kind 'home' gets the dark pin; everything else gets the tan pin.
 */
export type VisitedPlace = {
  name: string;
  lat: number;
  lng: number;
  year?: number;
  link?: string;
  kind?: 'home' | 'visit';
};

export const visited: VisitedPlace[] = [
  // Home base, from the site config (Toronto family journal).
  { name: 'Toronto, Canada (home)', lat: 43.6532, lng: -79.3832, kind: 'home' },
  // UNCONFIRMED EXAMPLES: the old WordPress site had destination graphics for these two countries.
  // Confirm with Andrew, then add a year and a link once a story exists. Pinned at country centre.
  { name: 'Egypt', lat: 26.8206, lng: 30.8025 },
  { name: 'Portugal', lat: 39.3999, lng: -8.2245 },
  // The only destinations in src/content/blog are draft samples ("Sample Lake", "Sample Park"),
  // which are not real places, so they are not pinned.
];
