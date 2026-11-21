/* PDF to Black & White */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
  var onLoad = function () {};
  var TH = window.ToolsHub, st = TH.status, src = null, name = "document";
  function needLib() { if (!window.PDFLib) { st(t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return true; } }
  function isPdf(f) { return f.type === "application/pdf" || /\.pdf$/i.test(f.name); }
  async function saveDoc(doc, suffix) { var b = await doc.save(); TH.download(new Blob([b], { type: "application/pdf" }), name + suffix + ".pdf"); st(t("Done. Your file was downloaded.", "مکمل۔ آپ کی فائل ڈاؤن لوڈ ہو گئی۔"), "ok"); }
  TH.pick($("dz"), $("fi"), async function (fs) {
    var f = fs[0]; if (!isPdf(f)) { st(t("Please choose a PDF file.", "براہ کرم PDF فائل چنیں۔"), "err"); return; } if (needLib()) return;
    try { src = new Uint8Array(await f.arrayBuffer()); name = f.name.replace(/\.pdf$/i, ""); await onLoad(f); $("work").hidden = false; st(""); }
    catch (e) { console.error(e); st(t("This PDF cannot be read (it may be protected or damaged).", "یہ PDF پڑھی نہیں جا سکی (شاید محفوظ یا خراب ہے)۔"), "err"); }
  });
  $("dl").onclick = async function () {
    if (!window.pdfjsLib) { st(t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return; }
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    var pdf = await pdfjsLib.getDocument({ data: src.slice() }).promise, o = await PDFLib.PDFDocument.create(), sc = +$("q").value, pg = $("pg"); pg.hidden = false; pg.max = pdf.numPages;
    for (var i = 1; i <= pdf.numPages; i++) {
      var page = await pdf.getPage(i), vp = page.getViewport({ scale: sc }), c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
      var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
      await page.render({ canvasContext: x, viewport: vp }).promise;
      var im = x.getImageData(0, 0, c.width, c.height), d = im.data;
      for (var j = 0; j < d.length; j += 4) { var g = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2]; d[j] = d[j + 1] = d[j + 2] = g; }
      x.putImageData(im, 0, 0);
      var jb = await TH.toBlob(c, "image/jpeg", 0.8), img = await o.embedJpg(new Uint8Array(await jb.arrayBuffer())), v1 = page.getViewport({ scale: 1 });
      o.addPage([v1.width, v1.height]).drawImage(img, { x: 0, y: 0, width: v1.width, height: v1.height });
      pg.value = i; st(t("Page ", "صفحہ ") + i + " / " + pdf.numPages);
    }
    pg.hidden = true; await saveDoc(o, "-bw");
  };
})();
