/* Blur / Pixelate / Box selected areas */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var img = null, rects = [], drag = null, view = $("view"), work = $("work"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput"), baseName = "image";
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }
  function effect(x, r) {
    var W = img.naturalWidth, st = +$("str").value;
    if (r.m === "box") { x.fillStyle = "#000"; x.fillRect(r.x, r.y, r.w, r.h); return; }
    if (r.m === "blur" && "filter" in x) { x.save(); x.beginPath(); x.rect(r.x, r.y, r.w, r.h); x.clip(); x.filter = "blur(" + Math.max(2, W * 0.004 * st) + "px)"; x.drawImage(img, 0, 0); x.restore(); return; }
    var bs = Math.max(4, Math.round(W * 0.004 * st * 1.4)), tw = Math.max(1, Math.round(r.w / bs)), th = Math.max(1, Math.round(r.h / bs)), t = document.createElement("canvas"); t.width = tw; t.height = th;
    t.getContext("2d").drawImage(img, r.x, r.y, r.w, r.h, 0, 0, tw, th); x.imageSmoothingEnabled = false; x.drawImage(t, 0, 0, tw, th, r.x, r.y, r.w, r.h); x.imageSmoothingEnabled = true;
  }
  function paint(c, sel) {
    c.width = img.naturalWidth; c.height = img.naturalHeight; var x = c.getContext("2d"); x.drawImage(img, 0, 0);
    rects.forEach(function (r) { effect(x, r); });
    if (sel) { x.strokeStyle = "#34d399"; x.lineWidth = Math.max(2, c.width / 300); x.setLineDash([10, 6]); x.strokeRect(sel.x, sel.y, sel.w, sel.h); x.setLineDash([]); }
  }
  function pt(e) { var r = view.getBoundingClientRect(); return [(e.clientX - r.left) * view.width / r.width, (e.clientY - r.top) * view.height / r.height]; }
  function norm(a, b) { return { x: Math.round(Math.min(a[0], b[0])), y: Math.round(Math.min(a[1], b[1])), w: Math.round(Math.abs(a[0] - b[0])), h: Math.round(Math.abs(a[1] - b[1])) }; }
  view.addEventListener("pointerdown", function (e) { if (!img) return; drag = { s: pt(e) }; view.setPointerCapture(e.pointerId); });
  view.addEventListener("pointermove", function (e) { if (drag) { drag.r = norm(drag.s, pt(e)); paint(view, drag.r); } });
  function end() { if (drag && drag.r && drag.r.w > 4 && drag.r.h > 4) { drag.r.m = $("mode").value; rects.push(drag.r); } drag = null; if (img) paint(view); }
  view.addEventListener("pointerup", end); view.addEventListener("pointercancel", end);
  $("undo").addEventListener("click", function () { rects.pop(); if (img) paint(view); });
  $("str").addEventListener("input", function () { if (img) paint(view); });
  $("dlBtn").addEventListener("click", function () { if (!img) return; var c = document.createElement("canvas"); paint(c); c.toBlob(function (b) { ToolsHub.download(b, baseName + "-hidden.png"); }, "image/png"); });
  $("newBtn").addEventListener("click", function () { img = null; rects = []; work.hidden = true; setStatus(""); });
  function load(f) {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return; }
    var u = URL.createObjectURL(f), im = new Image();
    im.onload = function () { URL.revokeObjectURL(u); img = im; rects = []; baseName = f.name.replace(/\.[^.]+$/, ""); work.hidden = false; setStatus(""); paint(view); };
    im.onerror = function () { URL.revokeObjectURL(u); setStatus(ToolsHub.t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); };
    im.src = u;
  }
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
