/* Percentage Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  function num(id) { var v = $(id).value; return v === "" ? NaN : parseFloat(v); }
  function fmt(n) { return isFinite(n) ? String(Math.round(n * 10000) / 10000) : "-"; }

  function calc() {
    var a1 = num("a1"), b1 = num("b1"), a2 = num("a2"), b2 = num("b2"), a3 = num("a3"), b3 = num("b3");
    $("r1").textContent = fmt(a1 * b1 / 100);
    $("r2").textContent = b2 === 0 ? "-" : (isFinite(a2 / b2) ? fmt(a2 / b2 * 100) + "%" : "-");
    $("r3").textContent = a3 === 0 ? "-" : (isFinite((b3 - a3) / a3) ? ((b3 >= a3 ? "+" : "") + fmt((b3 - a3) / Math.abs(a3) * 100) + "%") : "-");
  }

  ["a1", "b1", "a2", "b2", "a3", "b3"].forEach(function (id) { $(id).addEventListener("input", calc); });
})();
