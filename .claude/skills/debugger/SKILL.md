# debugger 스킬

## 개요

ntable 프로젝트의 버그 재현, 원인 분석, 자동 수정 루프를 담당하는 스킬.
"디버깅해줘", "오류 고쳐줘", "왜 안 돼?" 같은 요청 시 이 스킬을 로드한다.

---

## 디버깅 프로세스

### 1단계: 증상 파악
- 어떤 화면/기능에서 발생했는지 확인
- 오류 메시지 전문 수집
- 재현 조건 파악 (항상 발생? 특정 상황에서만?)

### 2단계: 로그 확인

**서버 로그 위치:**
```
uvicorn 실행 터미널 출력 확인
또는 서버 시작 시 로그 파일 지정 시 해당 경로
```

**WebSocket 로그 확인:**
```python
# ws.py 내 print 로그 확인
# 브라우저 개발자도구 → Console 탭
# 브라우저 개발자도구 → Network 탭 → WS 필터
```

**DB 상태 확인 쿼리:**
```python
# Python 실행으로 DB 직접 조회
import sqlite3
conn = sqlite3.connect(r'C:\Users\quite\Documents\ntable\onetable.db')
conn.row_factory = sqlite3.Row
c = conn.cursor()

# 현재 방 상태 확인
c.execute("SELECT id, room_code, status, host_sub FROM rooms ORDER BY id DESC LIMIT 5")
print([dict(r) for r in c.fetchall()])

# 현재 참여자 확인
c.execute("SELECT nickname, gender, role FROM members ORDER BY last_visit DESC LIMIT 10")
print([dict(r) for r in c.fetchall()])

# room_state 확인
c.execute("SELECT room_id, updated_at, substr(state_json,1,200) FROM room_state")
print([dict(r) for r in c.fetchall()])

conn.close()
```

### 3단계: 원인 분석

**자주 발생하는 오류 패턴:**

| 증상 | 의심 위치 | 확인 방법 |
|------|----------|----------|
| 페이지 로딩 후 빈 화면 | JS 오류, API 실패 | 브라우저 Console 확인 |
| WebSocket 연결 안 됨 | ws.py, 서버 미실행 | Network 탭 WS 확인 |
| 로그인 후 무한 리다이렉트 | OAuth 콜백, 세션 | auth.py 로그 확인 |
| DB 관련 500 오류 | db.py 함수, 스키마 불일치 | 서버 터미널 traceback |
| 모바일에서만 오류 | 인앱브라우저 감지 로직 | guest.html UA 체크 |
| 버튼 클릭 무반응 | JS 이벤트, API 호출 실패 | Console + Network 확인 |
| SMS 미발송 | SENS 설정, 발신번호 | config.py SENS_SENDER |

### 4단계: 자동 수정 루프

```
오류 발생
    ↓
원인 코드 특정
    ↓
수정 적용
    ↓
Python import 테스트 (문법 오류 확인)
    python -c "import server; import db; import config"
    ↓
API 엔드포인트 확인
    python -c "from routers import auth, admin, pages, ws; print('OK')"
    ↓
실패 시 → 재수정 (최대 3회)
성공 시 → 사람에게 확인 요청
```

### 5단계: 에스컬레이션 조건

아래 경우는 자동 수정하지 않고 반드시 사람에게 확인:
- `onetable.db` 데이터 직접 수정이 필요한 경우
- OAuth 설정 변경이 필요한 경우
- Cloudflare Tunnel 설정 변경이 필요한 경우
- 운영 중 서버 재시작이 필요한 경우
- 원인을 3회 이상 수정해도 해결 안 되는 경우

---

## 빠른 진단 체크리스트

서버 관련:
```bash
# 서버 실행 중인지 확인
netstat -aon | findstr ":8000"

# Python import 테스트
cd C:\Users\quite\Documents\ntable
C:\Users\quite\AppData\Local\Python\pythoncore-3.14-64\python.exe -c "import server; print('OK')"
```

DB 관련:
```bash
# DB 파일 존재 확인
dir C:\Users\quite\Documents\ntable\onetable.db

# DB 용량 확인 (0이면 문제)
```

---

## 디버깅 결과 기록

버그 수정 완료 후 반드시 STATUS.md 미완성/불확실 섹션 업데이트:
```
- [x] 버그명: 증상 → 원인 → 해결 한 줄 요약
```
