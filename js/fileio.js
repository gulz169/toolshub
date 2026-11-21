/* Small file helpers shared by file-based tools */
(function () {
  "use strict";
  var TH = window.ToolsHub = window.ToolsHub || {};
  TH.pick = function (zone, input, cb) {
    zone.addEventListener("click", function () { input.click(); });
    input.addEventListener("change", function () { var f = Array.prototype.slice.call(input.files); input.value = ""; if (f.length) cb(f); });
    ["dragenter", "dragover"].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add("drag"); }); });
    ["dragleave", "drop"].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove("drag"); }); });
    zone.addEventListener("drop", function (e) { var f = Array.prototype.slice.call(e.dataTransfer.files); if (f.length) cb(f); });
  };
  TH.loadImage = function (file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); res(im); };
      im.onerror = function () { URL.revokeObjectURL(url); rej(new Error("bad image")); };
      im.src = url;
    });
  };
  TH.toBlob = function (c, type, q) { return new Promise(function (r) { c.toBlob(r, type, q); }); };
  TH.status = function (m, cls) { var s = document.getElementById("status"); if (s) { s.textContent = m || ""; s.className = "status" + (cls ? " " + cls : ""); } };
})();
