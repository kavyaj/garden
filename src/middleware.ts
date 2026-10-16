// Every link that leaves kavya.garden opens in a new tab, wherever it comes from: components, YAML, or a
// note's markdown. Runs as each page is built, so new content needs nothing extra.
import { defineMiddleware } from 'astro:middleware';

const EXTERNAL = /^https?:\/\//;
const OWN = /^https?:\/\/(www\.)?kavya\.garden(\/|$)/;

export function openExternalInNewTab(html: string): string {
  return html.replace(/<a\b[^>]*>/g, (tag) => {
    const href = /\shref="([^"]*)"/.exec(tag)?.[1] ?? '';
    if (!EXTERNAL.test(href) || OWN.test(href) || /\starget=/.test(tag)) return tag;
    const rel = /\srel="([^"]*)"/.exec(tag);
    const rels = new Set([...(rel?.[1].split(/\s+/).filter(Boolean) ?? []), 'noopener', 'noreferrer']);
    const relAttr = `rel="${[...rels].join(' ')}"`;
    const withRel = rel ? tag.replace(rel[0], ` ${relAttr}`) : tag.replace(/>$/, ` ${relAttr}>`);
    return withRel.replace(/>$/, ' target="_blank">');
  });
}

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const html = await response.text();
  return new Response(openExternalInNewTab(html), { status: response.status, headers: response.headers });
});
