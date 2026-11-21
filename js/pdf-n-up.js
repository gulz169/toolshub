/* PDF Pages per Sheet (N-up) */
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
    var s = await PDFLib.PDFDocument.load(src), o = await PDFLib.PDFDocument.create(), n = +$("n").value;
    var grid = { 2: [2, 1], 4: [2, 2], 6: [3, 2], 9: [3, 3] }[n], cols = grid[0], rows = grid[1], land = n === 2 || n === 6;
    var W = land ? 841.89 : 595.28, H = land ? 595.28 : 841.89, cw = (W - 20) / cols, ch = (H - 20) / rows;
    var emb = await o.embedPages(s.getPages()), p = null;
    emb.forEach(function (e, i) {
      if (i % n === 0) p = o.addPage([W, H]);
      var j = i % n, c = j % cols, r = Math.floor(j / cols), k = Math.min((cw - 8) / e.width, (ch - 8) / e.height), w = e.width * k, h = e.height * k;
      var x = 10 + c * cw + (cw - w) / 2, y = H - 10 - (r + 1) * ch + (ch - h) / 2;
      p.drawPage(e, { x: x, y: y, width: w, height: h });
      if ($("bd").value === "1") p.drawRectangle({ x: x, y: y, width: w, height: h, borderWidth: 0.6, borderColor: PDFLib.rgb(0.6, 0.6, 0.6) });
    });
    await saveDoc(o, "-" + n + "up");
  };
})();
