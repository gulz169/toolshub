/* Merge PDF - runs fully in the browser using pdf-lib */
(function () {
  "use strict";

  var items = []; // { file }
  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var pdfList = document.getElementById("pdfList");
  var actions = document.getElementById("actions");
  var statusEl = document.getElementById("status");
  var mergeBtn = document.getElementById("mergeBtn");
  var clearBtn = document.getElementById("clearBtn");

  function setStatus(msg, type) {
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  function isPdf(f) {
    return f.type === "application/pdf" || /\.pdf$/i.test(f.name);
  }

  function addFiles(list) {
    var added = 0;
    for (var i = 0; i < list.length; i++) {
      if (!isPdf(list[i])) continue;
      items.push({ file: list[i] });
      added++;
    }
    if (!added && list.length) {
      setStatus(ToolsHub.t("Please choose PDF files only.", "براہ کرم صرف PDF فائلیں چنیں۔"), "err");
    } else {
      setStatus("");
    }
    render();
  }

  function makeBtn(label, fn) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.addEventListener("click", fn);
    return b;
  }

  function render() {
    pdfList.innerHTML = "";
    items.forEach(function (it, idx) {
      var row = document.createElement("div");
      row.className = "pdf-row";

      var num = document.createElement("div");
      num.className = "num";
      num.textContent = idx + 1;

      var name = document.createElement("div");
      name.className = "name";
      name.textContent = "📄 " + it.file.name;

      var meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = ToolsHub.formatSize(it.file.size);

      row.appendChild(num);
      row.appendChild(name);
      row.appendChild(meta);
      row.appendChild(makeBtn("▲", function () { move(idx, -1); }));
      row.appendChild(makeBtn("▼", function () { move(idx, 1); }));
      row.appendChild(makeBtn("✕", function () { items.splice(idx, 1); render(); }));
      pdfList.appendChild(row);
    });
    actions.hidden = items.length === 0;
  }

  function move(idx, dir) {
    var j = idx + dir;
    if (j < 0 || j >= items.length) return;
    var tmp = items[idx];
    items[idx] = items[j];
    items[j] = tmp;
    render();
  }

  async function merge() {
    if (items.length < 2) {
      setStatus(ToolsHub.t("Add at least 2 PDF files.", "کم از کم 2 PDF فائلیں شامل کریں۔"), "err");
      return;
    }
    if (!window.PDFLib) {
      setStatus(ToolsHub.t("PDF library failed to load. Check your internet and refresh.",
        "PDF لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور صفحہ ریفریش کریں۔"), "err");
      return;
    }

    mergeBtn.disabled = true;
    try {
      var out = await PDFLib.PDFDocument.create();
      var totalPages = 0;

      for (var i = 0; i < items.length; i++) {
        var f = items[i].file;
        setStatus(ToolsHub.t("Adding file ", "فائل شامل ہو رہی ہے ") + (i + 1) + " / " + items.length);
        var bytes = new Uint8Array(await f.arrayBuffer());
        var src;
        try {
          src = await PDFLib.PDFDocument.load(bytes);
        } catch (e) {
          throw new Error(f.name + ": " + ToolsHub.t(
            "cannot be read (it may be password protected or damaged).",
            "پڑھی نہیں جا سکی (شاید پاس ورڈ والی یا خراب ہے)۔"));
        }
        var pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach(function (p) { out.addPage(p); });
        totalPages += pages.length;
      }

      var saved = await out.save();
      var blob = new Blob([saved], { type: "application/pdf" });
      ToolsHub.download(blob, "merged.pdf");
      setStatus(ToolsHub.t("Done! Merged PDF has ", "ہو گیا! مرج شدہ PDF میں ") + totalPages +
        ToolsHub.t(" pages (", " صفحات ہیں (") + ToolsHub.formatSize(blob.size) + ")", "ok");
    } catch (e) {
      console.error(e);
      setStatus(e.message, "err");
    } finally {
      mergeBtn.disabled = false;
    }
  }

  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () {
    addFiles(fileInput.files);
    fileInput.value = "";
  });
  ["dragenter", "dragover"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); });
  });
  dropzone.addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });

  mergeBtn.addEventListener("click", merge);
  clearBtn.addEventListener("click", function () { items = []; setStatus(""); render(); });
})();
