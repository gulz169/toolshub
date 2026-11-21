/* Image to PDF - runs fully in the browser using pdf-lib */
(function () {
  "use strict";

  var items = []; // { file, url }
  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var fileList = document.getElementById("fileList");
  var options = document.getElementById("options");
  var actions = document.getElementById("actions");
  var statusEl = document.getElementById("status");
  var convertBtn = document.getElementById("convertBtn");
  var clearBtn = document.getElementById("clearBtn");

  var PAGE_SIZES = {
    a4: [595.28, 841.89],
    letter: [612, 792]
  };

  function setStatus(msg, type) {
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  function addFiles(fileListLike) {
    var added = 0;
    for (var i = 0; i < fileListLike.length; i++) {
      var f = fileListLike[i];
      if (!/^image\//.test(f.type)) continue;
      items.push({ file: f, url: URL.createObjectURL(f) });
      added++;
    }
    if (!added && fileListLike.length) {
      setStatus(ToolsHub.t("Please choose image files only.", "براہ کرم صرف تصاویر چنیں۔"), "err");
    } else {
      setStatus("");
    }
    render();
  }

  function render() {
    fileList.innerHTML = "";
    items.forEach(function (it, idx) {
      var div = document.createElement("div");
      div.className = "file-item";

      var num = document.createElement("div");
      num.className = "num";
      num.textContent = idx + 1;

      var img = document.createElement("img");
      img.src = it.url;
      img.alt = it.file.name;

      var name = document.createElement("div");
      name.className = "name";
      name.textContent = it.file.name + " (" + ToolsHub.formatSize(it.file.size) + ")";

      var ctrl = document.createElement("div");
      ctrl.className = "ctrl";
      ctrl.appendChild(makeBtn("◀", function () { move(idx, -1); }));
      ctrl.appendChild(makeBtn("✕", function () { remove(idx); }));
      ctrl.appendChild(makeBtn("▶", function () { move(idx, 1); }));

      div.appendChild(num);
      div.appendChild(img);
      div.appendChild(name);
      div.appendChild(ctrl);
      fileList.appendChild(div);
    });

    var has = items.length > 0;
    options.hidden = !has;
    actions.hidden = !has;
  }

  function makeBtn(label, fn) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.addEventListener("click", fn);
    return b;
  }

  function move(idx, dir) {
    var j = idx + dir;
    if (j < 0 || j >= items.length) return;
    var tmp = items[idx];
    items[idx] = items[j];
    items[j] = tmp;
    render();
  }

  function remove(idx) {
    URL.revokeObjectURL(items[idx].url);
    items.splice(idx, 1);
    render();
  }

  function clearAll() {
    items.forEach(function (it) { URL.revokeObjectURL(it.url); });
    items = [];
    setStatus("");
    render();
  }

  // Draw image to a canvas (handles EXIF rotation + WebP etc.) and return bytes
  function imageToBytes(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        var isPng = file.type === "image/png";
        if (!isPng) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        var mime = isPng ? "image/png" : "image/jpeg";
        canvas.toBlob(function (blob) {
          URL.revokeObjectURL(url);
          if (!blob) return reject(new Error("canvas failed"));
          blob.arrayBuffer().then(function (buf) {
            resolve({ bytes: new Uint8Array(buf), isPng: isPng, w: canvas.width, h: canvas.height });
          });
        }, mime, 0.92);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("Cannot read " + file.name));
      };
      img.src = url;
    });
  }

  async function convert() {
    if (!items.length) return;
    if (!window.PDFLib) {
      setStatus(ToolsHub.t("PDF library failed to load. Check your internet and refresh.",
        "PDF لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور صفحہ ریفریش کریں۔"), "err");
      return;
    }

    convertBtn.disabled = true;
    setStatus(ToolsHub.t("Creating PDF...", "PDF بن رہی ہے..."));

    try {
      var pdf = await PDFLib.PDFDocument.create();
      var sizeOpt = document.getElementById("pageSize").value;
      var orient = document.getElementById("orientation").value;
      var margin = parseInt(document.getElementById("margin").value, 10);

      for (var i = 0; i < items.length; i++) {
        setStatus(ToolsHub.t("Processing image ", "تصویر پروسیس ہو رہی ہے ") + (i + 1) + " / " + items.length);
        var data = await imageToBytes(items[i].file);
        var embedded = data.isPng ? await pdf.embedPng(data.bytes) : await pdf.embedJpg(data.bytes);

        var pageW, pageH;
        if (sizeOpt === "fit") {
          pageW = data.w;
          pageH = data.h;
        } else {
          var base = PAGE_SIZES[sizeOpt];
          var landscape = orient === "landscape" || (orient === "auto" && data.w > data.h);
          pageW = landscape ? base[1] : base[0];
          pageH = landscape ? base[0] : base[1];
        }

        var page = pdf.addPage([pageW, pageH]);
        var m = sizeOpt === "fit" ? 0 : margin;
        var availW = pageW - m * 2;
        var availH = pageH - m * 2;
        var scale = Math.min(availW / data.w, availH / data.h);
        var drawW = data.w * scale;
        var drawH = data.h * scale;

        page.drawImage(embedded, {
          x: (pageW - drawW) / 2,
          y: (pageH - drawH) / 2,
          width: drawW,
          height: drawH
        });
      }

      var out = await pdf.save();
      var blob = new Blob([out], { type: "application/pdf" });
      ToolsHub.download(blob, "images-to-pdf.pdf");
      setStatus(ToolsHub.t("Done! PDF downloaded (", "ہو گیا! PDF ڈاؤن لوڈ ہو گئی (") + ToolsHub.formatSize(blob.size) + ")", "ok");
    } catch (e) {
      console.error(e);
      setStatus(ToolsHub.t("Something went wrong: ", "کچھ غلط ہو گیا: ") + e.message, "err");
    } finally {
      convertBtn.disabled = false;
    }
  }

  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () {
    addFiles(fileInput.files);
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
    addFiles(e.dataTransfer.files);
  });

  convertBtn.addEventListener("click", convert);
  clearBtn.addEventListener("click", clearAll);
})();
