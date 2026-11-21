/* Compress PDF - re-renders pages as JPEG (pdf.js) and rebuilds the PDF (pdf-lib) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var file = null;
  var dropzone = $("dropzone"), fileInput = $("fileInput"), actions = $("actions"),
      statusEl = $("status"), bar = $("bar"), goBtn = $("goBtn"), level = $("level");
  var LEVELS = { light: { s: 2, q: 0.85 }, balanced: { s: 1.5, q: 0.7 }, strong: { s: 1, q: 0.5 } };

  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function pick(f) {
    if (!f) return;
    if (!(f.type === "application/pdf" || /\.pdf$/i.test(f.name))) {
      setStatus(ToolsHub.t("Please choose a PDF file.", "براہ کرم PDF فائل چنیں۔"), "err"); return;
    }
    file = f; actions.hidden = false;
    setStatus(f.name + " · " + ToolsHub.formatSize(f.size));
  }

  async function compress() {
    if (!window.pdfjsLib || !window.PDFLib) {
      setStatus(ToolsHub.t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return;
    }
    var cfg = LEVELS[level.value];
    goBtn.disabled = true; bar.hidden = false; bar.value = 0;
    try {
      var data = new Uint8Array(await file.arrayBuffer());
      var pdf = await pdfjsLib.getDocument({ data: data }).promise;
      var out = await PDFLib.PDFDocument.create();
      for (var i = 1; i <= pdf.numPages; i++) {
        setStatus(ToolsHub.t("Page ", "صفحہ ") + i + " / " + pdf.numPages);
        var pg = await pdf.getPage(i);
        var base = pg.getViewport({ scale: 1 });
        var vp = pg.getViewport({ scale: cfg.s });
        var c = document.createElement("canvas");
        c.width = Math.round(vp.width); c.height = Math.round(vp.height);
        var ctx = c.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
        await pg.render({ canvasContext: ctx, viewport: vp }).promise;
        var blob = await new Promise(function (r) { c.toBlob(r, "image/jpeg", cfg.q); });
        var img = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
        var page = out.addPage([base.width, base.height]);
        page.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
        c.width = c.height = 0;
        bar.value = i / pdf.numPages;
      }
      var res = new Blob([await out.save()], { type: "application/pdf" });
      if (res.size >= file.size) {
        setStatus(ToolsHub.t("This PDF is already small - compressing would not help. Try a stronger level.",
          "یہ PDF پہلے ہی چھوٹی ہے، کمپریس سے فائدہ نہیں ہوگا۔ زیادہ کمپریشن آزمائیں۔"), "err");
      } else {
        ToolsHub.download(res, file.name.replace(/\.pdf$/i, "") + "-compressed.pdf");
        var pct = Math.round((1 - res.size / file.size) * 100);
        setStatus(ToolsHub.t("Done! ", "ہو گیا! ") + ToolsHub.formatSize(file.size) + " → " + ToolsHub.formatSize(res.size) + " (-" + pct + "%)", "ok");
      }
    } catch (e) {
      console.error(e);
      setStatus(ToolsHub.t("This PDF cannot be read (it may be password protected or damaged).", "یہ PDF پڑھی نہیں جا سکی (شاید پاس ورڈ والی یا خراب ہے)۔"), "err");
    } finally {
      goBtn.disabled = false; bar.hidden = true;
    }
  }

  goBtn.addEventListener("click", compress);
  $("clearBtn").addEventListener("click", function () { file = null; actions.hidden = true; setStatus(""); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { pick(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { pick(e.dataTransfer.files[0]); });
})();
