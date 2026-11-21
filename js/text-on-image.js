/* Text on Image - meme style, canvas */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var view = $("view"), work = $("work"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput");
  var img = null, baseName = "image";
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function wrap(ctx, text, maxW) {
    var words = text.split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) {
      var t = cur ? cur + " " + w : w;
      if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function paint(c) {
    var w = img.naturalWidth, h = img.naturalHeight, fs = Math.round(w * +$("size").value / 100), pad = fs * 0.4;
    c.width = w; c.height = h;
    var x = c.getContext("2d"); x.drawImage(img, 0, 0, w, h);
    x.font = "900 " + fs + "px Impact, 'Arial Black', 'Noto Nastaliq Urdu', sans-serif";
    x.textAlign = "center"; x.lineJoin = "round"; x.lineWidth = fs / 7;
    x.fillStyle = $("fill").value; x.strokeStyle = $("stroke").value;
    function t(s) { s = s.trim(); return $("caps").checked ? s.toUpperCase() : s; }
    function draw(lines, startY, dir) {
      lines.forEach(function (l, i) { var y = startY + dir * i * fs * 1.1; x.strokeText(l, w / 2, y); x.fillText(l, w / 2, y); });
    }
    var top = wrap(x, t($("top").value), w * 0.92), bot = wrap(x, t($("bot").value), w * 0.92);
    x.textBaseline = "top"; draw(top, pad, 1);
    x.textBaseline = "alphabetic"; draw(bot.slice().reverse(), h - pad, -1);
  }
  function refresh() { if (img) paint(view); }

  function load(f) {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return; }
    var u = URL.createObjectURL(f), im = new Image();
    im.onload = function () { URL.revokeObjectURL(u); img = im; baseName = f.name.replace(/\.[^.]+$/, ""); work.hidden = false; setStatus(""); refresh(); };
    im.onerror = function () { URL.revokeObjectURL(u); setStatus(ToolsHub.t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); };
    im.src = u;
  }
  ["top", "bot", "size", "fill", "stroke", "caps"].forEach(function (id) { $(id).addEventListener("input", refresh); });
  $("newBtn").addEventListener("click", function () { img = null; work.hidden = true; setStatus(""); });
  $("dlBtn").addEventListener("click", function () { view.toBlob(function (b) { ToolsHub.download(b, baseName + "-text.png"); }, "image/png"); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
