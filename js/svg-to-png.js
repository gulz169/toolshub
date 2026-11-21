/* SVG to PNG Converter */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
  var TH = window.ToolsHub, st = TH.status, img = null, base = "image";
  TH.pick($("dz"), $("fi"), function (fs) {
    var f = fs[0]; if (!/svg/i.test(f.type) && !/\.svg$/i.test(f.name)) { st(t("Please choose an SVG file.", "براہ کرم SVG فائل چنیں۔"), "err"); return; }
    TH.loadImage(f).then(function (im) { img = im; base = f.name.replace(/\.[^.]+$/, ""); $("pv").src = im.src || ""; var u = URL.createObjectURL(f); $("pv").src = u; $("work").hidden = false; st(""); }, function () { st(t("This SVG cannot be read.", "یہ SVG پڑھی نہیں جا سکی۔"), "err"); });
  });
  $("dl").onclick = function () {
    var w = img.naturalWidth || 512, h = img.naturalHeight || 512, k = +$("sc").value, c = document.createElement("canvas"); c.width = w * k; c.height = h * k; var x = c.getContext("2d");
    if ($("bg").value === "w") { x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); } x.drawImage(img, 0, 0, c.width, c.height);
    TH.toBlob(c, "image/png").then(function (b) { TH.download(b, base + ".png"); });
  };
})();
