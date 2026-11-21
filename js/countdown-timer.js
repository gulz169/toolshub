/* Countdown to a Date */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
var d0 = new Date(Date.now() + 30 * 864e5); d0.setHours(0, 0, 0, 0); d0.setMinutes(d0.getMinutes() - d0.getTimezoneOffset()); $("dt").value = d0.toISOString().slice(0, 16);
  function run() {
    var ms = new Date($("dt").value) - Date.now(); if (isNaN(ms)) return; var neg = ms < 0; ms = Math.abs(ms);
    $("d").textContent = Math.floor(ms / 864e5); $("h").textContent = Math.floor(ms / 36e5) % 24; $("m").textContent = Math.floor(ms / 6e4) % 60; $("s").textContent = Math.floor(ms / 1e3) % 60;
    $("status").textContent = neg ? t("This date has passed", "یہ تاریخ گزر چکی ہے") : "";
  }
  $("dt").addEventListener("input", run); setInterval(run, 1000); run();
})();
