/* Image Info */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
  var TH = window.ToolsHub, st = TH.status, img = null, base = "image";
  function load(f) {
    if (!/^image\//.test(f.type)) { st(t("Please choose an image.", "براہ کرم تصویر چنیں۔"), "err"); return; }
    TH.loadImage(f).then(function (im) { img = im; base = f.name.replace(/\.[^.]+$/, ""); st(""); $("work").hidden = false; ready(f); }, function () { st(t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); });
  }
  TH.pick($("dz"), $("fi"), function (fs) { load(fs[0]); });
  function dl(c, type, suffix) { var ext = type === "image/png" ? ".png" : type === "image/jpeg" ? ".jpg" : ".webp"; TH.toBlob(c, type, 0.95).then(function (b) { TH.download(b, base + suffix + ext); }); }
  function g(a, b) { return b ? g(b, a % b) : a; }
  function ready(f) {
    var w = img.naturalWidth, h = img.naturalHeight, d = g(w, h), rows = [[t("File name", "فائل کا نام"), f.name], [t("Type", "قسم"), f.type || "-"], [t("File size", "فائل کا سائز"), TH.formatSize(f.size)], [t("Dimensions", "ڈائمنشنز"), w + " x " + h + " px"], [t("Aspect ratio", "ایسپیکٹ ریشو"), (w / d) + ":" + (h / d)], [t("Megapixels", "میگا پکسل"), (w * h / 1e6).toFixed(2) + " MP"], [t("Print size at 300 DPI", "300 DPI پر پرنٹ سائز"), (w / 300 * 2.54).toFixed(1) + " x " + (h / 300 * 2.54).toFixed(1) + " cm"], [t("Last modified", "آخری ترمیم"), new Date(f.lastModified).toLocaleString()]];
    $("out").innerHTML = '<table style="width:100%;border-collapse:collapse">' + rows.map(function (r) { return '<tr style="border-top:1px solid rgba(255,255,255,.1)"><td style="padding:9px;opacity:.7">' + r[0] + '</td><td style="padding:9px;word-break:break-all" dir="ltr">' + String(r[1]).replace(/</g, "&lt;") + "</td></tr>"; }).join("") + "</table>";
  }
})();
