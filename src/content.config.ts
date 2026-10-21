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

/** YAML lists: give each entry an id (from its title, or its position) and its position in the file. */
const listWithIds = (text: string) =>
  ((parseYaml(text) as Record<string, unknown>[] | null) ?? []).map((e, order) => ({
    id: e.title ? `${String(order).padStart(2, '0')}-${slug(String(e.title))}` : String(order),
    order,
    ...e,
  }));

/** A YAML file that is one object, not a list: one entry with this id. */
const single = (id: string) => (text: string) => [{ id, ...((parseYaml(text) as Record<string, unknown>) ?? {}) }];

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
    /** The original's language: hi, sa or kn. Picks the Tiro face. Devanagari is detected if it's left out. */
    lang: z.enum(['hi', 'sa', 'kn']).optional(),
    original: z.string(),
    translit: z.string().optional(),
    translation: z.string().default(''),
    source: z.string(),
    why: z.string().default(''),
    /** Exactly one: big at the top of /quotes and on Home. */
    featured: z.boolean().default(false),
    /** The featured quote's excerpt on Home, if it shows less than the whole quote. */
    home: z.object({ original: z.string(), translation: z.string() }).optional(),
    /** The card spans the whole grid row (long quotes with a transliteration). */
    wide: z.boolean().default(false),
    added: z.coerce.date(),
  }),
});

const songs = defineCollection({
  loader: file('src/content/songs.yaml', { parser: listWithIds }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    artist: z.string(),
    /** Kavya's words only. Empty shows nothing. */
    note: z.string().nullish().transform((v) => v ?? ''),
    /** The track on Spotify. Offered only when there's no 30-second preview to play. */
    spotify: z.string().url().optional(),
    added: z.coerce.date().optional(),
  }),
});

const books = defineCollection({
  loader: file('src/content/books.yaml', { parser: listWithIds }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    author: z.string(),
    /** Slug of public/covers/<cover>-sm.webp and -lg.webp. Missing files fall back to a lettered cover. */
    cover: z.string().optional(),
    goodreads_url: z.url().optional(),
    first_read: z.number(),
    reread: z.boolean().default(false),
    featured: z.boolean().default(false),
    note: z.string(),
    /** The underlined line, shown on the featured book only. */
    line: z.string().optional(),
  }),
});

const done = defineCollection({
  loader: file('src/content/done.yaml', { parser: listWithIds }),
  schema: z.object({
    order: z.number(),
    group: z.string(),
    title: z.string(),
    story: z.string().nullish(),
    year: z.coerce.string().nullish(),
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience.yaml', { parser: single('experience') }),
  schema: z.object({
    intro: z.array(z.string()),
    location: z.string().optional(),
    roles: z.array(
      z.object({
        years: z.string(),
        title: z.string(),
        org: z.string(),
        url: z.url().optional(),
        current: z.boolean().default(false),
        line: z.string(),
      })
    ),
    education: z.array(z.object({ years: z.string(), degree: z.string(), school: z.string() })),
    featured: z.array(z.object({ name: z.string(), episode: z.number(), url: z.url() })),
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/thatha/chapters' }),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    date: z.string(),
    /** The line under the title. Defaults to "From our conversations, <date>". */
    byline: z.string().optional(),
    summary: z.string(),
    caption: z.string(),
    /** /illustrations/thatha-0N.svg: the drawing is inlined from src/illustrations/. */
    illustration: z.string(),
    status: z.enum(['done', 'writing']),
    /** Words that get a tooltip: word → meaning. */
    glossary: z.record(z.string(), z.string()).optional(),
  }),
});

const timeline = defineCollection({
  loader: file('src/content/thatha/timeline.yaml', { parser: listWithIds }),
  schema: z.object({
    order: z.number(),
    year: z.coerce.string().optional(),
    gap: z.boolean().default(false),
    text: z.string(),
  }),
});

const words = defineCollection({
  loader: file('src/content/thatha/words.yaml', { parser: single('words') }),
  schema: z.object({
    words: z.array(z.object({ phrase: z.string(), meaning: z.string() })),
    songs: z.array(z.object({ title: z.string(), lyrics: z.string().default(''), note: z.string().optional() })),
  }),
});

const projects = defineCollection({
  loader: file('src/content/projects.yaml', { parser: listWithIds }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      /** run: the bigger things, as a list. written: books, as a list. small: weekend projects, as cards. */
      kind: z.enum(['run', 'written', 'small']),
      title: z.string(),
      /** A full URL, or a path on this site (/thatha). */
      url: z.string().optional(),
      blurb: z.string(),
      /** A shorter line for Home's "Things I've made". */
      short: z.string().optional(),
      /** The note on the right: "Since 2019", "2013", "Published". */
      since: z.string().optional(),
      /** small only: a screenshot next to projects.yaml, shown 16:10. */
      image: image().optional(),
      /** written only: a 72px photo thumbnail, a path under public/. */
      thumb: z.string().optional(),
      /** Set the title in italics (a book title). */
      italic: z.boolean().default(false),
      added: z.coerce.date(),
    }),
});

export const collections = { notes, quotes, songs, books, done, experience, chapters, timeline, words, projects };
