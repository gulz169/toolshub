/* Electricity Cost Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var kd = +$("w").value * +$("h").value * (+$("n").value || 1) / 1000, p = +$("p").value;
    $("kd").textContent = f(kd); $("km").textContent = f(kd * 30); $("cd").textContent = f(kd * p); $("cm").textContent = f(kd * p * 30, 0);
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); run();
})();
