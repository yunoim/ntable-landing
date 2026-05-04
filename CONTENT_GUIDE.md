# 콘텐츠 편집 가이드

이 가이드는 **엔지니어가 아닌 사람이 랜딩페이지 카피를 직접 수정할 수 있도록** 작성되었습니다.

## 어디서 수정하나

모든 카피, 숫자, 링크, 이모지는 `src/data/ko/` 폴더의 **YAML** 파일과 `privacy.md`, `terms.md`에 있습니다.

| 파일 | 섹션 |
|------|------|
| `meta.yml` | `<head>` 안의 제목·설명·OG·Twitter 공유 정보 |
| `nav.yml` | 상단 내비게이션 + 모바일 메뉴 |
| `hero.yml` | 메인 타이틀·서브타이틀·CTA 버튼·오른쪽 목업 (목업 클릭 시 이동 URL은 `mockup.cta.href`) |
| `stats.yml` | Phase 1 배지·라이브 위젯 설정·통계 4카드 |
| `problems.yml` | 3개 문제 카드 |
| `solutions.yml` | 4단계 솔루션 + 하단 CTA |
| `how.yml` | 4 스텝 진행 장치 |
| `model.yml` | 비즈니스 모델 카드 + 5사 비교표 + 하단 CTA |
| `expansion.yml` | 5 팩 + 툴킷 로드맵 5 |
| `roadmap.yml` | Phase 1~4 |
| `contact.yml` | 문의 섹션 |
| `faq.yml` | FAQ 문답 |
| `footer.yml` | 푸터 |
| `privacy.md` | 개인정보처리방침 본문 (Markdown) |
| `terms.md` | 이용약관 본문 (Markdown) |

**컴포넌트(.astro) 파일은 건드리지 마세요.** 템플릿과 스타일은 엔지니어 영역입니다.

> 첫 방문 시 노출되는 풀스크린 브랜드 인트로(`BrandSplash.astro`)는 카피·타이밍 모두 컴포넌트 내부에 있습니다. 수정 필요 시 엔지니어에게 요청하세요.

---

## YAML 편집 규칙

### 1. 들여쓰기는 스페이스 2개

```yaml
cta:
  label: 모임 열기        # 스페이스 2개
  href: https://app.ntable.kr
```

**탭 금지.** 탭이 섞이면 빌드가 깨집니다. VS Code를 쓰면 자동으로 스페이스로 변환됩니다.

### 2. 문자열에 `:` · `#` · `-` · `"` 가 있으면 따옴표로 감쌉니다

```yaml
# 괜찮음 (특수문자 없음)
title: 누구나 모임장이 되는 모임

# 따옴표 필요
title: "Q 3 / 5 · 실시간 투표"
subtitle: "모임장은 '다음' 버튼만 누르세요."
example: '😓 "지난번엔 그렇게 재밌었는데"'
```

작은따옴표 `'...'`를 쓰면 안쪽 내용을 글자 그대로 취급합니다. 내용에 `'`이 있으면 큰따옴표 `"..."`를 쓰세요.

### 3. 줄바꿈은 `\n` 또는 블록 문법

한 줄 안에서 줄바꿈을 표현하려면:

```yaml
# 방법 A: \n 를 문자열에 직접 (큰따옴표 필수)
title: "함께 만들어갈\n다음 챕터"
```

템플릿에서 자동으로 `<br>`로 바뀝니다.

### 4. 강조 체(italic `<em>`)는 `emphasis` 키로 분리

```yaml
title:
  prefix: 누구나
  emphasis: 모임장이 되는
  suffix: " 모임"
```

→ 렌더링: "누구나 *모임장이 되는* 모임"  
`emphasis`에 들어간 글자는 Cormorant Garamond italic + 골드 그라데이션으로 표시됩니다.

### 5. `_html` 접미사가 붙은 필드는 **HTML 태그**를 쓸 수 있습니다

```yaml
# faq.yml
items:
  - q: 모임에서 입력한 정보는 어떻게 되나요?
    a_html: '닉네임·사진·프로필은 <strong>모임 안에서만</strong> 쓰이고...'
```

`<strong>`, `<a href="...">` 같은 태그가 그대로 HTML로 나옵니다. **그 외 필드는 태그를 쓰면 그냥 글자로 보입니다.**

---

## 카드·배열 추가/삭제

배열은 `- `(대시 + 스페이스)로 시작하는 블록의 반복입니다.

### Problem 카드 추가

```yaml
# problems.yml
cards:
  - icon: '🤹'
    title: 모임장 의존
    body: ...
    example: ...
  - icon: '🤫'
    title: 말 없는 사람은 늘 외곽
    body: ...
    example: ...
  # ↓ 새 카드 추가 — 들여쓰기, 키 이름 똑같이
  - icon: '✨'
    title: 새 카드 제목
    body: 본문
    example: '😓 "예시 문장"'
```

**카드 삭제**는 해당 `-` 블록 통째로 지웁니다.

### FAQ 문항 추가

```yaml
# faq.yml
items:
  - q: 기존 질문
    a_html: 기존 답변
  - q: 새 질문
    a_html: 새 답변
```

### Expansion 팩 추가

```yaml
# expansion.yml
packs:
  - emoji: '👫'
    title: 둘이서
    body: 2인 전용
    status: 지금 사용 가능
  - emoji: '🎲'     # 새 팩
    title: 보드게임
    body: 4~6인
    status: 예정
```

---

## 링크·이미지 경로

- **외부 링크**: 전체 URL (`https://app.ntable.kr`)
- **내부 페이지**: `/privacy.html`, `/terms.html` — `.html` 확장자 유지
- **앵커 이동**: `#hero`, `#faq` — 섹션 id
- **이메일**: `mailto:` 프리픽스 없이 주소만 적으면 됨 (`connect@ntable.kr`)
- **OG 이미지 등 공유 이미지**: `public/` 폴더에 저장, URL은 `/og-image.png` 형태 (PNG 공식. SVG 원본은 `og-image.svg`로 보존, 카피 변경 시 둘 다 갱신)

---

## 법적 문서 (Markdown)

`privacy.md`, `terms.md`는 **Markdown** 입니다. YAML이 아닙니다.

### 목차 추가

```markdown
---
toc:
  - { anchor: s1, label: 수집하는 개인정보 항목 }
  - { anchor: s11, label: 새 조항 }   # 추가
---
```

### 새 조항 추가

```markdown
<h2 id="s11" data-num="11">새 조항</h2>

본문 내용이 여기에 들어갑니다.

- 리스트 항목
- 리스트 항목

| 항목 | 내용 |
|------|------|
| 셀 1 | 셀 2 |
```

`id="sN"`과 `data-num="NN"`은 **꼭 맞춰야** 목차 링크가 작동합니다.

### 강조 박스

```markdown
<div class="highlight-box">

박스 안에 들어갈 본문. 앞뒤로 빈 줄 필수.

</div>
```

---

## 변경 → 배포 흐름

```
YAML 편집 → PR 생성 → 리뷰 → main 브랜치 머지 → 자동 배포
```

1. **GitHub 웹에서 편집** (가장 빠른 방법)
   - 편집하려는 파일을 GitHub 웹에서 연다 (예: `src/data/ko/hero.yml`)
   - 연필 아이콘(Edit) 클릭
   - 수정 후 하단 "Propose changes" 누르면 PR이 열림
   - 팀원 리뷰 후 "Squash and merge"
   - main에 머지되는 순간 GitHub Actions가 자동 배포 (보통 1~2분)

2. **Notion ↔ GitHub 연동**
   - Notion 문서에서 `[파일명](GitHub URL)` 링크를 두면 한 번에 이동 가능
   - GitHub 웹에서 `.`(마침표) 키를 누르면 VS Code 웹 에디터가 열림 — 여러 파일 동시 편집에 편리

3. **로컬에서 편집 (엔지니어용)**
   ```bash
   git checkout -b copy/{설명}
   # YAML 수정
   npm run dev        # localhost:4321 에서 미리보기
   git add -A && git commit -m "copy: ..."
   git push -u origin copy/{설명}
   ```

---

## 분석 설정 (Plausible)

외부 `PUBLIC_PLAUSIBLE_DOMAIN` 환경변수가 설정되면 페이지 로드 시 Plausible 스크립트가 자동 주입됩니다.

**프로덕션 세팅 (한 번만):**
1. Cloudflare Dashboard → Workers & Pages → `ntable-landing` → Settings → Variables
2. 환경변수 추가: `PUBLIC_PLAUSIBLE_DOMAIN` = `ntable.kr`
3. 다음 배포부터 반영

자체 호스팅 Plausible을 쓴다면 `PUBLIC_PLAUSIBLE_SCRIPT_SRC`도 설정:
- `PUBLIC_PLAUSIBLE_SCRIPT_SRC` = `https://analytics.yourdomain/js/script.js`

**추적 이벤트**: 템플릿의 `data-event` 속성이 있는 모든 요소(CTA 버튼 등) 클릭 시 Plausible 사용자 정의 이벤트로 기록.

---

## 자주 발생하는 실수

| 증상 | 원인 | 고치는 법 |
|------|------|---------|
| 빌드 실패: `YAMLException: bad indentation` | 탭이 섞임 | 해당 라인의 탭을 스페이스 2개로 변경 |
| 빌드 실패: `YAMLException: can not read a block mapping entry` | 들여쓰기 불일치 | 같은 레벨의 키는 스페이스 개수를 맞춰야 함 |
| 빌드 실패: Zod validation error | 필수 필드 누락 또는 타입 오류 | 에러 메시지에서 필드 경로 확인 후 채우기 |
| 카피는 수정됐는데 사이트에 반영 안 됨 | 배포 대기 중 | GitHub Actions 탭에서 deploy 진행 확인 (보통 1~2분) |
| `<strong>`이 글자 그대로 보임 | `_html` 접미사 없는 필드에 HTML 씀 | 필드 이름을 `_html` 로 바꾸거나 HTML 빼기 |

---

## 도움이 필요하면

- 긴급: connect@ntable.kr
- 기술 질문: GitHub Issue 또는 Notion 허브 코멘트
