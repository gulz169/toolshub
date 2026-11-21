/* Barcode Generator - JsBarcode */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var st = $("status"), ok = false;
  function render() {
    if (!window.JsBarcode) { st.className = "status err"; st.textContent = ToolsHub.t("Library failed to load. Check internet and refresh.", "لائبریری لوڈ نہیں ہوئی۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"); return; }
    try {
      JsBarcode($("cv"), $("val").value, { format: $("fmt").value, width: +$("bw").value, height: +$("bh").value, displayValue: $("txt").checked, margin: 12, background: "#ffffff", lineColor: "#000000", fontSize: 18,
        valid: function (v) { ok = v; } });
      if (ok) { st.textContent = ""; st.className = "status"; }
      else { st.className = "status err"; st.textContent = ToolsHub.t("This value is not valid for the chosen type.", "یہ قدر منتخب قسم کے لیے درست نہیں۔"); }
    } catch (e) { ok = false; st.className = "status err"; st.textContent = ToolsHub.t("This value is not valid for the chosen type.", "یہ قدر منتخب قسم کے لیے درست نہیں۔"); }
  }
  ["val", "fmt", "bw", "bh", "txt"].forEach(function (id) { $(id).addEventListener("input", render); });
  $("dl").addEventListener("click", function () { if (ok) $("cv").toBlob(function (b) { ToolsHub.download(b, "barcode-" + $("fmt").value.toLowerCase() + ".png"); }); });
  render();
})();
