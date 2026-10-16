// Finds a 30-second preview for each song in src/content/songs.yaml using the iTunes Search API,
// and caches it in src/content/.preview-cache.json so builds don't depend on the network.
// Nothing is downloaded or hosted: the player streams Apple's preview URL after a click.
// A song with no match is cached as null, and the player says "no preview".
// Re-run with REFRESH_PREVIEWS=1 to look everything up again.
import fs from 'node:fs';
import { parseYaml } from '@astrojs/internal-helpers/yaml';

const SONGS = 'src/content/songs.yaml';
const CACHE = 'src/content/.preview-cache.json';

const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const bare = (s) => norm(s.replace(/\(.*?\)|\[.*?\]/g, ''));
/** A store title without its film credit: "Tere Paas Main - Female Version (From …)" → "tere paas main female version". */
const storeTitle = (s) => norm(s.replace(/\((from|feat)[^)]*\)|\[.*?\]/gi, '').replace(/\s-\s/, ' '));
const keyOf = (song) => `${song.title} — ${song.artist}`;
const UNWANTED = /\b(live|demo|riff|rough mix|karaoke|instrumental|remix|cover|tribute|acoustic|unplugged|sped up|slowed|8d)\b/;

async function search(term, country) {
  const url = `https://itunes.apple.com/search?${new URLSearchParams({ term, entity: 'song', limit: '25', country })}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`iTunes ${res.status}`);
  return (await res.json()).results ?? [];
}

function best(song, results) {
  const want = bare(song.title);
  const full = norm(song.title);
  const artist = norm(song.artist.split(',')[0]);
  const scored = results
    .filter((r) => r.previewUrl && norm(r.artistName).includes(artist))
    .filter((r) => [want, full].includes(bare(r.trackName)) || storeTitle(r.trackName) === full)
    .filter((r) => !UNWANTED.test(norm(r.trackName)) || UNWANTED.test(full))
    .map((r) => ({ r, score: (storeTitle(r.trackName) === full ? 3 : 0) + (norm(r.trackName) === full ? 2 : 0) + (/\(/.test(r.trackName) ? 0 : 1) }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.r;
}

const songs = parseYaml(fs.readFileSync(SONGS, 'utf8')) ?? [];
const cache = fs.existsSync(CACHE) && !process.env.REFRESH_PREVIEWS ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
let looked = 0;
let offline = false;

for (const song of songs) {
  const key = keyOf(song);
  if (key in cache || offline) continue;
  try {
    const term = `${bare(song.title)} ${song.artist.split(',')[0]}`;
    let hit = best(song, await search(term, 'SG'));
    if (!hit) hit = best(song, await search(term, 'US'));
    cache[key] = hit ? { url: hit.previewUrl, track: hit.trackName, artist: hit.artistName } : null;
    looked++;
  } catch (e) {
    // No network: keep what's cached and build anyway. Uncached songs show "no preview".
    console.warn(`previews: couldn't reach iTunes (${e.message}); using the cache as it is.`);
    offline = true;
  }
}

// Keep the cache to the songs that are still on the list.
const keep = Object.fromEntries(songs.map((s) => [keyOf(s), cache[keyOf(s)] ?? null]).filter(([k]) => k in cache));
if (looked || Object.keys(keep).length !== Object.keys(cache).length) fs.writeFileSync(CACHE, JSON.stringify(keep, null, 2) + '\n');
const found = Object.values(keep).filter(Boolean).length;
console.log(`previews: ${found} of ${songs.length} songs have a preview${looked ? ` (looked up ${looked})` : ''}`);
