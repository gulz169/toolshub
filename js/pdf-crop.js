/* Crop PDF Margins */
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
    var d = await PDFLib.PDFDocument.load(src), k = 72 / 25.4, bad = false;
    d.getPages().forEach(function (p) {
      var b = p.getMediaBox(), x = b.x + $("ml").value * k, y = b.y + $("mb").value * k, w = b.width - ($("ml").value * 1 + $("mr").value * 1) * k, h = b.height - ($("mt").value * 1 + $("mb").value * 1) * k;
      if (w <= 10 || h <= 10) { bad = true; return; }
      p.setMediaBox(x, y, w, h); p.setCropBox(x, y, w, h);
    });
    if (bad) { st(t("Margins are too large for this page.", "مارجن اس صفحے کے لیے بہت بڑے ہیں۔"), "err"); return; }
    await saveDoc(d, "-cropped");
  };
})();
