/* PDF to Images - runs fully in the browser using pdf.js + JSZip */
(function () {
  "use strict";

  var pdfFile = null;
  var results = []; // { name, blob, url }

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var fileInfo = document.getElementById("fileInfo");
  var options = document.getElementById("options");
  var actions = document.getElementById("actions");
  var convertBtn = document.getElementById("convertBtn");
  var zipBtn = document.getElementById("zipBtn");
  var clearBtn = document.getElementById("clearBtn");
  var progress = document.getElementById("progress");
  var statusEl = document.getElementById("status");
  var pageGrid = document.getElementById("pageGrid");

  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  function setStatus(msg, type) {
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  function clearResults() {
    results.forEach(function (r) { URL.revokeObjectURL(r.url); });
    results = [];
    pageGrid.innerHTML = "";
    zipBtn.hidden = true;
    progress.hidden = true;
  }

  function setFile(f) {
    if (!f) return;
    var isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf) {
      setStatus(ToolsHub.t("Please choose a PDF file.", "براہ کرم PDF فائل چنیں۔"), "err");
      return;
    }
    clearResults();
    pdfFile = f;
    fileInfo.hidden = false;
    fileInfo.textContent = "📄 " + f.name + " (" + ToolsHub.formatSize(f.size) + ")";
    options.hidden = false;
    actions.hidden = false;
    setStatus("");
  }

  function canvasToBlob(canvas, mime) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (b) {
        b ? resolve(b) : reject(new Error("Image creation failed"));
      }, mime, 0.92);
    });
  }

  function addResult(pageNum, blob, ext) {
    var base = pdfFile.name.replace(/\.pdf$/i, "");
    var name = base + "-page-" + pageNum + "." + ext;
    var url = URL.createObjectURL(blob);
    results.push({ name: name, blob: blob, url: url });

    var box = document.createElement("div");
    box.className = "page-item";

    var img = document.createElement("img");
    img.src = url;
    img.alt = name;

    var cap = document.createElement("div");
    cap.className = "cap";
    cap.textContent = ToolsHub.t("Page ", "صفحہ ") + pageNum + " · " + ToolsHub.formatSize(blob.size);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = ToolsHub.t("Download", "ڈاؤن لوڈ");
    btn.addEventListener("click", function () { ToolsHub.download(blob, name); });

    box.appendChild(img);
    box.appendChild(cap);
    box.appendChild(btn);
    pageGrid.appendChild(box);
  }

  async function convert() {
    if (!pdfFile) return;
    if (!window.pdfjsLib) {
      setStatus(ToolsHub.t("PDF library failed to load. Check your internet and refresh.",
        "PDF لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور صفحہ ریفریش کریں۔"), "err");
      return;
    }

    convertBtn.disabled = true;
    clearResults();
    progress.hidden = false;
    progress.value = 0;

    var format = document.getElementById("format").value;
    var scale = parseFloat(document.getElementById("scale").value);
    var mime = format === "png" ? "image/png" : "image/jpeg";
    var ext = format === "png" ? "png" : "jpg";

    try {
      setStatus(ToolsHub.t("Reading PDF...", "PDF پڑھی جا رہی ہے..."));
      var data = new Uint8Array(await pdfFile.arrayBuffer());
      var pdf = await pdfjsLib.getDocument({ data: data }).promise;
      var total = pdf.numPages;

      for (var p = 1; p <= total; p++) {
        setStatus(ToolsHub.t("Converting page ", "صفحہ کنورٹ ہو رہا ہے ") + p + " / " + total);
        var page = await pdf.getPage(p);
        var viewport = page.getViewport({ scale: scale });

        var canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        var ctx = canvas.getContext("2d");
        if (format === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        var blob = await canvasToBlob(canvas, mime);
        addResult(p, blob, ext);

        canvas.width = canvas.height = 0; // free memory
        progress.value = Math.round((p / total) * 100);
      }

      zipBtn.hidden = total < 2;
      setStatus(ToolsHub.t("Done! ", "ہو گیا! ") + total + ToolsHub.t(" page(s) converted.", " صفحات کنورٹ ہوئے۔"), "ok");
    } catch (e) {
      console.error(e);
      var msg = e && e.name === "PasswordException"
        ? ToolsHub.t("This PDF is password protected.", "یہ PDF پاس ورڈ سے محفوظ ہے۔")
        : ToolsHub.t("Something went wrong: ", "کچھ غلط ہو گیا: ") + (e && e.message ? e.message : e);
      setStatus(msg, "err");
    } finally {
      convertBtn.disabled = false;
    }
  }

  async function downloadZip() {
    if (!results.length) return;
    if (!window.JSZip) {
      setStatus(ToolsHub.t("ZIP library failed to load. Refresh the page.", "ZIP لائبریری لوڈ نہیں ہوئی۔ صفحہ ریفریش کریں۔"), "err");
      return;
    }
    zipBtn.disabled = true;
    setStatus(ToolsHub.t("Creating ZIP...", "ZIP بن رہی ہے..."));
    try {
      var zip = new JSZip();
      results.forEach(function (r) { zip.file(r.name, r.blob); });
      var blob = await zip.generateAsync({ type: "blob" });
      ToolsHub.download(blob, pdfFile.name.replace(/\.pdf$/i, "") + "-images.zip");
      setStatus(ToolsHub.t("ZIP downloaded.", "ZIP ڈاؤن لوڈ ہو گئی۔"), "ok");
    } catch (e) {
      setStatus(ToolsHub.t("ZIP failed: ", "ZIP نہیں بن سکی: ") + e.message, "err");
    } finally {
      zipBtn.disabled = false;
    }
  }

  function clearAll() {
    clearResults();
    pdfFile = null;
    fileInfo.hidden = true;
    options.hidden = true;
    actions.hidden = true;
    setStatus("");
  }

  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () {
    setFile(fileInput.files[0]);
    fileInput.value = "";
  });
  ["dragenter", "dragover"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) {
      e.preventDefault();
      dropzone.classList.add("drag");
    });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) {
      e.preventDefault();
      dropzone.classList.remove("drag");
    });
  });
  dropzone.addEventListener("drop", function (e) {
    setFile(e.dataTransfer.files[0]);
  });

  convertBtn.addEventListener("click", convert);
  zipBtn.addEventListener("click", downloadZip);
  clearBtn.addEventListener("click", clearAll);
})();
