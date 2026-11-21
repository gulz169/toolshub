/* Profit & Margin Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var c = +$("c").value, s = +$("s").value, tm = +$("tm").value;
    $("pf").textContent = f(s - c); $("mg").textContent = s ? f((s - c) / s * 100) + "%" : "-"; $("mk").textContent = c ? f((s - c) / c * 100) + "%" : "-";
    $("np").textContent = tm < 100 ? f(c / (1 - tm / 100)) : "-";
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); run();
})();
