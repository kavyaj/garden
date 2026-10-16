import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kavya.garden',
  output: 'static',
  build: { format: 'directory' },
  // V1 called About "The Gardener".
  redirects: { '/gardener': '/about' },
});
