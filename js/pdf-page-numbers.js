/* Add page numbers to PDF - pdf-lib */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var bytes = null, baseName = "document", work = $("work"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput");
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }
  async function load(f) {
    if (!f) return;
    if (!(f.type === "application/pdf" || /\.pdf$/i.test(f.name))) { setStatus(ToolsHub.t("Please choose a PDF file.", "براہ کرم PDF فائل چنیں۔"), "err"); return; }
    if (!window.PDFLib) { setStatus(ToolsHub.t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return; }
    try {
      bytes = new Uint8Array(await f.arrayBuffer()); baseName = f.name.replace(/\.pdf$/i, "");
      var n = (await PDFLib.PDFDocument.load(bytes)).getPageCount();
      work.hidden = false; setStatus(n + ToolsHub.t(" pages", " صفحات"), "ok");
    } catch (e) { setStatus(ToolsHub.t("This PDF cannot be read (it may be password protected or damaged).", "یہ PDF پڑھی نہیں جا سکی (شاید پاس ورڈ والی یا خراب ہے)۔"), "err"); }
  }
  $("goBtn").addEventListener("click", async function () {
    try {
      var doc = await PDFLib.PDFDocument.load(bytes), font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
      var pages = doc.getPages(), total = pages.length, start = parseInt($("start").value, 10) || 1, fs = +$("fs").value || 11, pos = $("pos").value, fm = $("fmt").value;
      pages.forEach(function (pg, i) {
        var n = start + i, last = start + total - 1;
        var t = fm === "n" ? "" + n : fm === "p" ? "Page " + n : fm === "of" ? n + " / " + last : "Page " + n + " of " + last;
        var s = pg.getSize(), w = font.widthOfTextAtSize(t, fs), m = 28;
        var x = pos[1] === "c" ? (s.width - w) / 2 : pos[1] === "l" ? m : s.width - w - m;
        var y = pos[0] === "b" ? m : s.height - m - fs;
        pg.drawText(t, { x: x, y: y, size: fs, font: font, color: PDFLib.rgb(0.2, 0.2, 0.2) });
      });
      ToolsHub.download(new Blob([await doc.save()], { type: "application/pdf" }), baseName + "-numbered.pdf");
      setStatus(ToolsHub.t("Done!", "ہو گیا!"), "ok");
    } catch (e) { console.error(e); setStatus(ToolsHub.t("Could not save the PDF.", "PDF محفوظ نہیں ہو سکی۔"), "err"); }
  });
  $("newBtn").addEventListener("click", function () { bytes = null; work.hidden = true; setStatus(""); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
