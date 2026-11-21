import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { tripTypeIds } from './config';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      heroImage: image(),
      heroAlt: z.string(),
      destination: z.string(),
      region: z.string(),
      tripType: z.enum(tripTypeIds),
      tags: z.array(z.string()).default([]),
      youtubeId: z
        .string()
        .regex(/^[A-Za-z0-9_-]{11}$/, 'YouTube ids are 11 characters')
        .optional(),
      draft: z.boolean().default(false),
      sample: z.boolean().default(false),
    }),
});

const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      price: z.string(),
      buyUrl: z.string().url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      affiliate: z.boolean().default(false),
      draft: z.boolean().default(false),
      sample: z.boolean().default(false),
    }),
});

export const collections = { blog, products };
