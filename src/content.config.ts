import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { parseYaml } from '@astrojs/internal-helpers/yaml';
import { z } from 'astro/zod';

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** YAML lists without an `id`: give each entry one from its title. */
const listWithIds = (text: string) =>
  ((parseYaml(text) as Record<string, unknown>[] | null) ?? []).map((e, order) => ({ id: slug(String(e.title)), order, ...e }));

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    planted: z.coerce.date(),
    tended: z.coerce.date(),
  }),
});

const quotes = defineCollection({
  loader: file('src/content/quotes.yaml'),
  schema: z.object({
    original: z.string(),
    script: z.enum(['deva', 'latin']),
    translit: z.string().default(''),
    translation: z.string().default(''),
    highlight: z.string().default(''),
    source: z.string(),
    when: z.string().default(''),
    reflection: z.string().default(''),
    ink: z.boolean().default(false),
    added: z.coerce.date(),
  }),
});

const records = defineCollection({
  loader: file('src/content/records.yaml', { parser: listWithIds }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    artist: z.string(),
    label: z.string(),
    note: z.string().default(''),
    listen_url: z.url(),
    sleeve: z.string(),
    added: z.coerce.date(),
  }),
});

const projects = defineCollection({
  loader: file('src/content/projects.yaml', { parser: listWithIds }),
  schema: ({ image }) => z.object({
    order: z.number(),
    title: z.string(),
    url: z.url(),
    blurb: z.string(),
    image: image().optional(),
    alt: z.string().default(''),
    cta: z.string().default('Have a look'),
    added: z.coerce.date(),
  }),
});

const growing = defineCollection({
  loader: file('src/content/growing.yaml', { parser: listWithIds }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    url: z.url().optional(),
    blurb: z.string(),
  }),
});

export const collections = { notes, quotes, records, projects, growing };
