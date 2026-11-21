/* UUID Generator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function gen() {
    var n = Math.min(500, Math.max(1, +$("n").value || 1)), a = [], c = $("c").value;
    for (var i = 0; i < n; i++) {
      var u = crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (ch) { var r = crypto.getRandomValues(new Uint8Array(1))[0] & 15; return (ch === "x" ? r : (r & 3) | 8).toString(16); });
      a.push(c === "u" ? u.toUpperCase() : c === "nh" ? u.replace(/-/g, "") : u);
    }
    $("o").value = a.join("\n");
  }
  $("go").onclick = gen; $("c").onchange = gen;
  $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); };
  gen();
})();
