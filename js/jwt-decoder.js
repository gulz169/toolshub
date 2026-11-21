/* JWT Decoder */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function dec(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }))); }
  function run() {
    var st = $("status"); st.className = "status"; st.textContent = ""; $("h").value = $("p").value = ""; $("ex").textContent = "-";
    var p = $("i").value.trim().split("."); if (p.length < 2 || !p[0]) return;
    try { var h = dec(p[0]), b = dec(p[1]); $("h").value = JSON.stringify(h, null, 2); $("p").value = JSON.stringify(b, null, 2);
      if (b.exp) $("ex").textContent = new Date(b.exp * 1000).toLocaleString() + (b.exp * 1000 < Date.now() ? " (expired)" : "");
    } catch (e) { st.className = "status err"; st.textContent = t("Not a valid JWT", "یہ درست JWT نہیں"); }
  }
  $("i").addEventListener("input", run);
})();
