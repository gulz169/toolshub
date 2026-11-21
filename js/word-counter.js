/* Word & Character Counter - live, English and Urdu */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var txt = $("txt");

  function update() {
    var t = txt.value, trimmed = t.trim();
    var words = trimmed ? trimmed.split(/\s+/).length : 0;
    var chars = Array.from(t).length;
    var noSp = Array.from(t.replace(/\s/g, "")).length;
    var sent = trimmed ? (trimmed.match(/[^.!?۔؟]+[.!?۔؟]*/g) || []).filter(function (s) { return s.trim(); }).length : 0;
    var para = trimmed ? trimmed.split(/\n\s*\n/).filter(function (p) { return p.trim(); }).length : 0;
    var mins = words ? Math.max(1, Math.ceil(words / 200)) : 0;
    $("sWords").textContent = words;
    $("sChars").textContent = chars;
    $("sNoSp").textContent = noSp;
    $("sSent").textContent = sent;
    $("sPara").textContent = para;
    $("sRead").textContent = mins;
  }

  txt.addEventListener("input", update);
  $("clearBtn").addEventListener("click", function () { txt.value = ""; update(); txt.focus(); });
  update();
})();
