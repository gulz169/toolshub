/* Image Splitter (Grid) */
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
  function draw() {
    var cv = $("cv"), r = Math.max(1, +$("r").value || 1), c = Math.max(1, +$("c").value || 1); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
    var x = cv.getContext("2d"); x.drawImage(img, 0, 0); x.strokeStyle = "#ec4899"; x.lineWidth = Math.max(2, cv.width / 300);
    for (var i = 1; i < c; i++) { x.beginPath(); x.moveTo(cv.width * i / c, 0); x.lineTo(cv.width * i / c, cv.height); x.stroke(); }
    for (var j = 1; j < r; j++) { x.beginPath(); x.moveTo(0, cv.height * j / r); x.lineTo(cv.width, cv.height * j / r); x.stroke(); }
  }
  function ready() { draw(); } $("r").oninput = $("c").oninput = function () { if (img) draw(); };
  $("dl").onclick = async function () {
    if (!window.JSZip) { st(t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return; }
    var r = Math.max(1, +$("r").value || 1), c = Math.max(1, +$("c").value || 1), w = Math.floor(img.naturalWidth / c), h = Math.floor(img.naturalHeight / r), z = new JSZip();
    for (var i = 0; i < r; i++) for (var j = 0; j < c; j++) {
      var o = document.createElement("canvas"); o.width = w; o.height = h; o.getContext("2d").drawImage(img, j * w, i * h, w, h, 0, 0, w, h);
      z.file(base + "-" + (i * c + j + 1) + ".png", await TH.toBlob(o, "image/png"));
    }
    TH.download(await z.generateAsync({ type: "blob" }), base + "-pieces.zip");
  };
})();
