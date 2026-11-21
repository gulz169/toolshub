/* PX, REM & EM Converter */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var px = +$("px").value, b = +$("base").value || 16;
    $("rem").textContent = f(px / b, 4); $("pt").textContent = f(px * 0.75, 3); $("rp").textContent = f(+$("rv").value * b, 2);
  }
  Array.prototype.forEach.call(document.querySelectorAll("input"), function (e) { e.addEventListener("input", run); }); run();
})();
