/* Average Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
$("i").value = "10, 20, 20, 35, 50";
  function run() {
    var a = ($("i").value.match(/-?\d+(\.\d+)?/g) || []).map(Number).sort(function (x, y) { return x - y; });
    var ids = ["n", "sum", "mean", "med", "mode", "min", "max", "rg"];
    if (!a.length) { ids.forEach(function (k) { $(k).textContent = "-"; }); return; }
    var s = a.reduce(function (x, y) { return x + y; }, 0), m = a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2;
    var cnt = {}, best = 0, modes = []; a.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; best = Math.max(best, cnt[v]); });
    Object.keys(cnt).forEach(function (k) { if (cnt[k] === best) modes.push(k); });
    $("n").textContent = a.length; $("sum").textContent = f(s, 4); $("mean").textContent = f(s / a.length, 4); $("med").textContent = f(m, 4);
    $("mode").textContent = best > 1 ? modes.slice(0, 5).join(", ") : "-"; $("min").textContent = f(a[0], 4); $("max").textContent = f(a[a.length - 1], 4); $("rg").textContent = f(a[a.length - 1] - a[0], 4);
  }
  $("i").addEventListener("input", run); run();
})();
