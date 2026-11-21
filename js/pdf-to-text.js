/* PDF to Text - pdf.js text extraction */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var pages = [], baseName = "document", out = $("out"), statusEl = $("status");
  var dropzone = $("dropzone"), fileInput = $("fileInput"), bar = $("bar"), work = $("work");
  if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function compose() {
    out.value = pages.map(function (t, i) { return ($("brk").checked ? "--- " + ToolsHub.t("Page ", "صفحہ ") + (i + 1) + " ---\n" : "") + t.trim(); }).join("\n\n");
  }
  async function load(f) {
    if (!f) return;
    if (!(f.type === "application/pdf" || /\.pdf$/i.test(f.name))) { setStatus(ToolsHub.t("Please choose a PDF file.", "براہ کرم PDF فائل چنیں۔"), "err"); return; }
    if (!window.pdfjsLib) { setStatus(ToolsHub.t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return; }
    baseName = f.name.replace(/\.pdf$/i, ""); work.hidden = true; bar.hidden = false; bar.value = 0; pages = [];
    try {
      var pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise;
      for (var i = 1; i <= pdf.numPages; i++) {
        setStatus(ToolsHub.t("Page ", "صفحہ ") + i + " / " + pdf.numPages);
        var tc = await (await pdf.getPage(i)).getTextContent();
        pages.push(tc.items.map(function (it) { return it.str + (it.hasEOL ? "\n" : ""); }).join(""));
        bar.value = i / pdf.numPages;
      }
      compose(); work.hidden = false;
      if (out.value.replace(/\s/g, "").length < 20) setStatus(ToolsHub.t("No text found. This looks like a scanned PDF - use the Image to Text tool.", "کوئی متن نہیں ملا۔ یہ اسکین شدہ PDF لگتی ہے، Image to Text ٹول استعمال کریں۔"), "err");
      else setStatus(pages.length + ToolsHub.t(" pages read.", " صفحات پڑھے گئے۔"), "ok");
    } catch (e) { console.error(e); setStatus(ToolsHub.t("This PDF cannot be read (it may be password protected or damaged).", "یہ PDF پڑھی نہیں جا سکی (شاید پاس ورڈ والی یا خراب ہے)۔"), "err"); }
    finally { bar.hidden = true; }
  }
  $("brk").addEventListener("change", compose);
  $("txtBtn").addEventListener("click", function () { ToolsHub.download(new Blob(["﻿" + out.value], { type: "text/plain;charset=utf-8" }), baseName + ".txt"); });
  $("docBtn").addEventListener("click", function () {
    var esc = out.value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
    ToolsHub.download(new Blob(["﻿<html><head><meta charset='utf-8'></head><body style='font-family:Arial'>" + esc + "</body></html>"], { type: "application/msword" }), baseName + ".doc");
  });
  $("copyBtn").addEventListener("click", function () {
    var done = function () { setStatus(ToolsHub.t("Copied!", "کاپی ہو گیا!"), "ok"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out.value).then(done, function () { out.select(); document.execCommand("copy"); done(); });
    else { out.select(); document.execCommand("copy"); done(); }
  });
  $("clearBtn").addEventListener("click", function () { pages = []; out.value = ""; work.hidden = true; setStatus(""); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
