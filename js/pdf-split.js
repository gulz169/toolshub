/* Split PDF - runs fully in the browser using pdf-lib + JSZip */
(function () {
  "use strict";

  var pdfFile = null;
  var srcDoc = null;
  var pageCount = 0;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var fileInfo = document.getElementById("fileInfo");
  var controls = document.getElementById("controls");
  var rangeBox = document.getElementById("rangeBox");
  var rangeInput = document.getElementById("rangeInput");
  var splitBtn = document.getElementById("splitBtn");
  var clearBtn = document.getElementById("clearBtn");
  var statusEl = document.getElementById("status");

  function setStatus(msg, type) {
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  function getMode() {
    return document.querySelector('input[name="mode"]:checked').value;
  }

  function baseName() {
    return pdfFile.name.replace(/\.pdf$/i, "");
  }

  // "1-3, 5, 8-10" -> [0,1,2,4,7,8,9]  (zero-based, in the order typed)
  function parseRanges(text, max) {
    var out = [];
    var parts = text.replace(/\s+/g, "").split(",").filter(Boolean);
    if (!parts.length) throw new Error(ToolsHub.t("Enter the pages you want, e.g. 1-3, 5", "مطلوبہ صفحات لکھیں، جیسے 1-3, 5"));
    parts.forEach(function (part) {
      var m = /^(\d+)(?:-(\d+))?$/.exec(part);
      if (!m) throw new Error(ToolsHub.t("Invalid range: ", "غلط رینج: ") + part);
      var a = parseInt(m[1], 10);
      var b = m[2] ? parseInt(m[2], 10) : a;
      if (a < 1 || b < 1 || a > max || b > max) {
        throw new Error(ToolsHub.t("Page out of range (this PDF has ", "صفحہ حد سے باہر ہے (اس PDF میں ") + max +
          ToolsHub.t(" pages): ", " صفحات ہیں): ") + part);
      }
      if (a > b) throw new Error(ToolsHub.t("Invalid range: ", "غلط رینج: ") + part);
      for (var p = a; p <= b; p++) out.push(p - 1);
    });
    return out;
  }

  async function setFile(f) {
    if (!f) return;
    var isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf) {
      setStatus(ToolsHub.t("Please choose a PDF file.", "براہ کرم PDF فائل چنیں۔"), "err");
      return;
    }
    if (!window.PDFLib) {
      setStatus(ToolsHub.t("PDF library failed to load. Check your internet and refresh.",
        "PDF لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور صفحہ ریفریش کریں۔"), "err");
      return;
    }
    setStatus(ToolsHub.t("Reading PDF...", "PDF پڑھی جا رہی ہے..."));
    try {
      var bytes = new Uint8Array(await f.arrayBuffer());
      srcDoc = await PDFLib.PDFDocument.load(bytes);
      pdfFile = f;
      pageCount = srcDoc.getPageCount();
      fileInfo.hidden = false;
      fileInfo.textContent = "📄 " + f.name + " (" + ToolsHub.formatSize(f.size) + ") — " +
        pageCount + ToolsHub.t(" pages", " صفحات");
      controls.hidden = false;
      rangeInput.value = "";
      setStatus("");
    } catch (e) {
      console.error(e);
      srcDoc = null;
      pdfFile = null;
      controls.hidden = true;
      fileInfo.hidden = true;
      setStatus(ToolsHub.t("This PDF cannot be read (it may be password protected or damaged).",
        "یہ PDF پڑھی نہیں جا سکی (شاید پاس ورڈ والی یا خراب ہے)۔"), "err");
    }
  }

  async function split() {
    if (!srcDoc) return;
    splitBtn.disabled = true;
    try {
      if (getMode() === "range") {
        var idx = parseRanges(rangeInput.value, pageCount);
        setStatus(ToolsHub.t("Creating PDF...", "PDF بن رہی ہے..."));
        var out = await PDFLib.PDFDocument.create();
        var pages = await out.copyPages(srcDoc, idx);
        pages.forEach(function (p) { out.addPage(p); });
        var blob = new Blob([await out.save()], { type: "application/pdf" });
        ToolsHub.download(blob, baseName() + "-pages.pdf");
        setStatus(ToolsHub.t("Done! New PDF has ", "ہو گیا! نئی PDF میں ") + idx.length +
          ToolsHub.t(" page(s).", " صفحات ہیں۔"), "ok");
      } else {
        if (!window.JSZip) throw new Error(ToolsHub.t("ZIP library failed to load. Refresh the page.", "ZIP لائبریری لوڈ نہیں ہوئی۔ صفحہ ریفریش کریں۔"));
        var zip = new JSZip();
        var pad = String(pageCount).length;
        for (var i = 0; i < pageCount; i++) {
          setStatus(ToolsHub.t("Splitting page ", "صفحہ الگ ہو رہا ہے ") + (i + 1) + " / " + pageCount);
          var single = await PDFLib.PDFDocument.create();
          var cp = await single.copyPages(srcDoc, [i]);
          single.addPage(cp[0]);
          var num = String(i + 1);
          while (num.length < pad) num = "0" + num;
          zip.file(baseName() + "-page-" + num + ".pdf", await single.save());
        }
        setStatus(ToolsHub.t("Creating ZIP...", "ZIP بن رہی ہے..."));
        var zblob = await zip.generateAsync({ type: "blob" });
        ToolsHub.download(zblob, baseName() + "-split.zip");
        setStatus(ToolsHub.t("Done! ", "ہو گیا! ") + pageCount + ToolsHub.t(" PDFs in the ZIP.", " PDF فائلیں ZIP میں ہیں۔"), "ok");
      }
    } catch (e) {
      console.error(e);
      setStatus(e.message, "err");
    } finally {
      splitBtn.disabled = false;
    }
  }

  function clearAll() {
    pdfFile = null;
    srcDoc = null;
    pageCount = 0;
    fileInfo.hidden = true;
    controls.hidden = true;
    setStatus("");
  }

  // Show range box only in "range" mode
  Array.prototype.forEach.call(document.querySelectorAll('input[name="mode"]'), function (r) {
    r.addEventListener("change", function () {
      rangeBox.hidden = getMode() !== "range";
    });
  });

  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () {
    setFile(fileInput.files[0]);
    fileInput.value = "";
  });
  ["dragenter", "dragover"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); });
  });
  dropzone.addEventListener("drop", function (e) { setFile(e.dataTransfer.files[0]); });

  splitBtn.addEventListener("click", split);
  clearBtn.addEventListener("click", clearAll);
})();
