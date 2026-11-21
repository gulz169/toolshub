/* PDF Info */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
  var onLoad;
  var TH = window.ToolsHub, st = TH.status, src = null, name = "document";
  function needLib() { if (!window.PDFLib) { st(t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return true; } }
  function isPdf(f) { return f.type === "application/pdf" || /\.pdf$/i.test(f.name); }
  async function saveDoc(doc, suffix) { var b = await doc.save(); TH.download(new Blob([b], { type: "application/pdf" }), name + suffix + ".pdf"); st(t("Done. Your file was downloaded.", "مکمل۔ آپ کی فائل ڈاؤن لوڈ ہو گئی۔"), "ok"); }
  onLoad = async function (f) {
    var d = await PDFLib.PDFDocument.load(src, { updateMetadata: false }), pgs = d.getPages(), sizes = {}, esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
    pgs.forEach(function (p) { var s = p.getSize(), k = Math.round(s.width * 25.4 / 72) + " x " + Math.round(s.height * 25.4 / 72) + " mm"; sizes[k] = (sizes[k] || 0) + 1; });
    var fm = function (x) { return x ? x.toLocaleString() : "-"; };
    var rows = [[t("File name", "فائل کا نام"), f.name], [t("File size", "فائل کا سائز"), TH.formatSize(f.size)], [t("Pages", "صفحات"), pgs.length], [t("Page sizes", "صفحات کے سائز"), Object.keys(sizes).map(function (k) { return k + " (" + sizes[k] + ")"; }).join(", ")],
      [t("Title", "ٹائٹل"), d.getTitle() || "-"], [t("Author", "مصنف"), d.getAuthor() || "-"], [t("Subject", "سبجیکٹ"), d.getSubject() || "-"], [t("Creator", "تخلیق کار"), d.getCreator() || "-"], [t("Producer", "پروڈیوسر"), d.getProducer() || "-"],
      [t("Created", "بنائی گئی"), fm(d.getCreationDate())], [t("Modified", "ترمیم"), fm(d.getModificationDate())]];
    $("out").innerHTML = '<table style="width:100%;border-collapse:collapse">' + rows.map(function (r) { return '<tr style="border-top:1px solid rgba(255,255,255,.1)"><td style="padding:9px;opacity:.7">' + esc(r[0]) + '</td><td style="padding:9px;word-break:break-all">' + esc(r[1]) + "</td></tr>"; }).join("") + "</table>";
  };
  TH.pick($("dz"), $("fi"), async function (fs) {
    var f = fs[0]; if (!isPdf(f)) { st(t("Please choose a PDF file.", "براہ کرم PDF فائل چنیں۔"), "err"); return; } if (needLib()) return;
    try { src = new Uint8Array(await f.arrayBuffer()); name = f.name.replace(/\.pdf$/i, ""); await onLoad(f); $("work").hidden = false; st(""); }
    catch (e) { console.error(e); st(t("This PDF cannot be read (it may be protected or damaged).", "یہ PDF پڑھی نہیں جا سکی (شاید محفوظ یا خراب ہے)۔"), "err"); }
  });

})();
