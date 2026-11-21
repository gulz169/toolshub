/* Speed, Distance & Time */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var s = $("s").value, d = $("d").value, tm = $("tm").value, e = [s, d, tm].filter(function (x) { return x === ""; }).length, r = "-";
    if (e === 1) {
      if (s === "" && +tm) r = t("Speed: ", "رفتار: ") + f(d / tm) + " km/h";
      else if (d === "") r = t("Distance: ", "فاصلہ: ") + f(s * tm) + " km";
      else if (tm === "" && +s) { var h = d / s; r = t("Time: ", "وقت: ") + f(h) + " h (" + Math.floor(h) + "h " + Math.round((h % 1) * 60) + "m)"; }
    }
    $("r").textContent = r;
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); run();
})();
