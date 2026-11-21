/* Image Compressor - canvas re-encode, runs in the browser */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var items = []; // { file, blob, name }
  var dropzone = $("dropzone"), fileInput = $("fileInput"), list = $("list"),
      actions = $("actions"), statusEl = $("status"), q = $("quality"), mw = $("maxW");

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function loadImg(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); res(im); };
      im.onerror = function () { URL.revokeObjectURL(url); rej(new Error(file.name)); };
      im.src = url;
    });
  }

  async function compress(file) {
    var im = await loadImg(file);
    var w = im.naturalWidth, h = im.naturalHeight, max = parseInt(mw.value, 10);
    if (max && w > max) { h = Math.round(h * max / w); w = max; }
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    var ctx = c.getContext("2d");
    var type = file.type === "image/png" ? "image/webp" : file.type; // PNG ignores quality, so WebP is used
    if (type === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
    ctx.drawImage(im, 0, 0, w, h);
    var blob = await new Promise(function (r) { c.toBlob(r, type, parseFloat(q.value)); });
    if (!blob || blob.size >= file.size) blob = file; // never return a bigger file
    var ext = blob === file ? (file.name.match(/\.[^.]+$/) || [".jpg"])[0] : (type === "image/webp" ? ".webp" : ".jpg");
    return { file: file, blob: blob, name: file.name.replace(/\.[^.]+$/, "") + "-compressed" + ext };
  }

  async function run(files) {
    var imgs = Array.prototype.filter.call(files, function (f) { return /^image\/(jpeg|png|webp)$/.test(f.type); });
    if (!imgs.length) { setStatus(ToolsHub.t("Please choose JPG, PNG or WebP images.", "براہ کرم JPG، PNG یا WebP تصاویر چنیں۔"), "err"); return; }
    setStatus(ToolsHub.t("Compressing...", "کمپریس ہو رہی ہیں..."));
    for (var i = 0; i < imgs.length; i++) {
      try { items.push(await compress(imgs[i])); }
      catch (e) { setStatus(ToolsHub.t("Cannot read: ", "پڑھی نہیں جا سکی: ") + imgs[i].name, "err"); return; }
    }
    setStatus(""); render();
  }

  function render() {
    list.innerHTML = "";
    items.forEach(function (it, idx) {
      var row = document.createElement("div"); row.className = "pdf-row";
      var name = document.createElement("div"); name.className = "name"; name.textContent = "🖼️ " + it.name;
      var meta = document.createElement("div"); meta.className = "meta";
      var pct = Math.max(0, Math.round((1 - it.blob.size / it.file.size) * 100));
      meta.textContent = ToolsHub.formatSize(it.file.size) + " → " + ToolsHub.formatSize(it.blob.size) + " (-" + pct + "%)";
      var dl = document.createElement("button"); dl.type = "button"; dl.textContent = "⬇";
      dl.addEventListener("click", function () { ToolsHub.download(it.blob, it.name); });
      var rm = document.createElement("button"); rm.type = "button"; rm.textContent = "✕";
      rm.addEventListener("click", function () { items.splice(idx, 1); render(); });
      row.append(name, meta, dl, rm);
      list.appendChild(row);
    });
    actions.hidden = !items.length;
  }

  async function recompress() {
    var files = items.map(function (i) { return i.file; });
    items = []; render();
    if (files.length) await run(files);
  }

  $("allBtn").addEventListener("click", function () {
    items.forEach(function (it, i) { setTimeout(function () { ToolsHub.download(it.blob, it.name); }, i * 400); });
  });
  $("clearBtn").addEventListener("click", function () { items = []; setStatus(""); render(); });
  q.addEventListener("change", recompress);
  mw.addEventListener("change", recompress);

  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { run(fileInput.files); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { run(e.dataTransfer.files); });
})();
