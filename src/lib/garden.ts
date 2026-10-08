// How the site counts itself. Everything here is worked out at build time from src/content/.
import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../site';

export const BUILD_DATE = new Date();

const DAY = 86_400_000;

/** Notes, newest tended first. */
export async function notesByTended(): Promise<CollectionEntry<'notes'>[]> {
  const notes = await getCollection('notes');
  return notes.sort((a, b) => b.data.tended.getTime() - a.data.tended.getTime());
}

/** The yellow dot: tended within site.recentDays of the build. Same rule everywhere. */
export function recentlyTended(tended: Date, now = BUILD_DATE): boolean {
  return (now.getTime() - tended.getTime()) / DAY <= site.recentDays;
}

/** ISO date for <time datetime>. */
export function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** The no-JS fallback: a plain date. Client JS swaps in "3 days ago". */
export function plainDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** "4 min read", from the note's markdown. */
export function readingTime(body = ''): string {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
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

const WORDS =['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/** "Six records", "One record". Numbers past twelve stay digits. */
export function count(n: number, singular: string, plural = singular + 's'): string {
  return `${WORDS[n] ?? n} ${n === 1 ? singular : plural}`;
}
