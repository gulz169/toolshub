/* QR Code Generator - qrcode-generator library + canvas */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var txt = $("txt"), canvas = $("qr"), box = $("qrBox"), actions = $("actions"),
      statusEl = $("status"), size = $("size"), ec = $("ec"), color = $("color");

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function draw() {
    var text = txt.value.trim();
    box.hidden = actions.hidden = !text;
    setStatus("");
    if (!text) return;
    if (!window.qrcode) {
      box.hidden = actions.hidden = true;
      setStatus(ToolsHub.t("QR library failed to load. Check internet and refresh.", "QR لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err");
      return;
    }
    try {
      qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"]; // Urdu / emoji support
      var qr = qrcode(0, ec.value);
      qr.addData(text);
      qr.make();
      var n = qr.getModuleCount(), px = parseInt(size.value, 10), cell = Math.floor(px / n), s = cell * n;
      canvas.width = canvas.height = s;
      canvas.style.width = Math.min(s, 320) + "px";
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, s, s);
      ctx.fillStyle = color.value;
      for (var r = 0; r < n; r++)
        for (var c = 0; c < n; c++)
          if (qr.isDark(r, c)) ctx.fillRect(c * cell, r * cell, cell, cell);
    } catch (e) {
      box.hidden = actions.hidden = true;
      setStatus(ToolsHub.t("Text is too long for a QR code.", "متن QR کوڈ کے لیے بہت لمبا ہے۔"), "err");
    }
  }

  $("dlBtn").addEventListener("click", function () {
    canvas.toBlob(function (b) { ToolsHub.download(b, "qr-code.png"); }, "image/png");
  });
  [txt, size, ec, color].forEach(function (el) { el.addEventListener("input", draw); });
  draw();
})();
