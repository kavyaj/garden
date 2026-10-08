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

/** YAML lists: give each entry an id from its title (unless it has one) and its position in the file. */
const listWithIds = (text: string) =>
  ((parseYaml(text) as Record<string, unknown>[] | null) ?? []).map((e, order) => ({ id: slug(String(e.title)), order, ...e }));

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    planted: z.coerce.date(),
    tended: z.coerce.date(),
    /** One margin note, in Kavya's hand. Optional. */
    margin: z.string().optional(),
    /** An exact phrase from the body that gets the highlighter. Optional. */
    highlight: z.string().optional(),
  }),
});

const quotes = defineCollection({
  loader: file('src/content/quotes.yaml'),
  schema: z.object({
    original: z.string(),
    translit: z.string().optional(),
    translation: z.string().default(''),
    source: z.string(),
    why: z.string().default(''),
    /** Exactly one: big at the top of /quotes and on Home. */
    featured: z.boolean().default(false),
    added: z.coerce.date(),
  }),
});

const records = defineCollection({
  loader: file('src/content/records.yaml', { parser: listWithIds }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    artist: z.string(),
    note: z.string().default(''),
    listen_url: z.url(),
    sleeve: z.string(),
    added: z.coerce.date(),
  }),
});

const projects = defineCollection({
  loader: file('src/content/projects.yaml', { parser: listWithIds }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      /** run: the bigger things, as a list. small: weekend projects, as cards with a screenshot. */
      kind: z.enum(['run', 'small']),
      title: z.string(),
      url: z.url().optional(),
      blurb: z.string(),
      /** A shorter line for Home's "Things I've made". */
      short: z.string().optional(),
      /** run only: "Since 2019", "Ongoing". */
      since: z.string().optional(),
      /** small only: a screenshot next to projects.yaml, shown 16:10. */
      image: image().optional(),
      added: z.coerce.date(),
    }),
});

export const collections = { notes, quotes, records, projects };
