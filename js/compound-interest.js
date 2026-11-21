/* Compound Interest Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function calc() {
    var p = +$("p").value, r = +$("r").value / 100, y = +$("y").value, m = +$("m").value, n = +$("n").value;
    var bal = p, dep = p, h = '<table style="width:100%;text-align:center;border-collapse:collapse"><tr><th>' + t("Year", "سال") + "</th><th>" + t("Balance", "رقم") + "</th></tr>";
    var per = n === 365 ? 365 : n;
    for (var yr = 1; yr <= Math.min(y, 60); yr++) {
      for (var mo = 1; mo <= 12; mo++) {
        bal += m; dep += m;
        bal *= Math.pow(1 + r / per, per / 12);
      }
      h += '<tr style="border-top:1px solid rgba(255,255,255,.1)"><td>' + yr + "</td><td dir=ltr>" + f(bal, 0) + "</td></tr>";
    }
    $("fin").textContent = f(bal, 0); $("dep").textContent = f(dep, 0); $("int").textContent = f(bal - dep, 0); $("tbl").innerHTML = h + "</table>";
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select"), function (e) { e.addEventListener("input", calc); });
  document.addEventListener("langchange", calc); calc();
})();
