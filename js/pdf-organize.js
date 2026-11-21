/* Reorder PDF pages - pdf.js thumbnails + pdf-lib */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var order = [], thumbs = [], bytes = null, baseName = "document", dragFrom = -1;
  var grid = $("grid"), work = $("work"), bar = $("bar"), statusEl = $("status"), dropzone = $("dropzone"), fileInput = $("fileInput");
  if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function render() {
    grid.innerHTML = "";
    order.forEach(function (orig, pos) {
      var d = document.createElement("div"); d.className = "pg"; d.draggable = true;
      var c = document.createElement("canvas"); c.width = thumbs[orig].width; c.height = thumbs[orig].height; c.getContext("2d").drawImage(thumbs[orig], 0, 0);
      var cap = document.createElement("div"); cap.style.cssText = "font-size:.82rem;opacity:.8;margin-top:4px"; cap.textContent = (pos + 1) + "  (" + ToolsHub.t("was ", "پہلے ") + (orig + 1) + ")";
      var row = document.createElement("div"); row.className = "row";
      [["◀", -1], ["▶", 1]].forEach(function (b) { var bt = document.createElement("button"); bt.type = "button"; bt.textContent = b[0]; bt.addEventListener("click", function () { move(pos, pos + b[1]); }); row.appendChild(bt); });
      d.append(c, cap, row);
      d.addEventListener("dragstart", function (e) { dragFrom = pos; e.dataTransfer.effectAllowed = "move"; try { e.dataTransfer.setData("text/plain", "" + pos); } catch (x) {} });
      d.addEventListener("dragover", function (e) { e.preventDefault(); d.classList.add("over"); });
      d.addEventListener("dragleave", function () { d.classList.remove("over"); });
      d.addEventListener("drop", function (e) { e.preventDefault(); d.classList.remove("over"); if (dragFrom >= 0) { move(dragFrom, pos); dragFrom = -1; } });
      grid.appendChild(d);
    });
  }
  function move(a, b) { if (b < 0 || b >= order.length || a === b) return; var x = order.splice(a, 1)[0]; order.splice(b, 0, x); render(); }

  async function load(f) {
    if (!f) return;
    if (!(f.type === "application/pdf" || /\.pdf$/i.test(f.name))) { setStatus(ToolsHub.t("Please choose a PDF file.", "براہ کرم PDF فائل چنیں۔"), "err"); return; }
    if (!window.pdfjsLib || !window.PDFLib) { setStatus(ToolsHub.t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return; }
    work.hidden = true; bar.hidden = false; bar.value = 0; thumbs = []; order = [];
    try {
      bytes = new Uint8Array(await f.arrayBuffer()); baseName = f.name.replace(/\.pdf$/i, "");
      var pdf = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
      for (var i = 1; i <= pdf.numPages; i++) {
        setStatus(ToolsHub.t("Page ", "صفحہ ") + i + " / " + pdf.numPages);
        var pg = await pdf.getPage(i), vp = pg.getViewport({ scale: 0.35 }), c = document.createElement("canvas");
        c.width = Math.round(vp.width); c.height = Math.round(vp.height);
        await pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
        thumbs.push(c); order.push(i - 1); bar.value = i / pdf.numPages;
      }
      setStatus(""); work.hidden = false; render();
    } catch (e) { console.error(e); setStatus(ToolsHub.t("This PDF cannot be read (it may be password protected or damaged).", "یہ PDF پڑھی نہیں جا سکی (شاید پاس ورڈ والی یا خراب ہے)۔"), "err"); }
    finally { bar.hidden = true; }
  }
  $("revBtn").addEventListener("click", function () { order.reverse(); render(); });
  $("newBtn").addEventListener("click", function () { work.hidden = true; order = []; thumbs = []; setStatus(""); });
  $("saveBtn").addEventListener("click", async function () {
    try {
      var src = await PDFLib.PDFDocument.load(bytes), out = await PDFLib.PDFDocument.create(), pages = await out.copyPages(src, order);
      pages.forEach(function (p) { out.addPage(p); });
      ToolsHub.download(new Blob([await out.save()], { type: "application/pdf" }), baseName + "-reordered.pdf"); setStatus(ToolsHub.t("Done!", "ہو گیا!"), "ok");
    } catch (e) { console.error(e); setStatus(ToolsHub.t("Could not save the PDF.", "PDF محفوظ نہیں ہو سکی۔"), "err"); }
  });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
