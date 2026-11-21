/* Voice to Text - Web Speech API (Chrome / Edge) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var st = $("status"), SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null, on = false, base = "";
  function setStatus(m, t) { st.textContent = m || ""; st.className = "status" + (t ? " " + t : ""); }
  if (!SR) { setStatus(ToolsHub.t("Your browser does not support voice typing. Use Chrome or Edge.", "آپ کا براؤزر وائس ٹائپنگ سپورٹ نہیں کرتا۔ Chrome یا Edge استعمال کریں۔"), "err"); $("mic").disabled = true; return; }
  function label() { $("mic").textContent = on ? ToolsHub.t("⏹ Stop", "⏹ روکیں") : ToolsHub.t("🎤 Start", "🎤 شروع"); }
  function start() {
    rec = new SR(); rec.lang = $("lang").value; rec.continuous = true; rec.interimResults = true;
    base = $("out").value + ($("out").value && !/\s$/.test($("out").value) ? " " : "");
    rec.onresult = function (e) {
      var fin = "", tmp = "";
      for (var i = 0; i < e.results.length; i++) (e.results[i].isFinal ? (fin += e.results[i][0].transcript) : (tmp += e.results[i][0].transcript));
      $("out").value = base + fin + tmp;
    };
    rec.onerror = function (e) {
      var m = e.error === "not-allowed" ? ToolsHub.t("Microphone permission was denied.", "مائیکروفون کی اجازت نہیں ملی۔") : e.error === "no-speech" ? "" : ToolsHub.t("Error: ", "خرابی: ") + e.error;
      if (m) setStatus(m, "err");
    };
    rec.onend = function () { if (on) { try { base = $("out").value + " "; rec.start(); } catch (x) { on = false; label(); } } else label(); };
    try { rec.start(); on = true; setStatus(ToolsHub.t("Listening...", "سن رہا ہے..."), "ok"); } catch (x) { on = false; }
    label();
  }
  $("mic").addEventListener("click", function () { if (on) { on = false; rec.stop(); setStatus(""); label(); } else start(); });
  $("lang").addEventListener("change", function () { if (on) { on = false; rec.stop(); setTimeout(start, 400); } });
  $("copyBtn").addEventListener("click", function () { ToolsHub.copy($("out").value, function () { setStatus(ToolsHub.t("Copied!", "کاپی ہو گیا!"), "ok"); }); });
  $("clearBtn").addEventListener("click", function () { $("out").value = ""; });
})();
