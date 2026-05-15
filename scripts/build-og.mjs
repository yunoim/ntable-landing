// SVG → PNG 변환 (수동 실행). og-image.svg 카피를 변경했을 때 호출.
//
// 사용:
//   npm run og:build
//
// 정책:
// - 자동 빌드(GitHub Actions)에는 hook하지 않음. CI Ubuntu 환경에는 한글
//   폰트(Malgun Gothic 등) + Cormorant Garamond·DM Sans가 모두 부재라
//   fallback 시각이 어색해질 수 있음. 로컬(Windows)에서 실행해야 시스템
//   폰트로 안정.
// - 결과 PNG는 git에 commit. SNS·카카오톡·Slack 프리뷰가 이 PNG를 가져감
//   (og:image: /og-image.png).
//
// 검증:
// - 실행 후 public/og-image.png 를 viewer로 열어 한글 깨짐·fallback 시각
//   확인. 어색하면 SVG의 font-family fallback 순서 조정 또는 fontFiles 명시.
//
// History:
// - 2026-05-04 f5e99e3 — 최초 PNG 생성 (인라인 일회성).
// - 2026-05-13 — 본 스크립트로 재현 가능하게 보존.

import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'public/og-image.svg');
const pngPath = join(root, 'public/og-image.png');

const svg = readFileSync(svgPath);
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: 'DM Sans',
  },
});
const png = resvg.render().asPng();
writeFileSync(pngPath, png);
console.log(`✓ public/og-image.png 갱신 (${png.length.toLocaleString()} bytes)`);
console.log('  → viewer 로 열어 한글 깨짐·fallback 시각 직접 확인 권장.');
