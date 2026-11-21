/* Favicon Maker - PNG sizes, ICO (PNG-in-ICO) and ZIP */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var img = null, work = $("work"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput");
  var SIZES = [16, 32, 48, 64, 180, 192, 512];
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }
  function make(size) {
    var c = document.createElement("canvas"); c.width = c.height = size; var x = c.getContext("2d");
    if ($("bgm").value === "c") { x.fillStyle = $("bg").value; x.fillRect(0, 0, size, size); }
    var p = size * (+$("pad").value / 100), s = Math.max(img.naturalWidth, img.naturalHeight), side = Math.min(img.naturalWidth, img.naturalHeight);
    // contain-fit for padding > 0, otherwise centered square crop (cover)
    if (+$("pad").value > 0) { var k = (size - 2 * p) / s; x.imageSmoothingQuality = "high"; x.drawImage(img, (size - img.naturalWidth * k) / 2, (size - img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k); }
    else { x.imageSmoothingQuality = "high"; x.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size); }
    return c;
  }
  function blobOf(c) { return new Promise(function (r) { c.toBlob(r, "image/png"); }); }
  function refresh() {
    if (!img) return; var box = $("prevs"); box.innerHTML = "";
    [16, 32, 64, 180].forEach(function (s) { var d = document.createElement("div"), c = make(s); d.append(c, document.createTextNode(s + "px")); box.appendChild(d); });
  }
  async function buildIco() {
    var sizes = [16, 32, 48], pngs = [];
    for (var i = 0; i < sizes.length; i++) pngs.push(new Uint8Array(await (await blobOf(make(sizes[i]))).arrayBuffer()));
    var head = 6 + 16 * sizes.length, total = head + pngs.reduce(function (a, p) { return a + p.length; }, 0), buf = new Uint8Array(total), dv = new DataView(buf.buffer), off = head;
    dv.setUint16(2, 1, true); dv.setUint16(4, sizes.length, true);
    sizes.forEach(function (s, i) { var o = 6 + i * 16; buf[o] = s; buf[o + 1] = s; dv.setUint16(o + 4, 1, true); dv.setUint16(o + 6, 32, true); dv.setUint32(o + 8, pngs[i].length, true); dv.setUint32(o + 12, off, true); buf.set(pngs[i], off); off += pngs[i].length; });
    return new Blob([buf], { type: "image/x-icon" });
  }
  function load(f) {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return; }
    var u = URL.createObjectURL(f), im = new Image();
    im.onload = function () { URL.revokeObjectURL(u); img = im; work.hidden = false; setStatus(""); refresh(); };
    im.onerror = function () { URL.revokeObjectURL(u); setStatus(ToolsHub.t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); };
    im.src = u;
  }
  ["bgm", "bg", "pad"].forEach(function (id) { $(id).addEventListener("input", refresh); });
  $("ico").addEventListener("click", async function () { if (img) ToolsHub.download(await buildIco(), "favicon.ico"); });
  $("zip").addEventListener("click", async function () {
    if (!img) return;
    if (!window.JSZip) { setStatus(ToolsHub.t("ZIP library failed to load. Check internet and refresh.", "ZIP لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return; }
    var z = new JSZip(); z.file("favicon.ico", await buildIco());
    for (var i = 0; i < SIZES.length; i++) z.file(SIZES[i] === 180 ? "apple-touch-icon.png" : "icon-" + SIZES[i] + ".png", await blobOf(make(SIZES[i])));
    z.file("snippet.html", '<link rel="icon" href="/favicon.ico" sizes="any">\n<link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n');
    ToolsHub.download(await z.generateAsync({ type: "blob" }), "favicons.zip");
  });
  $("newBtn").addEventListener("click", function () { img = null; work.hidden = true; setStatus(""); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
