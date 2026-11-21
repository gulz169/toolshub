/* URL Parser */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function run() {
    var o = $("out"), st = $("status"); st.textContent = "";
    try {
      var u = new URL($("u").value.trim()), rows = [["Protocol", u.protocol], ["Host", u.hostname], ["Port", u.port || "-"], ["Path", u.pathname], ["Hash", u.hash || "-"]];
      u.searchParams.forEach(function (v, k) { rows.push(["? " + k, v]); });
      o.innerHTML = '<table style="width:100%;border-collapse:collapse" dir="ltr">' + rows.map(function (r) { return '<tr style="border-top:1px solid rgba(255,255,255,.1)"><td style="padding:8px;opacity:.7">' + esc(r[0]) + '</td><td style="padding:8px;word-break:break-all">' + esc(r[1]) + "</td></tr>"; }).join("") + "</table>";
    } catch (e) { o.innerHTML = ""; if ($("u").value) { st.className = "status err"; st.textContent = t("Not a valid URL", "یہ درست URL نہیں"); } }
  }
  $("u").addEventListener("input", run); run();
})();
