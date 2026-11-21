/* Markdown Previewer */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
    s = s.replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%">').replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }
  function md(src) {
    var lines = src.split("\n"), out = [], list = null, code = false, buf = [];
    function close() { if (list) { out.push("</" + list + ">"); list = null; } }
    lines.forEach(function (l) {
      if (/^```/.test(l)) { if (code) { out.push("<pre><code>" + esc(buf.join("\n")) + "</code></pre>"); buf = []; code = false; } else { close(); code = true; } return; }
      if (code) { buf.push(l); return; }
      var m;
      if ((m = /^(#{1,6})\s+(.*)/.exec(l))) { close(); out.push("<h" + m[1].length + ">" + inline(m[2]) + "</h" + m[1].length + ">"); }
      else if ((m = /^\s*[-*+]\s+(.*)/.exec(l))) { if (list !== "ul") { close(); out.push("<ul>"); list = "ul"; } out.push("<li>" + inline(m[1]) + "</li>"); }
      else if ((m = /^\s*\d+\.\s+(.*)/.exec(l))) { if (list !== "ol") { close(); out.push("<ol>"); list = "ol"; } out.push("<li>" + inline(m[1]) + "</li>"); }
      else if ((m = /^>\s?(.*)/.exec(l))) { close(); out.push("<blockquote>" + inline(m[1]) + "</blockquote>"); }
      else if (/^(-{3,}|\*{3,})\s*$/.test(l)) { close(); out.push("<hr>"); }
      else if (!l.trim()) { close(); }
      else { close(); out.push("<p>" + inline(l) + "</p>"); }
    });
    close(); if (code) out.push("<pre><code>" + esc(buf.join("\n")) + "</code></pre>");
    return out.join("\n");
  }
  $("in").value = "# Hello\n\nSome **bold**, *italic* and `code`.\n\n- item one\n- item two\n\n[link](https://example.com)";
  var last = "";
  function run() { last = md($("in").value); $("out").innerHTML = last; }
  $("in").addEventListener("input", run); run();
  $("cp").onclick = function () { window.ToolsHub.copy(last, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); };
})();
