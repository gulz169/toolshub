/* Text to Binary, Hex & Morse */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
var M = {A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----.",".":".-.-.-",",":"--..--","?":"..--..","!":"-.-.--","/":"-..-.","@":".--.-.","-":"-....-"};
  var R = {}; Object.keys(M).forEach(function (k) { R[M[k]] = k; });
  function run() {
    var s = $("i").value, m = $("m").value, enc = $("d").value === "enc", o = "";
    try {
      if (m === "bin") o = enc ? Array.prototype.map.call(new TextEncoder().encode(s), function (b) { return b.toString(2).padStart(8, "0"); }).join(" ") : new TextDecoder().decode(new Uint8Array(s.trim().split(/\s+/).filter(Boolean).map(function (b) { return parseInt(b, 2); })));
      else if (m === "hex") o = enc ? Array.prototype.map.call(new TextEncoder().encode(s), function (b) { return b.toString(16).padStart(2, "0"); }).join(" ") : new TextDecoder().decode(new Uint8Array(s.trim().split(/\s+/).filter(Boolean).map(function (b) { return parseInt(b, 16); })));
      else o = enc ? s.toUpperCase().split("").map(function (c) { return c === " " ? "/" : (M[c] || ""); }).filter(function (x) { return x; }).join(" ") : s.trim().split(/\s+/).map(function (c) { return c === "/" ? " " : (R[c] || ""); }).join("");
    } catch (e) { o = ""; }
    $("o").value = o;
  }
  $("i").value = "Hello";
  ["i", "m", "d"].forEach(function (id) { $(id).addEventListener("input", run); });
  $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); };
  run();
})();
