import type { APIRoute } from 'astro';
import { getPosts } from '../lib/content';
import { site } from '../config';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site: origin }) => {
  if (!origin) throw new Error('Set site in astro.config.mjs');
  const posts = (await getPosts()).filter((post) => post.data.draft !== true && post.data.sample !== true);
  const abs = (path: string) => new URL(path, origin).href;
  const items = posts
    .map((post) => {
      const link = abs(`/blog/${post.id}/`);
      return [
        '    <item>',
        `      <title>${escapeXml(post.data.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${post.data.date.toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.data.description)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${abs('/')}</link>
    <atom:link href="${abs('/rss.xml')}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(site.description)}</description>
    <language>en-ca</language>
${posts.length ? `    <lastBuildDate>${posts[0].data.date.toUTCString()}</lastBuildDate>\n` : ''}${items}${items ? '\n' : ''}  </channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
