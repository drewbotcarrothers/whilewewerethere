import type { APIRoute } from 'astro';
import { publishWorkWithUs } from '../config';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Set site in astro.config.mjs');
  const sitemap = new URL('/sitemap.xml', site).href;
  const hideWork = publishWorkWithUs ? '' : 'Disallow: /work-with-us/\n';
  const body = `User-agent: Mediapartners-Google
Allow: /

User-agent: *
Allow: /
${hideWork}
Sitemap: ${sitemap}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
