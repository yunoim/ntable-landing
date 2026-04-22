import { defineConfig } from 'astro/config';

// Pure SSG. Cloudflare Workers serves ./dist via a separate Worker (STEP 5).
// No @astrojs/cloudflare adapter — Astro is a static file generator here,
// the Worker is a file server. Two clean roles.
export default defineConfig({
  site: 'https://ntable.kr',
  output: 'static',
});
