import sqlite3, secrets
from datetime import date

DB = 'onetable.db'
OWNER = 'skb.yunho.im@gmail.com'

conn = sqlite3.connect(DB)
c = conn.cursor()

c.execute('SELECT google_email, nickname, role FROM members')
print('=== 현재 회원 ===')
for m in c.fetchall():
    print(' ', m)

c.execute('SELECT google_sub FROM members WHERE google_email=?', (OWNER,))
row = c.fetchone()
owner_sub = row[0] if row else None
print('오너 sub:', owner_sub)

c.execute('DELETE FROM visits WHERE google_sub!=?', (owner_sub,))
c.execute('DELETE FROM room_state')
c.execute('DELETE FROM members WHERE google_sub!=?', (owner_sub,))
c.execute('UPDATE rooms SET status="closed"')

c.execute('SELECT id FROM venues ORDER BY id LIMIT 1')
v = c.fetchone()
if v:
    code = date.today().strftime('%Y%m%d') + secrets.token_hex(3).upper()
    c.execute("INSERT INTO rooms (venue_id,room_code,status) VALUES (?,?,'waiting')", (v[0], code))
    print('새 room:', code)

conn.commit()

c.execute('SELECT google_email, nickname, role FROM members')
print('=== 남은 회원 ===')
for m in c.fetchall():
    print(' ', m)

conn.close()
print('완료 - 서버 재시작 필요')