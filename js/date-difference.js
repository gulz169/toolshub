/* Date difference and date add */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var DAY = 86400000;
  function p(v) { var a = v.split("-"); return new Date(Date.UTC(+a[0], +a[1] - 1, +a[2])); }
  function iso(d) { return d.toISOString().slice(0, 10); }
  function diff() {
    if (!$("d1").value || !$("d2").value) return;
    var a = p($("d1").value), b = p($("d2").value), sign = "";
    if (a > b) { var t = a; a = b; b = t; sign = "-"; }
    var y = b.getUTCFullYear() - a.getUTCFullYear(), m = b.getUTCMonth() - a.getUTCMonth(), d = b.getUTCDate() - a.getUTCDate();
    if (d < 0) { m--; d += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate(); }
    if (m < 0) { y--; m += 12; }
    var days = Math.round((b - a) / DAY), wd = 0;
    for (var i = 0; i < days; i++) { var w = new Date(a.getTime() + i * DAY).getUTCDay(); if (w !== 0 && w !== 6) wd++; }
    $("ymd").textContent = y + " / " + m + " / " + d; $("days").textContent = sign + days.toLocaleString(); $("weeks").textContent = (days / 7).toFixed(1); $("wd").textContent = wd.toLocaleString();
  }
  function add() {
    if (!$("d3").value) return;
    var r = new Date(p($("d3").value).getTime() + (+$("n").value || 0) * DAY);
    $("res").textContent = new Intl.DateTimeFormat(ToolsHub.t("en-GB", "ur-PK-u-nu-latn"), { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(r);
  }
  var now = new Date(), today = iso(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
  $("d1").value = today; $("d2").value = today; $("d3").value = today;
  ["d1", "d2"].forEach(function (id) { $(id).addEventListener("input", diff); });
  ["d3", "n"].forEach(function (id) { $(id).addEventListener("input", add); });
  document.addEventListener("langchange", add);
  diff(); add();
})();
