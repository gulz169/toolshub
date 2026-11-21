/* Hash Generator - SubtleCrypto */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var ALGS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"], fileBuf = null, seq = 0;
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  async function run() {
    var my = ++seq, res = $("res"), data = fileBuf || new TextEncoder().encode($("txt").value);
    if (!window.crypto || !crypto.subtle) { $("status").className = "status err"; $("status").textContent = ToolsHub.t("This needs https or localhost.", "اس کے لیے https یا localhost چاہیے۔"); return; }
    var out = [];
    for (var i = 0; i < ALGS.length; i++) out.push(hex(await crypto.subtle.digest(ALGS[i], data)));
    if (my !== seq) return;
    res.innerHTML = "";
    ALGS.forEach(function (a, i) {
      var d = document.createElement("div"); d.className = "h"; var h = $("up").checked ? out[i].toUpperCase() : out[i];
      d.innerHTML = "<b></b><code></code>"; d.firstChild.textContent = a; d.lastChild.textContent = h;
      d.addEventListener("click", function () { ToolsHub.copy(h, function () { $("status").className = "status ok"; $("status").textContent = a + ToolsHub.t(" copied", " کاپی ہو گیا"); }); });
      res.appendChild(d);
    });
  }
  $("txt").addEventListener("input", function () { fileBuf = null; $("file").value = ""; run(); });
  $("up").addEventListener("change", run);
  $("file").addEventListener("change", async function () {
    var f = $("file").files[0]; if (!f) return;
    if (f.size > 500 * 1048576) { $("status").className = "status err"; $("status").textContent = ToolsHub.t("File is too big (max 500 MB).", "فائل بہت بڑی ہے (زیادہ سے زیادہ 500 MB)۔"); return; }
    fileBuf = await f.arrayBuffer(); $("txt").value = ""; run();
  });
  run();
})();
