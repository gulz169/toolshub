/* Add Watermark - images (canvas) and PDF (pdf-lib) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var dropzone = $("dropzone"), fileInput = $("fileInput"), work = $("work"), stage = $("stage"), statusEl = $("status");
  var kind = null, img = null, pdfBytes = null, base = null, baseName = "file", preview = document.createElement("canvas");
  stage.appendChild(preview);

  if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function opts() {
    return { text: $("wmText").value || " ", pos: $("pos").value, size: +$("size").value / 100, op: +$("opacity").value / 100, color: $("color").value };
  }
  // grid of anchor points (top-left origin) shared by canvas and PDF
  function points(w, h, fs, tw, pos) {
    if (pos === "center") return { pts: [[(w - tw) / 2, h / 2 + fs / 3]], rot: 30 };
    if (pos === "br") return { pts: [[w - tw - fs, h - fs]], rot: 0 };
    var pts = [], sx = tw * 1.5, sy = fs * 4, row = 0;
    for (var y = sy / 2; y < h + w; y += sy, row++)
      for (var x = -w + (row % 2) * sx / 2; x < w * 1.5; x += sx) pts.push([x, y]);
    return { pts: pts, rot: 30 };
  }

  function drawOn(ctx, w, h, o) {
    var fs = Math.max(8, Math.min(w, h) * o.size);
    ctx.save();
    ctx.font = "700 " + fs + "px 'Plus Jakarta Sans', 'Noto Nastaliq Urdu', Arial, sans-serif";
    ctx.fillStyle = o.color; ctx.globalAlpha = o.op; ctx.textBaseline = "alphabetic";
    var tw = ctx.measureText(o.text).width, g = points(w, h, fs, tw, o.pos);
    if (o.pos === "tile") { ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip(); }
    g.pts.forEach(function (p) {
      ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(-g.rot * Math.PI / 180); ctx.fillText(o.text, 0, 0); ctx.restore();
    });
    ctx.restore();
  }

  function refresh() {
    if (!base) return;
    preview.width = base.width; preview.height = base.height;
    var c = preview.getContext("2d"); c.drawImage(base, 0, 0);
    drawOn(c, base.width, base.height, opts());
  }

  async function load(f) {
    if (!f) return;
    var isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf && !/^image\/(jpeg|png|webp)$/.test(f.type)) { setStatus(ToolsHub.t("Please choose a JPG, PNG, WebP or PDF file.", "براہ کرم JPG، PNG، WebP یا PDF فائل چنیں۔"), "err"); return; }
    baseName = f.name.replace(/\.[^.]+$/, "");
    try {
      if (isPdf) {
        if (!window.pdfjsLib || !window.PDFLib) { setStatus(ToolsHub.t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return; }
        kind = "pdf"; pdfBytes = new Uint8Array(await f.arrayBuffer());
        var pdf = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise, pg = await pdf.getPage(1);
        var vp = pg.getViewport({ scale: 700 / pg.getViewport({ scale: 1 }).width });
        base = document.createElement("canvas"); base.width = Math.round(vp.width); base.height = Math.round(vp.height);
        var bc = base.getContext("2d"); bc.fillStyle = "#fff"; bc.fillRect(0, 0, base.width, base.height);
        await pg.render({ canvasContext: bc, viewport: vp }).promise;
      } else {
        kind = "img";
        img = await new Promise(function (res, rej) { var u = URL.createObjectURL(f), im = new Image(); im.onload = function () { URL.revokeObjectURL(u); res(im); }; im.onerror = rej; im.src = u; });
        base = img;
      }
      work.hidden = false; setStatus(""); refresh();
    } catch (e) { console.error(e); setStatus(ToolsHub.t("This file cannot be read.", "یہ فائل پڑھی نہیں جا سکی۔"), "err"); }
  }

  async function download() {
    var o = opts();
    if (kind === "img") {
      var c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
      var x = c.getContext("2d"); x.drawImage(img, 0, 0); drawOn(x, c.width, c.height, o);
      c.toBlob(function (b) { ToolsHub.download(b, baseName + "-watermarked.png"); }, "image/png");
      return;
    }
    if (/[^\x20-\x7E]/.test(o.text)) { setStatus(ToolsHub.t("PDF watermark supports English letters and numbers only.", "PDF واٹر مارک میں صرف انگریزی حروف اور اعداد چلتے ہیں۔"), "err"); return; }
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes), font = await doc.embedFont(PDFLib.StandardFonts.HelveticaBold);
      var rgbv = [1, 3, 5].map(function (i) { return parseInt(o.color.substr(i, 2), 16) / 255; });
      doc.getPages().forEach(function (pg) {
        var s = pg.getSize(), fs = Math.max(8, Math.min(s.width, s.height) * o.size), tw = font.widthOfTextAtSize(o.text, fs), g = points(s.width, s.height, fs, tw, o.pos);
        g.pts.forEach(function (p) {
          if (o.pos === "tile" && (p[0] > s.width * 1.2 || p[1] < -s.height)) return;
          pg.drawText(o.text, { x: p[0], y: s.height - p[1], size: fs, font: font, color: PDFLib.rgb(rgbv[0], rgbv[1], rgbv[2]), opacity: o.op, rotate: PDFLib.degrees(g.rot) });
        });
      });
      ToolsHub.download(new Blob([await doc.save()], { type: "application/pdf" }), baseName + "-watermarked.pdf");
      setStatus("");
    } catch (e) { console.error(e); setStatus(ToolsHub.t("Could not save the PDF.", "PDF محفوظ نہیں ہو سکی۔"), "err"); }
  }

  ["wmText", "pos", "size", "opacity", "color"].forEach(function (id) { $(id).addEventListener("input", refresh); });
  $("dlBtn").addEventListener("click", download);
  $("newBtn").addEventListener("click", function () { base = null; work.hidden = true; setStatus(""); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
