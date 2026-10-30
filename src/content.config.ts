import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { tripTypeIds } from './data/trips';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    heroImage: z
      .string()
      .regex(/^\//, 'heroImage must be a root-relative path such as /images/lake.jpg'),
    heroAlt: z.string().min(1).optional(),
    destination: z.string().min(1),
    region: z.string().min(1),
    tripType: z.enum(tripTypeIds),
    kidsAges: z.object({
      harrison: z.number().int().min(0).max(30),
      sullivan: z.number().int().min(0).max(30),
      maeve: z.number().int().min(0).max(30),
    }),
    tags: z.array(z.string().min(1)).default([]),
    youtubeId: z
      .string()
      .regex(/^[A-Za-z0-9_-]{11}$/, 'youtubeId must be an 11-character YouTube video id')
      .optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
