// The book about Thatha: chapters in order, and the little bits of formatting its frontmatter carries.
import { getCollection, type CollectionEntry } from 'astro:content';

export const BOOK_TITLE = 'Allide mane, illige bande summane';

/** Chapters 1 to 9, in order. */
export async function chapters(): Promise<CollectionEntry<'chapters'>[]> {
  return (await getCollection('chapters')).sort((a, b) => a.data.number - b.data.number);
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Frontmatter summaries can have *italics* (film titles). Everything else stays plain text. */
export function inlineItalics(s: string): string {
  return escape(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** "01" */
export const pad2 = (n: number) => String(n).padStart(2, '0');
