import { defineConfig } from 'astro/config';

// Pure SSG. Cloudflare Workers serves ./dist via a separate Worker (STEP 5).
// No @astrojs/cloudflare adapter — Astro is a static file generator here,
// the Worker is a file server. Two clean roles.
export default defineConfig({
  site: 'https://ntable.kr',
  output: 'static',
  // 'file' format maps src/pages/X.astro → /X.html. Required to serve
  // /privacy.html and /terms.html at their original URLs (existing links
  // in YAML + SEO + external backlinks depend on the .html extension).
  build: {
    format: 'file',
  },
});
