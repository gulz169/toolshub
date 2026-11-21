/* BMI Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function calc() {
    var metric = $("sys").value === "m", h, w;
    $("mBox").hidden = !metric; $("iBox").hidden = metric;
    if (metric) { h = +$("cm").value / 100; w = +$("kg").value; }
    else { h = ((+$("ft").value || 0) * 12 + (+$("inch").value || 0)) * 0.0254; w = +$("lb").value * 0.45359237; }
    if (!(h > 0.5) || !(w > 5)) { ["bmi", "cat", "rng"].forEach(function (i) { $(i).textContent = "-"; }); return; }
    var b = w / (h * h), c = b < 18.5 ? ["Underweight", "کم وزن"] : b < 25 ? ["Normal", "نارمل"] : b < 30 ? ["Overweight", "زیادہ وزن"] : ["Obese", "موٹاپا"];
    $("bmi").textContent = b.toFixed(1); $("cat").textContent = ToolsHub.t(c[0], c[1]);
    var lo = 18.5 * h * h, hi = 24.9 * h * h;
    $("rng").textContent = metric ? lo.toFixed(1) + "–" + hi.toFixed(1) + " kg" : (lo / 0.45359237).toFixed(0) + "–" + (hi / 0.45359237).toFixed(0) + " lb";
  }
  ["sys", "cm", "kg", "ft", "inch", "lb"].forEach(function (id) { $(id).addEventListener("input", calc); });
  document.addEventListener("langchange", calc);
  calc();
})();
