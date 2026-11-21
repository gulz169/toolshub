/* Regex Tester */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
$("tx").value = "Mail ali@site.com or sara@mail.com today.";
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function run() {
    var st = $("status"); st.className = "status"; st.textContent = "";
    var re; try { re = new RegExp($("p").value, $("fl").value.replace(/[^dgimsuy]/g, "")); } catch (e) { st.className = "status err"; st.textContent = e.message; return; }
    var s = $("tx").value, out = "", last = 0, c = 0, m;
    if (!$("p").value) { $("hl").textContent = s; $("cnt").textContent = 0; return; }
    var g = re.global ? re : new RegExp(re.source, re.flags + "g");
    while ((m = g.exec(s)) && c < 5000) {
      out += esc(s.slice(last, m.index)) + '<mark style="background:#a78bfa;color:#fff;border-radius:4px;padding:0 2px">' + esc(m[0]) + "</mark>";
      last = m.index + m[0].length; c++; if (!m[0].length) g.lastIndex++;
    }
    $("hl").innerHTML = out + esc(s.slice(last)); $("cnt").textContent = c;
    var rs = $("rs"); if ($("rp").value) { rs.style.display = "block"; rs.textContent = s.replace(re, $("rp").value); } else rs.style.display = "none";
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,textarea"), function (e) { e.addEventListener("input", run); }); run();
})();
