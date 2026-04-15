# ntable-landing 에이전트 지침

## 프로젝트 개요

**레포:** ntable-landing (ntable.kr 랜딩페이지 전용)
**배포:** Cloudflare Workers (GitHub Actions 자동배포)
**도메인:** ntable.kr
**법인명:** MLPC (More Life People Connect)
**사업자:** 286-87-02414

이 레포는 ntable.kr 랜딩페이지만 관리한다. FastAPI 운영 서버(ntable), 데모(ntable-demo)와 완전 분리.

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
- 데모 레포: ntable-demo/ (별도)
