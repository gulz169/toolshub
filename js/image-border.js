/* Add Border to Image */
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
    var b = Math.max(0, +$("bw").value || 0), iw = img.naturalWidth, ih = img.naturalHeight, W = iw + 2 * b, H = ih + 2 * b, r = Math.min(+$("rd").value || 0, W / 2, H / 2);
    c.width = W; c.height = H; var x = c.getContext("2d");
    function rr(px, py, w, h, q) { x.beginPath(); x.moveTo(px + q, py); x.arcTo(px + w, py, px + w, py + h, q); x.arcTo(px + w, py + h, px, py + h, q); x.arcTo(px, py + h, px, py, q); x.arcTo(px, py, px + w, py, q); x.closePath(); }
    if ($("tr").value === "0") { x.fillStyle = $("bc").value; x.fillRect(0, 0, W, H); }
    x.save(); rr(0, 0, W, H, r); x.clip(); if ($("tr").value === "1") { x.fillStyle = $("bc").value; x.fillRect(0, 0, W, H); } x.drawImage(img, b, b); x.restore();
  }
  function ready() { draw($("cv")); }
  ["bw", "bc", "rd", "tr"].forEach(function (i) { $(i).oninput = function () { if (img) ready(); }; });
  $("dl").onclick = function () { var c = document.createElement("canvas"); draw(c); dl(c, "image/png", "-border"); };
})();
