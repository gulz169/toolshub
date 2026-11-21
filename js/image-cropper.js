/* Image Cropper - canvas, pointer events (mouse + touch) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var view = $("view"), ctx = view.getContext("2d"), work = $("work"), statusEl = $("status"),
      dropzone = $("dropzone"), fileInput = $("fileInput"), dimEl = $("dim"), fmt = $("fmt");
  var img = null, baseName = "image", scale = 1, ratio = 0;
  var rect = { x: 0, y: 0, w: 0, h: 0 };   // in original image pixels
  var drag = null, HANDLE = 18, MIN = 20;

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function load(file) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      setStatus(ToolsHub.t("Please choose a JPG, PNG or WebP image.", "براہ کرم JPG، PNG یا WebP تصویر چنیں۔"), "err"); return;
    }
    var url = URL.createObjectURL(file), im = new Image();
    im.onload = function () {
      URL.revokeObjectURL(url);
      img = im; baseName = file.name.replace(/\.[^.]+$/, "");
      var maxW = Math.min(760, $("work").parentNode.clientWidth - 40 || 700), maxH = 520;
      scale = Math.min(1, maxW / im.naturalWidth, maxH / im.naturalHeight);
      view.width = Math.round(im.naturalWidth * scale); view.height = Math.round(im.naturalHeight * scale);
      work.hidden = false; setStatus("");
      ratio = 0; setChip("0");
      resetRect(); draw();
    };
    im.onerror = function () { URL.revokeObjectURL(url); setStatus(ToolsHub.t("This image cannot be read.", "یہ تصویر پڑھی نہیں جا سکی۔"), "err"); };
    im.src = url;
  }

  function resetRect() {
    var W = img.naturalWidth, H = img.naturalHeight;
    // start with a centered box covering 80% (respecting the ratio if set)
    var w = W * 0.8, h = H * 0.8;
    if (ratio) { if (w / h > ratio) w = h * ratio; else h = w / ratio; }
    rect = { x: (W - w) / 2, y: (H - h) / 2, w: w, h: h };
  }

  function draw() {
    if (!img) return;
    var cw = view.width, ch = view.height;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);
    var x = rect.x * scale, y = rect.y * scale, w = rect.w * scale, h = rect.h * scale;
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fillRect(0, 0, cw, y); ctx.fillRect(0, y + h, cw, ch - y - h);
    ctx.fillRect(0, y, x, h); ctx.fillRect(x + w, y, cw - x - w, h);
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,.4)";
    ctx.beginPath();
    for (var i = 1; i < 3; i++) {
      ctx.moveTo(x + w * i / 3, y); ctx.lineTo(x + w * i / 3, y + h);
      ctx.moveTo(x, y + h * i / 3); ctx.lineTo(x + w, y + h * i / 3);
    }
    ctx.stroke();
    ctx.fillStyle = "#fff";
    [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(function (p) { ctx.fillRect(p[0] - 6, p[1] - 6, 12, 12); });
    dimEl.textContent = Math.round(rect.w) + " × " + Math.round(rect.h) + " px";
  }

  function pos(e) {
    var r = view.getBoundingClientRect(), k = view.width / r.width;
    return { x: (e.clientX - r.left) * k / scale, y: (e.clientY - r.top) * k / scale, k: k };
  }

  function hit(p) {
    var tol = HANDLE * p.k / scale;
    var c = { tl: [rect.x, rect.y], tr: [rect.x + rect.w, rect.y], bl: [rect.x, rect.y + rect.h], br: [rect.x + rect.w, rect.y + rect.h] };
    for (var k in c) if (Math.abs(p.x - c[k][0]) <= tol && Math.abs(p.y - c[k][1]) <= tol) return k;
    if (p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h) return "move";
    return null;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  view.addEventListener("pointerdown", function (e) {
    if (!img) return;
    var p = pos(e), m = hit(p);
    if (!m) return;
    drag = { mode: m, sx: p.x, sy: p.y, r: { x: rect.x, y: rect.y, w: rect.w, h: rect.h } };
    view.setPointerCapture(e.pointerId);
  });

  view.addEventListener("pointermove", function (e) {
    if (!img) return;
    var p = pos(e);
    if (!drag) {
      var m = hit(p);
      view.style.cursor = !m ? "crosshair" : m === "move" ? "move" : (m === "tl" || m === "br") ? "nwse-resize" : "nesw-resize";
      return;
    }
    var W = img.naturalWidth, H = img.naturalHeight, o = drag.r;
    if (drag.mode === "move") {
      rect.x = clamp(o.x + p.x - drag.sx, 0, W - o.w);
      rect.y = clamp(o.y + p.y - drag.sy, 0, H - o.h);
    } else {
      var left = drag.mode[1] === "l", top = drag.mode[0] === "t";
      var ax = left ? o.x + o.w : o.x, ay = top ? o.y + o.h : o.y;      // fixed (opposite) corner
      var px = clamp(p.x, 0, W), py = clamp(p.y, 0, H);
      var w = Math.max(MIN, Math.abs(px - ax)), h = Math.max(MIN, Math.abs(py - ay));
      var maxW = left ? ax : W - ax, maxH = top ? ay : H - ay;
      if (ratio) {
        if (w / h > ratio) w = h * ratio; else h = w / ratio;
        var f = Math.min(1, maxW / w, maxH / h); w *= f; h *= f;
      } else { w = Math.min(w, maxW); h = Math.min(h, maxH); }
      rect.w = w; rect.h = h;
      rect.x = left ? ax - w : ax; rect.y = top ? ay - h : ay;
    }
    draw();
  });

  function end() { drag = null; }
  view.addEventListener("pointerup", end);
  view.addEventListener("pointercancel", end);

  function setChip(r) {
    Array.prototype.forEach.call($("ratios").children, function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-r") === r ? "true" : "false"); });
  }
  $("ratios").addEventListener("click", function (e) {
    var b = e.target.closest("[data-r]"); if (!b || !img) return;
    ratio = parseFloat(b.getAttribute("data-r")); setChip(b.getAttribute("data-r"));
    resetRect(); draw();
  });

  $("resetBtn").addEventListener("click", function () { if (img) { resetRect(); draw(); } });
  $("newBtn").addEventListener("click", function () { img = null; work.hidden = true; setStatus(""); });

  $("dlBtn").addEventListener("click", function () {
    if (!img) return;
    var w = Math.max(1, Math.round(rect.w)), h = Math.max(1, Math.round(rect.h)), type = fmt.value;
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var cx = c.getContext("2d");
    if (type === "image/jpeg") { cx.fillStyle = "#fff"; cx.fillRect(0, 0, w, h); }
    cx.drawImage(img, Math.round(rect.x), Math.round(rect.y), w, h, 0, 0, w, h);
    var ext = type === "image/png" ? ".png" : type === "image/jpeg" ? ".jpg" : ".webp";
    c.toBlob(function (b) { ToolsHub.download(b, baseName + "-cropped" + ext); }, type, 0.95);
  });

  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { load(fileInput.files[0]); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { load(e.dataTransfer.files[0]); });
})();
