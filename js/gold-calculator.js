/* Gold Calculator (Tola, Masha, Ratti) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var g = +$("w").value * +$("u").value, k = +$("k").value / 24;
    $("g").textContent = f(g, 3); $("tl").textContent = f(g / 11.664, 4); $("pure").textContent = f(g * k, 3); $("val").textContent = f(g * k / 11.664 * +$("pr").value, 0);
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); run();
})();
