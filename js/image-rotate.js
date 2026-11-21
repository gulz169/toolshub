/* Rotate & Flip Image - canvas */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var view = $("view"), work = $("work"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput");
  var img = null, baseName = "image", rot = 0, fh = false, fv = false;

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function render(c) {
    var w = img.naturalWidth, h = img.naturalHeight, odd = rot % 2 === 1;
    c.width = odd ? h : w; c.height = odd ? w : h;
    var ctx = c.getContext("2d");
    ctx.save();
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate(rot * Math.PI / 2);
    ctx.scale(fh ? -1 : 1, fv ? -1 : 1);
    ctx.drawImage(img, -w / 2, -h / 2);
    ctx.restore();
  }

  function load(file) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return; }
    var url = URL.createObjectURL(file), im = new Image();
    im.onload = function () { URL.revokeObjectURL(url); img = im; baseName = file.name.replace(/\.[^.]+$/, ""); reset(); work.hidden = false; setStatus(""); };
    im.onerror = function () { URL.revokeObjectURL(url); setStatus(ToolsHub.t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); };
    im.src = url;
  }
  function reset() { rot = 0; fh = fv = false; render(view); }

  $("rr").addEventListener("click", function () { rot = (rot + 1) % 4; render(view); });
  $("rl").addEventListener("click", function () { rot = (rot + 3) % 4; render(view); });
  // flips are applied to the image as shown, so they swap meaning when rotated sideways
  $("fh").addEventListener("click", function () { if (rot % 2) fv = !fv; else fh = !fh; render(view); });
  $("fv").addEventListener("click", function () { if (rot % 2) fh = !fh; else fv = !fv; render(view); });
  $("resetBtn").addEventListener("click", reset);
  $("newBtn").addEventListener("click", function () { img = null; work.hidden = true; setStatus(""); });
  $("dlBtn").addEventListener("click", function () {
    var type = $("fmt").value, c = document.createElement("canvas");
    render(c);
    if (type === "image/jpeg") { var o = document.createElement("canvas"); o.width = c.width; o.height = c.height; var x = o.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, o.width, o.height); x.drawImage(c, 0, 0); c = o; }
    var ext = type === "image/png" ? ".png" : type === "image/jpeg" ? ".jpg" : ".webp";
    c.toBlob(function (b) { ToolsHub.download(b, baseName + "-edited" + ext); }, type, 0.95);
  });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
