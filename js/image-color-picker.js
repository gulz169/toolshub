/* Pick Colors from Image */
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
  var cv = $("cv");
  function ready() { cv.width = img.naturalWidth; cv.height = img.naturalHeight; cv.getContext("2d").drawImage(img, 0, 0); $("sw").innerHTML = ""; }
  function pick(e) {
    var r = cv.getBoundingClientRect(), px = (e.clientX - r.left) * cv.width / r.width, py = (e.clientY - r.top) * cv.height / r.height, d = cv.getContext("2d").getImageData(Math.floor(px), Math.floor(py), 1, 1).data;
    var hex = "#" + [d[0], d[1], d[2]].map(function (v) { return v.toString(16).padStart(2, "0"); }).join("").toUpperCase(), b = document.createElement("button");
    b.type = "button"; b.style.cssText = "display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);cursor:pointer;color:inherit;direction:ltr";
    b.innerHTML = '<i style="width:26px;height:26px;border-radius:8px;background:' + hex + ';border:1px solid #fff5"></i><span>' + hex + "  rgb(" + d[0] + ", " + d[1] + ", " + d[2] + ")</span>";
    b.onclick = function () { TH.copy(hex, function () { st(t("Copied ", "کاپی ہو گیا ") + hex, "ok"); }); };
    $("sw").insertBefore(b, $("sw").firstChild); if ($("sw").children.length > 12) $("sw").lastChild.remove();
  }
  cv.addEventListener("click", pick);
})();
