/* Circle Crop (Round Photo) */
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
  function draw(c, S) {
    c.width = c.height = S; var x = c.getContext("2d"), iw = img.naturalWidth, ih = img.naturalHeight, k = Math.max(S / iw, S / ih) * +$("z").value, w = iw * k, h = ih * k;
    var ox = (+$("x").value / 100) * Math.max(0, (w - S) / 2), oy = (+$("y").value / 100) * Math.max(0, (h - S) / 2);
    x.clearRect(0, 0, S, S); x.save(); x.beginPath(); x.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); x.clip(); x.drawImage(img, (S - w) / 2 - ox, (S - h) / 2 - oy, w, h); x.restore();
  }
  function ready() { draw($("cv"), 400); }
  ["z", "x", "y"].forEach(function (i) { $(i).oninput = function () { if (img) ready(); }; });
  $("dl").onclick = function () { var c = document.createElement("canvas"); draw(c, +$("s").value); dl(c, "image/png", "-round"); };
})();
