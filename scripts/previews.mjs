// Finds a 30-second preview for each song in src/content/songs.yaml using the iTunes Search API,
// and caches it in src/content/.preview-cache.json so builds don't depend on the network.
// Nothing is downloaded or hosted: the player streams Apple's preview URL after a click.
// If the original has no preview, another recording by the same artist (live, re-recorded) is used. A song with no match at all is cached as null, retried each build, and the player says "no preview".
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
const keyOf = (song) => `${song.title} · ${song.artist}`;
const UNWANTED = /\b(live|demo|riff|rough mix|karaoke|instrumental|remix|cover|tribute|acoustic|unplugged|sped up|slowed|8d)\b/;
// Second pass, when the original recording has no preview: another take by the same artist (live, unplugged, re-recorded) is fine.
const NEVER = /\b(demo|riff|rough mix|karaoke|instrumental|remix|cover|tribute|sped up|slowed|8d)\b/;

async function search(term, country) {
  const url = `https://itunes.apple.com/search?${new URLSearchParams({ term, entity: 'song', limit: '50', country })}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`iTunes ${res.status}`);
  return (await res.json()).results ?? [];
}

function best(song, results, relaxed = false) {
  const unwanted = relaxed ? NEVER : UNWANTED;
  const want = bare(song.title);
  const full = norm(song.title);
  const artist = norm(song.artist.split(',')[0]);
  const scored = results
    .filter((r) => r.previewUrl && norm(r.artistName).includes(artist))
    .filter((r) => [want, full].includes(bare(r.trackName)) || storeTitle(r.trackName) === full || storeTitle(r.trackName).startsWith(`${want} `))
    .filter((r) => !unwanted.test(norm(r.trackName)) || unwanted.test(full))
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
  // A miss (null) is retried on every build, so one bad lookup doesn't stick forever.
  if ((cache[key] ?? null) !== null || offline) continue;
  try {
    const first = song.artist.split(',')[0];
    // Artist + title first, then title alone (the artist filter in best() still applies), then the artist's name with the title.
    const terms = [`${bare(song.title)} ${first}`, bare(song.title), `${first} ${song.title}`];
    const seen = [];
    let hit;
    for (const term of terms) {
      for (const country of ['SG', 'US', 'IN']) {
        const results = await search(term, country);
        seen.push(results);
        hit = best(song, results);
        if (hit) break;
      }
      if (hit) break;
    }
    // No preview of the original: settle for another recording of the same song by the same artist.
    if (!hit) for (const results of seen) if ((hit = best(song, results, true))) break;
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
