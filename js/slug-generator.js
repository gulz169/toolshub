/* Slug Generator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var sep = $("s").value;
    $("o").value = $("i").value.split("\n").map(function (l) {
      return l.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s_-]+/g, "").trim().replace(/[\s_-]+/g, sep);
    }).join("\n");
  }
  $("i").value = "My First Blog Post!\nBest Tools in 2026";
  $("i").addEventListener("input", run); $("s").onchange = run;
  $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); };
  run();
})();
