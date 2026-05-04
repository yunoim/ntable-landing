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
    // CSS 인라인 강제 — splash 가 모바일 slow 4G 에서 외부 CSS 다운로드 (~300ms) 대기로 늦게 paint 되는 문제 해결
    // Trade-off: HTML 약간 커지지만 cache 됨. 첫 paint 가 압도적으로 중요.
    inlineStylesheets: 'always',
  },
});
