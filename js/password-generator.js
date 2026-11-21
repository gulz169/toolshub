/* Password Generator - crypto.getRandomValues, nothing stored or sent */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var pw = $("pw"), len = $("len"), meter = $("meter"), statusEl = $("status");
  var SETS = {
    oUp: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    oLow: "abcdefghijklmnopqrstuvwxyz",
    oNum: "0123456789",
    oSym: "!@#$%^&*()-_=+[]{};:,.?"
  };

  function rand(n) { // unbiased random int in [0, n)
    var max = Math.floor(4294967296 / n) * n, a = new Uint32Array(1);
    do { crypto.getRandomValues(a); } while (a[0] >= max);
    return a[0] % n;
  }

  function generate() {
    var sim = $("oSim").checked, groups = [];
    Object.keys(SETS).forEach(function (k) {
      if ($(k).checked) {
        var s = sim ? SETS[k].replace(/[O0lI1]/g, "") : SETS[k];
        if (s) groups.push(s);
      }
    });
    if (!groups.length) {
      pw.value = ""; meter.style.width = "0";
      statusEl.textContent = ToolsHub.t("Select at least one character type.", "کم از کم ایک قسم کے حروف چنیں۔");
      statusEl.className = "status err"; return;
    }
    statusEl.textContent = ""; statusEl.className = "status";
    var n = Math.max(parseInt(len.value, 10), groups.length), all = groups.join(""), out = [];
    groups.forEach(function (g) { out.push(g[rand(g.length)]); }); // one from each chosen type
    while (out.length < n) out.push(all[rand(all.length)]);
    for (var i = out.length - 1; i > 0; i--) { // Fisher-Yates shuffle
      var j = rand(i + 1), t = out[i]; out[i] = out[j]; out[j] = t;
    }
    pw.value = out.join("");
    strength(n, all.length);
  }

  function strength(n, pool) {
    var bits = n * Math.log2(pool), pct = Math.min(100, Math.round(bits / 100 * 100));
    meter.style.width = Math.max(pct, 8) + "%";
    meter.style.background = bits < 50 ? "#f43f5e" : bits < 70 ? "#f59e0b" : "#34d399";
  }

  $("len").addEventListener("input", function () { $("lenVal").textContent = len.value; generate(); });
  ["oUp", "oLow", "oNum", "oSym", "oSim"].forEach(function (id) { $(id).addEventListener("change", generate); });
  $("genBtn").addEventListener("click", generate);
  $("copyBtn").addEventListener("click", function () {
    if (!pw.value) return;
    var done = function () {
      statusEl.textContent = ToolsHub.t("Copied!", "کاپی ہو گیا!"); statusEl.className = "status ok";
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pw.value).then(done, function () { pw.select(); document.execCommand("copy"); done(); });
    } else { pw.select(); document.execCommand("copy"); done(); }
  });
  generate();
})();
