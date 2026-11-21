/**
 * Stops for the September 2013 Paris-to-Rome trip map.
 *
 * The camera on this trip did not store GPS. Coordinates are the
 * landmarks visible in the photographs, placed in chronological order
 * from file times (and EXIF where it existed). They are not a home
 * address or a hotel pin.
 */
export type TripStop = {
  name: string;
  date: string;
  lat: number;
  lng: number;
};

export const parisItaly2013Stops: TripStop[] = [
  { name: 'Paris — Place de la Bastille', date: '14 September 2013', lat: 48.853, lng: 2.3692 },
  { name: 'Palace of Versailles', date: '15 September 2013', lat: 48.8049, lng: 2.1204 },
  { name: 'Eiffel Tower', date: '15 September 2013', lat: 48.8584, lng: 2.2945 },
  { name: 'Louvre Pyramid', date: '16 September 2013', lat: 48.8606, lng: 2.3376 },
  { name: 'Pont des Arts', date: '16 September 2013', lat: 48.8583, lng: 2.3375 },
  { name: 'Notre-Dame Cathedral', date: '17 September 2013', lat: 48.853, lng: 2.3499 },
  { name: 'Florence Cathedral', date: '18 September 2013', lat: 43.7731, lng: 11.256 },
  { name: 'Ponte Vecchio', date: '19 September 2013', lat: 43.768, lng: 11.2531 },
  { name: 'Sorrento — Marina Grande', date: '20 September 2013', lat: 40.6259, lng: 14.3758 },
  { name: 'Positano', date: '21 September 2013', lat: 40.6281, lng: 14.4849 },
  { name: 'Pompeii', date: '22 September 2013', lat: 40.7498, lng: 14.4869 },
  { name: 'Capri — Faraglioni', date: '23 September 2013', lat: 40.542, lng: 14.253 },
  { name: 'Colosseum, Rome', date: '25 September 2013', lat: 41.8902, lng: 12.4922 },
  { name: 'Trevi Fountain', date: '25 September 2013', lat: 41.9009, lng: 12.4833 },
  { name: 'Roman Forum', date: '26 September 2013', lat: 41.8925, lng: 12.4862 },
  { name: "St. Peter's Square", date: '27 September 2013', lat: 41.9022, lng: 12.4539 },
];
