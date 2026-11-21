/* Meta Tag Generator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function e(s) { return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
  function run() {
    var v = function (id) { return e($(id).value.trim()); }, o = [];
    o.push("<title>" + v("ti") + "</title>", '<meta name="description" content="' + v("de") + '">');
    if (v("kw")) o.push('<meta name="keywords" content="' + v("kw") + '">'); if (v("au")) o.push('<meta name="author" content="' + v("au") + '">');
    o.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
    if (v("ur")) o.push('<link rel="canonical" href="' + v("ur") + '">', '<meta property="og:url" content="' + v("ur") + '">');
    o.push('<meta property="og:type" content="website">', '<meta property="og:title" content="' + v("ti") + '">', '<meta property="og:description" content="' + v("de") + '">');
    if (v("im")) o.push('<meta property="og:image" content="' + v("im") + '">');
    o.push('<meta name="twitter:card" content="' + (v("im") ? "summary_large_image" : "summary") + '">', '<meta name="twitter:title" content="' + v("ti") + '">', '<meta name="twitter:description" content="' + v("de") + '">');
    if (v("im")) o.push('<meta name="twitter:image" content="' + v("im") + '">');
    $("o").value = o.join("\n");
  }
  Array.prototype.forEach.call(document.querySelectorAll("input,select,textarea"), function (e) { e.addEventListener("input", run); }); $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); }; run();
})();
