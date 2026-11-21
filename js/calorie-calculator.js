/* Calorie & BMR Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var b = 10 * +$("wt").value + 6.25 * +$("ht").value - 5 * +$("ag").value + ($("sx").value === "m" ? 5 : -161), m = b * +$("ac").value;
    $("bmr").textContent = f(b, 0); $("mt").textContent = f(m, 0); $("lo").textContent = f(m - 500, 0); $("ga").textContent = f(m + 500, 0);
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); run();
})();
