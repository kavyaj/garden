// How the site counts itself. Everything here is worked out at build time from src/content/.
import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../site';

export const BUILD_DATE = new Date();

const DAY = 86_400_000;
const daysSince = (d: Date, now = BUILD_DATE) => (now.getTime() - d.getTime()) / DAY;

/** Notes, newest tended first. */
export async function notesByTended(): Promise<CollectionEntry<'notes'>[]> {
  const notes = await getCollection('notes');
  return notes.sort((a, b) => b.data.tended.getTime() - a.data.tended.getTime());
}

/** The yellow dot: tended within site.recentDays of the build. Same rule everywhere. */
export function recentlyTended(tended: Date): boolean {
  return daysSince(tended) <= site.recentDays;
}

/** Not tended for over a year: the title goes muted. Old notes stay; neglect shows. */
export function neglected(tended: Date): boolean {
  return daysSince(tended) > site.neglectDays;
}

/** ISO date for <time datetime>. */
export function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });

/** "5 Oct" this year, "Jan 2025" otherwise. */
export function shortDate(d: Date): string {
  return d.getUTCFullYear() === BUILD_DATE.getUTCFullYear() ? fmt(d, { day: 'numeric', month: 'short' }) : fmt(d, { month: 'short', year: 'numeric' }).replace('Sept', 'Sep');
}

/** "5 Oct 2026". */
export function fullDate(d: Date): string {
  return fmt(d, { day: 'numeric', month: 'short', year: 'numeric' }).replace('Sept', 'Sep');
}

/** "March 2026". */
export function monthYear(d: Date): string {
  return fmt(d, { month: 'long', year: 'numeric' });
}

/** The second line in the Notes list: "planted 12 Mar", or "never tended since". */
export function plantedLine(planted: Date, tended: Date): string {
  return iso(planted) === iso(tended) ? 'never tended since' : `planted ${shortDate(planted)}`;
}

/** "4 min", from the note's markdown. */
export function readingTime(body = ''): string {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min`;
}

/** Slugs of other notes a note links to: plain markdown links to /notes/<slug>. */
export function linkedSlugs(body = ''): Set<string> {
  return new Set([...body.matchAll(/\]\(\/notes\/([a-z0-9-]+)\/?(?:#[^)]*)?\)/g)].map((m) => m[1]));
}

/** Backlinks: for each note, the notes that link to it, newest tended first. */
export async function backlinks(): Promise<Map<string, CollectionEntry<'notes'>[]>> {
  const notes = await notesByTended();
  const map = new Map<string, CollectionEntry<'notes'>[]>();
  for (const source of notes) {
    for (const target of linkedSlugs(source.body)) {
      if (target === source.id) continue;
      if (!map.has(target)) map.set(target, []);
      map.get(target)!.push(source);
    }
  }
  return map;
}

/** The one featured quote. Exactly one, or the build stops. */
export async function featuredQuote(): Promise<CollectionEntry<'quotes'> | undefined> {
  const quotes = await getCollection('quotes');
  const featured = quotes.filter((q) => q.data.featured);
  if (quotes.length && featured.length !== 1) {
    throw new Error(`quotes.yaml: exactly one quote needs featured: true (found ${featured.length}).`);
  }
  return featured[0];
}

/** Devanagari in a string means it's set in Tiro and marked lang="hi". */
export const isDevanagari = (s: string) => /[ऀ-ॿ]/.test(s);

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/** "Six records", "One record". Numbers past twelve stay digits. */
export function count(n: number, singular: string, plural = singular + 's'): string {
  return `${WORDS[n] ?? n} ${n === 1 ? singular : plural}`;
}

/** "6 records", "1 record". */
export function plural(n: number, singular: string, pluralForm = singular + 's'): string {
  return `${n} ${n === 1 ? singular : pluralForm}`;
}
