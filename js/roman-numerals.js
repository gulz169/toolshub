/* Roman Numeral Converter */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
var P = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  function run() {
    var v = $("v").value.trim().toUpperCase(), r = "-";
    if (/^\d+$/.test(v)) { var n = +v; if (n >= 1 && n <= 3999) { r = ""; P.forEach(function (p) { while (n >= p[0]) { r += p[1]; n -= p[0]; } }); } }
    else if (/^[MDCLXVI]+$/.test(v)) { var s = v, n2 = 0; P.forEach(function (p) { while (s.indexOf(p[1]) === 0) { n2 += p[0]; s = s.slice(p[1].length); } }); r = s ? "-" : String(n2); }
    $("o").textContent = r;
  }
  $("v").addEventListener("input", run); run();
})();
