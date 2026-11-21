/* Base64 Encode & Decode (UTF-8 safe) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var inp = $("inp"), out = $("out"), statusEl = $("status");
  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }

  function encode(s) {
    var bytes = new TextEncoder().encode(s), bin = "";
    for (var i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    var b = btoa(bin);
    return $("urlSafe").checked ? b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : b;
  }
  function decode(s) {
    s = s.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    var bin = atob(s), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  }

  $("encBtn").addEventListener("click", function () { out.value = encode(inp.value); setStatus(""); });
  $("decBtn").addEventListener("click", function () {
    try { out.value = decode(inp.value); setStatus(""); }
    catch (e) { out.value = ""; setStatus(ToolsHub.t("This is not valid Base64 text.", "یہ درست Base64 متن نہیں ہے۔"), "err"); }
  });
  $("swapBtn").addEventListener("click", function () { inp.value = out.value; out.value = ""; setStatus(""); });
  $("clearBtn").addEventListener("click", function () { inp.value = out.value = ""; setStatus(""); });
  $("copyBtn").addEventListener("click", function () {
    if (!out.value) return;
    var done = function () { setStatus(ToolsHub.t("Copied!", "کاپی ہو گیا!"), "ok"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out.value).then(done, function () { out.select(); document.execCommand("copy"); done(); });
    else { out.select(); document.execCommand("copy"); done(); }
  });
})();
