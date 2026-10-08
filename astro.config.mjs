import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { asidePlugin } from './src/lib/aside-plugin.mjs';

export default defineConfig({
  site: 'https://kavya.wiki',
  output: 'static',
  build: { format: 'directory' },
  markdown: { processor: satteri({ mdastPlugins: [asidePlugin] }) },
});
