/* Social Media Image Resizer */
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
  function draw(c) {
    var s = $("p").value.split(",").map(Number), W = s[0], H = s[1]; c.width = W; c.height = H; var x = c.getContext("2d"), iw = img.naturalWidth, ih = img.naturalHeight;
    x.fillStyle = $("bg").value; x.fillRect(0, 0, W, H);
    var k = $("m").value === "cover" ? Math.max(W / iw, H / ih) : Math.min(W / iw, H / ih); x.drawImage(img, (W - iw * k) / 2, (H - ih * k) / 2, iw * k, ih * k);
  }
  function ready() { draw($("cv")); }
  ["p", "m", "bg"].forEach(function (i) { $(i).oninput = function () { if (img) ready(); }; });
  $("dl").onclick = function () { var c = document.createElement("canvas"); draw(c); dl(c, $("f").value, "-" + $("p").value.replace(",", "x")); };
})();
