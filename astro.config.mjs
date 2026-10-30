// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { site } from './src/config.ts';

// https://whilewewerethere.com — canonical origin for sitemap, RSS, and meta tags.
export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [mdx()],
  prefetch: true,
});
