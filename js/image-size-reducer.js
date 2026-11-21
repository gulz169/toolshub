/* Compress image to a target size in KB */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var statusEl = $("status");
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }
  var img = null, baseName = "image", result = null, ext = ".jpg", work = $("work"), dropzone = $("dropzone"), fileInput = $("fileInput");
  function loadImage(f, cb) {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return; }
    var u = URL.createObjectURL(f), im = new Image();
    im.onload = function () { URL.revokeObjectURL(u); cb(im); };
    im.onerror = function () { URL.revokeObjectURL(u); setStatus(ToolsHub.t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); };
    im.src = u;
  }
  function load(f) { loadImage(f, function (im) { img = im; baseName = f.name.replace(/\.[^.]+$/, ""); result = null; $("prev").hidden = true; work.hidden = false; setStatus(ToolsHub.formatSize(f.size) + " · " + im.naturalWidth + "×" + im.naturalHeight); }); }
  function blobAt(scale, q, type) {
    var c = document.createElement("canvas"); c.width = Math.max(1, Math.round(img.naturalWidth * scale)); c.height = Math.max(1, Math.round(img.naturalHeight * scale));
    var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
    return new Promise(function (r) { c.toBlob(function (b) { r({ blob: b, w: c.width, h: c.height }); }, type, q); });
  }
  async function run() {
    var target = (+$("kb").value || 0) * 1024, type = $("fmt").value;
    if (target < 2048) { setStatus(ToolsHub.t("Enter a size of at least 2 KB.", "کم از کم 2 KB لکھیں۔"), "err"); return; }
    $("goBtn").disabled = true; setStatus(ToolsHub.t("Compressing...", "کمپریس ہو رہی ہے..."));
    try {
      var scale = 1, best = null;
      for (var round = 0; round < 12 && !best; round++) {
        var lo = 0.05, hi = 0.95, fit = null;
        var top = await blobAt(scale, hi, type);
        if (top.blob.size <= target) fit = top;
        else {
          for (var i = 0; i < 7; i++) {
            var mid = (lo + hi) / 2, r = await blobAt(scale, mid, type);
            if (r.blob.size <= target) { fit = r; lo = mid; } else hi = mid;
          }
        }
        if (fit) best = fit; else scale *= 0.85;
      }
      if (!best) { setStatus(ToolsHub.t("Could not reach that size. Try a bigger target.", "اس سائز تک نہیں پہنچ سکی۔ بڑا ہدف آزمائیں۔"), "err"); return; }
      result = best; ext = type === "image/webp" ? ".webp" : ".jpg";
      var u = URL.createObjectURL(best.blob); $("prev").src = u; $("prev").hidden = false;
      setStatus(ToolsHub.formatSize(best.blob.size) + " · " + best.w + "×" + best.h, "ok");
    } finally { $("goBtn").disabled = false; }
  }
  $("goBtn").addEventListener("click", function () { if (img) run(); });
  $("dlBtn").addEventListener("click", function () { if (result) ToolsHub.download(result.blob, baseName + "-" + Math.round(result.blob.size / 1024) + "kb" + ext); else setStatus(ToolsHub.t("Press Compress first.", "پہلے کمپریس دبائیں۔"), "err"); });
  $("newBtn").addEventListener("click", function () { img = null; result = null; work.hidden = true; setStatus(""); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-kb]"), function (b) { b.addEventListener("click", function () { $("kb").value = b.getAttribute("data-kb"); }); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
