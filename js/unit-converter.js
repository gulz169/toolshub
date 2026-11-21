/* Unit Converter - each unit has a factor to the base unit of its type */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  var TYPES = {
    length: { en: "Length", ur: "لمبائی", base: "m", units: {
      mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344 } },
    weight: { en: "Weight", ur: "وزن", base: "kg", units: {
      mg: 0.000001, g: 0.001, kg: 1, tonne: 1000, ounce: 0.028349523125, pound: 0.45359237, tola: 0.0116638038, seer: 0.933104304, maund: 37.3241722 } },
    area: { en: "Area", ur: "رقبہ", base: "m²", units: {
      "sq m": 1, "sq km": 1e6, "sq ft": 0.09290304, "sq yard": 0.83612736, marla: 272.25 * 0.09290304, kanal: 20 * 272.25 * 0.09290304, acre: 4046.8564224, hectare: 10000 } },
    volume: { en: "Volume", ur: "حجم", base: "L", units: {
      ml: 0.001, litre: 1, "cubic m": 1000, "US gallon": 3.785411784, "US cup": 0.2365882365, "fl oz (US)": 0.0295735295625 } },
    speed: { en: "Speed", ur: "رفتار", base: "m/s", units: {
      "m/s": 1, "km/h": 1 / 3.6, mph: 0.44704, knot: 0.514444444 } },
    data: { en: "Data size", ur: "ڈیٹا سائز", base: "B", units: {
      B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 } },
    temp: { en: "Temperature", ur: "درجہ حرارت", units: { "°C": 1, "°F": 1, K: 1 } }
  };

  var cat = $("cat"), val = $("val"), from = $("from"), to = $("to"), res = $("res"), line = $("line");

  function lang() { return ToolsHub.t("en", "ur"); }

  function fillTypes() {
    var cur = cat.value || "length";
    cat.innerHTML = "";
    Object.keys(TYPES).forEach(function (k) {
      var o = document.createElement("option"); o.value = k; o.textContent = TYPES[k][lang()]; cat.appendChild(o);
    });
    cat.value = cur;
  }

  function fillUnits() {
    var names = Object.keys(TYPES[cat.value].units);
    [from, to].forEach(function (s) {
      s.innerHTML = "";
      names.forEach(function (n) { var o = document.createElement("option"); o.value = n; o.textContent = n; s.appendChild(o); });
    });
    from.value = names[0]; to.value = names[Math.min(2, names.length - 1)];
    if (cat.value === "temp") { from.value = "°C"; to.value = "°F"; }
  }

  function temp(v, f, t) {
    var c = f === "°C" ? v : f === "°F" ? (v - 32) * 5 / 9 : v - 273.15;
    return t === "°C" ? c : t === "°F" ? c * 9 / 5 + 32 : c + 273.15;
  }

  function fmt(n) {
    if (!isFinite(n)) return "";
    if (n !== 0 && (Math.abs(n) >= 1e12 || Math.abs(n) < 1e-6)) return n.toExponential(6);
    return String(parseFloat(n.toPrecision(10)));
  }

  function calc() {
    var v = parseFloat(val.value);
    if (isNaN(v)) { res.value = ""; line.textContent = ""; return; }
    var t = TYPES[cat.value], r;
    r = cat.value === "temp" ? temp(v, from.value, to.value) : v * t.units[from.value] / t.units[to.value];
    res.value = fmt(r);
    line.textContent = fmt(v) + " " + from.value + " = " + fmt(r) + " " + to.value;
  }

  cat.addEventListener("change", function () { fillUnits(); calc(); });
  [val, from, to].forEach(function (el) { el.addEventListener("input", calc); });
  $("swap").addEventListener("click", function () { var f = from.value; from.value = to.value; to.value = f; calc(); });
  document.addEventListener("langchange", function () { fillTypes(); });

  fillTypes(); fillUnits(); calc();
})();
