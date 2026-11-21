/* Age Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var dob = $("dob"), asof = $("asof"), out = $("out"), statusEl = $("status");

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parse(v) { var p = v.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function days(a, b) { return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000); }

  function calc() {
    statusEl.textContent = ""; statusEl.className = "status";
    if (!dob.value || !asof.value) { out.hidden = true; return; }
    var b = parse(dob.value), t = parse(asof.value);
    if (b > t) {
      out.hidden = true;
      statusEl.textContent = ToolsHub.t("Date of birth must be before the other date.", "تاریخ پیدائش دوسری تاریخ سے پہلے ہونی چاہیے۔");
      statusEl.className = "status err"; return;
    }
    var y = t.getFullYear() - b.getFullYear(), m = t.getMonth() - b.getMonth(), d = t.getDate() - b.getDate();
    if (d < 0) { m--; d += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    var next = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    if (next < t) next = new Date(t.getFullYear() + 1, b.getMonth(), b.getDate());
    $("y").textContent = y; $("m").textContent = m; $("d").textContent = d;
    $("td").textContent = days(b, t).toLocaleString();
    $("nb").textContent = days(t, next);
    out.hidden = false;
  }

  asof.value = iso(new Date());
  dob.max = asof.value;
  dob.addEventListener("input", calc);
  asof.addEventListener("input", calc);
})();
