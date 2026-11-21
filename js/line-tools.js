/* Line Tools - sort, dedupe, clean */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var txt = $("txt"), statusEl = $("status");
  var coll = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

  var OPS = {
    az: function (a) { return a.slice().sort(coll.compare); },
    za: function (a) { return a.slice().sort(coll.compare).reverse(); },
    num: function (a) {
      return a.slice().sort(function (x, y) {
        var p = parseFloat(x), q = parseFloat(y);
        if (isNaN(p) && isNaN(q)) return coll.compare(x, y);
        if (isNaN(p)) return 1; if (isNaN(q)) return -1;
        return p - q;
      });
    },
    dup: function (a) { var s = {}; return a.filter(function (l) { var k = l.trim().toLowerCase(); if (s[k]) return false; s[k] = 1; return true; }); },
    empty: function (a) { return a.filter(function (l) { return l.trim() !== ""; }); },
    trim: function (a) { return a.map(function (l) { return l.replace(/\s+/g, " ").trim(); }); },
    rev: function (a) { return a.slice().reverse(); },
    shuf: function (a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }
  };

  Array.prototype.forEach.call(document.querySelectorAll("[data-op]"), function (b) {
    b.addEventListener("click", function () {
      if (!txt.value) return;
      var before = txt.value.split(/\r?\n/), after = OPS[b.getAttribute("data-op")](before);
      txt.value = after.join("\n");
      statusEl.className = "status ok";
      statusEl.textContent = ToolsHub.t("Lines: ", "لائنیں: ") + after.length +
        (after.length < before.length ? ToolsHub.t(" (removed ", " (ہٹائی گئیں ") + (before.length - after.length) + ")" : "");
    });
  });
  $("clearBtn").addEventListener("click", function () { txt.value = ""; statusEl.textContent = ""; txt.focus(); });
  $("copyBtn").addEventListener("click", function () {
    if (!txt.value) return;
    var done = function () { statusEl.className = "status ok"; statusEl.textContent = ToolsHub.t("Copied!", "کاپی ہو گیا!"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt.value).then(done, function () { txt.select(); document.execCommand("copy"); done(); });
    else { txt.select(); document.execCommand("copy"); done(); }
  });
})();
