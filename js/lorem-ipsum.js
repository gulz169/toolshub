/* Lorem Ipsum Generator */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var W = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum").split(" ");
  var out = $("out"), statusEl = $("status");

  function r(n) { return Math.floor(Math.random() * n); }
  function words(n) { var a = []; for (var i = 0; i < n; i++) a.push(W[r(W.length)]); return a; }
  function sentence() {
    var a = words(6 + r(9));
    if (a.length > 8) a[3 + r(3)] += ",";
    var s = a.join(" ").replace(/,,/g, ",");
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  }
  function paragraph() { var a = [], n = 3 + r(4); for (var i = 0; i < n; i++) a.push(sentence()); return a.join(" "); }

  function gen() {
    var n = Math.max(1, Math.min(100, parseInt($("count").value, 10) || 1)), k = $("kind").value, res;
    if (k === "w") res = words(n).join(" ");
    else if (k === "s") { res = []; for (var i = 0; i < n; i++) res.push(sentence()); res = res.join(" "); }
    else { res = []; for (var j = 0; j < n; j++) res.push(paragraph()); res = res.join("\n\n"); }
    if ($("start").checked) {
      var first = "Lorem ipsum dolor sit amet";
      res = k === "w" ? (first.toLowerCase().split(" ").concat(res.split(" "))).slice(0, n).join(" ") : first + ", " + res.charAt(0).toLowerCase() + res.slice(1);
      if (k === "w") res = res.charAt(0).toUpperCase() + res.slice(1);
    }
    out.value = res; statusEl.textContent = "";
  }

  $("genBtn").addEventListener("click", gen);
  ["kind", "count", "start"].forEach(function (id) { $(id).addEventListener("change", gen); });
  $("copyBtn").addEventListener("click", function () {
    var done = function () { statusEl.textContent = ToolsHub.t("Copied!", "کاپی ہو گیا!"); statusEl.className = "status ok"; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out.value).then(done, function () { out.select(); document.execCommand("copy"); done(); });
    else { out.select(); document.execCommand("copy"); done(); }
  });
  gen();
})();
