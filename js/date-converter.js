/* Hijri <-> Gregorian converter using the browser's Intl calendars */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var MEN = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Shaban", "Ramadan", "Shawwal", "Dhul Qadah", "Dhul Hijjah"];
  var MUR = ["محرم", "صفر", "ربیع الاول", "ربیع الثانی", "جمادی الاول", "جمادی الثانی", "رجب", "شعبان", "رمضان", "شوال", "ذی القعدہ", "ذی الحجہ"];
  var DAY = 86400000;

  MEN.forEach(function (n, i) { var o = document.createElement("option"); o.value = i + 1; o.textContent = (i + 1) + " - " + n + " / " + MUR[i]; $("hm").appendChild(o); });

  function hijri(ms) {
    var p = new Intl.DateTimeFormat("en-u-ca-" + $("cal").value + "-nu-latn", { day: "numeric", month: "numeric", year: "numeric", timeZone: "UTC" }).formatToParts(new Date(ms)), r = {};
    p.forEach(function (x) { r[x.type] = parseInt(x.value, 10); });
    return { d: r.day, m: r.month, y: r.year };
  }
  function adj() { return parseInt($("adj").value, 10) * DAY; }
  function fmtG(ms, loc) { return new Intl.DateTimeFormat(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(ms)); }
  function iso(ms) { return new Date(ms).toISOString().slice(0, 10); }

  function g2h() {
    var v = $("g").value; if (!v) { $("gOut").textContent = ""; return; }
    var p = v.split("-"), ms = Date.UTC(+p[0], +p[1] - 1, +p[2], 12), h;
    try { h = hijri(ms + adj()); } catch (e) { $("gOut").textContent = ToolsHub.t("Not supported in this browser.", "اس براؤزر میں سپورٹ نہیں ہے۔"); return; }
    $("gOut").innerHTML = "";
    [h.d + " " + MEN[h.m - 1] + " " + h.y + " AH", h.d + " " + MUR[h.m - 1] + " " + h.y + " ھ"].forEach(function (t) {
      var d = document.createElement("div"); d.textContent = t; $("gOut").appendChild(d);
    });
  }

  function h2g() {
    var d = +$("hd").value, m = +$("hm").value, y = +$("hy").value, out = $("hOut");
    if (!d || !y) { out.textContent = ""; return; }
    var start = Date.UTC(Math.round(y * 0.970224 + 621.57) - 1, 0, 1, 12), found = null;
    for (var i = 0; i < 800 && found === null; i++) {
      var ms = start + i * DAY, h = hijri(ms + adj());
      if (h.y === y && h.m === m && h.d === d) found = ms;
    }
    out.innerHTML = "";
    if (found === null) { out.textContent = ToolsHub.t("This Hijri date does not exist.", "یہ ہجری تاریخ موجود نہیں۔"); return; }
    [fmtG(found, "en-GB"), fmtG(found, "ur-PK-u-nu-latn")].forEach(function (t) { var x = document.createElement("div"); x.textContent = t; out.appendChild(x); });
    $("g").dataset.last = iso(found);
  }

  function all() { g2h(); h2g(); }
  ["g"].forEach(function (id) { $(id).addEventListener("input", g2h); });
  ["hd", "hm", "hy"].forEach(function (id) { $(id).addEventListener("input", h2g); });
  ["cal", "adj"].forEach(function (id) { $(id).addEventListener("change", all); });

  var now = new Date(); $("g").value = iso(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12));
  var h0 = hijri(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12));
  $("hd").value = h0.d; $("hm").value = h0.m; $("hy").value = h0.y;
  all();
})();
