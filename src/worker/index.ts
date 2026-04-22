// ntable-landing Worker
// - /admin* 경로 → admin.ntable.kr 으로 301 리다이렉트 (관리자 진입점 통합)
// - 그 외는 Astro 빌드 산출물(dist/)을 env.ASSETS 로 서빙

interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
}

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      const dest = 'https://admin.ntable.kr' + url.pathname + url.search;
      return Response.redirect(dest, 301);
    }

    return env.ASSETS.fetch(request);
  },
};

export default handler;
