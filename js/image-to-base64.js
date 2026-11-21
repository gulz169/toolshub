/* Image <-> Base64 */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var b64 = $("b64"), prev = $("prev"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput");
  var dataUrl = "", baseName = "image";
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function show() {
    b64.value = $("raw").checked ? dataUrl.replace(/^data:[^,]*,/, "") : dataUrl;
    prev.src = dataUrl; prev.hidden = !dataUrl;
  }
  function load(f) {
    if (!f) return;
    if (!/^image\//.test(f.type)) { setStatus(ToolsHub.t("Please choose an image file.", "براہ کرم تصویر کی فائل چنیں۔"), "err"); return; }
    var rd = new FileReader();
    rd.onload = function () { dataUrl = rd.result; baseName = f.name.replace(/\.[^.]+$/, ""); show(); setStatus(ToolsHub.t("Length: ", "لمبائی: ") + dataUrl.length.toLocaleString() + ToolsHub.t(" characters", " حروف"), "ok"); };
    rd.readAsDataURL(f);
  }
  function guessMime(s) {
    if (/^\/9j\//.test(s)) return "image/jpeg"; if (/^iVBOR/.test(s)) return "image/png"; if (/^R0lGOD/.test(s)) return "image/gif";
    if (/^UklGR/.test(s)) return "image/webp"; if (/^(PHN2Zy|PD94)/.test(s)) return "image/svg+xml"; return "";
  }
  $("toImg").addEventListener("click", function () {
    var s = b64.value.trim().replace(/\s+/g, "");
    if (!s) { setStatus(ToolsHub.t("Paste Base64 first.", "پہلے Base64 پیسٹ کریں۔"), "err"); return; }
    if (!/^data:/.test(s)) { var mt = guessMime(s); if (!mt) { setStatus(ToolsHub.t("Cannot tell the image type. Paste the full data: URL.", "تصویر کی قسم معلوم نہیں ہوئی۔ مکمل data: URL پیسٹ کریں۔"), "err"); return; } s = "data:" + mt + ";base64," + s; }
    var t = new Image();
    t.onload = function () { dataUrl = s; baseName = "image"; prev.src = s; prev.hidden = false; setStatus(t.naturalWidth + " × " + t.naturalHeight + " px", "ok"); };
    t.onerror = function () { setStatus(ToolsHub.t("This is not a valid image.", "یہ درست تصویر نہیں ہے۔"), "err"); };
    t.src = s;
  });
  $("dlBtn").addEventListener("click", function () {
    if (!dataUrl) return;
    var mt = (/^data:([^;,]+)/.exec(dataUrl) || [])[1] || "image/png", ext = mt.split("/")[1].replace("svg+xml", "svg").replace("jpeg", "jpg");
    fetch(dataUrl).then(function (r) { return r.blob(); }).then(function (b) { ToolsHub.download(b, baseName + "." + ext); });
  });
  $("copyBtn").addEventListener("click", function () {
    if (!b64.value) return;
    var done = function () { setStatus(ToolsHub.t("Copied!", "کاپی ہو گیا!"), "ok"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(b64.value).then(done, function () { b64.select(); document.execCommand("copy"); done(); });
    else { b64.select(); document.execCommand("copy"); done(); }
  });
  $("clearBtn").addEventListener("click", function () { dataUrl = ""; b64.value = ""; prev.hidden = true; setStatus(""); });
  $("raw").addEventListener("change", function () { if (dataUrl) show(); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
