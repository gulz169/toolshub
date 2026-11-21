/* Passport Photo Maker - 300 DPI, print sheets */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var statusEl = $("status");
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }
  var img = null, baseName = "photo", view = $("view"), work = $("work"), dropzone = $("dropzone"), fileInput = $("fileInput"), DPI = 300;
  function loadImage(f, cb) {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return; }
    var u = URL.createObjectURL(f), im = new Image();
    im.onload = function () { URL.revokeObjectURL(u); cb(im); };
    im.onerror = function () { URL.revokeObjectURL(u); setStatus(ToolsHub.t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); };
    im.src = u;
  }
  function dims() { var s = $("size").value.split(","); return [Math.round(+s[0] / 25.4 * DPI), Math.round(+s[1] / 25.4 * DPI)]; }
  function photo(c, W, H) {
    c.width = W; c.height = H; var x = c.getContext("2d");
    x.fillStyle = $("bg").value; x.fillRect(0, 0, W, H);
    var z = +$("zoom").value / 100, s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * z, w = img.naturalWidth * s, h = img.naturalHeight * s;
    var px = (W - w) / 2 + (+$("ox").value / 100) * Math.abs(w - W) / 2, py = (H - h) / 2 + (+$("oy").value / 100) * Math.abs(h - H) / 2;
    x.drawImage(img, px, py, w, h);
  }
  function refresh() {
    if (!img) return; var d = dims(), k = Math.min(1, 380 / d[1]);
    var t = document.createElement("canvas"); photo(t, d[0], d[1]);
    view.width = Math.round(d[0] * k); view.height = Math.round(d[1] * k); view.getContext("2d").drawImage(t, 0, 0, view.width, view.height);
    view.style.border = "1px solid rgba(255,255,255,.3)";
  }
  function load(f) { loadImage(f, function (im) { img = im; baseName = f.name.replace(/\.[^.]+$/, ""); work.hidden = false; setStatus(""); refresh(); }); }
  $("dlBtn").addEventListener("click", function () {
    if (!img) return; var d = dims(), one = document.createElement("canvas"); photo(one, d[0], d[1]);
    var mode = $("out").value, out = one, name = baseName + "-photo.png";
    if (mode !== "one") {
      var SW = mode === "a4" ? 2480 : 1800, SH = mode === "a4" ? 3508 : 1200, gap = 30, m = 60;
      var cols = Math.max(1, Math.floor((SW - 2 * m + gap) / (d[0] + gap))), rows = Math.max(1, Math.floor((SH - 2 * m + gap) / (d[1] + gap)));
      out = document.createElement("canvas"); out.width = SW; out.height = SH; var x = out.getContext("2d");
      x.fillStyle = "#fff"; x.fillRect(0, 0, SW, SH);
      var gw = cols * d[0] + (cols - 1) * gap, gh = rows * d[1] + (rows - 1) * gap, ox = (SW - gw) / 2, oy = (SH - gh) / 2;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) { var px = ox + c * (d[0] + gap), py = oy + r * (d[1] + gap); x.drawImage(one, px, py); x.strokeStyle = "#bbb"; x.lineWidth = 1; x.strokeRect(px, py, d[0], d[1]); }
      name = baseName + "-" + mode + "-sheet.png";
    }
    out.toBlob(function (b) { ToolsHub.download(b, name); }, "image/png");
  });
  ["size", "bg", "zoom", "ox", "oy"].forEach(function (id) { $(id).addEventListener("input", refresh); });
  $("newBtn").addEventListener("click", function () { img = null; work.hidden = true; setStatus(""); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
