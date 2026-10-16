// Site settings. Everything else the site says about itself is counted from src/content/.

export const site = {
  name: 'Kavya Jahagirdar',
  url: 'https://kavya.garden',
  tagline: 'Perpetually figuring it out. Annoyingly self-aware about it.',
  /** The garden's birthday. */
  planted: '2026-10-07',
  place: 'Singapore',
  // No email on the site, by Kavya's choice. People reach her through the socials.
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kavya-jahagirdar/' },
    { label: 'X', href: 'https://x.com/kavyaj93' },
  ],
  /** Days a note counts as recently tended (the yellow dot). */
  recentDays: 14,
  /** Days after which an untended note's title goes muted. */
  neglectDays: 365,
};

/** Header nav: plain words, this order. The map isn't here; it's the gate on Home and the footer. */
export const nav = [
  { label: 'Notes', href: '/notes' },
  { label: 'Quotes', href: '/quotes' },
  { label: 'On repeat', href: '/on-repeat' },
  { label: "Things I've made", href: '/made' },
  { label: 'About', href: '/about' },
];

/**
 * Plots on the map, in the 1200×760 drawing (src/components/MapPlan.astro).
 * - `area`: the clickable patch, as % of the map [left, top, width, height].
 * - `labelAt`: the label sits above or below the patch.
 * - `collection`: what the plot counts. Empty: a dashed plot labelled "later", not a link.
 *   One or more entries: a drawn bed with a count, and a link.
 * - `bed`: where a plot with no drawing of its own gets a generated bed once it has entries, in map units.
 * - `list`: the plot's line in the plain list under the map.
 */
export interface Plot {
  key: string;
  label: string;
  href: string;
  collection?: 'notes' | 'quotes' | 'songs' | 'projects' | 'reading' | 'compost' | 'guestbook';
  area: [number, number, number, number];
  labelAt: 'above' | 'below';
  bed?: { x: number; y: number; w: number; h: number };
  list: string;
}

export const plots: Plot[] = [
  { key: 'home', label: 'The gate', href: '/', area: [45, 94.21, 10, 5.79], labelAt: 'above', list: 'Where you came in.' },
  { key: 'notes', label: 'Notes', href: '/notes', collection: 'notes', area: [13.83, 44.21, 22.33, 17.89], labelAt: 'below', list: "Thinking in progress. Some of it will be wrong, and that's fine." },
  { key: 'quotes', label: 'Quotes', href: '/quotes', collection: 'quotes', area: [64.67, 28.68, 22, 22.89], labelAt: 'above', list: 'Lines that stuck, each with a note on why.' },
  { key: 'records', label: 'On repeat', href: '/on-repeat', collection: 'songs', area: [44.17, 13.16, 11.67, 18.42], labelAt: 'above', list: 'Songs, and what each one is attached to.' },
  { key: 'made', label: "Things I've made", href: '/made', collection: 'projects', area: [71.33, 67.89, 17.33, 15.53], labelAt: 'below', list: 'What I run, and what I built on weekends.' },
  { key: 'about', label: 'About', href: '/about', area: [15.83, 15.79, 11, 12.89], labelAt: 'above', list: 'Who I am, and the terms of the garden.' },
  { key: 'reading', label: 'Reading', href: '/reading', collection: 'reading', area: [15, 72.37, 14.17, 13.16], labelAt: 'below', bed: { x: 180, y: 550, w: 170, h: 100 }, list: 'Books, with the page I folded down.' },
  { key: 'compost', label: 'Compost', href: '/compost', collection: 'compost', area: [82.5, 11.84, 10, 11.84], labelAt: 'below', bed: { x: 990, y: 90, w: 120, h: 90 }, list: 'Things I used to believe.' },
  { key: 'guestbook', label: 'Guestbook', href: '/guestbook', collection: 'guestbook', area: [56, 83.68, 6.33, 6.32], labelAt: 'above', bed: { x: 680, y: 640, w: 60, h: 40 }, list: 'Leave a note on your way out.' },
];
