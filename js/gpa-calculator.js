/* GPA / CGPA Calculator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
var G = [["A+",4],["A",4],["A-",3.67],["B+",3.33],["B",3],["B-",2.67],["C+",2.33],["C",2],["C-",1.67],["D+",1.33],["D",1],["F",0]];
  var rows = $("rows");
  function add(g, c) {
    var d = document.createElement("div"); d.className = "options"; d.style.margin = "8px 0";
    d.style.flexWrap = "nowrap"; d.style.alignItems = "flex-end"; d.innerHTML = '<label style="flex:1 1 90px"><span>' + t("Grade", "گریڈ") + '</span><select class="g">' + G.map(function (x, i) { return '<option value="' + x[1] + '"' + (i === (g || 1) ? " selected" : "") + ">" + x[0] + " (" + x[1] + ")</option>"; }).join("") + '</select></label>' +
      '<label style="flex:1 1 90px"><span>' + t("Credit hours", "کریڈٹ آورز") + '</span><input class="c" type="number" min="0" step="0.5" value="' + (c || 3) + '" dir="ltr"></label>' +
      '<button type="button" class="btn ghost x" style="flex:none;padding:6px 14px">✕</button>';
    d.querySelector(".x").onclick = function () { d.remove(); calc(); };
    d.addEventListener("input", calc); rows.appendChild(d); calc();
  }
  function calc() {
    var pts = 0, cr = 0;
    Array.prototype.forEach.call(rows.children, function (r) { var c = +r.querySelector(".c").value || 0; pts += c * +r.querySelector(".g").value; cr += c; });
    var gpa = cr ? pts / cr : 0, pc = +$("pc").value || 0, pch = +$("pch").value || 0;
    $("gpa").textContent = cr ? gpa.toFixed(2) : "-"; $("tc").textContent = f(cr);
    $("cgpa").textContent = (cr + pch) ? ((pts + pc * pch) / (cr + pch)).toFixed(2) : "-";
  }
  $("add").onclick = function () { add(); };
  $("pc").addEventListener("input", calc); $("pch").addEventListener("input", calc);
  add(0); add(1); add(3);
})();
