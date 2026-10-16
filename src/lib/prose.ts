// Small rewrites of rendered markdown, applied as a note or chapter is built. Text runs only, never inside a tag.

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Replace the first text run containing `find` with `wrap(match)`. */
function inFirstText(html: string, find: string, wrap: (m: string) => string): string {
  let done = false;
  return html.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => {
    if (tag || done || !text.includes(find)) return m;
    done = true;
    return text.replace(find, wrap(find));
  });
}

/** The highlighter behind one exact phrase. */
export function highlight(html: string, phrase?: string): string {
  return phrase ? inFirstText(html, escape(phrase), (m) => `<span class="hl">${m}</span>`) : html;
}

/**
 * A quoted tweet as a quiet card, never a screenshot. In markdown it's a blockquote whose last paragraph is
 * "Name ([@handle](https://x.com/handle)), on X, 6 Dec 2024".
 */
export function tweetCards(html: string): string {
  return html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (block, inner: string) => {
    const paras = [...inner.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1].trim());
    const by = paras.at(-1)?.match(/^(.+?)\s*\(<a href="(https:\/\/(?:x|twitter)\.com\/[^"]+)">@([\w]+)<\/a>\),\s*on X,\s*(.+)$/i);
    if (!by) return block;
    const [, name, url, handle, date] = by;
    const text = paras.slice(0, -1).map((p) => `<p>${p}</p>`).join('');
    return (
      `<figure class="tweet">` +
      `<p class="tweet-by"><span class="tweet-name">${name}</span> <span class="tweet-handle">@${handle}</span></p>` +
      `<blockquote>${text}</blockquote>` +
      `<figcaption><a class="kw-ul" href="${url}">On X</a>, ${date}</figcaption>` +
      `</figure>`
    );
  });
}

/** Glossary words get a dotted underline and a tooltip that works on hover, focus and tap. First use only. */
export function glossary(html: string, words?: Record<string, string>): string {
  if (!words) return html;
  for (const [word, meaning] of Object.entries(words)) {
    html = inFirstText(
      html,
      escape(word),
      (m) => `<button type="button" class="gl" aria-describedby="gl-${slug(word)}">${m}<span role="tooltip" id="gl-${slug(word)}" class="gl-tip">${escape(meaning)}</span></button>`
    );
  }
  return html;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
