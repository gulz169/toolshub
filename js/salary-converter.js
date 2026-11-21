/* Salary Converter */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
$("per").value = "m";
  function run() {
    var a = +$("a").value, hd = +$("hd").value || 8, dw = +$("dw").value || 5, y = hd * dw * 52, hy;
    var yearly = { h: a * y, d: a * dw * 52, w: a * 52, m: a * 12, y: a }[$("per").value];
    $("ph").textContent = f(yearly / y); $("pd").textContent = f(yearly / (dw * 52)); $("pw").textContent = f(yearly / 52); $("pm").textContent = f(yearly / 12); $("py").textContent = f(yearly);
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); run();
})();
