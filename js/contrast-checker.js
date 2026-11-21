/* Color Contrast Checker */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function lum(h) { var c = [1, 3, 5].map(function (i) { var v = parseInt(h.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function run() {
    var a = lum($("fg").value), b = lum($("bg").value), r = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), ok = function (x) { return x ? "✅ Pass" : "❌ Fail"; };
    $("pv").style.color = $("fg").value; $("pv").style.background = $("bg").value;
    $("ra").textContent = r.toFixed(2) + ":1"; $("aa").textContent = ok(r >= 4.5); $("al").textContent = ok(r >= 3); $("aaa").textContent = ok(r >= 7);
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); run();
})();
