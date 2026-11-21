/* URL Encoder / Decoder */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var out = $("out"), st = $("status");
  function setStatus(m, t) { st.textContent = m || ""; st.className = "status" + (t ? " " + t : ""); }
  $("enc").addEventListener("click", function () { out.value = ($("mode").value === "c" ? encodeURIComponent : encodeURI)($("inp").value); setStatus(""); });
  $("dec").addEventListener("click", function () {
    try { out.value = ($("mode").value === "c" ? decodeURIComponent : decodeURI)($("inp").value.replace(/\+/g, $("mode").value === "c" ? " " : "+")); setStatus(""); }
    catch (e) { out.value = ""; setStatus(ToolsHub.t("This is not valid encoded text.", "یہ درست انکوڈ شدہ متن نہیں ہے۔"), "err"); }
  });
  $("copyBtn").addEventListener("click", function () { ToolsHub.copy(out.value, function () { setStatus(ToolsHub.t("Copied!", "کاپی ہو گیا!"), "ok"); }); });
  $("clearBtn").addEventListener("click", function () { $("inp").value = out.value = ""; setStatus(""); });
})();
