// A fenced ```aside block in a note becomes marginalia: Kavya's hand, in the margin, behind a spot bar.
// Put the block just before the paragraph it should sit beside.
// An mdast plugin for Sätteri, Astro's Markdown processor.

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const asidePlugin = {
  name: 'kavya-aside',
  code(node, ctx) {
    if (node.lang !== 'aside') return;
    const paras = node.value
      .split(/\n\s*\n/)
      .map((p) => `<p>${escape(p.trim())}</p>`)
      .join('');
    ctx.replaceNode(node, { type: 'html', value: `<aside class="kw-margin note-aside">${paras}</aside>` });
  },
};
