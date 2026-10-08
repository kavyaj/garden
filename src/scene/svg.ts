// A tiny SVG tree: enough to cut the painted scenes into layers. No text nodes, which these scenes don't have.

export interface Node {
  tag: string;
  attrs: string;
  children: Node[];
}

export function parse(src: string): Node {
  const root: Node = { tag: '#root', attrs: '', children: [] };
  const stack: Node[] = [root];
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const [, close, tag, attrs, self] = m;
    if (close) {
      stack.pop();
      continue;
    }
    const n: Node = { tag, attrs: attrs.trim(), children: [] };
    stack[stack.length - 1].children.push(n);
    if (!self) stack.push(n);
  }
  return root;
}

export function ser(n: Node): string {
  if (n.tag === '#root') return n.children.map(ser).join('');
  const a = n.attrs ? ' ' + n.attrs : '';
  return n.children.length ? `<${n.tag}${a}>${n.children.map(ser).join('')}</${n.tag}>` : `<${n.tag}${a}/>`;
}

export function attr(n: Node, name: string): string | undefined {
  return new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(n.attrs)?.[1];
}

export function setAttr(n: Node, name: string, value: string | undefined): void {
  const re = new RegExp(`(^|\\s)${name}="[^"]*"`);
  if (value === undefined) n.attrs = n.attrs.replace(re, '').trim();
  else if (re.test(n.attrs)) n.attrs = n.attrs.replace(re, `$1${name}="${value}"`);
  else n.attrs = `${n.attrs} ${name}="${value}"`.trim();
}

/** Ids referenced by url(#x) or href="#x" in a piece of markup. */
export function refs(markup: string): Set<string> {
  const out = new Set<string>();
  for (const m of markup.matchAll(/url\(#([\w-]+)\)|href="#([\w-]+)"/g)) out.add(m[1] ?? m[2]);
  return out;
}

/** Finds the node carrying a given id anywhere in the tree. */
export function byId(root: Node, id: string): Node | undefined {
  for (const c of root.children) {
    if (attr(c, 'id') === id) return c;
    const hit = byId(c, id);
    if (hit) return hit;
  }
}
