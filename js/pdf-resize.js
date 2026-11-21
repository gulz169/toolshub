/* Resize PDF to A4 / Letter */
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
    var s = await PDFLib.PDFDocument.load(src), o = await PDFLib.PDFDocument.create(), z = $("sz").value.split(",").map(Number);
    var emb = await o.embedPages(s.getPages());
    emb.forEach(function (e) {
      var land = e.width > e.height, W = land ? z[1] : z[0], H = land ? z[0] : z[1], k = Math.min(W / e.width, H / e.height), w = e.width * k, h = e.height * k;
      var p = o.addPage([W, H]); p.drawPage(e, { x: (W - w) / 2, y: (H - h) / 2, width: w, height: h });
    });
    await saveDoc(o, "-resized");
  };
})();
