/* Image to Text (OCR) - Tesseract.js in the browser */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var files = [];
  var dropzone = $("dropzone"), fileInput = $("fileInput"), list = $("list"), actions = $("actions"),
      statusEl = $("status"), bar = $("bar"), goBtn = $("goBtn"), lang = $("lang"),
      result = $("result"), out = $("out");

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function add(fl) {
    var ok = Array.prototype.filter.call(fl, function (f) { return /^image\/(jpeg|png|webp)$/.test(f.type); });
    if (!ok.length) { setStatus(ToolsHub.t("Please choose JPG, PNG or WebP images.", "براہ کرم JPG، PNG یا WebP تصاویر چنیں۔"), "err"); return; }
    files = files.concat(ok); setStatus(""); render();
  }

  function render() {
    list.innerHTML = "";
    files.forEach(function (f, i) {
      var it = document.createElement("div"); it.className = "file-item";
      var img = document.createElement("img"); img.alt = "";
      img.src = URL.createObjectURL(f); img.onload = function () { URL.revokeObjectURL(img.src); };
      var name = document.createElement("div"); name.className = "name"; name.textContent = f.name;
      var ctrl = document.createElement("div"); ctrl.className = "ctrl";
      var rm = document.createElement("button"); rm.type = "button"; rm.textContent = "✕";
      rm.addEventListener("click", function () { files.splice(i, 1); render(); });
      ctrl.appendChild(rm); it.append(img, name, ctrl); list.appendChild(it);
    });
    actions.hidden = !files.length;
  }

  async function run() {
    if (!window.Tesseract) {
      setStatus(ToolsHub.t("OCR library failed to load. Check internet and refresh.", "OCR لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"), "err"); return;
    }
    goBtn.disabled = true; bar.hidden = false; bar.value = 0; result.hidden = true;
    var worker = null, texts = [];
    try {
      var idx = 0;
      setStatus(ToolsHub.t("Loading language data...", "زبان کا ڈیٹا لوڈ ہو رہا ہے..."));
      worker = await Tesseract.createWorker(lang.value, 1, {
        logger: function (m) {
          if (m.status === "recognizing text") {
            bar.value = (idx + m.progress) / files.length;
            setStatus(ToolsHub.t("Reading image ", "تصویر پڑھی جا رہی ہے ") + (idx + 1) + " / " + files.length);
          }
        }
      });
      for (idx = 0; idx < files.length; idx++) {
        var r = await worker.recognize(files[idx]);
        texts.push(r.data.text.trim());
      }
      out.value = files.length > 1
        ? texts.map(function (t, i) { return "--- " + files[i].name + " ---\n" + t; }).join("\n\n")
        : texts[0];
      result.hidden = false;
      setStatus(out.value.trim()
        ? ToolsHub.t("Done! Please check the text for mistakes.", "ہو گیا! براہ کرم متن میں غلطیاں چیک کریں۔")
        : ToolsHub.t("No text found. Try a clearer image or another language.", "کوئی متن نہیں ملا۔ صاف تصویر یا دوسری زبان آزمائیں۔"),
        out.value.trim() ? "ok" : "err");
    } catch (e) {
      console.error(e);
      setStatus(ToolsHub.t("OCR failed. Check your internet connection and try again.", "OCR ناکام ہو گیا۔ انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔"), "err");
    } finally {
      if (worker) { try { await worker.terminate(); } catch (e) {} }
      goBtn.disabled = false; bar.hidden = true;
    }
  }

  $("copyBtn").addEventListener("click", function () {
    if (!out.value) return;
    var done = function () { setStatus(ToolsHub.t("Copied!", "کاپی ہو گیا!"), "ok"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(out.value).then(done, function () { out.select(); document.execCommand("copy"); done(); });
    } else { out.select(); document.execCommand("copy"); done(); }
  });
  $("txtBtn").addEventListener("click", function () {
    ToolsHub.download(new Blob(["﻿" + out.value], { type: "text/plain;charset=utf-8" }), "extracted-text.txt");
  });
  goBtn.addEventListener("click", run);
  $("clearBtn").addEventListener("click", function () { files = []; result.hidden = true; out.value = ""; setStatus(""); render(); });
  dropzone.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () { add(fileInput.files); fileInput.value = ""; });
  ["dragenter", "dragover"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("drag"); }); });
  ["dragleave", "drop"].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("drag"); }); });
  dropzone.addEventListener("drop", function (e) { add(e.dataTransfer.files); });
})();
