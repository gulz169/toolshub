/* Data Auto-Arranger - clean, dedupe and sort CSV/Excel in the browser (SheetJS) */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var wb = null, baseName = "data", result = [];
  var dropzone = $("dropzone"), fileInput = $("fileInput"), work = $("work"),
      statusEl = $("status"), sheetSel = $("sheetSel"), sortCol = $("sortCol"),
      sortDir = $("sortDir"), tbl = $("tbl");
  var opts = ["optTrim", "optEmpty", "optDup"].map($);

  function setStatus(msg, type) {
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  function loadFile(f) {
    if (!f) return;
    if (!/\.(csv|xlsx|xls)$/i.test(f.name)) {
      setStatus(ToolsHub.t("Please choose a CSV or Excel file.", "براہ کرم CSV یا Excel فائل چنیں۔"), "err");
      return;
    }
    if (!window.XLSX) {
      setStatus(ToolsHub.t("Library failed to load. Check internet and refresh.",
        "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err");
      return;
    }
    var rd = new FileReader();
    rd.onload = function () {
      try {
        wb = XLSX.read(new Uint8Array(rd.result), { type: "array" });
        baseName = f.name.replace(/\.[^.]+$/, "");
        sheetSel.innerHTML = "";
        wb.SheetNames.forEach(function (n, i) {
          var o = document.createElement("option");
          o.value = i; o.textContent = n;
          sheetSel.appendChild(o);
        });
        fillColumns();
        work.hidden = false;
        setStatus("");
        process();
      } catch (e) {
        console.error(e);
        setStatus(ToolsHub.t("This file cannot be read.", "یہ فائل پڑھی نہیں جا سکی۔"), "err");
      }
    };
    rd.readAsArrayBuffer(f);
  }

  function rawRows() {
    var ws = wb.Sheets[wb.SheetNames[sheetSel.value || 0]];
    return XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: true });
  }

  function fillColumns() {
    var rows = rawRows();
    var head = rows[0] || [];
    sortCol.innerHTML = "";
    var none = document.createElement("option");
    none.value = "-1";
    none.textContent = ToolsHub.t("(no sorting)", "(ترتیب نہیں)");
    sortCol.appendChild(none);
    head.forEach(function (h, i) {
      var o = document.createElement("option");
      o.value = i; o.textContent = String(h) || ToolsHub.t("Column ", "کالم ") + (i + 1);
      sortCol.appendChild(o);
    });
  }

  function cmp(a, b) {
    var an = typeof a === "number" ? a : (a !== "" && !isNaN(a) ? Number(a) : null);
    var bn = typeof b === "number" ? b : (b !== "" && !isNaN(b) ? Number(b) : null);
    if (an !== null && bn !== null) return an - bn;
    if (a === "" && b !== "") return 1;   // empty cells go last
    if (b === "" && a !== "") return -1;
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
  }

  function process() {
    if (!wb) return;
    var rows = rawRows();
    if (!rows.length) { result = []; render(); return; }

    var trim = opts[0].checked, noEmpty = opts[1].checked, noDup = opts[2].checked;
    var head = rows[0], body = rows.slice(1);

    if (trim) {
      body = body.map(function (r) {
        return r.map(function (c) { return typeof c === "string" ? c.replace(/\s+/g, " ").trim() : c; });
      });
    }
    if (noEmpty) body = body.filter(function (r) { return r.some(function (c) { return c !== "" && c != null; }); });
    if (noDup) {
      var seen = {};
      body = body.filter(function (r) {
        var k = JSON.stringify(r.map(function (c) { return typeof c === "string" ? c.toLowerCase() : c; }));
        if (seen[k]) return false;
        seen[k] = 1; return true;
      });
    }
    var col = parseInt(sortCol.value, 10);
    if (col >= 0) {
      var dir = sortDir.value === "desc" ? -1 : 1;
      body = body.slice().sort(function (x, y) { return dir * cmp(x[col], y[col]); });
    }
    result = [head].concat(body);
    render(rows.length - 1 - body.length);
  }

  function render(removed) {
    tbl.innerHTML = "";
    var show = result.slice(0, 51);
    show.forEach(function (r, i) {
      var tr = document.createElement("tr");
      r.forEach(function (c) {
        var cell = document.createElement(i === 0 ? "th" : "td");
        cell.textContent = c;
        tr.appendChild(cell);
      });
      tbl.appendChild(tr);
    });
    var n = Math.max(result.length - 1, 0);
    setStatus(ToolsHub.t("Rows: ", "قطاریں: ") + n +
      (removed > 0 ? ToolsHub.t(" (removed ", " (ہٹائی گئیں ") + removed + ")" : "") +
      (n > 50 ? ToolsHub.t(" - showing first 50", " - پہلی 50 دکھائی گئی ہیں") : ""), "ok");
  }

  function sheet() { return XLSX.utils.aoa_to_sheet(result); }

  $("xlsxBtn").addEventListener("click", function () {
    var out = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(out, sheet(), "Arranged");
    var data = XLSX.write(out, { bookType: "xlsx", type: "array" });
    ToolsHub.download(new Blob([data], { type: "application/octet-stream" }), baseName + "-arranged.xlsx");
  });
  $("csvBtn").addEventListener("click", function () {
    var csv = "﻿" + XLSX.utils.sheet_to_csv(sheet()); // BOM keeps Urdu text correct in Excel
    ToolsHub.download(new Blob([csv], { type: "text/csv;charset=utf-8" }), baseName + "-arranged.csv");
  });
  $("clearBtn").addEventListener("click", function () {
    wb = null; result = []; work.hidden = true; tbl.innerHTML = ""; setStatus("");
  });

  sheetSel.addEventListener("change", function () { fillColumns(); process(); });
  sortCol.addEventListener("change", process);
  sortDir.addEventListener("change", process);
  opts.forEach(function (o) { o.addEventListener("change", process); });

  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { loadFile(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); });
  });
  dropzone.addEventListener("drop", function (e) { loadFile(e.dataTransfer.files[0]); });
})();
