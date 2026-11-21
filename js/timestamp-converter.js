/* Unix Timestamp Converter */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function now() { $("now").textContent = Math.floor(Date.now() / 1000); }
  setInterval(now, 1000); now();
  $("ts").value = Math.floor(Date.now() / 1000);
  function fromTs() {
    var v = +$("ts").value; if (!v) { $("loc").textContent = $("utc").textContent = "-"; return; }
    var d = new Date(Math.abs(v) < 1e11 ? v * 1000 : v);
    $("loc").textContent = isNaN(d) ? "-" : d.toLocaleString(); $("utc").textContent = isNaN(d) ? "-" : d.toUTCString().replace("GMT", "UTC");
  }
  function fromDt() { var d = new Date($("dt").value); if (isNaN(d)) return; $("sec").textContent = Math.floor(d / 1000); $("ms").textContent = d.getTime(); }
  $("ts").addEventListener("input", fromTs); $("dt").addEventListener("input", fromDt);
  var d0 = new Date(); d0.setMinutes(d0.getMinutes() - d0.getTimezoneOffset()); $("dt").value = d0.toISOString().slice(0, 16);
  fromTs(); fromDt();
})();
