/* Fuel Cost Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function calc() {
    var d = +$("d").value * +$("rt").value, k = +$("k").value, p = +$("pr").value, l = d / k;
    $("lit").textContent = f(l); $("cost").textContent = f(l * p, 0); $("pk").textContent = f(p / k);
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select"), function (e) { e.addEventListener("input", calc); }); calc();
})();
