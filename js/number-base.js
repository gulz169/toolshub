/* Number Base Converter - BigInt */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var st = $("status"), DIG = "0123456789abcdefghijklmnopqrstuvwxyz";
  function parse(s, base) {
    s = s.trim().toLowerCase().replace(/[\s_]/g, "").replace(/^0[xbo]/, ""); if (!s) return null;
    var neg = s[0] === "-"; if (neg) s = s.slice(1);
    var r = 0n, b = BigInt(base);
    for (var i = 0; i < s.length; i++) { var d = DIG.indexOf(s[i]); if (d < 0 || d >= base) return undefined; r = r * b + BigInt(d); }
    return neg ? -r : r;
  }
  function roman(n) {
    if (n < 1n || n > 3999n) return "-"; n = Number(n); var m = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]], o = "";
    m.forEach(function (p) { while (n >= p[0]) { o += p[1]; n -= p[0]; } }); return o;
  }
  function calc() {
    var v = parse($("num").value, +$("base").value);
    if (v === undefined) { st.className = "status err"; st.textContent = ToolsHub.t("This number has digits that are not valid in the chosen base.", "اس نمبر میں ایسے ہندسے ہیں جو منتخب بیس میں درست نہیں۔"); return; }
    st.textContent = ""; st.className = "status";
    [["b2", 2], ["b8", 8], ["b10", 10], ["b16", 16]].forEach(function (p) { $(p[0]).textContent = v === null ? "-" : (p[1] === 16 ? v.toString(16).toUpperCase() : v.toString(p[1])); });
    $("rom").textContent = v === null ? "-" : roman(v);
  }
  $("num").addEventListener("input", calc); $("base").addEventListener("change", calc);
  Array.prototype.forEach.call(document.querySelectorAll(".stat"), function (s) {
    s.addEventListener("click", function () { var t = s.querySelector("b").textContent; if (t && t !== "-") ToolsHub.copy(t, function () { st.className = "status ok"; st.textContent = ToolsHub.t("Copied!", "کاپی ہو گیا!"); }); });
  });
  calc();
})();
