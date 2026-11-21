/* HTML Entity Encoder / Decoder */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
$("i").value = '<a href="x">Tom & Jerry</a>';
  function run() {
    var s = $("i").value;
    $("o").value = $("m").value === "e" ? s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }).replace(/[^\x00-\x7f]/g, function (c) { return "&#" + c.codePointAt(0) + ";"; }) : (new DOMParser().parseFromString(s, "text/html").documentElement.textContent || "");
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); }; run();
})();
