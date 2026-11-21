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

  { name: 'Paris, France', lat: 48.8566, lng: 2.3522, year: 2013, link: '/blog/paris-florence-sorrento-rome-2013/' },
  { name: 'Florence, Italy', lat: 43.7696, lng: 11.2558, year: 2013, link: '/blog/paris-florence-sorrento-rome-2013/' },
  { name: 'Sorrento, Italy', lat: 40.6263, lng: 14.3758, year: 2013, link: '/blog/paris-florence-sorrento-rome-2013/' },
  { name: 'Positano, Italy', lat: 40.6281, lng: 14.4849, year: 2013, link: '/blog/paris-florence-sorrento-rome-2013/' },
  { name: 'Pompeii, Italy', lat: 40.7498, lng: 14.4869, year: 2013, link: '/blog/paris-florence-sorrento-rome-2013/' },
  { name: 'Capri, Italy', lat: 40.5507, lng: 14.2426, year: 2013, link: '/blog/paris-florence-sorrento-rome-2013/' },
  { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, year: 2013, link: '/blog/paris-florence-sorrento-rome-2013/' },
  { name: 'Vatican City', lat: 41.9022, lng: 12.4539, year: 2013, link: '/blog/paris-florence-sorrento-rome-2013/' },
  // Draft sample posts ("Sample Lake", "Sample Park") are not real places, so they are not pinned.
];
