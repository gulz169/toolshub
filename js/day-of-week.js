/* Day of the Week Finder */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
$("dt").value = "2000-01-01";
  function run() {
    var p = $("dt").value.split("-"); if (p.length < 3) return; var d = new Date(+p[0], +p[1] - 1, +p[2]), y = d.getFullYear();
    var doy = Math.round((d - new Date(y, 0, 1)) / 864e5) + 1, tt = new Date(Date.UTC(y, d.getMonth(), d.getDate())), dn = tt.getUTCDay() || 7; tt.setUTCDate(tt.getUTCDate() + 4 - dn);
    var wk = Math.ceil(((tt - Date.UTC(tt.getUTCFullYear(), 0, 1)) / 864e5 + 1) / 7);
    $("wd").textContent = d.toLocaleDateString(undefined, { weekday: "long" }); $("wk").textContent = wk; $("dy").textContent = doy; $("lp").textContent = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? "Yes" : "No";
  }
  $("dt").addEventListener("input", run); run();
})();
