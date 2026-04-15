# ntable PLAN.md

> 마지막 업데이트: 2026-04-13 (완료 항목 정리)
> STATUS.md와 함께 관리. 개발 우선순위 및 다음 액션 정리.
> 프로젝트 경로: C:\Users\quite\Documents\ntable\

---

## 🔴 지금 당장 (다음 모임 전)

| 항목 | 유형 | 비고 |
|------|------|------|
| **통신판매업 신고** | 법무 | 관할 구청 방문. 결제 받기 전 법적 필수 |
| **통신판매업 등록번호 노출** | 개발 | ntable.kr footer + privacy.html + terms.html + 공정위 링크 |
| **SENS 발신번호 승인 확인** | 운영 | 01064518665 승인 완료 시 SMS 자동 발송 시작 |
| **DB 백업 자동화** | 개발 | onetable.db 구글드라이브 자동 업로드 스크립트 |
| **venues.name DB 수정 확인** | 운영 | `남산원테이블` → `남산` (디스코드 메시지 `[남산원테이블엔테이블]` 오표기 원인) |

---

## 🟠 코드 반영 대기 중

> 개발 대화창에서 프롬프트 작성 완료. 실제 파일 반영 여부 확인 필요.

- [ ] 게스트 화면 호스트 소개 시 `(호스트)` 닉네임 표시 — guest.html
- [x] `/api/host/profile` 권한 완화 (게스트도 접근 가능) — 완료
- [x] 로그인 버튼 뒤로가기 고착 — pageshow + resetLoginBtns() 완료

---

## 🟠 단기 개발 (Phase 1 마무리)

### 미착수 개발
- [ ] 질문 호스트 직접 추가/수정 기능 (`custom_questions` 테이블 활용)
- [ ] 모임 종료 버튼 UX 정리 (host.html sp3)
- [ ] `@slug` 연애 성향 결과 표시 (`member_results` 완성됨, `result.html` 연동 검토)

### 운영/법무
- [ ] 모임 진행 체크리스트 작성 (당일 운영 실수 방지)
- [ ] 호스트 매뉴얼 작성 (베타 호스트 모집 전 필수)
- [ ] 상표 등록 "엔테이블" (모임 5회 이후)

---

## 🟡 중기 (Phase 2 — 모임 5회 이후)

### 호스트 시스템
- [ ] `members.role`에서 host 삭제 → guest/owner만 유지
- [ ] guest.html 대기 화면 "내 모임 열기" 버튼 (`visit_count >= 3`)
- [ ] `/host/new` 모임 개설 폼 (날짜/시간/장소/최대인원/성비)
- [ ] `/dashboard` 호스트 대시보드 (내 모임 목록 / 참가자 관리)
- [ ] `/subscribe` 플랜 선택 + 토스페이먼츠 결제

### 인프라
- [ ] 클라우드 마이그레이션 (로컬 PC → Railway/GCP)
- [x] ntable.kr → Cloudflare Workers 이전 완료 (landing/ 폴더, wrangler.toml)

---

## 🟢 장기 (Phase 3 — 멤버 100명, 매출 발생 후)

- [ ] 토스페이먼츠 참가비 중개 (개인사업자)
- [ ] `apply.html` 게스트 모임 신청 폼
- [ ] 성비 자동 확정 로직 (초과 시 대기)
- [ ] 카카오 알림톡 결제 확정 알림
- [ ] `confirm.html` 결제 완료 안내

---

## ⏳ 초장기 (Phase 4 — 1년 이후)

- [ ] 그룹핑 host.html UI (Enterprise, `tables` 테이블 기반)
- [ ] 커스텀 질문 (`custom_questions` 테이블)
- [ ] 결과 리포트 PDF 자동 생성
- [ ] 화이트라벨 (`venues` 테이블 `theme_color`/`logo_url`)
- [ ] AI 매칭 고도화 (투표 이력 기반)
- [ ] 게스트 성향 분석 리포트 (유료 판매)
- [ ] 다중 지점 도메인 분기 (강남/광화문/여의도)
- [ ] B2B 기업 팀빌딩 상품
- [ ] 해외 진출 (일본)

---

## 📋 보류 항목

| 항목 | 이유 |
|------|------|
| `public.html` 도메인 변경 (`ns.ntable.kr` → `ntable.kr`) | ntable.kr 터널 안정화 후 진행 |
| `subscriptions` 테이블 활성화 | 종량제 전환으로 우선순위 낮아짐. 게스트 프리미엄 멤버십 필요 시 재검토 |

---

## 🔗 참고 링크

- STATUS.md: 구현 완료 기능 전체 목록
- Notion 허브: https://www.notion.so/340eff09d94281e1b31dd190cfab0fef
- 진행중: https://www.notion.so/340eff09d942816884e8f00f34ecb4ee
- 백로그: https://www.notion.so/340eff09d94281ab9241f93575f01a3f
- 인프라/TODO: https://www.notion.so/340eff09d942811fa450fe31434df1b6
