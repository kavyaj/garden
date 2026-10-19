# kavya.garden

Kavya's digital garden: the place for the thinking that doesn't fit on LinkedIn. Half-ideas, things she's changed her mind about, words she keeps returning to. Kavya builds and runs it alone with Claude Code.

**The order of importance is Kavya, then what she thinks and makes, then the garden.** The garden is the site's physics (things get planted, tended, left alone, revisited), not its decoration. When in doubt, take something away.

**The domain is `kavya.garden`.** The old `kavya.wiki` has been allowed to expire and is not coming back. Never write `kavya.wiki` anywhere in code, config, meta tags or copy. Canonical URL, OG URLs, sitemap and RSS all use `https://kavya.garden`. Put it in one place (`src/site.ts` as `url`) and read it from there. The design system (component `Mp3Player`) and mockups are called "Kavya Garden". The repo folder may still say `kavya-wiki`; that's just a folder name.

Read this whole file before changing anything. If this file and the design system disagree, the design system wins and this file gets fixed.

## Sources of truth

| What | Where |
|---|---|
| Design system: tokens, rules, components | https://claude.ai/artifact/1nXPMnsfRo7APjyFHyGSmN ("Kavya Garden", V2) |
| Page mockups | https://claude.ai/artifact/Lz4Gb8d2cwxXRvEUwEcnp6, the page called **"V2, quieter"**. Ignore the "V1" page. |
| Content | `src/content/` in this repo. Flat files, no database, no CMS. |

The V2 mockups are the spec for layout, spacing, copy and motion. Match them. The mockups use stand-ins where the repo already has the real thing: the About portrait is `src/assets/portrait.webp`, and there is no email anywhere on the site, by Kavya's choice (people reach her through LinkedIn and X).

## Where the repo stands

The V1 to V2 migration is done (commit "Migrate to V2: remove scenes, new tokens"). The repo was then built against an early V2 (Oct 8). Everything decided since (the new logo, the kavya.garden domain, the MP3 player, Books, the reverse bucket list, the book about Thatha, Experience, Why it looks like this, the real notes and quotes) was built from the V2 update brief (commits "New spec" to "Check"). The brief and its folder are gone; this file is the only spec.

## Stack

- **Astro**, static output. Content collections for everything Kavya writes.
- **Plain CSS** with custom properties from the design system's `tokens.json`. Class names follow the V2 mockup (`ul`, `tl`, `row`, `card`, `vine`). The design system's `components/bundle.css` has the same rules with a `kw-` prefix.
- **No client framework.** Small vanilla JS only for: the MP3 player, relative dates, and starting the tendril draw when it scrolls into view.
- **Code:** the GitHub repo `Garden`, which Kavya creates and pushes to herself. Never push, and never add or change a remote, unless she asks.
- **Hosting:** GitHub Pages, built and deployed by `.github/workflows/deploy.yml` (the official Astro action) on every push to `main`. `public/CNAME` holds `kavya.garden`. No `base` in `astro.config.mjs`, because the site has its own domain. Output is a plain static folder. Custom domain `kavya.garden` (apex), with `www.kavya.garden` redirecting to the apex. HTTPS on. Add `robots.txt` and `sitemap.xml` for `kavya.garden`.
- **Referral tags:** links out to Kavya's own products (StoryCV, Resumey.Pro) carry `?ref=kavyagarden`.
- **Fonts** (Google Fonts): Fraunces, DM Sans, Shantell Sans, Tiro Devanagari Hindi on pages that show Devanagari (Home, Quotes), and Tiro Kannada on pages that show Kannada (Quotes). Original-script quotes always use the Tiro face for their script, with `lang` set (`hi`, `sa`, `kn`). Preload Fraunces.

## Routes

| Route | Page | Mockup artboard |
|---|---|---|
| `/` | Home | Home |
| `/notes` | Notes, grouped by year | Notes |
| `/notes/[slug]` | One note | A note |
| `/quotes` | Quotes | Quotes |
| `/on-repeat` | The MP3 player and the song list | On repeat |
| `/made` | Things I've made | Things I've made |
| `/about` | About ("The gardener") | About |
| `/books` | Books I love, handpicked | Books |
| `/done` | The reverse bucket list | Done |
| `/thatha` | Cover of the book "Allide mane, illige bande summane" | Thatha (cover) |
| `/thatha/[chapter]` | One chapter, 1 to 9 | Thatha Ch1 to Ch9 |
| `/thatha/timeline` | His life, 1934 to 2014 | Thatha timeline |
| `/thatha/words` | Phrases, songs and rhymes with meanings | Thatha words |
| `/why` | Why it looks like this: the logo story, the values, the rules | Why it looks like this |
| `/experience` | Where I've been: work timeline, education, featured in. Same URL as on the old site so old links keep working | Experience |
| `/map` | The garden from above | The map |
| `/404` | "This one hasn't grown yet." with a tendril that stops short | none, build in the same style |

Header nav, in this order and with these exact words: **Notes · Quotes · On repeat · Things I've made · About.** Interface words stay boring on purpose; the content gets to be surprising.

Books, the reverse bucket list, `/experience` and `/why` are not in the header nav. Reach them from About ("More of me"), the footer and the map. The book is reached from About and Things I've made. Planned for later, shown as dotted plots on the map: Compost, Guestbook. Don't build these until Kavya asks.

## Tokens (V2)

| Token | Value | Job |
|---|---|---|
| `paper` | `#F4F1EA` | Page ground, with grain |
| `paper-lift` | `#FBFAF6` | Cards only |
| `ink` | `#1A1916` | Text, lines, focus ring (15.6:1) |
| `muted` | `#6B675E` | Summaries, dates, captions, margin notes (5.0:1) |
| `hair` | `rgba(26,25,22,0.12)` | Hairlines, card borders, card hover shadow |
| `green` | `#2F5D45` | The one green: tendril leaves, backlinks glyph, "playing" |
| `green-deep` | `#22442F` | Footer only |
| `green-mid`, `green-soft` | `#3F6B52`, `#6E8F72` | Gate drawing and map only |
| `spot` | `#fd5183` | Link underlines, active nav, the one flower, the selected song. Never text |
| `blue` | `#A7CDE0` | Sky through the gate, water on the map |
| `sun` | `#FDE837` | The recently-tended dot |
| `sun-wash` | `rgba(253,232,55,0.7)` | One highlighted phrase per page |
| `path`, `lawn` | `#E7E0D1`, `#E4E8D7` | Gate drawing and map only |

Pink and yellow never appear in the same component.

**Paper grain:** an absolutely positioned SVG behind the content (`mix-blend-mode: multiply`, opacity .5) with two `feTurbulence` layers: fine grain (`baseFrequency .9`, 16% alpha) and horizontal fibre (`baseFrequency .012 .18`, 9% alpha). It sits under content, never over cards. Render it once in the base layout. If it costs paint performance on long pages, bake it to a small tiled PNG instead.

## Type

- **Fraunces**: H1 (`opsz 144, SOFT 50, WONK 1`, weight 600), H2 (weight 600), titles in lists (23 to 24px, weight 500), quotes.
- **DM Sans**: everything else. Nav, body (17px; articles 18.5px at 1.7), dates, labels, buttons, quote reasons.
- **Shantell Sans**: exactly four kinds of place. One margin note per article at most, the caption under the gate on Home, the tagline aside in the Home hero, "thanks for wandering in" in the footer. Never rotated, never in UI.

## Content model

All dates ISO (`2026-10-05`).

**Notes:** `src/content/notes/<slug>.md`

```yaml
---
title: The résumé is a compression artifact
summary: Everything interesting about a career is the part that doesn't fit on one page.
planted: 2026-03-12
tended: 2026-10-05
margin: still not sure if this is a complaint or a design brief.   # optional, max one
highlight: nine words on a page                                     # optional, exact phrase in the body
---
```

Body is markdown. Links to other notes are plain links to `/notes/<slug>`; backlinks come from these.

**Experience:** `src/content/experience.yaml` with `roles` (years, title, org, url optional, current bool, line), `intro` (three paragraphs), `education` and `featured` (podcast name, episode, url). Kavya's words; never rewrite the role lines.

**Quotes:** `src/content/quotes.yaml`

```yaml
- id: kabir-mali
  original: "धीरे-धीरे रे मना, धीरे सब कुछ होय। माली सींचे सौ घड़ा, ऋतु आए फल होय।"
  translation: "Slowly, mind, everything happens slowly. The gardener pours a hundred pots of water, but fruit comes in its season."
  source: Kabir, 15th century
  why: The whole reason this site is a garden, in two lines.
  featured: true     # exactly one: shown big at the top of /quotes and on Home
  added: 2026-10-01
- id: sanchi-honnamma
  lang: kn
  original: "ಪೆಣ್ಣು ಪೆಣ್ಣೆಂದೇತಕೆ ಬೀಳುಗಳೆವರು?\nಕಣ್ಣು ಕಾಣದ ಗಾವಿಲರು!\nಪೆಣ್ಣಲ್ಲವೇ ನಮ್ಮನೆಲ್ಲ ಪಡೆದ ತಾಯಿ?"
  transliteration: "Pennu pennendethake beelugalevaru?\nKannu kaanada gaavilaru!\nPennallave nammanella padeda taayi?"   # optional field, shown in muted italic under the original
  translation: "Why do people look down upon a woman with such contempt? They are blind fools who cannot see! Is not a woman the mother who gave birth to us all?"
  source: "Sanchi Honnamma (ಸಂಚಿ ಹೊನ್ನಮ್ಮ), 17th-century Kannada poetry"
  why: Kavya's own words, verbatim (see the mockup).
  wide: true         # optional: the card spans the full grid row (use for long quotes with a transliteration)
```

The Sanchi Honnamma quote and its "why" are Kavya's real ones. The other five cards in the grid are stand-ins until she supplies her own.

**Songs:** `src/content/songs.yaml`, in this order, seeded from Kavya's Spotify playlist "Kavya's Favourites" (https://open.spotify.com/playlist/7r28hzPeYUeMYLb67iDUD0, 16 tracks). It is her curated list, so use it as is and keep her order. Fields: title, artist, note (optional), added. Notes are hers; leave them empty until she writes one, and the page simply shows no note. Never write one.

1. Chasing Cars, Snow Patrol
2. Drop, Connor Price and Zensery
3. Fuel, Metallica
4. Free Bird, Lynyrd Skynyrd
5. Zara Zara, Bombay Jayashri
6. Tere Paas Main (Female Version), A.R. Rahman, Irshad Kamil and Deepali Sahay
7. Lose Yourself, Eminem
8. Hotel California, Eagles
9. Love Story, Taylor Swift
10. You Belong With Me, Taylor Swift
11. Bavra Mann, Swanand Kirkire
12. Niyat-e-Shauq, Zeeshan Ali
13. Trendsetter, Connor Price and Haviah Mighty
14. Can't Help Falling in Love, Elvis Presley
15. Numb, Linkin Park
16. Demons, Imagine Dragons

Displayed titles drop Spotify's suffixes ("2013 Remaster", the film credit). When she adds a song to the playlist, add it to the end of the yaml. The player never hosts audio: the 30-second preview URL comes from the iTunes Search API at build time (match on title + first artist), cached to `src/content/.preview-cache.json` so builds don't depend on the network. If no preview is found, the song still shows and the play button says "no preview". "Open the whole playlist on Spotify" under the list is the link-out; `playlist_url` lives in `src/site.ts`.

**Books:** `src/content/books.yaml` (title, author, cover, goodreads_url optional, first_read year, reread bool, note, line optional, featured: exactly one). Kavya's real list is in the file; the notes are her own words, so never edit or rewrite them. `line` is the underlined line, shown only on the featured book (The Annihilation of Caste). The meta line reads "Read 2022" or "First read 2007 · re-read". Covers are the publishers' own art, supplied by Kavya, in `public/covers/` as `<cover>-sm.webp` (160px wide, the list) and `<cover>-lg.webp` (360px, the featured book only). Use real `<img>` with `alt="Cover of <title>"`, explicit width, `loading="lazy"` below the fold. Covers keep square corners and the `hair` card border. If a cover file is missing, fall back to the lettered cover. "On Goodreads" is a plain ink underlined link (not the pink one, because the featured block already has the yellow highlight). Order on the page is the file order, featured book first.

**Reverse bucket list:** `src/content/done.yaml` (title, year, group: made | learned | went | did-anyway | small, story optional one line). The page's "still counts" line and group counts are computed.

**The book:** `src/content/thatha/` with `chapters/01-childhood.md` through `09-fighter.md` (frontmatter: number, title, caption, illustration, status: done | writing), `timeline.yaml` (year, text, plus one `gap` entry) and `words.yaml` (phrase, language, meaning, kind: phrase | song). Chapter 8 is still being written and renders a "still being written" note. Glossary words are marked `[[word|meaning]]` in the markdown and render as `.gl` tooltips that also work on tap and focus. His words are Kavya's rough translations from Kannada and Telugu; keep that line on the cover. Chapter illustrations are hand-built SVGs in `src/illustrations/`, one per chapter, 300px max.

**Things I've made:** `src/content/projects.yaml` with `kind: run` (StoryCV, Resumey.Pro, Red Thread Careers: shown as a list under "The ones I run" with a "Since 2019" style note), `kind: written` (the book "Allide mane, illige bande summane", dated 2013, with a 72px thumbnail, and The Brave Rocketeers: shown as a list under "Things I've written") or `kind: small` (weekend projects: shown as cards with a 16:10 screenshot).

**Site settings:** `src/site.ts`: `url` (`https://kavya.garden`), `tagline` ("Perpetually figuring it out. Annoyingly self-aware about it.", used on Home and as the fallback meta description), `planted`, socials (LinkedIn and X, no email), the book's planted and tended dates, map plots.


## How the site counts itself

Nothing is a hand-typed number. All of it is computed at build time.

- **Yellow dot:** a note whose `tended` is within 14 days of the build. Same everywhere.
- **Dates in lists:** "Tended 5 Oct" this year, "Tended Jan 2025" otherwise. The Notes page adds "planted Mar 2026" underneath, or "never tended since" when `planted == tended`.
- **Neglect shows:** notes not tended for over a year get a `muted` title. Don't hide old notes.
- **Last tended** (map census, note header): output `<time datetime>`; a few lines of JS turn it into "3 days ago" in the browser where that reads better. Without JS it's the plain date.
- **Map census:** one line under the map: "7 notes, 6 quotes, 16 songs, 8 books, 17 things done, 7 things made. Last tended 5 Oct 2026."
- **Map plots:** each plot in `site.ts` names a collection. Empty means a dashed plot labelled "later"; one entry or more means a drawn bed with a count.
- **Backlinks:** inverted note-to-note link map. "Mentioned in" only renders when there's at least one.

## Page anatomy

Every page: `SiteHeader`, the page's content, `Footer`. That's it. No scenes above or below.

- **Home:** H1 "Everyone has a story to tell.", a subheading ("And this is mine. Hi, I'm Kavya. This is my little corner on the internet where I share and nurture ideas and projects that are close to my heart."), then her tagline "Perpetually figuring it out. Annoyingly self-aware about it." as an aside in Shantell Sans (the second sentence highlighted), because it's said under her breath. On the right, the gate drawing (`GateIllustration`), which links to `/map`. Then the page's one tendril, Recently tended (4 notes, list), the featured quote large, then On repeat and Things I've made side by side, small.
- **Notes:** H1, one paragraph, the list by year, then a tendril trailing off next to "That's everything, for now."
- **A note:** narrow editorial column (36rem), title, meta line, body, margin note on the right on wide screens (inline on phones) only if the note has one, "Mentioned in" only if something links here, All notes and Next. A quoted tweet is shown as a quiet card (name, handle, text, "On X" link and date), never as a screenshot.
- **Experience (`/experience`):** H1 "Where I've been", Kavya's three intro paragraphs, then a vertical timeline (years left, a thin ink line with a dot per role; current roles have a filled green dot; the line fades to `hair` after the last role), Education, a tendril, "Featured in" (tendril links to the two Indie Founder episodes), and a closing link to Things I've made.
- **Quotes:** H1, intro, the featured quote big with no card (the page's loud thing), a tendril, then `QuoteCard`s with "Why I keep it" in a native `<details>`.
- **On repeat:** the MP3 player on the left (a replica of the blue one her parents gave her as a teenager), the song list on the right, then "The real one" story under the player. Intro: "Listening to songs is really one of my favourite pastimes. Here are some of my favourites." then, as its own line, "Interact with this MP3 player to play songs." See Interactions.
- **Books:** H1, intro, one featured book large with the underlined line, then the shelf with each book's cover (lettered cover when the file is missing). Notes are Kavya's; never write them.
- **Reverse bucket list:** H1, intro, groups (Made, Learned, Went, Did anyway, Small) as plain lists with a green tick that redraws on hover, and a "still counts" line.
- **The book:** cover with the photo of Kavya and her grandfather and the foreword, then the chapter list with Contents, then the timeline and words pages. Chapter column 42rem, 18.5px at 1.7, one illustration with a caption per chapter.
- **Why it looks like this (`/why`):** one 64rem column. Hero splits H1 and lede | the mark you can walk (the page's one loud thing: buttons "Walk the J", "Walk the K", "Just the garden" reveal pink dotted paths through the J and K, by stroke-dashoffset on masks; respect reduced motion). Then "A garden, seen from above", "It took six tries" (a viewer with the six logo attempts plus Earlier/Later buttons, and a numbered list that selects each; tries 1 to 5 are black or green sketches, 6 is the final mark), "What the garden is about" (Curiosity, Care, Growth, Personality, Restraint, each with a "So:" line), the Kabir couplet with one highlighted phrase, "What it's made of" (colours, rare colours, type), "Where you'll see the mark", "Rules I gave myself", and a closing "This page will change too." with the tended dot. **The copy is a draft written by Claude for Kavya to edit; do not treat it as final.** The mockup carries a thin ink banner saying so; the real page does not. The mark is the shared logo files, but the walkable mark inlines the SVG paths.
- **Things I've made:** "The ones I run" list, "Things I've written" list, a tendril, then "Small things" as cards.
- **About:** "The gardener" bio and portrait, "More of me" (links to Books, the reverse bucket list, Experience, Why it looks like this and the book about her grandfather), "Say hello" with LinkedIn and X only (no email), a tendril, then Terms of the garden with "Everything here is a work in progress, including me." set large in Fraunces.
- **The map:** flat drawn plan (no scene, no hanging tags), plain labels with a count, a dashed ink outline on hover, the census line, then the same garden as a plain list for phones and screen readers. Keep that list.

**One loud thing per viewport.** If a section has a big title, a big quote or the drawing, everything near it stays quiet.

## Tendrils

At most one big tendril per page, and it always has a job: a divider between the two halves of a page, or the end of a list. It's a thin ink line (1.6px) with a counter-clockwise coil and two small leaves (`green`, `green-soft`). It draws in once (2.2s) when it scrolls into view.

Small marks that don't count toward the one: the glyph beside "Mentioned in", the coil beside the footer signoff, and the pink coil that draws off the end of a `tl` link on hover.

Never on cards, never on the gate drawing, never looping.

## Motion

Only these:
1. **Growth:** the gate drawing grows in once on Home (about 2.6s in total); a page's tendril draws in once.
2. **The gate:** swings open on hover and focus (700ms), because it's the door to the map. The flower leans a little.
3. **Hover details:** list titles get a pink underline growing from the left, `tl` links draw a coil, cards lift 2px with a `hair` shadow.
4. **The MP3 player:** the progress bar, the equaliser bars while playing, the earphone-cable tendril, the removable cap.

Nothing else moves. The logo is static. `prefers-reduced-motion`: everything shows in its final state, and the gate link and MP3 player still work.

## Interactions

- **MP3 player** (`/on-repeat`): built from HTML, CSS and SVG, sized with container-query units so it scales as one piece. Real buttons: play/pause, previous, next. Picking a song from the list loads it; play starts the 30-second preview in an `<audio>` element (no autoplay, no audio until a click). The LCD shows title, artist, a progress bar and the equaliser. When idle, the LCD shows today's date and the current time in the visitor's time zone (`12 OCT 26`, blinking colon), updated by a one-second timer. Don't put `aria-live` on the LCD. The USB cap at the bottom is a button: click and it comes off, click again to put it back (`aria-pressed`). The earphone cable is the page's one tendril. Link out to Spotify for the full song. LCD font is VT323, the body blue is `#2E58A6`; those are the only exceptions to the palette and type rules, and they stay inside the player.
- **Quote reasons:** native `<details>`; the `+` rotates into an `×`.
- **Map:** each planted bed is one link. Unplanted plots aren't links.

## Photos

Photographs have rounded corners (8 to 10px: portrait and book cover 10px, small thumbnails 8px). Cards stay square. Don't round anything else.

## Logo

The mark is a garden seen from above: a disc with the J and K cut out as paths. Use only the files in the design system's **Logos** group (`kj-mark-deep-green.svg`, `kj-mark-paper.svg` and friends), copied into `public/brand/`. The old pressed KJ disc (white disc, pink K, soft pink J) is retired. Don't use it anywhere, and don't use `spot-soft`, which was its J.

- **Header:** horizontal lockup. The deep-green mark at 32px, then "Kavya Jahagirdar" in Fraunces 600 (`opsz 144, SOFT 50, WONK 1`, 18px, letter-spacing -0.015em), gap 10px. Links to `/`. The image has empty `alt` because the name beside it is live text.
- **Footer:** domain lockup. The `paper` mark at 28px on `green-deep`, then "kavya.garden" in Fraunces 500 (`opsz 72, SOFT 50`, 17px), above the signoff.
- **Favicon and touch icon:** `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png` from the Logos group, plus the SVG as the modern icon.
- **Share images (OG, 1200 x 630):** the stacked lockup, deep green on `paper`. LinkedIn and X avatar: `kj-avatar-800.png`.
- One colour per surface. Deep green by default, `ink` when colour isn't yours to choose, pink only at 64px and up, once per surface. No box, no ring, no shadow, no rotation, never on yellow, never pink on green. Clear space is a quarter of the disc on every side. Minimum 16px alone, 24px in a lockup. Static: no intro animation.

## Illustrations

Two kinds. The gate drawing and the map are the scenes. Everything else is a **vignette**: one small hand-built inline SVG of a single object at the top of a book chapter (`viewBox 0 0 320 190`, max 300px wide, 44px below it, then the body). Ink line 1.7, flat fills from the palette only, at most one pink mark, no people, no shading or gradients, `role="img"` with an `aria-label`, and a one-line italic `muted` caption underneath. Static, never animated. The rules, the nine reference drawings and the checklist are in the design system under **Vignette** and **VignetteFrame**; read them before drawing anything. Captions and drawings you make are drafts until Kavya has seen them.

## Floors

- Text 4.5:1 minimum. Pink and yellow are never text.
- Real `<a>` and `<button>` everywhere, visible `ink` focus ring, targets at least 44px.
- Decorative SVG is `aria-hidden`. The gate link has `aria-label="Through the gate: a map of the whole site"`.
- Works at 360px wide: the nav wraps, the margin note drops inline, the shelf stays 3 across or drops to 2, no horizontal scroll.
- Under 150KB transferred per page on first load, fonts excluded.
- No dark mode, no trackers, no cookie banner.

## Copy and voice

Any copy you write (alt text, empty states, 404, meta descriptions, labels) follows Kavya's voice:

- Short paragraphs, contractions always, sharp and a little wry.
- No em dashes, ever.
- Banned: "landscape", "leverage", "game-changer", "unlock", "delve", "quietly", and any "This isn't X, this is Y" construction.
- No LinkedIn-speak, no clichés. Physical verbs. Humour through specificity.
- Plain words in the interface. Garden verbs (planted, tended) only for dates.

Never write a note, quote reason or record note on Kavya's behalf unless she asks, and mark anything you draft as a draft.

## Common jobs

- **"Add a note":** new file in `src/content/notes/` with `planted` and `tended` set to today.
- **"I tended X":** set `tended` to today. The dot, the order and the census follow.
- **"Add a quote / record / project":** append to the YAML file.
- **"Plant Reading / Compost / Guestbook":** ask first. Then the collection, the route, the map plot, and the page in the same anatomy, reusing existing components. Check the design system before inventing anything.
- **Before every commit:** `npm run build` passes, there are no broken internal links (fail the build on one), and no page goes over budget.

## Don't

- Bring back anything from the V1 removal list.
- Add illustrations beyond the gate drawing, the map and the book's chapter vignettes. A vignette anywhere else needs Kavya's yes first.
- Use cards for notes.
- Use Shantell outside its four places.
- Mention `kavya.wiki` anywhere.
- Put pink and yellow in one component.
- Add a second big tendril to a page.
- Animate anything not listed under Motion.
- Use blur, gradients as fills, soft shadows, rotations or tape.
- Add a dependency for something 30 lines of code can do.

## Still open

- A note per song on On repeat, only if she wants one (the songs themselves are real now).
- The real reverse bucket list (with years). Only the true entries in the mockup are real; bracketed ones are placeholders. The Books page is now real.
- Chapter 8 of the book, and the 1999 to 2014 gap in the timeline.
- Notes are real now (3). The planted date for "A solo date on a Tuesday" is a guess (the day it was added); confirm with Kavya.
- The five stand-in quote cards on Quotes (only Kabir and Sanchi Honnamma are hers).
- Resumey.Pro: Things I've made says "Since 2019" (her first product), Experience says Co-founder 2021 to now. Both may be true; check with Kavya before changing either. StoryCV is 2025 in both.
