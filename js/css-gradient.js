/* CSS Gradient Generator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function run() {
    var cs = [$("c1").value, $("c2").value]; if ($("u3").value === "1") cs.push($("c3").value);
    var g = $("k").value === "linear" ? "linear-gradient(" + $("a").value + "deg, " + cs.join(", ") + ")" : "radial-gradient(circle, " + cs.join(", ") + ")";
    $("pv").style.background = g; $("o").value = "background: " + g + ";";
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select"), function (e) { e.addEventListener("input", run); });
  $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); };
  run();
})();
