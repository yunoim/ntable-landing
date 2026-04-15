# security 스킬

## 개요

ntable 프로젝트의 보안 취약점 점검을 담당하는 스킬.
"보안 점검해줘", "취약점 있어?", "배포 전 보안 확인" 요청 시 이 스킬을 로드한다.

---

## 점검 항목

### 1. API 키 / 시크릿 노출 점검

**확인 대상:** `config.py`

```python
# 아래 항목들이 코드에 하드코딩되어 있는지 확인
GOOGLE_CLIENT_SECRET
KAKAO_CLIENT_SECRET
DISCORD_WEBHOOK
SENS_ACCESS_KEY
SENS_SECRET_KEY
```

**점검 기준:**
- 외부 저장소(GitHub 등)에 올라가면 안 되는 값들
- `.gitignore`에 `config.py` 포함 여부 확인
- 현재 config.py가 소스에 포함되어 있으므로 GitHub push 시 반드시 주의

**권고:**
```
현재: config.py에 하드코딩
이상적: .env 파일로 분리 + python-dotenv 사용
GitHub 올리기 전: config.py와 onetable.db를 .gitignore에 추가 필수
```

### 2. 인증 우회 가능성 점검

**확인 대상:** `routers/auth.py`, `routers/admin.py`, `routers/pages.py`

점검 항목:
- owner 전용 API에 role 검증이 있는지
- session 없이 API 직접 호출 가능한지
- host_sub 파라미터를 클라이언트에서 조작 가능한지

```python
# admin.py - owner 권한 검증 패턴 확인
# 아래처럼 role 체크가 있는지 확인
if member.get('role') not in HOST_ROLES:
    raise HTTPException(status_code=403)
```

**ADMIN_PIN 점검:**
- config.py의 ADMIN_PIN이 단순한지 확인
- PIN이 `/api/admin/pin-check` 서버 검증으로만 처리되는지 확인
- 클라이언트 JS에 PIN 값이 노출되지 않는지 확인

### 3. SQL Injection 취약점 점검

**확인 대상:** `db.py` 전체

```python
# 안전한 패턴 (파라미터 바인딩) ✅
c.execute("SELECT * FROM members WHERE google_sub = ?", (google_sub,))

# 위험한 패턴 (문자열 직접 삽입) ❌ 발견 시 즉시 수정
c.execute(f"SELECT * FROM members WHERE google_sub = '{google_sub}'")
```

db.py 전체적으로 파라미터 바인딩을 사용하고 있으나, 신규 추가 함수에 대해 반드시 확인.

### 4. 파일 업로드 취약점 점검

**확인 대상:** `config.py`의 `save_photo()`

점검 항목:
- 파일 크기 제한 (2MB) 적용 여부
- 이미지 외 다른 형식 업로드 차단 여부
- 업로드 경로 traversal 가능 여부

```python
# save_photo()에서 확인
if len(raw) > 2 * 1024 * 1024:
    raise ValueError("image_too_large")
```

### 5. 외부 노출 엔드포인트 점검

공개 접근 가능한 엔드포인트 (의도적 공개):
```
GET /              → 도메인별 분기 (landing / guest)
GET /@{slug}       → 공개 프로필
GET /api/stats     → 랜딩 통계
GET /api/result    → 모임 결과 카드
```

**점검 기준:**
- `/host` 접근 시 role 체크가 서버 사이드에서 이루어지는지
- `/api/admin/*` 엔드포인트가 인증 없이 접근 가능한지
- owner 전용 기능이 guest로 접근 가능한지

### 6. WebSocket 보안 점검

**확인 대상:** `routers/ws.py`

점검 항목:
- WebSocket 연결 시 세션 검증 여부
- 다른 room의 상태를 조작 가능한지
- chat_send 시 발신자 위조 가능한지
- room_code 추측으로 다른 방 접근 가능한지

### 7. 개인정보 노출 점검

점검 항목:
- `google_sub`, `google_email` 등 민감 정보가 클라이언트에 불필요하게 노출되는지
- `/static/uploads/` 사진이 인증 없이 외부 접근 가능한지
- Discord Webhook URL이 클라이언트 JS에 노출되는지
- 전화번호(`phone`)가 다른 사용자에게 노출되는지

---

## 점검 결과 보고 형식

```
## 보안 점검 결과 — {날짜}

### 🔴 위험 (즉시 수정 필요)
- 항목: 설명

### 🟡 경고 (개선 권고)
- 항목: 설명

### 🟢 양호
- 항목: 확인 완료
```

---

## 에스컬레이션 조건

아래 취약점 발견 시 자동 수정하지 않고 반드시 사람에게 보고:
- API 키/시크릿 외부 노출 확인 시
- 인증 우회 가능한 엔드포인트 발견 시
- SQL Injection 취약점 발견 시
- 실제 사용자 데이터 접근 가능한 취약점 발견 시

---

## GitHub 배포 전 필수 체크리스트

```
- [ ] config.py를 .gitignore에 추가했는가?
- [ ] .env.example 파일로 키 목록만 공유했는가?
- [ ] onetable.db를 .gitignore에 추가했는가?
- [ ] static/uploads/ 를 .gitignore에 추가했는가?
- [ ] ADMIN_PIN을 강화했는가?
- [ ] 모든 owner 전용 API에 role 검증이 있는가?
```
