/* Remove image metadata - re-encode through canvas */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var img = null, baseName = "photo", work = $("work"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput");
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  // look for an EXIF block (JPEG APP1) and a GPS entry in its first directory
  function inspect(buf, type) {
    var v = new Uint8Array(buf.slice(0, 262144)), exif = false, gps = false;
    if (type === "image/jpeg" && v[0] === 0xFF && v[1] === 0xD8) {
      var i = 2;
      while (i + 4 < v.length && v[i] === 0xFF) {
        var m = v[i + 1], len = (v[i + 2] << 8) + v[i + 3];
        if (m === 0xE1 && String.fromCharCode(v[i + 4], v[i + 5], v[i + 6], v[i + 7]) === "Exif") {
          exif = true;
          var t = i + 10, le = v[t] === 0x49;
          var r16 = function (o) { return le ? v[o] + (v[o + 1] << 8) : (v[o] << 8) + v[o + 1]; };
          var r32 = function (o) { return le ? (v[o] + (v[o + 1] << 8) + (v[o + 2] << 16) + v[o + 3] * 16777216) : (v[o] * 16777216 + (v[o + 1] << 16) + (v[o + 2] << 8) + v[o + 3]); };
          var ifd = t + r32(t + 4), n = r16(ifd);
          for (var k = 0; k < n && ifd + 2 + k * 12 + 2 < v.length; k++) if (r16(ifd + 2 + k * 12) === 0x8825) gps = true;
          break;
        }
        i += 2 + len;
      }
    } else if (type === "image/png") { exif = /eXIf|tEXt|iTXt/.test(String.fromCharCode.apply(null, v.subarray(0, 4096))); }
    return { exif: exif, gps: gps };
  }

  function load(f) {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return; }
    f.arrayBuffer().then(function (buf) {
      var r = inspect(buf, f.type), u = URL.createObjectURL(f), im = new Image();
      im.onload = function () {
        URL.revokeObjectURL(u); img = im; baseName = f.name.replace(/\.[^.]+$/, ""); work.hidden = false; setStatus("");
        var info = $("info");
        info.className = "status " + (r.gps ? "err" : r.exif ? "" : "ok");
        info.textContent = r.gps ? ToolsHub.t("⚠ This photo contains GPS location data.", "⚠ اس تصویر میں GPS لوکیشن موجود ہے۔")
          : r.exif ? ToolsHub.t("This photo has hidden metadata (camera, date, etc.).", "اس تصویر میں چھپا میٹا ڈیٹا ہے (کیمرا، تاریخ وغیرہ)۔")
          : ToolsHub.t("No obvious metadata found. You can still make a clean copy.", "کوئی واضح میٹا ڈیٹا نہیں ملا۔ پھر بھی صاف کاپی بنا سکتے ہیں۔");
        $("fmt").value = f.type;
      };
      im.onerror = function () { URL.revokeObjectURL(u); setStatus(ToolsHub.t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); };
      im.src = u;
    });
  }
  $("dlBtn").addEventListener("click", function () {
    var type = $("fmt").value, c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
    var x = c.getContext("2d"); if (type === "image/jpeg") { x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); }
    x.drawImage(img, 0, 0);
    var ext = type === "image/png" ? ".png" : type === "image/jpeg" ? ".jpg" : ".webp";
    c.toBlob(function (b) { ToolsHub.download(b, baseName + "-clean" + ext); setStatus(ToolsHub.t("Clean copy saved.", "صاف کاپی محفوظ ہو گئی۔"), "ok"); }, type, 0.95);
  });
  $("newBtn").addEventListener("click", function () { img = null; work.hidden = true; setStatus(""); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
