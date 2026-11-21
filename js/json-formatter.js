/* JSON Formatter & Validator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var txt = $("txt"), statusEl = $("status");

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function sortDeep(v) {
    if (Array.isArray(v)) return v.map(sortDeep);
    if (v && typeof v === "object") {
      var o = {};
      Object.keys(v).sort().forEach(function (k) { o[k] = sortDeep(v[k]); });
      return o;
    }
    return v;
  }

  // Small strict JSON scanner: returns the index of the first error, or -1 if valid
  function findError(src) {
    var i = 0, n = src.length;
    function ws() { while (i < n && " \t\n\r".indexOf(src[i]) !== -1) i++; }
    function str() {
      i++;
      while (i < n) {
        var c = src[i];
        if (c === '"') { i++; return true; }
        if (c === "\\") { i += (src[i + 1] === "u") ? 6 : 2; continue; }
        if (c < " ") return false;
        i++;
      }
      return false;
    }
    function val() {
      ws();
      var c = src[i];
      if (c === "{") {
        i++; ws();
        if (src[i] === "}") { i++; return true; }
        for (;;) {
          ws(); if (src[i] !== '"' || !str()) return false;
          ws(); if (src[i] !== ":") return false; i++;
          if (!val()) return false; ws();
          if (src[i] === ",") { i++; continue; }
          if (src[i] === "}") { i++; return true; }
          return false;
        }
      }
      if (c === "[") {
        i++; ws();
        if (src[i] === "]") { i++; return true; }
        for (;;) {
          if (!val()) return false; ws();
          if (src[i] === ",") { i++; continue; }
          if (src[i] === "]") { i++; return true; }
          return false;
        }
      }
      if (c === '"') return str();
      var m = /^(?:-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null)/.exec(src.slice(i));
      if (!m) return false;
      i += m[0].length; return true;
    }
    if (!val()) return i;
    ws();
    return i < n ? i : -1;
  }

  function errorPlace(e, src) {
    var pos = findError(src);
    if (pos < 0) {
      var m = /position (\d+)/i.exec(e.message);
      if (!m) return null;
      pos = +m[1];
    }
    var before = src.slice(0, pos).split("\n");
    return { line: before.length, col: before[before.length - 1].length + 1, pos: pos };
  }

  function parse() {
    var src = txt.value;
    if (!src.trim()) { setStatus(ToolsHub.t("Paste some JSON first.", "پہلے JSON پیسٹ کریں۔"), "err"); return undefined; }
    try { return JSON.parse(src); }
    catch (e) {
      var p = errorPlace(e, src), msg = ToolsHub.t("Invalid JSON", "JSON درست نہیں");
      if (p) {
        msg += ToolsHub.t(" - line ", " - لائن ") + p.line + ToolsHub.t(", column ", "، کالم ") + p.col;
        if (p.pos != null) { txt.focus(); txt.setSelectionRange(p.pos, Math.min(p.pos + 1, src.length)); }
      }
      setStatus(msg + "\n" + e.message, "err");
      statusEl.style.whiteSpace = "pre-wrap"; statusEl.style.direction = "ltr";
      return undefined;
    }
  }

  function indentVal() { var v = $("indent").value; return v === "tab" ? "\t" : parseInt(v, 10); }

  function run(mode) {
    statusEl.style.whiteSpace = ""; statusEl.style.direction = "";
    var v = parse();
    if (v === undefined) return;
    if ($("sortKeys").checked) v = sortDeep(v);
    if (mode === "format") txt.value = JSON.stringify(v, null, indentVal());
    if (mode === "min") txt.value = JSON.stringify(v);
    setStatus(mode === "val" ? ToolsHub.t("Valid JSON ✓", "JSON درست ہے ✓") :
      ToolsHub.t("Done ✓ ", "ہو گیا ✓ ") + ToolsHub.formatSize(new Blob([txt.value]).size), "ok");
  }

  $("fmtBtn").addEventListener("click", function () { run("format"); });
  $("minBtn").addEventListener("click", function () { run("min"); });
  $("valBtn").addEventListener("click", function () { run("val"); });
  $("clearBtn").addEventListener("click", function () { txt.value = ""; setStatus(""); txt.focus(); });
  $("dlBtn").addEventListener("click", function () {
    if (txt.value) ToolsHub.download(new Blob([txt.value], { type: "application/json" }), "data.json");
  });
  $("copyBtn").addEventListener("click", function () {
    if (!txt.value) return;
    var done = function () { setStatus(ToolsHub.t("Copied!", "کاپی ہو گیا!"), "ok"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt.value).then(done, function () { txt.select(); document.execCommand("copy"); done(); });
    } else { txt.select(); document.execCommand("copy"); done(); }
  });
})();
