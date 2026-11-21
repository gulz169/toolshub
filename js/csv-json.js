/* CSV <-> JSON */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var inp = $("inp"), st = $("status");
  function setStatus(m, t) { st.textContent = m || ""; st.className = "status" + (t ? " " + t : ""); }
  function delim() { return $("delim").value === "\\t" ? "\t" : $("delim").value; }

  function parseCsv(s, d) {
    var rows = [], row = [], f = "", q = false;
    s = s.replace(/^﻿/, "");
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (q) { if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true;
      else if (c === d) { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && s[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
      else f += c;
    }
    if (f !== "" || row.length) { row.push(f); rows.push(row); }
    return rows.filter(function (r) { return r.length > 1 || r[0] !== ""; });
  }
  function conv(v) { return v !== "" && !isNaN(v) && /^-?\d+(\.\d+)?$/.test(v.trim()) && !/^0\d/.test(v.trim()) ? Number(v) : v; }

  $("toJson").addEventListener("click", function () {
    var rows = parseCsv(inp.value, delim());
    if (!rows.length) { setStatus(ToolsHub.t("Paste some CSV first.", "پہلے CSV پیسٹ کریں۔"), "err"); return; }
    var res;
    if ($("hdr").checked) {
      var h = rows[0].map(function (x, i) { return x.trim() || "column" + (i + 1); });
      res = rows.slice(1).map(function (r) { var o = {}; h.forEach(function (k, i) { o[k] = conv(r[i] == null ? "" : r[i]); }); return o; });
    } else res = rows.map(function (r) { return r.map(conv); });
    inp.value = JSON.stringify(res, null, 2); setStatus(res.length + ToolsHub.t(" rows converted.", " قطاریں تبدیل ہوئیں۔"), "ok");
  });
  $("toCsv").addEventListener("click", function () {
    var data; try { data = JSON.parse(inp.value); } catch (e) { setStatus(ToolsHub.t("This is not valid JSON.", "یہ درست JSON نہیں ہے۔"), "err"); return; }
    if (!Array.isArray(data)) { if (data && typeof data === "object") data = [data]; else { setStatus(ToolsHub.t("JSON must be a list of objects or rows.", "JSON اشیاء یا قطاروں کی فہرست ہونی چاہیے۔"), "err"); return; } }
    var d = delim(), keys = [], rows;
    var esc = function (v) { if (v == null) v = ""; if (typeof v === "object") v = JSON.stringify(v); v = String(v); return new RegExp('["\\n\\r' + (d === "\t" ? "\\t" : d) + ']').test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    if (data.length && !Array.isArray(data[0]) && typeof data[0] === "object") {
      data.forEach(function (o) { Object.keys(o || {}).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); }); });
      rows = [keys.map(esc).join(d)].concat(data.map(function (o) { return keys.map(function (k) { return esc((o || {})[k]); }).join(d); }));
    } else rows = data.map(function (r) { return (Array.isArray(r) ? r : [r]).map(esc).join(d); });
    inp.value = rows.join("\n"); setStatus(data.length + ToolsHub.t(" rows converted.", " قطاریں تبدیل ہوئیں۔"), "ok");
  });
  $("copyBtn").addEventListener("click", function () { ToolsHub.copy(inp.value, function () { setStatus(ToolsHub.t("Copied!", "کاپی ہو گیا!"), "ok"); }); });
  $("dlBtn").addEventListener("click", function () {
    var j = /^\s*[\[{]/.test(inp.value); if (inp.value) ToolsHub.download(new Blob(["﻿" + inp.value], { type: j ? "application/json" : "text/csv;charset=utf-8" }), j ? "data.json" : "data.csv");
  });
  $("clearBtn").addEventListener("click", function () { inp.value = ""; setStatus(""); });
})();
