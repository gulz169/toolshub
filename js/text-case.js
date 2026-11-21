/* Text Case Converter */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var txt = $("txt"), statusEl = $("status");

  function words(s) { return s.toLowerCase().split(/[^a-z0-9À-ɏ]+/i).filter(Boolean); }
  function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1); }

  var FN = {
    upper: function (s) { return s.toUpperCase(); },
    lower: function (s) { return s.toLowerCase(); },
    title: function (s) { return s.toLowerCase().replace(/(^|[\s\-_(\["'])([a-zÀ-ɏ])/g, function (m, a, b) { return a + b.toUpperCase(); }); },
    sentence: function (s) { return s.toLowerCase().replace(/(^\s*|[.!?]\s+|\n\s*)([a-zÀ-ɏ])/g, function (m, a, b) { return a + b.toUpperCase(); }); },
    toggle: function (s) { return s.replace(/[A-Za-zÀ-ɏ]/g, function (c) { return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase(); }); },
    camel: function (s) { return words(s).map(function (w, i) { return i ? cap(w) : w; }).join(""); },
    snake: function (s) { return words(s).join("_"); },
    kebab: function (s) { return words(s).join("-"); }
  };

  Array.prototype.forEach.call(document.querySelectorAll("[data-case]"), function (b) {
    b.addEventListener("click", function () { txt.value = FN[b.getAttribute("data-case")](txt.value); statusEl.textContent = ""; });
  });

  $("copyBtn").addEventListener("click", function () {
    if (!txt.value) return;
    var done = function () { statusEl.textContent = ToolsHub.t("Copied!", "کاپی ہو گیا!"); statusEl.className = "status ok"; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt.value).then(done, function () { txt.select(); document.execCommand("copy"); done(); });
    } else { txt.select(); document.execCommand("copy"); done(); }
  });
  $("clearBtn").addEventListener("click", function () { txt.value = ""; statusEl.textContent = ""; txt.focus(); });
})();
