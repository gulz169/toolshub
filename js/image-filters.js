/* Image Filters - canvas ctx.filter */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var view = $("view"), work = $("work"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput");
  var img = null, baseName = "image", PREV = 800;
  var IDS = ["brightness", "contrast", "saturate", "grayscale", "sepia", "hue", "blur", "invert"];
  var DEF = { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, hue: 0, blur: 0, invert: 0 };
  var PRE = {
    none: {}, bw: { grayscale: 100, contrast: 110 }, sepia: { sepia: 85 }, vivid: { saturate: 160, contrast: 110 },
    vintage: { sepia: 40, contrast: 90, brightness: 110, saturate: 120 }
  };
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }
  function v(id) { return +$(id).value; }
  function filter(k) {
    return "brightness(" + v("brightness") + "%) contrast(" + v("contrast") + "%) saturate(" + v("saturate") + "%) grayscale(" + v("grayscale") +
      "%) sepia(" + v("sepia") + "%) hue-rotate(" + v("hue") + "deg) blur(" + (v("blur") * k) + "px) invert(" + v("invert") + "%)";
  }
  function paint(c, w, h, k) {
    c.width = w; c.height = h; var x = c.getContext("2d");
    x.filter = filter(k); x.drawImage(img, 0, 0, w, h); x.filter = "none";
  }
  function refresh() {
    if (!img) return;
    var k = Math.min(1, PREV / img.naturalWidth);
    paint(view, Math.round(img.naturalWidth * k), Math.round(img.naturalHeight * k), k);
  }
  function setVals(o) { IDS.forEach(function (id) { $(id).value = o[id] != null ? o[id] : DEF[id]; }); refresh(); }

  function load(f) {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return; }
    var u = URL.createObjectURL(f), im = new Image();
    im.onload = function () {
      URL.revokeObjectURL(u); img = im; baseName = f.name.replace(/\.[^.]+$/, "");
      if (!("filter" in view.getContext("2d"))) { setStatus(ToolsHub.t("Your browser does not support filters. Try Chrome, Edge or Firefox.", "آپ کا براؤزر فلٹرز سپورٹ نہیں کرتا۔ Chrome، Edge یا Firefox آزمائیں۔"), "err"); return; }
      work.hidden = false; setStatus(""); setVals({});
    };
    im.onerror = function () { URL.revokeObjectURL(u); setStatus(ToolsHub.t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); };
    im.src = u;
  }
  IDS.forEach(function (id) { $(id).addEventListener("input", refresh); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-p]"), function (b) { b.addEventListener("click", function () { setVals(PRE[b.getAttribute("data-p")]); }); });
  $("resetBtn").addEventListener("click", function () { setVals({}); });
  $("newBtn").addEventListener("click", function () { img = null; work.hidden = true; setStatus(""); });
  $("dlBtn").addEventListener("click", function () {
    var c = document.createElement("canvas"); paint(c, img.naturalWidth, img.naturalHeight, 1);
    c.toBlob(function (b) { ToolsHub.download(b, baseName + "-filtered.png"); }, "image/png");
  });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
