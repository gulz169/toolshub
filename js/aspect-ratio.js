/* Aspect Ratio Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function g(a, b) { return b ? g(b, a % b) : a; }
  function calc() {
    var w = Math.round(+$("w").value), h = Math.round(+$("h").value);
    if (!(w > 0 && h > 0)) return;
    var d = g(w, h); $("ra").textContent = (w / d) + ":" + (h / d); $("dc").textContent = (w / h).toFixed(4);
    return w / h;
  }
  $("w").addEventListener("input", calc); $("h").addEventListener("input", calc);
  $("nw").addEventListener("input", function () { var r = calc(); if (r) $("nh").value = Math.round(+$("nw").value / r); });
  $("nh").addEventListener("input", function () { var r = calc(); if (r) $("nw").value = Math.round(+$("nh").value * r); });
  calc();
})();
