/* Add or Subtract Days from a Date */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
$("st").value = new Date().toISOString().slice(0, 10);
  function run() {
    var p = $("st").value.split("-"); if (p.length < 3) return;
    var d = new Date(+p[0] + (+$("yy").value || 0), +p[1] - 1 + (+$("mm").value || 0), +p[2] + (+$("dd").value || 0));
    $("r").textContent = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    $("wd").textContent = d.toLocaleDateString(undefined, { weekday: "long" });
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); run();
})();
