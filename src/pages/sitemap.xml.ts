import type { APIRoute } from 'astro';
import { tripTypeIds } from '../config';
import { destinationsFrom, getPosts, getProducts, regionsFrom, slugify, tagsFrom } from '../lib/content';

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Set site in astro.config.mjs');
  const posts = (await getPosts()).filter((post) => post.data.draft !== true && post.data.sample !== true);
  const products = (await getProducts()).filter((product) => product.data.draft !== true && product.data.sample !== true);
  const places = destinationsFrom(posts);
  const regions = regionsFrom(posts);
  const tags = tagsFrom(posts);

  const urls: { loc: string; lastmod?: string }[] = [
    { loc: '/' },
    { loc: '/about/' },
    { loc: '/contact/' },
    { loc: '/faq/' },
    { loc: '/privacy/' },
    { loc: '/shop/' },
    { loc: '/work-with-us/' },
    { loc: '/destinations/' },
  ];

  if (posts.length) urls.push({ loc: '/blog/' });

  for (const type of tripTypeIds) {
    const typed = posts.filter((post) => post.data.tripType === type);
    if (typed.length) urls.push({ loc: `/blog/type/${type}/` });
  }

  for (const region of regions) urls.push({ loc: `/blog/region/${region.slug}/` });
  for (const tag of tags) urls.push({ loc: `/blog/tag/${tag.slug}/` });

  const combos = new Set<string>();
  for (const post of posts) {
    const key = `${post.data.tripType}/${slugify(post.data.region)}`;
    if (combos.has(key)) continue;
    combos.add(key);
    urls.push({ loc: `/blog/type/${post.data.tripType}/region/${slugify(post.data.region)}/` });
  }

  for (const post of posts) {
    urls.push({ loc: `/blog/${post.id}/`, lastmod: post.data.date.toISOString().slice(0, 10) });
  }
  for (const place of places) urls.push({ loc: `/destinations/${place.slug}/` });
  for (const product of products) urls.push({ loc: `/shop/${product.id}/` });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((entry) => {
    const loc = new URL(entry.loc, site).href;
    const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
  })
  .join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
