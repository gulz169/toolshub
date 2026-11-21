/* Random Number Generator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function go() {
    var a = Math.ceil(+$("mn").value), b = Math.floor(+$("mx").value), n = Math.min(1000, Math.max(1, +$("n").value || 1)), r = [], st = $("status"); st.textContent = "";
    if (a > b) { st.className = "status err"; st.textContent = t("From must be less than To", "پہلا نمبر دوسرے سے چھوٹا ہو"); return; }
    var span = b - a + 1; if ($("u").value === "1" && n > span) n = span;
    var seen = {}; while (r.length < n) { var v = a + crypto.getRandomValues(new Uint32Array(1))[0] % span; if ($("u").value === "1") { if (seen[v]) continue; seen[v] = 1; } r.push(v); }
    $("o").value = r.join(", ");
  }
  $("go").onclick = go; $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); }; go();
})();
