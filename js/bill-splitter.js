/* Bill Splitter */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function calc() {
    var b = +$("b").value, tp = +$("tp").value, p = Math.max(1, Math.floor(+$("pp").value) || 1), tip = b * tp / 100;
    $("tip").textContent = f(tip); $("tot").textContent = f(b + tip); $("each").textContent = f((b + tip) / p);
  }
  Array.prototype.forEach.call(document.querySelectorAll("input"), function (e) { e.addEventListener("input", calc); }); calc();
})();
