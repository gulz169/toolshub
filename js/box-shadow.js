/* CSS Box Shadow Generator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var h = $("c").value, r = parseInt(h.slice(1, 3), 16), g = parseInt(h.slice(3, 5), 16), b = parseInt(h.slice(5, 7), 16);
    var v = $("in").value + $("x").value + "px " + $("y").value + "px " + $("b").value + "px " + $("sp").value + "px rgba(" + r + ", " + g + ", " + b + ", " + (+$("op").value / 100) + ")";
    $("bx").style.boxShadow = v; $("o").value = "box-shadow: " + v + ";";
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); }; run();
})();
