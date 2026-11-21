/* EMI / Loan Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n) { return Math.round(n).toLocaleString("en-US"); };

  function calc() {
    var P = +$("amt").value, r = +$("rate").value / 1200, n = Math.round((+$("ten").value || 0) * +$("unit").value), st = $("status");
    st.textContent = ""; st.className = "status";
    if (!(P > 0) || !(n > 0) || r < 0) { ["emi", "int", "tot"].forEach(function (i) { $(i).textContent = "-"; }); $("sch").innerHTML = ""; $("pBar").style.width = "0"; return; }
    var emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1), total = emi * n, interest = total - P;
    $("emi").textContent = f(emi); $("int").textContent = f(interest); $("tot").textContent = f(total);
    $("pBar").style.width = (P / total * 100).toFixed(1) + "%";

    var rows = ["<tr><th>" + ToolsHub.t("Year", "سال") + "</th><th>" + ToolsHub.t("Principal", "اصل") + "</th><th>" + ToolsHub.t("Interest", "سود") + "</th><th>" + ToolsHub.t("Balance", "باقی") + "</th></tr>"];
    var bal = P, pp = 0, ip = 0;
    for (var m = 1; m <= n; m++) {
      var i = bal * r, pr = emi - i; bal = Math.max(0, bal - pr); pp += pr; ip += i;
      if (m % 12 === 0 || m === n) { rows.push("<tr><td>" + Math.ceil(m / 12) + "</td><td>" + f(pp) + "</td><td>" + f(ip) + "</td><td>" + f(bal) + "</td></tr>"); pp = ip = 0; }
    }
    $("sch").innerHTML = rows.join("");
  }
  ["amt", "rate", "ten", "unit"].forEach(function (id) { $(id).addEventListener("input", calc); });
  calc();
})();
