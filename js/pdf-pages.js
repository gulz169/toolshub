/* Rotate & Delete PDF pages - pdf.js for thumbnails, pdf-lib for saving */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var pages = [], srcBytes = null, baseName = "document";
  var dropzone = $("dropzone"), fileInput = $("fileInput"), grid = $("grid"),
      actions = $("actions"), statusEl = $("status");

  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  async function load(f) {
    if (!f) return;
    if (!(f.type === "application/pdf" || /\.pdf$/i.test(f.name))) {
      setStatus(ToolsHub.t("Please choose a PDF file.", "براہ کرم PDF فائل چنیں۔"), "err"); return;
    }
    if (!window.pdfjsLib || !window.PDFLib) {
      setStatus(ToolsHub.t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return;
    }
    setStatus(ToolsHub.t("Loading pages...", "صفحات لوڈ ہو رہے ہیں..."));
    try {
      srcBytes = new Uint8Array(await f.arrayBuffer());
      baseName = f.name.replace(/\.pdf$/i, "");
      var pdf = await pdfjsLib.getDocument({ data: srcBytes.slice() }).promise;
      pages = [];
      grid.innerHTML = "";
      for (var i = 1; i <= pdf.numPages; i++) {
        var pg = await pdf.getPage(i);
        var vp = pg.getViewport({ scale: 0.4 });
        var c = document.createElement("canvas");
        c.width = vp.width; c.height = vp.height;
        await pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
        pages.push({ canvas: c, rot: 0, gone: false });
      }
      setStatus(""); render();
    } catch (e) {
      console.error(e);
      setStatus(ToolsHub.t("This PDF cannot be read (it may be password protected or damaged).", "یہ PDF پڑھی نہیں جا سکی (شاید پاس ورڈ والی یا خراب ہے)۔"), "err");
    }
  }

  function btn(label, fn) {
    var b = document.createElement("button"); b.type = "button"; b.className = "btn"; b.textContent = label;
    b.addEventListener("click", fn); return b;
  }

  function render() {
    grid.innerHTML = "";
    pages.forEach(function (p, i) {
      var it = document.createElement("div"); it.className = "page-item" + (p.gone ? " gone" : "");
      var th = document.createElement("div"); th.className = "thumb";
      p.canvas.style.transform = "rotate(" + p.rot + "deg)";
      th.appendChild(p.canvas);
      var cap = document.createElement("div"); cap.className = "cap";
      cap.textContent = ToolsHub.t("Page ", "صفحہ ") + (i + 1);
      var row = document.createElement("div"); row.className = "row";
      row.appendChild(btn("↻", function () { p.rot = (p.rot + 90) % 360; render(); }));
      row.appendChild(btn(p.gone ? "↩" : "✕", function () { p.gone = !p.gone; render(); }));
      it.append(th, cap, row);
      grid.appendChild(it);
    });
    actions.hidden = !pages.length;
  }

  async function save() {
    var keep = pages.filter(function (p) { return !p.gone; }).length;
    if (!keep) { setStatus(ToolsHub.t("Keep at least one page.", "کم از کم ایک صفحہ رکھیں۔"), "err"); return; }
    try {
      var doc = await PDFLib.PDFDocument.load(srcBytes);
      for (var i = pages.length - 1; i >= 0; i--) {
        if (pages[i].gone) { doc.removePage(i); continue; }
        if (pages[i].rot) {
          var pg = doc.getPage(i);
          pg.setRotation(PDFLib.degrees((pg.getRotation().angle + pages[i].rot) % 360));
        }
      }
      var blob = new Blob([await doc.save()], { type: "application/pdf" });
      ToolsHub.download(blob, baseName + "-edited.pdf");
      setStatus(ToolsHub.t("Done! ", "ہو گیا! ") + keep + ToolsHub.t(" pages saved.", " صفحات محفوظ ہوئے۔"), "ok");
    } catch (e) {
      console.error(e);
      setStatus(ToolsHub.t("Could not save the PDF.", "PDF محفوظ نہیں ہو سکی۔"), "err");
    }
  }

  $("saveBtn").addEventListener("click", save);
  $("rotAllBtn").addEventListener("click", function () { pages.forEach(function (p) { p.rot = (p.rot + 90) % 360; }); render(); });
  $("clearBtn").addEventListener("click", function () { pages = []; srcBytes = null; grid.innerHTML = ""; setStatus(""); render(); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
