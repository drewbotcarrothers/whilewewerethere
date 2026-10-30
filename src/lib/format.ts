export interface KidsAges {
  harrison: number;
  sullivan: number;
  maeve: number;
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function years(age: number): string {
  return age === 1 ? 'year' : 'years';
}

export function agesLine(ages: KidsAges): string {
  return `Harrison was ${ages.harrison} ${years(ages.harrison)}, Sullivan was ${ages.sullivan} ${years(ages.sullivan)}, and Maeve was ${ages.maeve} ${years(ages.maeve)}.`;
}

export function storyCount(count: number): string {
  return `${count} ${count === 1 ? 'story' : 'stories'}`;
}
