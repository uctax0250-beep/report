const APP = "https:" + "//script.google.com/macros/s/AKfycbxMKgTgxIBiiADxzGp-1HrBDD132EjyS7Wm__ihDRz2i_uwUnhrGaupFCTf0folbsSHoQ/exec";
const KEY = new URLSearchParams(location.search).get("k") || "";
const api = body => fetch(APP, {method: "POST", credentials: "omit", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(body)}).then(r => r.json());
let SESS = {t: "", e: 0};
(function () {
  const app = document.getElementById("app"), back = document.getElementById("back"), LS = "uc_pin_" + KEY;
  const direct = () => location.replace(APP + location.search + location.hash);
  if (back) back.style.visibility = "hidden";
  app.innerHTML = '<p class="lk-wait">보고서를 여는 중이에요…</p>';
  if (!KEY) { app.innerHTML = '<p class="lk-wait">보고서를 찾을 수 없어요.<br>받으신 카카오톡 링크를 다시 눌러 주세요.</p>'; return; }
  let saved = null; try { saved = JSON.parse(localStorage.getItem(LS) || "null"); } catch (_) {}
  const open = r => { SESS = {t: r.st || "", e: r.se || 0}; if (back) back.style.visibility = ""; startApp(r.data); };
  const ui = msg => {
    app.innerHTML = '<section class="lk"><div class="lk-ico">🔒</div><h1>대표님 확인</h1><p class="lk-sub">보고서를 보시려면 대표님 <b>생년월일 6자리</b>를 입력해 주세요.</p>'
      + '<form id="lkf" autocomplete="off"><input id="lkp" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="예) 750315" aria-label="생년월일 6자리">'
      + '<label class="lk-rem"><input type="checkbox" id="lkr" checked> 이 기기에서 30일 동안 다시 묻지 않기</label>'
      + '<button type="submit" id="lkb">보고서 열기</button><p class="lk-msg" id="lkm" role="alert">' + (msg || "") + '</p></form>'
      + '<p class="lk-foot">생년월일은 확인에만 쓰이고 저장되지 않아요.<br>문의: 유창세무회계 담당자</p></section>';
    const f = document.getElementById("lkf"), p = document.getElementById("lkp"), b = document.getElementById("lkb"), m = document.getElementById("lkm");
    p.focus();
    f.addEventListener("submit", ev => {
      ev.preventDefault(); const pin = p.value.replace(/\D/g, "");
      if (pin.length !== 6) { m.textContent = "생년월일 6자리를 입력해 주세요."; return; }
      b.disabled = true; b.textContent = "확인 중…"; m.textContent = "";
      const rem = document.getElementById("lkr").checked;
      api({action: "unlock", k: KEY, pin: pin, remember: rem}).then(r => {
        if (r && r.ok) { if (rem && r.t) { try { localStorage.setItem(LS, JSON.stringify({t: r.t, e: r.e})); } catch (_) {} } open(r); }
        else { b.disabled = false; b.textContent = "보고서 열기"; p.value = ""; m.textContent = (r && r.msg) || "다시 시도해 주세요."; if (r && r.left === 0) b.disabled = true; }
      }).catch(() => { b.disabled = false; b.textContent = "보고서 열기"; m.textContent = "연결이 불안정해요. 다시 시도해 주세요."; });
    });
  };
  const ok = saved && saved.t && saved.e > Date.now();
  api({action: "open", k: KEY, t: ok ? saved.t : "", e: ok ? saved.e : 0}).then(r => {
    if (r && r.ok) open(r);
    else if (r && (r.locked || r.expired)) { if (r.expired) { try { localStorage.removeItem(LS); } catch (_) {} } ui(); }
    else app.innerHTML = '<p class="lk-wait">' + ((r && r.msg) || "보고서를 찾을 수 없어요.") + '<br>계속 안 열리면 유창세무회계로 연락해 주세요.</p>';
  }).catch(direct);
})();
