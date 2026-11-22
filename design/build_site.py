# 고객보고서_Index.html(구글용) → GitHub Pages용 index.html 생성
import re,sys
src=open('/home/claude/gas/Index.html',encoding='utf-8').read()
boot=open('/tmp/boot_remote.js',encoding='utf-8').read()
head_extra='''<meta name="robots" content="noindex, nofollow">
<title>월간 경영 보고서 · 유창세무회계</title>
<meta property="og:type" content="website">
<meta property="og:site_name" content="유창세무회계">
<meta property="og:title" content="월간 경영 보고서가 도착했어요">
<meta property="og:description" content="유창세무회계 · 매출·매입·인건비·부가세를 한눈에 확인하세요">
<meta property="og:image" content="https://uctax0250-beep.github.io/report/og5.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="icon.png">
'''
s=src.replace('<base target="_top">\n','',1)
s=s.replace('<meta name="viewport" content="width=device-width, initial-scale=1">\n','<meta name="viewport" content="width=device-width, initial-scale=1">\n'+head_extra,1)
i=s.index('const BOOT = '); j=s.index('function startApp(RAW) {')
s=s[:i]+boot+'\n'+s[j:]
a='''const send = (kind, file) => prep(file).then(d => new Promise((ok, no) => { if (!GS) { setTimeout(() => ok({ok: true}), 400); return; }
  google.script.run.withSuccessHandler(ok).withFailureHandler(no).uploadPhoto(RAW.k, kind, file.name, d, SESS.t, SESS.e); }));'''
assert a in s
s=s.replace(a,'''const send = (kind, file) => prep(file).then(d => api({action: "upload", k: RAW.k, kind: kind, name: file.name, data: d, t: SESS.t, e: SESS.e})).then(r => { if (!r || !r.ok) throw new Error((r && r.msg) || "fail"); return r; });''')
assert 'google.script.run' not in s and '<?' not in s
open(sys.argv[1],'w',encoding='utf-8').write(s)
print(len(s))
