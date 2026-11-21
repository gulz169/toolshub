/* Color Palette from Image - quantised histogram */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var statusEl = $("status");
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }
  var img = null, cols = [], work = $("work"), dropzone = $("dropzone"), fileInput = $("fileInput");
  function loadImage(f, cb) {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return; }
    var u = URL.createObjectURL(f), im = new Image();
    im.onload = function () { URL.revokeObjectURL(u); cb(im); };
    im.onerror = function () { URL.revokeObjectURL(u); setStatus(ToolsHub.t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); };
    im.src = u;
  }
  function hex(c) { return "#" + c.map(function (v) { return ("0" + v.toString(16)).slice(-2); }).join(""); }
  function extract() {
    if (!img) return;
    var k = Math.min(1, 120 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
    var x = c.getContext("2d"); x.drawImage(img, 0, 0, c.width, c.height); var d = x.getImageData(0, 0, c.width, c.height).data, map = {};
    for (var i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue;
      var key = (d[i] >> 4) + "," + (d[i + 1] >> 4) + "," + (d[i + 2] >> 4), b = map[key] || (map[key] = { n: 0, r: 0, g: 0, b: 0 });
      b.n++; b.r += d[i]; b.g += d[i + 1]; b.b += d[i + 2];
    }
    var list = Object.keys(map).map(function (k2) { var b = map[k2]; return { n: b.n, c: [Math.round(b.r / b.n), Math.round(b.g / b.n), Math.round(b.b / b.n)] }; }).sort(function (a, b) { return b.n - a.n; });
    var want = +$("cnt").value, pick = [];
    for (var min = 70; min >= 0 && pick.length < want; min -= 20) {
      pick = [];
      list.forEach(function (it) { if (pick.length < want && pick.every(function (p) { var dr = p.c[0] - it.c[0], dg = p.c[1] - it.c[1], db = p.c[2] - it.c[2]; return Math.sqrt(dr * dr + dg * dg + db * db) >= min; })) pick.push(it); });
    }
    cols = pick.map(function (p) { return hex(p.c); });
    var box = $("sw"); box.innerHTML = "";
    cols.forEach(function (h) {
      var b = document.createElement("button"); b.type = "button"; b.style.background = h; b.textContent = h.toUpperCase();
      var lum = parseInt(h.slice(1, 3), 16) * 0.299 + parseInt(h.slice(3, 5), 16) * 0.587 + parseInt(h.slice(5, 7), 16) * 0.114; b.style.color = lum > 150 ? "#111" : "#fff";
      b.addEventListener("click", function () { ToolsHub.copy(h.toUpperCase(), function () { setStatus(h.toUpperCase() + ToolsHub.t(" copied", " کاپی ہو گیا"), "ok"); }); });
      box.appendChild(b);
    });
  }
  function load(f) {
    loadImage(f, function (im) {
      img = im; var k = Math.min(1, 700 / im.naturalWidth), c = document.createElement("canvas");
      c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      $("prev").src = c.toDataURL("image/jpeg", 0.85); work.hidden = false; setStatus(""); extract();
    });
  }
  $("cnt").addEventListener("change", extract);
  $("copyAll").addEventListener("click", function () { ToolsHub.copy(cols.map(function (c) { return c.toUpperCase(); }).join(", "), function () { setStatus(ToolsHub.t("All colors copied", "تمام رنگ کاپی ہو گئے"), "ok"); }); });
  $("newBtn").addEventListener("click", function () { img = null; work.hidden = true; setStatus(""); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
