export const tripTypeIds = ['family-trip', 'day-trip', 'local'] as const;

export type TripType = (typeof tripTypeIds)[number];

export const tripTypes: readonly {
  id: TripType;
  label: string;
  plural: string;
  text: string;
}[] = [
  {
    id: 'family-trip',
    label: 'Family trip',
    plural: 'Family trips',
    text: 'The longer ones. A night away, or several, with the car packed and a plan that will change by lunch.',
  },
  {
    id: 'day-trip',
    label: 'Day trip',
    plural: 'Day trips',
    text: 'Out after breakfast, home for bedtime. Far enough to feel like travel, close enough that nobody sleeps in a strange bed.',
  },
  {
    id: 'local',
    label: 'Local day',
    plural: 'Local days',
    text: 'Toronto, on purpose. Neighbourhoods, ravines, museums, and the afternoons that never need a suitcase.',
  },
];

export function tripById(id: string) {
  return tripTypes.find((trip) => trip.id === id);
}
