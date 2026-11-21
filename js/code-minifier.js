/* CSS & HTML Minifier */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var s = $("i").value, o;
    if ($("m").value === "css") o = s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();
    else o = s.replace(/<!--(?!\[if)[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
    $("o").value = o; $("sv").textContent = s.length ? Math.max(0, Math.round((1 - o.length / s.length) * 100)) + "%  (" + (s.length - o.length) + " B)" : "-";
  }
  $("i").addEventListener("input", run); $("m").onchange = run;
  $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); };
})();
