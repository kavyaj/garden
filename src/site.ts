// Site settings. Everything else the site says about itself is counted from src/content/.

export const site = {
  name: 'Kavya Jahagirdar',
  url: 'https://kavya.wiki',
  /** The garden's birthday. */
  planted: '2026-10-07',
  place: 'Singapore',
  // No email on the site, by Kavya's choice. People reach her through the socials below.
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kavya-jahagirdar/' },
    { label: 'X', href: 'https://x.com/kavyaj93' },
  ],
  /** Days a note counts as recently tended (the yellow dot). */
  recentDays: 14,
};

export const nav = [
  { label: 'Notes', href: '/notes' },
  { label: 'Quotes', href: '/quotes' },
  { label: 'On repeat', href: '/on-repeat' },
  { label: 'The Gardener', href: '/gardener' },
  { label: 'The map', href: '/map' },
];

/**
 * Plots on the map, in the 1200×800 map drawing.
 *
 * - `area`: the clickable patch, as % of the map [left, top, width, height].
 * - `tag`: where the hanging tag sits, as % of the area [x, y, tilt in degrees].
 * - `collection`: what the plot counts. `count` is the tag's second line, `{n}` replaced by the count.
 * - `bed`: for plots the mockup didn't paint. Zero entries draws the dashed "not planted yet" outline;
 *   one or more paints a bed (src/scene/beds.ts), with no other change. Collections that don't exist yet count as zero.
 * - `list`: the row in the plain list under the map. Plots without one (the sundial) only appear on the map.
 */
export interface Plot {
  key: string;
  tag: string;
  sub?: string;
  /** "{n} record|{n} records": singular before the bar, plural after. One form if it reads for any number. */
  count?: string;
  collection?: string;
  href?: string;
  area: [number, number, number, number];
  tagAt: [number, number, number];
  bed?: { x: number; y: number; w: number; h: number };
  list?: { name: string; text: string };
}

export const plots: Plot[] = [
  {
    key: 'gate', tag: 'the gate', sub: 'home', href: '/',
    area: [43.33, 90, 13.33, 8.75], tagAt: [125, 20, 2],
    list: { name: 'Home', text: 'The gate. What changed lately, and a way in.' },
  },
  {
    key: 'notes', tag: 'notes', count: '{n} growing', collection: 'notes', href: '/notes',
    area: [12.5, 45, 24.33, 19.5], tagAt: [50, 106, -2],
    list: { name: 'Notes', text: "Thinking in progress. Some of it will be wrong, and that's fine." },
  },
  {
    key: 'quotes', tag: 'quotes', count: '{n} floating', collection: 'quotes', href: '/quotes',
    area: [63.83, 29.75, 23.67, 23], tagAt: [50, -5, -3],
    list: { name: 'Quotes', text: 'Lines that stuck, each with a note on why.' },
  },
  {
    key: 'records', tag: 'on repeat', count: '{n} record|{n} records', collection: 'records', href: '/on-repeat',
    area: [42.5, 10.25, 15, 22.5], tagAt: [95, 90, 3],
    list: { name: 'On repeat', text: 'Records on a turntable, and what each song is attached to.' },
  },
  {
    key: 'gardener', tag: 'the gardener', sub: 'who tends this', href: '/gardener',
    area: [14.17, 12.5, 14.17, 17.5], tagAt: [50, 108, -3],
    list: { name: 'The Gardener', text: "Who I am, what I'm building, and the terms of the garden." },
  },
  {
    key: 'sundial', tag: 'the sundial', sub: 'what changed lately', href: '/notes',
    area: [45.67, 48.5, 8.67, 13], tagAt: [135, 72, 3],
  },
  {
    key: 'built', tag: 'built', count: '{n} story|{n} stories', collection: 'built', href: '/built',
    area: [73.83, 69.5, 15.67, 13.5], tagAt: [50, 50, 2], bed: { x: 886, y: 556, w: 188, h: 108 },
    list: { name: 'Built', text: "The longer story of each thing I've made." },
  },
  {
    key: 'reading', tag: 'reading bench', count: '{n} book|{n} books', collection: 'reading', href: '/reading',
    area: [14.17, 73.75, 15.83, 13], tagAt: [50, 50, -2], bed: { x: 170, y: 590, w: 190, h: 104 },
    list: { name: 'Reading bench', text: 'Books, with the page I folded down.' },
  },
  {
    key: 'compost', tag: 'compost', count: '{n} composted', collection: 'compost', href: '/compost',
    area: [82.5, 12, 9.83, 11.5], tagAt: [50, 50, 3], bed: { x: 990, y: 96, w: 118, h: 92 },
    list: { name: 'Compost', text: 'Things I used to believe, and what changed my mind.' },
  },
  {
    key: 'guestbook', tag: 'guestbook', count: '{n} note left|{n} notes left', collection: 'guestbook', href: '/guestbook',
    area: [53.33, 80, 6.67, 6.25], tagAt: [50, 50, -3], bed: { x: 676, y: 702, w: 40, h: 30 },
    list: { name: 'Guestbook', text: 'Leave a note on your way out.' },
  },
];
