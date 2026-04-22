# ntable-landing 에이전트 지침

## 프로젝트 개요

**레포:** ntable-landing (ntable.kr 랜딩페이지 전용)
**배포:** Cloudflare Workers (GitHub Actions 자동배포)
**도메인:** ntable.kr
**법인명:** MLPC Inc. (More Life. People Connect.)
**사업자:** 286-87-02414

이 레포는 ntable.kr 랜딩페이지만 관리한다. FastAPI 운영 서버(ntable), 데모(ntable-app)와 완전 분리.

> **🧊 ns 동결 (2026-04-17부)**: ns.ntable.kr(ntable 디렉토리)는 신규 개발 중단. 랜딩 문구에서 남산엔테이블을 Phase 1 직영 소개로 언급하는 건 OK지만, ns 기능 업데이트 계획을 추가하지 말 것. 플랫폼 기능 설명은 ntable-app 기준으로 작성.

---

## 파일 구조

```
C:\Users\quite\Documents\ntable-landing\
├── CLAUDE.md          ← 이 파일
├── index.html         ← 메인 랜딩페이지
├── privacy.html       ← 개인정보처리방침
├── terms.html         ← 이용약관
├── wrangler.toml      ← Cloudflare Workers 설정
└── .github/
    └── workflows/
        └── deploy.yml ← main push 시 자동 배포
```

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 배포 | Cloudflare Workers (Static Assets) |
| CI/CD | GitHub Actions (main 브랜치 push → 자동 배포) |
| 도메인 | ntable.kr |

---

## 개발 규칙

- 이 레포는 정적 HTML/CSS/JS만 다룬다
- FastAPI 서버 코드, DB, OAuth 관련 파일은 ntable 레포에서 관리
- 배포는 git push main 으로만 진행 (수동 배포 금지)
- wrangler.toml의 `name`은 `ntable-landing` 고정

---

## 금지사항

- server.py, config.py, db.py 등 서버 파일 추가 금지
- 민감 정보(API 키, 시크릿) 커밋 금지

---

## 주요 참조

- Notion 허브: https://www.notion.so/340eff09d94281e1b31dd190cfab0fef
- 랜딩 URL: https://ntable.kr
- 운영 레포: ntable/ (별도)
- 데모 레포: ntable-app/ (별도)

---

## 구조 (2026-04 헤드리스 재구성)

정적 HTML 한 덩어리 → 콘텐츠-템플릿 분리 구조로 전환 완료.

**콘텐츠 (비엔지니어 편집 영역):**
- `src/data/{locale}/*.yml` — 카피·숫자·링크 전부 YAML
- `src/data/{locale}/privacy.md` · `terms.md` — 법적 문서 (Markdown)
- 현재 locale: `ko`. `en/` 디렉토리는 미래 확장용 (없으면 ko fallback)

**템플릿 (엔지니어 영역 — 카피 수정엔 건드리지 말 것):**
- `src/components/*.astro` — 섹션별 컴포넌트 12개
- `src/pages/*.astro` — 라우트 (index, privacy, terms, en/index)
- `src/layouts/*.astro` — Layout (main), LegalLayout (legal)
- `src/styles/*.css` — tokens / global / animations / sections
- `src/lib/loadContent.ts` — YAML + MD 로더 (Zod 검증)
- `src/data/config.ts` — Zod 스키마 레지스트리
- `src/worker/index.ts` — Cloudflare Worker (/admin* 리다이렉트 + ASSETS 서빙)

**카피·숫자·링크 수정은 `src/data/`의 YAML만 편집. 컴포넌트는 건드리지 않는다.**

**빌드/배포:**
- 로컬 미리보기: `npm run dev` → http://localhost:4321/
- 빌드: `npm run build` → `dist/`
- 배포: main push → GitHub Actions → Wrangler → Cloudflare Workers

**상세 편집 가이드**: [CONTENT_GUIDE.md](./CONTENT_GUIDE.md)

---

## 왜 `src/content/`가 아니라 `src/data/`인가

Astro 4는 `src/content/` 폴더를 **content collections**로 자동 인식합니다. 이 프로젝트는 한 locale 디렉토리에 YAML(data)과 Markdown(content)이 공존하는 레이아웃이라 `MixedContentDataCollectionError`가 발생합니다.

Astro 콘벤션과 우리 레이아웃이 충돌하므로 `src/data/`로 옮겨 Astro의 자동 스캔을 피했습니다. 검증은 `src/lib/loadContent.ts`가 빌드 시점에 Zod 스키마로 직접 수행하므로 기능상 동일합니다.
