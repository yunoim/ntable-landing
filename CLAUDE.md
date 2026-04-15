# ntable 프로젝트 에이전트 지침

## 프로젝트 개요

**플랫폼명:** ntable (SaaS 상위 개념)
**직영 서비스:** 남산엔테이블 (ns.ntable.kr)
**법인명:** MLPC (More Life People Connect)
**사업자:** 286-87-02414

오프라인 소셜 미팅 플랫폼. 호스트가 모임을 열고, 게스트가 참가하여 실시간으로 진행되는 매칭/투표 기반 만남 서비스.

---

## 세션 시작 규칙

**매 세션 시작 시 반드시 아래 순서로 읽는다. 묻지 않고 바로 실행.**

1. `STATUS.md` — 현재 프로젝트 상태, 완료 기능, 백로그 파악
2. `STRATEGY.md` — 존재하면 현재 전략 방향 파악
3. `PLAN.md` — 존재하면 현재 구현 계획 파악

읽은 후 현재 상태를 한 줄로 요약하고 작업 제안.

---

## 파일 구조 및 역할

```
C:\Users\quite\Documents\ntable\
├── CLAUDE.md          ← 이 파일. 에이전트 행동 규칙
├── STATUS.md          ← 프로젝트 전체 상태 (단일 진실 공급원)
├── STRATEGY.md        ← 전략/방향 결정 기록 (없으면 생성)
├── PLAN.md            ← 구현 계획 상세 (없으면 생성)
├── server.py          ← FastAPI 앱
├── config.py          ← 공유 상수, OAuth, 과금 로직
├── db.py              ← SQLite DB 헬퍼
├── onetable.db        ← SQLite DB (데이터 보존, 이름 변경 금지)
├── routers/
│   ├── auth.py        ← OAuth, 프로필, survey API
│   ├── admin.py       ← owner 전용 API
│   ├── pages.py       ← HTML 서빙
│   └── ws.py          ← WebSocket 실시간 동기화
├── static/uploads/    ← 프로필 사진 (2MB 제한)
└── start.bat          ← 서버 + Cloudflare Tunnel 실행
```

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 백엔드 | FastAPI + uvicorn |
| 실시간 | WebSocket (room별 메모리 state + DB 영속화) |
| DB | SQLite (onetable.db) |
| 인증 | Google OAuth 2.0 + 카카오 OAuth |
| 인프라 | Cloudflare Tunnel (무고정IP) |
| 도메인 | ns.ntable.kr (운영) / ntable.kr (랜딩) |
| 알림 | Discord Webhook + 네이버 SENS SMS |
| Python | 3.14 (C:\Users\quite\AppData\Local\Python\pythoncore-3.14-64\) |

---

## 역할 분리 원칙

### 전략 (STRATEGY.md)
- 비즈니스 방향, 기능 우선순위, 제품 결정
- 결과는 반드시 `STRATEGY.md`에 저장
- 구현 디테일은 다루지 않음

### 기획 (PLAN.md)
- STRATEGY.md를 읽고 구체적 구현 계획 수립
- API 설계, DB 스키마 변경, UI 흐름 정의
- 결과는 반드시 `PLAN.md`에 저장

### 개발 (구현)
- PLAN.md를 읽고 코드 작성
- 구현 완료 후 STATUS.md 업데이트
- 테스트 통과 후에만 완료 처리

---

## 컨텍스트 관리 규칙

- 세션 간 기억은 파일로만 유지 (STATUS.md / STRATEGY.md / PLAN.md)
- 작업 완료 시 반드시 STATUS.md 업데이트
- 전략 결정 시 반드시 STRATEGY.md 업데이트
- 구현 계획 변경 시 반드시 PLAN.md 업데이트
- "나중에 기억해줘" 는 없다. 파일에 쓰거나 잊는 것 중 하나.

---

## 개발 규칙

### 코드 작성
- 기존 코드 스타일 유지 (한국어 주석, 간결한 함수)
- config.py의 상수 활용, 하드코딩 금지
- 상대경로 사용 원칙 (절대경로 최소화)
- DB 스키마 변경 시 init_db()에 ALTER TABLE 패턴으로 추가

### 검증 패턴
- 구조화된 산출물: 스키마 검증 (필수 필드, 타입)
- 정량 기준: 규칙 기반 검증
- 정성적 결과물: LLM 자기 검증 후 사람 검토 요청
- 외부 발송 / 결제 관련: 반드시 사람 검토

### 실패 처리
- 단순 오류: 자동 재시도 (최대 3회)
- 판단 불확실: 에스컬레이션 (사람에게 확인 요청)
- 선택적 단계 실패: 스킵 + 로그 기록

---

## 자동 테스트 규칙

구현 완료 후 아래 순서로 검증:

```
1. Python 문법 오류 확인 (import 테스트)
2. API 엔드포인트 존재 확인
3. DB 함수 호출 테스트 (onetable.db 대상)
4. WebSocket 핸들러 로직 검토
5. 실패 시 → 자동 수정 후 재검증 (최대 3회)
6. 3회 후에도 실패 → 사람에게 에스컬레이션
```

---

## 금지사항 (절대 하지 말 것)

- `onetable.db` 파일명 변경 금지 (데이터 유실 위험)
- 서버 무단 재시작 금지 (운영 중 서비스 중단)
- `config.py`의 API 키/시크릿 외부 노출 금지
- `static/uploads/` 파일 무단 삭제 금지 (사용자 사진)
- `start.bat` 직접 실행 금지 (서버 이중 실행 위험)
- STATUS.md 임의 삭제 또는 초기화 금지

---

## 운영 정책 (비즈니스 규칙)

- 호스트 참가비: 4명 이하 무료, 초과 인원 × 10,000원
- 유효 모임: 3인 이상 참석 시만 집계
- 호스트 자격: visit_count >= 3
- owner 이메일: skb.yunho.im@gmail.com
- 관리자 PIN: config.py ADMIN_PIN 참조

---

## 주요 참조

- Notion 허브: https://www.notion.so/340eff09d94281e1b31dd190cfab0fef
- 운영 URL: https://ns.ntable.kr
- 랜딩 URL: https://ntable.kr
- 문의: contact@ntable.kr
