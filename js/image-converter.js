/* Image Resizer & Converter - canvas, runs in the browser */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var items = [], files = [];
  var dropzone = $("dropzone"), fileInput = $("fileInput"), list = $("list"),
      actions = $("actions"), statusEl = $("status"), fmt = $("fmt"),
      scale = $("scale"), wBox = $("wBox"), wInput = $("wInput");
  var EXT = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function loadImg(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); res(im); };
      im.onerror = function () { URL.revokeObjectURL(url); rej(); };
      im.src = url;
    });
  }

  async function convert(file) {
    var im = await loadImg(file), w = im.naturalWidth, h = im.naturalHeight, nw, nh;
    if (scale.value === "custom") {
      nw = Math.max(1, parseInt(wInput.value, 10) || w);
    } else {
      nw = Math.max(1, Math.round(w * parseInt(scale.value, 10) / 100));
    }
    nh = Math.max(1, Math.round(h * nw / w));
    var c = document.createElement("canvas"); c.width = nw; c.height = nh;
    var ctx = c.getContext("2d"), type = fmt.value;
    if (type === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, nw, nh); }
    ctx.drawImage(im, 0, 0, nw, nh);
    var blob = await new Promise(function (r) { c.toBlob(r, type, 0.92); });
    if (!blob) throw new Error();
    return { blob: blob, name: file.name.replace(/\.[^.]+$/, "") + "-" + nw + "x" + nh + EXT[type], dim: w + "×" + h + " → " + nw + "×" + nh };
  }

  async function run() {
    items = [];
    if (!files.length) { render(); return; }
    setStatus(ToolsHub.t("Working...", "کام جاری ہے..."));
    for (var i = 0; i < files.length; i++) {
      try { items.push(await convert(files[i])); }
      catch (e) { setStatus(ToolsHub.t("Cannot process: ", "پروسیس نہیں ہو سکی: ") + files[i].name, "err"); render(); return; }
    }
    setStatus(""); render();
  }

  function render() {
    list.innerHTML = "";
    items.forEach(function (it, idx) {
      var row = document.createElement("div"); row.className = "pdf-row";
      var name = document.createElement("div"); name.className = "name"; name.textContent = "🖼️ " + it.name;
      var meta = document.createElement("div"); meta.className = "meta"; meta.textContent = it.dim + " · " + ToolsHub.formatSize(it.blob.size);
      var dl = document.createElement("button"); dl.type = "button"; dl.textContent = "⬇";
      dl.addEventListener("click", function () { ToolsHub.download(it.blob, it.name); });
      var rm = document.createElement("button"); rm.type = "button"; rm.textContent = "✕";
      rm.addEventListener("click", function () { files.splice(idx, 1); run(); });
      row.append(name, meta, dl, rm);
      list.appendChild(row);
    });
    actions.hidden = !items.length;
  }

  function add(list) {
    var ok = Array.prototype.filter.call(list, function (f) { return /^image\/(jpeg|png|webp)$/.test(f.type); });
    if (!ok.length) { setStatus(ToolsHub.t("Please choose JPG, PNG or WebP images.", "براہ کرم JPG، PNG یا WebP تصاویر چنیں۔"), "err"); return; }
    files = files.concat(ok); run();
  }

  scale.addEventListener("change", function () { wBox.hidden = scale.value !== "custom"; run(); });
  fmt.addEventListener("change", run);
  wInput.addEventListener("change", run);
  $("allBtn").addEventListener("click", function () {
    items.forEach(function (it, i) { setTimeout(function () { ToolsHub.download(it.blob, it.name); }, i * 400); });
  });
  $("clearBtn").addEventListener("click", function () { files = []; items = []; setStatus(""); render(); });

  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { add(fileInput.files); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { add(e.dataTransfer.files); });
})();
