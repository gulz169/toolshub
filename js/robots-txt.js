/* Robots.txt Generator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var o = ["User-agent: *"];
    if ($("m").value === "d") o.push("Disallow: /");
    else { var ds = $("ds").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean); if (ds.length) ds.forEach(function (p) { o.push("Disallow: " + p); }); else o.push("Disallow:"); }
    if ($("sm").value.trim()) o.push("", "Sitemap: " + $("sm").value.trim());
    $("o").value = o.join("\n");
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); }; run();
})();
