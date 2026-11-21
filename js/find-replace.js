/* Find & Replace */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
$("i").value = "I like cats. Cats are great.";$("f").value = "cats";$("r").value = "dogs";
  function run() {
    var s = $("i").value, fv = $("f").value, c = 0, st = $("status"); st.textContent = ""; st.className = "status";
    if (!fv) { $("o").value = s; $("c").textContent = 0; return; }
    try {
      var src = $("rx").value === "x" ? fv : fv.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var re = new RegExp(src, "g" + ($("cs").value === "i" ? "i" : ""));
      $("o").value = s.replace(re, function () { c++; var a = arguments, r = $("r").value; return $("rx").value === "x" ? r.replace(/\$(\d)/g, function (_, n) { return a[+n] === undefined ? "" : a[+n]; }) : r; });
      $("c").textContent = c;
    } catch (e) { st.className = "status err"; st.textContent = e.message; }
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); }; run();
})();
