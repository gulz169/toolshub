/* Time Zone Converter - Intl based */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var ZONES = [["Asia/Karachi", "Pakistan (Karachi)", "پاکستان (کراچی)"], ["Asia/Dubai", "UAE (Dubai)", "امارات (دبئی)"], ["Asia/Riyadh", "Saudi Arabia (Riyadh)", "سعودی عرب (ریاض)"], ["Europe/Istanbul", "Turkey (Istanbul)", "ترکی (استنبول)"], ["Europe/London", "UK (London)", "برطانیہ (لندن)"], ["Europe/Berlin", "Germany (Berlin)", "جرمنی (برلن)"], ["America/New_York", "USA (New York)", "امریکہ (نیو یارک)"], ["America/Chicago", "USA (Chicago)", "امریکہ (شکاگو)"], ["America/Los_Angeles", "USA (Los Angeles)", "امریکہ (لاس اینجلس)"], ["America/Toronto", "Canada (Toronto)", "کینیڈا (ٹورنٹو)"], ["Asia/Kuala_Lumpur", "Malaysia (Kuala Lumpur)", "ملائیشیا (کوالالمپور)"], ["Asia/Tokyo", "Japan (Tokyo)", "جاپان (ٹوکیو)"], ["Australia/Sydney", "Australia (Sydney)", "آسٹریلیا (سڈنی)"]];
  ZONES.forEach(function (z) { var o = document.createElement("option"); o.value = z[0]; o.textContent = z[1]; $("src").appendChild(o); });

  function parts(ms, zone) {
    var r = {}; new Intl.DateTimeFormat("en-US", { timeZone: zone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).formatToParts(new Date(ms)).forEach(function (x) { r[x.type] = +x.value; });
    return r;
  }
  function offset(ms, zone) { var q = parts(ms, zone); return Date.UTC(q.year, q.month - 1, q.day, q.hour, q.minute, q.second) - Math.floor(ms / 1000) * 1000; }
  function toUtc(local, zone) {
    var m = /^(\d+)-(\d+)-(\d+)T(\d+):(\d+)/.exec(local); if (!m) return NaN;
    var guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]), u = guess - offset(guess, zone);
    return guess - offset(u, zone);
  }
  function render() {
    var utc = toUtc($("dt").value, $("src").value), tb = $("tbl"); tb.innerHTML = "";
    if (isNaN(utc)) return;
    var loc = ToolsHub.t("en-GB", "ur-PK-u-nu-latn");
    ZONES.forEach(function (z) {
      var tr = document.createElement("tr"); if (z[0] === $("src").value) tr.className = "me";
      var off = offset(utc, z[0]) / 60000, sign = off < 0 ? "-" : "+", ao = Math.abs(off), gmt = "GMT" + sign + Math.floor(ao / 60) + (ao % 60 ? ":" + ("0" + ao % 60).slice(-2) : "");
      var time = new Intl.DateTimeFormat("en-GB", { timeZone: z[0], hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(utc);
      var date = new Intl.DateTimeFormat(loc, { timeZone: z[0], weekday: "short", day: "numeric", month: "short" }).format(utc);
      [ToolsHub.t(z[1], z[2]), time, date, gmt].forEach(function (t, i) { var td = document.createElement("td"); td.textContent = t; if (i === 1) td.style.fontWeight = "700"; tr.appendChild(td); });
      tb.appendChild(tr);
    });
  }
  function now() { var q = parts(Date.now(), $("src").value), p = function (n) { return ("0" + n).slice(-2); }; $("dt").value = q.year + "-" + p(q.month) + "-" + p(q.day) + "T" + p(q.hour) + ":" + p(q.minute); render(); }
  $("src").value = "Asia/Karachi";
  ["dt", "src"].forEach(function (id) { $(id).addEventListener("input", render); });
  $("now").addEventListener("click", now);
  document.addEventListener("langchange", render);
  now();
})();
