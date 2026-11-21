/* WhatsApp Link Generator - wa.me */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function build() {
    var cc = $("cc").value, n = $("num").value.replace(/[^\d+]/g, "");
    if (n[0] === "+") n = n.slice(1); else { if (n.slice(0, 2) === "00") n = n.slice(2); else { n = n.replace(/^0+/, ""); if (n.indexOf(cc) !== 0 || n.length <= 10) n = cc + n; } }
    var ok = n.length >= 8 && n.length <= 15, m = $("msg").value.trim();
    var url = ok ? "https://wa.me/" + n + (m ? "?text=" + encodeURIComponent(m) : "") : "";
    $("link").value = url; $("open").href = url || "#"; $("open").style.opacity = ok ? 1 : .5;
    $("status").className = "status"; $("status").textContent = ($("num").value && !ok) ? ToolsHub.t("Check the phone number.", "فون نمبر چیک کریں۔") : "";
  }
  ["cc", "num", "msg"].forEach(function (id) { $(id).addEventListener("input", build); });
  $("copyBtn").addEventListener("click", function () { if ($("link").value) ToolsHub.copy($("link").value, function () { $("status").className = "status ok"; $("status").textContent = ToolsHub.t("Copied!", "کاپی ہو گیا!"); }); });
  $("open").addEventListener("click", function (e) { if (!$("link").value) e.preventDefault(); });
  build();
})();
