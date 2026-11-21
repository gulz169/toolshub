/* Reading Time Estimator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function fm(m) { return m < 1 ? "< 1 min" : Math.floor(m) + " min " + Math.round((m % 1) * 60) + " s"; }
  function run() { var w = ($("i").value.trim().match(/\S+/g) || []).length; $("w").textContent = w; $("rt").textContent = w ? fm(w / 220) : "-"; $("st").textContent = w ? fm(w / 140) : "-"; }
  $("i").addEventListener("input", run); run();
})();
