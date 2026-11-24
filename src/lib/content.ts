import { getCollection, type CollectionEntry } from 'astro:content';
import { isTripType, tripTypeIds, tripTypes, type TripType } from '../config';
import { url } from './paths';

export type BlogPost = CollectionEntry<'blog'>;
export type Product = CollectionEntry<'products'>;

export function isPublicEntry(data: { draft?: boolean; sample?: boolean }): boolean {
  return data.draft !== true && data.sample !== true;
}

/** Drafts and sample templates are visible in dev and omitted from production. */
export async function getPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.PROD ? isPublicEntry(data) : true);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProducts(): Promise<Product[]> {
  const products = await getCollection('products', ({ data }) => (import.meta.env.PROD ? isPublicEntry(data) : true));
  return products.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function slugify(value: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'untitled';
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface PlaceGroup {
  slug: string;
  name: string;
  region: string;
  regionSlug: string;
  posts: BlogPost[];
}

export function destinationsFrom(posts: BlogPost[]): PlaceGroup[] {
  const map = new Map<string, PlaceGroup>();
  for (const post of posts) {
    const slug = slugify(post.data.destination);
    const existing = map.get(slug);
    if (existing) {
      existing.posts.push(post);
    } else {
      map.set(slug, {
        slug,
        name: post.data.destination,
        region: post.data.region,
        regionSlug: slugify(post.data.region),
        posts: [post],
      });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'en-CA'));
}

export interface RegionGroup {
  slug: string;
  name: string;
  posts: BlogPost[];
}

export function regionsFrom(posts: BlogPost[]): RegionGroup[] {
  const map = new Map<string, RegionGroup>();
  for (const post of posts) {
    const slug = slugify(post.data.region);
    const existing = map.get(slug);
    if (existing) existing.posts.push(post);
    else map.set(slug, { slug, name: post.data.region, posts: [post] });
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'en-CA'));
}

export interface TagGroup {
  slug: string;
  name: string;
  posts: BlogPost[];
}

export function tagsFrom(posts: BlogPost[]): TagGroup[] {
  const map = new Map<string, TagGroup>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = slugify(tag);
      const existing = map.get(slug);
      if (existing) {
        if (!existing.posts.includes(post)) existing.posts.push(post);
      } else {
        map.set(slug, { slug, name: tag, posts: [post] });
      }
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'en-CA'));
}

export interface FilterLink {
  href: string;
  label: string;
  count: number;
  current: boolean;
  type?: TripType;
}

export function storyFilters(posts: BlogPost[], current: { type?: TripType; region?: string } = {}) {
  const types: FilterLink[] = tripTypeIds.map((id) => {
    const inRegion = current.region
      ? posts.filter((post) => slugify(post.data.region) === current.region)
      : posts;
    const count = (current.region ? inRegion : posts).filter((post) => post.data.tripType === id).length;
    const combo = current.region
      ? posts.some((post) => post.data.tripType === id && slugify(post.data.region) === current.region)
      : false;
    return {
      href: combo ? url(`/blog/type/${id}/region/${current.region}/`) : url(`/blog/type/${id}/`),
      label: tripTypes[id].label,
      count: current.region ? count : posts.filter((post) => post.data.tripType === id).length,
      current: current.type === id,
      type: id,
    };
  });

  const regionSource = current.type ? posts.filter((post) => post.data.tripType === current.type) : posts;
  const regions: FilterLink[] = regionsFrom(regionSource).map((region) => ({
    href: current.type
      ? url(`/blog/type/${current.type}/region/${region.slug}/`)
      : url(`/blog/region/${region.slug}/`),
    label: region.name,
    count: region.posts.length,
    current: current.region === region.slug,
  }));

  return {
    types,
    regions,
    allHref: url('/blog/'),
    allCurrent: !current.type && !current.region,
  };
}

export function findDestination(posts: BlogPost[], slug: string): PlaceGroup | undefined {
  return destinationsFrom(posts).find((place) => place.slug === slug);
}

export function findRegion(posts: BlogPost[], slug: string): RegionGroup | undefined {
  return regionsFrom(posts).find((region) => region.slug === slug);
}

export function videosFrom(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => Boolean(post.data.youtubeId));
}

export function assertTripType(value: string | undefined): TripType {
  if (value && isTripType(value)) return value;
  throw new Error(`Unknown trip type: ${value ?? ''}`);
}

const COUNTRY_TAGS: Record<string, string> = {
  canada: 'Canada',
  france: 'France',
  italy: 'Italy',
  spain: 'Spain',
  portugal: 'Portugal',
  greece: 'Greece',
  japan: 'Japan',
  uk: 'United Kingdom',
  'united kingdom': 'United Kingdom',
  usa: 'United States',
  'united states': 'United States',
};

export function countriesFromTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of tags) {
    const mapped = COUNTRY_TAGS[tag.trim().toLowerCase()];
    if (mapped && !seen.has(mapped)) {
      seen.add(mapped);
      out.push(mapped);
    }
  }
  return out;
}

export function placeLocationLabel(post: BlogPost): string {
  const countries = countriesFromTags(post.data.tags);
  return countries.length > 0 ? `${countries.join(' & ')} · ${post.data.region}` : post.data.region;
}

export function tripLengthFrom(post: BlogPost): string | undefined {
  const body = post.body ?? '';
  const quickFactMatch = body.match(
    /label:\s*['"]Length of (?:stay|visit)['"]\s*,\s*value:\s*['"]([^'"]+)['"]/i,
  );
  if (quickFactMatch) {
    let val = quickFactMatch[1]
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\s+on the ground$/i, '')
      .replace(/\s+based in [^,]+(?:,.*)?$/i, '')
      .replace(/\s+sightseeing(?:,.*)?$/i, '')
      .replace(/\s+trip$/i, '')
      .trim();
    if (val) return val;
  }

  const desc = post.data.description;
  const weeksWordMatch = desc.match(/\b(one|two|three|four)\s+weeks?\b/i);
  if (weeksWordMatch) {
    const map: Record<string, string> = { one: '1', two: '2', three: '3', four: '4' };
    const n = map[weeksWordMatch[1].toLowerCase()] ?? weeksWordMatch[1];
    return `${n} ${n === '1' ? 'week' : 'weeks'}`;
  }
  const numMatch = desc.match(/\b(\d+)\s+(days?|nights?|weeks?)\b/i);
  if (numMatch) {
    return `${numMatch[1]} ${numMatch[2].toLowerCase()}`;
  }
  return undefined;
}

export interface TripSeriesLink {
  name: string;
  href: string;
  isOverview: boolean;
}

export function tripSeriesFor(post: BlogPost, allPosts: BlogPost[]): TripSeriesLink | undefined {
  const body = post.body ?? '';
  const blogRefs = [...body.matchAll(/\/blog\/([a-z0-9-]+)\//g)].map((m) => m[1]);
  const hasSeriesNav = body.includes('<TripSeriesNav');

  if (hasSeriesNav) {
    for (const refId of blogRefs) {
      if (refId === post.id) continue;
      const target = allPosts.find((candidate) => candidate.id === refId);
      if (target && !(target.body ?? '').includes('<TripSeriesNav')) {
        return {
          name: target.data.title.split(':')[0].trim(),
          href: url(`/blog/${target.id}/`),
          isOverview: false,
        };
      }
    }
  }

  const childReferrers = allPosts.filter(
    (other) =>
      other.id !== post.id &&
      (other.body ?? '').includes('<TripSeriesNav') &&
      (other.body ?? '').includes(`/blog/${post.id}/`),
  );
  if (childReferrers.length > 0) {
    return {
      name: post.data.title.split(':')[0].trim(),
      href: url(`/blog/${post.id}/`),
      isOverview: true,
    };
  }

  return undefined;
}
