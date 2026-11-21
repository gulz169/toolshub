/* Sign PDF - draw/upload signature, place it, save with pdf-lib */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var bytes = null, pdf = null, baseName = "document", scale = 1, pos = null, sig = null, strokes = [], cur = null;
  var view = $("view"), pad = $("pad"), px = pad.getContext("2d"), work = $("work"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput"), pageImg = null;
  if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  // signature pad
  function padDraw() { px.clearRect(0, 0, pad.width, pad.height); px.fillStyle = "#fff"; px.fillRect(0, 0, pad.width, pad.height); px.lineCap = px.lineJoin = "round"; px.strokeStyle = "#111"; px.lineWidth = 4;
    strokes.forEach(function (s) { px.beginPath(); s.forEach(function (p, i) { i ? px.lineTo(p[0], p[1]) : px.moveTo(p[0], p[1]); }); if (s.length === 1) px.lineTo(s[0][0] + .1, s[0][1]); px.stroke(); }); }
  function pp(e) { var r = pad.getBoundingClientRect(); return [(e.clientX - r.left) * pad.width / r.width, (e.clientY - r.top) * pad.height / r.height]; }
  pad.addEventListener("pointerdown", function (e) { cur = [pp(e)]; strokes.push(cur); pad.setPointerCapture(e.pointerId); padDraw(); });
  pad.addEventListener("pointermove", function (e) { if (cur) { cur.push(pp(e)); padDraw(); } });
  pad.addEventListener("pointerup", function () { cur = null; makeSig(); }); pad.addEventListener("pointercancel", function () { cur = null; });
  $("padClear").addEventListener("click", function () { strokes = []; padDraw(); sig = null; redraw(); });
  function makeSig() {
    if (!strokes.length) return; var x0 = 1e9, y0 = 1e9, x1 = 0, y1 = 0;
    strokes.forEach(function (s) { s.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }); });
    x0 = Math.max(0, x0 - 8); y0 = Math.max(0, y0 - 8); x1 = Math.min(pad.width, x1 + 8); y1 = Math.min(pad.height, y1 + 8);
    var c = document.createElement("canvas"); c.width = Math.round(x1 - x0); c.height = Math.round(y1 - y0); var x = c.getContext("2d"); x.lineCap = x.lineJoin = "round"; x.strokeStyle = "#111"; x.lineWidth = 4;
    strokes.forEach(function (s) { x.beginPath(); s.forEach(function (p, i) { i ? x.lineTo(p[0] - x0, p[1] - y0) : x.moveTo(p[0] - x0, p[1] - y0); }); if (s.length === 1) x.lineTo(s[0][0] - x0 + .1, s[0][1] - y0); x.stroke(); });
    sig = c; redraw();
  }
  $("sigFile").addEventListener("change", function () {
    var f = $("sigFile").files[0]; if (!f) return; var u = URL.createObjectURL(f), im = new Image();
    im.onload = function () { URL.revokeObjectURL(u); var c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext("2d").drawImage(im, 0, 0); sig = c; redraw(); };
    im.src = u; $("sigFile").value = "";
  });

  // page preview
  async function showPage() {
    var n = Math.min(Math.max(1, +$("pg").value || 1), pdf.numPages), pg = await pdf.getPage(n), base = pg.getViewport({ scale: 1 });
    scale = Math.min(1.5, 720 / base.width); var vp = pg.getViewport({ scale: scale });
    var c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
    await pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise; pageImg = c; redraw();
  }
  function sigSize() { var w = +$("sz").value; return [w, sig ? w * sig.height / sig.width : 0]; }
  function redraw() {
    if (!pageImg) return; view.width = pageImg.width; view.height = pageImg.height; var x = view.getContext("2d"); x.drawImage(pageImg, 0, 0);
    if (sig && pos) { var s = sigSize(); x.drawImage(sig, pos[0] - s[0] / 2, pos[1] - s[1] / 2, s[0], s[1]); x.strokeStyle = "rgba(52,211,153,.9)"; x.setLineDash([6, 4]); x.strokeRect(pos[0] - s[0] / 2, pos[1] - s[1] / 2, s[0], s[1]); x.setLineDash([]); }
  }
  var down = false;
  function vp(e) { var r = view.getBoundingClientRect(); return [(e.clientX - r.left) * view.width / r.width, (e.clientY - r.top) * view.height / r.height]; }
  view.addEventListener("pointerdown", function (e) { down = true; pos = vp(e); redraw(); view.setPointerCapture(e.pointerId); });
  view.addEventListener("pointermove", function (e) { if (down) { pos = vp(e); redraw(); } });
  view.addEventListener("pointerup", function () { down = false; });
  $("sz").addEventListener("input", redraw); $("pg").addEventListener("change", showPage);

  async function load(f) {
    if (!f) return;
    if (!(f.type === "application/pdf" || /\.pdf$/i.test(f.name))) { setStatus(ToolsHub.t("Please choose a PDF file.", "براہ کرم PDF فائل چنیں۔"), "err"); return; }
    if (!window.pdfjsLib || !window.PDFLib) { setStatus(ToolsHub.t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return; }
    try { bytes = new Uint8Array(await f.arrayBuffer()); baseName = f.name.replace(/\.pdf$/i, ""); pdf = await pdfjsLib.getDocument({ data: bytes.slice() }).promise; $("pg").max = pdf.numPages; $("pg").value = 1; pos = null; work.hidden = false; setStatus(""); padDraw(); await showPage(); }
    catch (e) { console.error(e); setStatus(ToolsHub.t("This PDF cannot be read (it may be password protected or damaged).", "یہ PDF پڑھی نہیں جا سکی (شاید پاس ورڈ والی یا خراب ہے)۔"), "err"); }
  }
  $("goBtn").addEventListener("click", async function () {
    if (!sig) { setStatus(ToolsHub.t("Draw or upload your signature first.", "پہلے دستخط بنائیں یا اپلوڈ کریں۔"), "err"); return; }
    if (!pos) { setStatus(ToolsHub.t("Click on the page to choose where the signature goes.", "صفحے پر کلک کر کے جگہ چنیں۔"), "err"); return; }
    try {
      var doc = await PDFLib.PDFDocument.load(bytes), png = await doc.embedPng(await new Promise(function (r) { sig.toBlob(function (b) { b.arrayBuffer().then(r); }); }));
      var s = sigSize(), cur = Math.min(Math.max(1, +$("pg").value || 1), doc.getPageCount()) - 1, fx = pos[0] / view.width, fy = pos[1] / view.height, fw = s[0] / view.width;
      ($("all").checked ? doc.getPages() : [doc.getPage(cur)]).forEach(function (pg) {
        var z = pg.getSize(), w = fw * z.width, h = w * sig.height / sig.width; pg.drawImage(png, { x: fx * z.width - w / 2, y: z.height - fy * z.height - h / 2, width: w, height: h });
      });
      ToolsHub.download(new Blob([await doc.save()], { type: "application/pdf" }), baseName + "-signed.pdf"); setStatus(ToolsHub.t("Done!", "ہو گیا!"), "ok");
    } catch (e) { console.error(e); setStatus(ToolsHub.t("Could not save the PDF.", "PDF محفوظ نہیں ہو سکی۔"), "err"); }
  });
  $("newBtn").addEventListener("click", function () { pdf = null; bytes = null; work.hidden = true; setStatus(""); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
