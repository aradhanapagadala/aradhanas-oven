// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages: https://sathwiksang.github.io/aradhanas-oven/
// (if you move to a custom domain, set `site` to it and remove `base`)
export default defineConfig({
  site: 'https://sathwiksang.github.io',
  base: '/aradhanas-oven',
  devToolbar: { enabled: false },
});
