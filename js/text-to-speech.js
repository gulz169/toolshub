/* Text to Speech - Web Speech API */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var st = $("status");
  if (!("speechSynthesis" in window)) { st.className = "status err"; st.textContent = ToolsHub.t("Your browser does not support speech.", "آپ کا براؤزر آواز سپورٹ نہیں کرتا۔"); return; }
  var voices = [];
  function fill() {
    voices = speechSynthesis.getVoices().slice().sort(function (a, b) { return (/^ur/.test(b.lang) - /^ur/.test(a.lang)) || a.lang.localeCompare(b.lang); });
    var cur = $("voice").value; $("voice").innerHTML = "";
    voices.forEach(function (v, i) { var o = document.createElement("option"); o.value = i; o.textContent = v.name + " (" + v.lang + ")"; $("voice").appendChild(o); });
    if (cur) $("voice").value = cur;
    if (!voices.length) { st.className = "status"; st.textContent = ToolsHub.t("No voices found on this device yet.", "اس آلے پر ابھی کوئی آواز نہیں ملی۔"); }
    else if (!voices.some(function (v) { return /^ur/.test(v.lang); })) { st.className = "status"; st.textContent = ToolsHub.t("No Urdu voice on this device. English voices will read Urdu text poorly.", "اس آلے پر اردو آواز نہیں ہے۔ انگریزی آوازیں اردو متن ٹھیک نہیں پڑھتیں۔"); }
    else st.textContent = "";
  }
  fill(); speechSynthesis.onvoiceschanged = fill;
  $("speak").addEventListener("click", function () {
    var t = $("txt").value.trim(); if (!t) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(t), v = voices[+$("voice").value];
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = +$("rate").value; u.pitch = +$("pitch").value; speechSynthesis.speak(u);
  });
  $("pause").addEventListener("click", function () {
    if (speechSynthesis.paused) { speechSynthesis.resume(); $("pause").textContent = ToolsHub.t("Pause", "روکیں"); }
    else { speechSynthesis.pause(); $("pause").textContent = ToolsHub.t("Resume", "جاری رکھیں"); }
  });
  $("stop").addEventListener("click", function () { speechSynthesis.cancel(); $("pause").textContent = ToolsHub.t("Pause", "روکیں"); });
})();
