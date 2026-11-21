/* Dice Roller & Coin Flip */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function rnd(n) { return crypto.getRandomValues(new Uint32Array(1))[0] % n; }
  $("roll").onclick = function () { var a = []; for (var i = 0; i < Math.min(20, +$("n").value || 1); i++) a.push(rnd(Math.max(2, +$("sd").value || 6)) + 1); $("r").textContent = a.join(" · "); $("tot").textContent = a.reduce(function (x, y) { return x + y; }, 0); };
  $("flip").onclick = function () { $("r").textContent = rnd(2) ? t("Heads", "ہیڈ") : t("Tails", "ٹیل"); $("tot").textContent = "-"; };
})();
