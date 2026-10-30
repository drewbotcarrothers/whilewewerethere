import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './slug';

export type Post = CollectionEntry<'blog'>;

export async function getPosts(includeDrafts = false): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => includeDrafts || data.draft !== true);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function getPublishedPosts(): Promise<Post[]> {
  return getPosts(false);
}

/** Drafts are visible in `astro dev` only. Production builds omit them. */
export function getIndexPosts(): Promise<Post[]> {
  return getPosts(import.meta.env.DEV);
}

export interface Destination {
  slug: string;
  name: string;
  region: string;
  regionSlug: string;
  posts: Post[];
}

export async function getDestinations(): Promise<Destination[]> {
  const posts = await getPublishedPosts();
  const map = new Map<string, Destination>();

  for (const post of posts) {
    const slug = slugify(post.data.destination);
    const existing = map.get(slug);
    if (!existing) {
      map.set(slug, {
        slug,
        name: post.data.destination,
        region: post.data.region,
        regionSlug: slugify(post.data.region),
        posts: [post],
      });
      continue;
    }
    if (existing.name !== post.data.destination) {
      throw new Error(
        `Destination slug "${slug}" is used by both "${existing.name}" and "${post.data.destination}". Spell the place the same way in every post.`,
      );
    }
    if (existing.region !== post.data.region) {
      throw new Error(
        `"${existing.name}" is listed in both "${existing.region}" and "${post.data.region}". Use one region for a destination.`,
      );
    }
    existing.posts.push(post);
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

export interface RegionGroup {
  slug: string;
  name: string;
  destinations: Destination[];
}

export function groupByRegion(destinations: Destination[]): RegionGroup[] {
  const map = new Map<string, RegionGroup>();
  for (const destination of destinations) {
    const existing = map.get(destination.regionSlug);
    if (existing) existing.destinations.push(destination);
    else {
      map.set(destination.regionSlug, {
        slug: destination.regionSlug,
        name: destination.region,
        destinations: [destination],
      });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

export function featuredDestinations(destinations: Destination[]): {
  items: Destination[];
  featured: boolean;
} {
  const picked = destinations.filter((destination) =>
    destination.posts.some((post) => post.data.featured),
  );
  const newest = (destination: Destination) => destination.posts[0]?.data.date.valueOf() ?? 0;
  if (picked.length > 0) {
    return { items: picked.sort((a, b) => newest(b) - newest(a)).slice(0, 6), featured: true };
  }
  return {
    items: [...destinations].sort((a, b) => newest(b) - newest(a)).slice(0, 3),
    featured: false,
  };
}

export function relatedPosts(posts: Post[], current: Post, limit = 3): Post[] {
  const destination = slugify(current.data.destination);
  const samePlace = posts.filter(
    (post) => post.id !== current.id && slugify(post.data.destination) === destination,
  );
  const sameType = posts.filter(
    (post) =>
      post.id !== current.id &&
      post.data.tripType === current.data.tripType &&
      slugify(post.data.destination) !== destination,
  );
  return [...samePlace, ...sameType].slice(0, limit);
}
