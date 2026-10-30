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
