/* Zakat Calculator - 2.5% above nisab */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var SILVER_G = 612.36, GOLD_G = 87.48;
  var f = function (n) { return Math.round(n).toLocaleString("en-US"); };
  function v(id) { return Math.max(0, +$(id).value || 0); }
  function calc() {
    var gp = v("gp"), sp = v("sp"), u = +$("unit").value;
    var assets = v("cash") + v("gold") * u * gp + v("silver") * u * sp + v("biz") + v("recv"), net = assets - v("debt");
    var nisab = $("basis").value === "s" ? SILVER_G * sp : GOLD_G * gp, msg = $("msg");
    $("net").textContent = f(net); $("nis").textContent = nisab ? f(nisab) : "-";
    if (!nisab) { $("zak").textContent = "-"; msg.textContent = ToolsHub.t("Enter the gold / silver price to find the nisab.", "نصاب معلوم کرنے کے لیے سونے / چاندی کی قیمت لکھیں۔"); return; }
    if (net >= nisab) { $("zak").textContent = f(net * 0.025); msg.style.color = "#34d399"; msg.textContent = ToolsHub.t("Your wealth is above the nisab. Zakat is due.", "آپ کی دولت نصاب سے زیادہ ہے۔ زکوٰۃ واجب ہے۔"); }
    else { $("zak").textContent = "0"; msg.style.color = ""; msg.textContent = ToolsHub.t("Your wealth is below the nisab. No Zakat is due.", "آپ کی دولت نصاب سے کم ہے۔ زکوٰۃ واجب نہیں۔"); }
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select"), function (el) { el.addEventListener("input", calc); });
  document.addEventListener("langchange", calc);
  calc();
})();
