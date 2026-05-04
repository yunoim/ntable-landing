// ntable-landing Worker
// - /admin* 경로 → admin.ntable.kr 으로 301 리다이렉트 (관리자 진입점 통합)
// - 그 외는 Astro 빌드 산출물(dist/)을 env.ASSETS 로 서빙
// - Cache-Control + 보안 헤더 주입 (Workers Static Assets _headers 미지원 우회)

interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
}

const IMMUTABLE_PATHS = new Set([
  '/og-image.png',
  '/og-image.svg',
  '/apple-touch-icon.png',
  '/apple-touch-icon.svg',
  '/icon-192.png',
  '/icon-512.png',
]);

const SHORT_CACHE_PATHS = new Set([
  '/robots.txt',
  '/sitemap.xml',
]);

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      const dest = 'https://admin.ntable.kr' + url.pathname + url.search;
      return Response.redirect(dest, 301);
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);

    // 캐시 정책
    if (url.pathname.startsWith('/_astro/') || IMMUTABLE_PATHS.has(url.pathname)) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (SHORT_CACHE_PATHS.has(url.pathname)) {
      headers.set('Cache-Control', 'public, max-age=3600');
    } else {
      // HTML·기타 — 짧은 cache로 카피 변경 빠르게 propagate
      headers.set('Cache-Control', 'public, max-age=300, must-revalidate');
    }

    // 보안 헤더 (모든 응답)
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('X-Frame-Options', 'DENY');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default handler;
