/* Background Remover - U2-Net-P (Apache-2.0) via onnxruntime-web, all in the browser */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var SIZE = 320, MAX_SIDE = 2000;
  var dropzone = $("dropzone"), fileInput = $("fileInput"), bar = $("bar"), statusEl = $("status"),
      work = $("work"), orig = $("orig"), result = $("result"), checker = $("checker"),
      bgMode = $("bgMode"), bgColor = $("bgColor"), colorBox = $("colorBox");
  var session = null, cutout = null, baseName = "image"; // cutout = canvas with transparent background

  if (window.ort) {
    ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/";
    ort.env.wasm.numThreads = 1; // works without special server headers
  }

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function loadImg(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { res({ im: im, url: url }); };
      im.onerror = function () { URL.revokeObjectURL(url); rej(); };
      im.src = url;
    });
  }

  async function getSession() {
    if (!session) {
      session = await ort.InferenceSession.create("../models/u2netp.onnx", { executionProviders: ["wasm"] });
    }
    return session;
  }

  async function process(file) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return;
    }
    if (!window.ort) {
      setStatus(ToolsHub.t("AI library failed to load. Check internet and refresh.", "AI لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return;
    }
    work.hidden = true; bar.hidden = false; bar.removeAttribute("value");
    try {
      setStatus(ToolsHub.t("Loading AI model (first time only)...", "AI ماڈل لوڈ ہو رہا ہے (صرف پہلی بار)..."));
      var s = await getSession();
      var loaded = await loadImg(file), im = loaded.im;
      baseName = file.name.replace(/\.[^.]+$/, "");

      // working size (limit very large photos so the browser does not run out of memory)
      var w = im.naturalWidth, h = im.naturalHeight, k = Math.min(1, MAX_SIDE / Math.max(w, h));
      w = Math.round(w * k); h = Math.round(h * k);
      var full = document.createElement("canvas"); full.width = w; full.height = h;
      var fctx = full.getContext("2d"); fctx.drawImage(im, 0, 0, w, h);
      orig.src = loaded.url;

      setStatus(ToolsHub.t("Finding the subject...", "اصل چیز تلاش کی جا رہی ہے..."));
      await new Promise(function (r) { setTimeout(r, 30); }); // let the UI repaint

      // preprocess: resize to 320x320, divide by max, normalise (U2-Net)
      var small = document.createElement("canvas"); small.width = small.height = SIZE;
      var sctx = small.getContext("2d"); sctx.drawImage(full, 0, 0, SIZE, SIZE);
      var px = sctx.getImageData(0, 0, SIZE, SIZE).data, n = SIZE * SIZE, max = 1;
      for (var i = 0; i < n; i++) { max = Math.max(max, px[i * 4], px[i * 4 + 1], px[i * 4 + 2]); }
      var mean = [0.485, 0.456, 0.406], std = [0.229, 0.224, 0.225], input = new Float32Array(3 * n);
      for (i = 0; i < n; i++) {
        for (var c = 0; c < 3; c++) input[c * n + i] = (px[i * 4 + c] / max - mean[c]) / std[c];
      }
      var feeds = {}; feeds[s.inputNames[0]] = new ort.Tensor("float32", input, [1, 3, SIZE, SIZE]);
      var out = (await s.run(feeds))[s.outputNames[0]].data;

      // min-max normalise the mask, scale it up smoothly and use it as alpha
      var mn = Infinity, mx = -Infinity;
      for (i = 0; i < n; i++) { if (out[i] < mn) mn = out[i]; if (out[i] > mx) mx = out[i]; }
      var mask = document.createElement("canvas"); mask.width = mask.height = SIZE;
      var mctx = mask.getContext("2d"), md = mctx.createImageData(SIZE, SIZE);
      for (i = 0; i < n; i++) {
        var a = Math.round((out[i] - mn) / (mx - mn || 1) * 255);
        md.data[i * 4] = md.data[i * 4 + 1] = md.data[i * 4 + 2] = 255; md.data[i * 4 + 3] = a;
      }
      mctx.putImageData(md, 0, 0);

      cutout = document.createElement("canvas"); cutout.width = w; cutout.height = h;
      var cctx = cutout.getContext("2d");
      cctx.imageSmoothingQuality = "high";
      cctx.drawImage(mask, 0, 0, w, h);               // alpha = mask
      cctx.globalCompositeOperation = "source-in";    // keep photo only where mask is opaque
      cctx.drawImage(full, 0, 0);

      work.hidden = false; setStatus(""); draw();
    } catch (e) {
      console.error(e);
      setStatus(ToolsHub.t("Could not process this image. Try another one or refresh the page.", "یہ تصویر پروسیس نہیں ہو سکی۔ دوسری تصویر آزمائیں یا صفحہ ریفریش کریں۔"), "err");
    } finally { bar.hidden = true; }
  }

  function draw() {
    if (!cutout) return;
    result.width = cutout.width; result.height = cutout.height;
    var ctx = result.getContext("2d");
    if (bgMode.value !== "transparent") {
      ctx.fillStyle = bgMode.value === "white" ? "#ffffff" : bgColor.value;
      ctx.fillRect(0, 0, result.width, result.height);
    }
    ctx.drawImage(cutout, 0, 0);
    checker.style.background = bgMode.value === "transparent" ? "" : "none";
    colorBox.hidden = bgMode.value !== "color";
  }

  $("dlBtn").addEventListener("click", function () {
    result.toBlob(function (b) { ToolsHub.download(b, baseName + "-no-bg.png"); }, "image/png");
  });
  $("clearBtn").addEventListener("click", function () { cutout = null; work.hidden = true; setStatus(""); });
  bgMode.addEventListener("change", draw);
  bgColor.addEventListener("input", draw);
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { if (fileInput.files[0]) process(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { if (e.dataTransfer.files[0]) process(e.dataTransfer.files[0]); });
})();
