/* Text Compare - line diff (LCS) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var MAXL = 2500;

  function norm(l) {
    if ($("iw").checked) l = l.replace(/\s+/g, " ").trim();
    if ($("ic").checked) l = l.toLowerCase();
    return l;
  }

  function diff(A, B) {
    var a = A.map(norm), b = B.map(norm), n = a.length, m = b.length, i, j;
    var L = [];
    for (i = 0; i <= n; i++) L.push(new Uint16Array(m + 1));
    for (i = n - 1; i >= 0; i--)
      for (j = m - 1; j >= 0; j--)
        L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var res = []; i = 0; j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { res.push({ t: "same", s: B[j] }); i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) { res.push({ t: "del", s: A[i] }); i++; }
      else { res.push({ t: "add", s: B[j] }); j++; }
    }
    while (i < n) res.push({ t: "del", s: A[i++] });
    while (j < m) res.push({ t: "add", s: B[j++] });
    return res;
  }

  $("goBtn").addEventListener("click", function () {
    var st = $("status"), box = $("diff");
    var A = $("a").value.split(/\r?\n/), B = $("b").value.split(/\r?\n/);
    if (!$("a").value && !$("b").value) { st.className = "status err"; st.textContent = ToolsHub.t("Paste some text in both boxes.", "دونوں خانوں میں متن پیسٹ کریں۔"); return; }
    if (A.length > MAXL || B.length > MAXL) { st.className = "status err"; st.textContent = ToolsHub.t("Too long. Up to " + MAXL + " lines each.", "بہت لمبا ہے۔ ہر طرف زیادہ سے زیادہ " + MAXL + " لائنیں۔"); return; }
    var r = diff(A, B), add = 0, del = 0;
    box.innerHTML = "";
    r.forEach(function (x) {
      var d = document.createElement("div");
      d.className = x.t === "same" ? "" : x.t;
      d.textContent = (x.t === "add" ? "+ " : x.t === "del" ? "- " : "  ") + x.s;
      if (x.t === "add") add++; if (x.t === "del") del++;
      box.appendChild(d);
    });
    box.hidden = false;
    st.className = "status " + (add || del ? "" : "ok");
    st.textContent = add || del
      ? ToolsHub.t("Added: ", "شامل: ") + add + " · " + ToolsHub.t("Removed: ", "ہٹائی گئی: ") + del
      : ToolsHub.t("Both texts are the same ✓", "دونوں متن ایک جیسے ہیں ✓");
  });
  $("clearBtn").addEventListener("click", function () { $("a").value = $("b").value = ""; $("diff").hidden = true; $("status").textContent = ""; });
})();
