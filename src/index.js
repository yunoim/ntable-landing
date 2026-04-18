// ntable-landing Worker
// - /admin* 경로 → admin.ntable.kr 으로 301 리다이렉트 (관리자 진입점 통합)
// - 그 외는 정적 에셋(index.html / privacy.html / terms.html 등) 그대로 서빙

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 관리자 진입점: ntable.kr/admin* → admin.ntable.kr
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      const dest = 'https://admin.ntable.kr' + url.pathname + url.search;
      return Response.redirect(dest, 301);
    }

    // 정적 에셋으로 위임
    return env.ASSETS.fetch(request);
  },
};
