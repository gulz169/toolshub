/* Reverse Text */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
$("i").value = "Hello World";
  function run() {
    var s = $("i").value, m = $("m").value;
    $("o").value = m === "c" ? Array.from(s).reverse().join("") : m === "w" ? s.split("\n").map(function (l) { return l.split(/\s+/).reverse().join(" "); }).join("\n") : s.split("\n").reverse().join("\n");
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); }; run();
})();
