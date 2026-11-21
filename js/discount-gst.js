/* Discount and GST calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "-"; };
  function calc() {
    var p = +$("price").value, d = +$("disc").value, a = +$("amt").value, r = +$("rate").value / 100;
    var save = p * d / 100; $("final").textContent = f(p - save); $("save").textContent = f(save);
    var net, gross;
    if ($("mode").value === "add") { net = a; gross = a * (1 + r); } else { gross = a; net = a / (1 + r); }
    $("net").textContent = f(net); $("tax").textContent = f(gross - net); $("gross").textContent = f(gross);
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select"), function (el) { el.addEventListener("input", calc); });
  calc();
})();
