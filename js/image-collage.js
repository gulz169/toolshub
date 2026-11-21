/* Photo Collage Maker */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var imgs = [], view = $("view"), work = $("work"), list = $("list"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput");
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }
  function add(files) {
    var ok = Array.prototype.filter.call(files, function (f) { return /^image\/(jpeg|png|webp)$/.test(f.type); });
    if (!ok.length) { setStatus(ToolsHub.t("Please choose JPG, PNG or WebP images.", "براہ کرم JPG، PNG یا WebP تصاویر چنیں۔"), "err"); return; }
    ok.slice(0, 12 - imgs.length).forEach(function (f) {
      var u = URL.createObjectURL(f), im = new Image(); im.onload = function () { URL.revokeObjectURL(u); imgs.push(im); render(); }; im.src = u;
    }); setStatus("");
  }
  function draw(c) {
    var lay = $("lay").value, gap = +$("gap").value, n = imgs.length, x, i;
    if (lay === "grid") {
      var cols = Math.min(+$("cols").value, n), rows = Math.ceil(n / cols), W = 1800, cell = (W - gap * (cols + 1)) / cols;
      c.width = W; c.height = Math.round(rows * cell + gap * (rows + 1)); x = c.getContext("2d"); x.fillStyle = $("bg").value; x.fillRect(0, 0, c.width, c.height);
      imgs.forEach(function (im, k) { var s = Math.min(im.naturalWidth, im.naturalHeight), px = gap + (k % cols) * (cell + gap), py = gap + Math.floor(k / cols) * (cell + gap);
        x.drawImage(im, (im.naturalWidth - s) / 2, (im.naturalHeight - s) / 2, s, s, px, py, cell, cell); });
    } else if (lay === "h") {
      var H = 900, ws = imgs.map(function (im) { return im.naturalWidth * H / im.naturalHeight; }), tot = ws.reduce(function (a, b) { return a + b; }, 0) + gap * (n + 1);
      c.width = Math.round(tot); c.height = H + 2 * gap; x = c.getContext("2d"); x.fillStyle = $("bg").value; x.fillRect(0, 0, c.width, c.height);
      var cx = gap; imgs.forEach(function (im, k) { x.drawImage(im, cx, gap, ws[k], H); cx += ws[k] + gap; });
    } else {
      var Wd = 1200, hs = imgs.map(function (im) { return im.naturalHeight * Wd / im.naturalWidth; }), tt = hs.reduce(function (a, b) { return a + b; }, 0) + gap * (n + 1);
      c.width = Wd + 2 * gap; c.height = Math.round(tt); x = c.getContext("2d"); x.fillStyle = $("bg").value; x.fillRect(0, 0, c.width, c.height);
      var cy = gap; imgs.forEach(function (im, k) { x.drawImage(im, gap, cy, Wd, hs[k]); cy += hs[k] + gap; });
    }
  }
  function render() {
    list.innerHTML = "";
    imgs.forEach(function (im, i) {
      var it = document.createElement("div"); it.className = "file-item"; var t = document.createElement("canvas"); t.width = 120; t.height = 90; t.style.cssText = "width:100%;border-radius:10px";
      var s = Math.min(im.naturalWidth, im.naturalHeight); t.getContext("2d").drawImage(im, (im.naturalWidth - s) / 2, (im.naturalHeight - s) / 2, s, s, 15, 0, 90, 90);
      var ctrl = document.createElement("div"); ctrl.className = "ctrl"; var b = document.createElement("button"); b.type = "button"; b.textContent = "✕"; b.addEventListener("click", function () { imgs.splice(i, 1); render(); }); ctrl.appendChild(b); it.append(t, ctrl); list.appendChild(it);
    });
    work.hidden = imgs.length < 2; if (imgs.length === 1) setStatus(ToolsHub.t("Add at least one more photo.", "کم از کم ایک اور تصویر شامل کریں۔"));
    if (imgs.length >= 2) { setStatus(""); draw(view); }
  }
  ["lay", "cols", "gap", "bg"].forEach(function (id) { $(id).addEventListener("input", function () { if (imgs.length > 1) draw(view); }); });
  $("dlBtn").addEventListener("click", function () { view.toBlob(function (b) { ToolsHub.download(b, "collage.png"); }, "image/png"); });
  $("clearBtn").addEventListener("click", function () { imgs = []; render(); setStatus(""); });
  fileInput.addEventListener("change", function () { add(fileInput.files); fileInput.value = ""; });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { add(e.dataTransfer.files); });
})();
