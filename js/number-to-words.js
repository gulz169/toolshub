/* Number to Words - English (international + lakh/crore) and Urdu */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var UR = "صفر ایک دو تین چار پانچ چھ سات آٹھ نو دس گیارہ بارہ تیرہ چودہ پندرہ سولہ سترہ اٹھارہ انیس بیس اکیس بائیس تیئیس چوبیس پچیس چھبیس ستائیس اٹھائیس انتیس تیس اکتیس بتیس تینتیس چونتیس پینتیس چھتیس سینتیس اڑتیس انتالیس چالیس اکتالیس بیالیس تینتالیس چوالیس پینتالیس چھیالیس سینتالیس اڑتالیس انچاس پچاس اکیاون باون ترپن چون پچپن چھپن ستاون اٹھاون انسٹھ ساٹھ اکسٹھ باسٹھ ترسٹھ چونسٹھ پینسٹھ چھیاسٹھ سڑسٹھ اڑسٹھ انہتر ستر اکہتر بہتر تہتر چوہتر پچھتر چھہتر ستتر اٹھہتر اناسی اسی اکیاسی بیاسی تراسی چوراسی پچاسی چھیاسی ستاسی اٹھاسی نواسی نوے اکانوے بانوے ترانوے چورانوے پچانوے چھیانوے ستانوے اٹھانوے ننانوے".split(" ");
  var UR_UNITS = ["", "ہزار", "لاکھ", "کروڑ", "ارب", "کھرب", "نیل"];
  var EN1 = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
  var EN10 = "  twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
  var EN_INT = ["", "thousand", "million", "billion", "trillion", "quadrillion"];
  var EN_PK = ["", "thousand", "lakh", "crore", "arab", "kharab", "neel"];

  function en99(n) { return n < 20 ? EN1[n] : EN10[Math.floor(n / 10)] + (n % 10 ? "-" + EN1[n % 10] : ""); }
  function en999(n) {
    var h = Math.floor(n / 100), r = n % 100, s = [];
    if (h) s.push(EN1[h] + " hundred");
    if (r) s.push((h ? "and " : "") + en99(r));
    return s.join(" ");
  }
  function ur999(n) {
    var h = Math.floor(n / 100), r = n % 100, s = [];
    if (h) s.push(UR[h] + " سو");
    if (r) s.push(UR[r]);
    return s.join(" ");
  }
  // split into group values: low 3 digits, then 3-digit (international) or 2-digit (lakh system) groups
  function groups(str, sys) {
    var g = [str.slice(-3)], rest = str.slice(0, -3), step = sys === "int" ? 3 : 2;
    while (rest) { g.push(rest.slice(-step)); rest = rest.slice(0, -step); }
    return g.map(Number);
  }
  function toWords(str, sys, lang) {
    str = str.replace(/^0+(?=\d)/, "");
    if (/^0+$/.test(str)) return lang === "ur" ? UR[0] : "zero";
    var g = groups(str, sys), units = lang === "ur" ? UR_UNITS : sys === "int" ? EN_INT : EN_PK, out = [];
    for (var i = g.length - 1; i >= 0; i--) {
      if (!g[i]) continue;
      var w = lang === "ur" ? (i === 0 ? ur999(g[i]) : UR[g[i]]) : (i === 0 || sys === "int" ? en999(g[i]) : en99(g[i]));
      out.push(w + (units[i] ? " " + units[i] : ""));
    }
    var res = out.join(" ");
    if (lang === "en" && g[0] && g.length > 1 && g[0] < 100) res = res.replace(/ ([a-z\-]+)$/, " and $1"); // "one thousand and five"
    return res;
  }
  function digits(s, lang) { return s.split("").map(function (d) { return lang === "ur" ? UR[+d] : EN1[+d]; }).join(" "); }

  function calc() {
    var raw = $("num").value.replace(/[,\s_]/g, ""), st = $("status"), cur = $("cur").checked;
    st.textContent = ""; st.className = "status";
    if (!raw) { $("ur").value = $("en").value = $("enpk").value = ""; return; }
    var m = /^(\d+)(?:\.(\d+))?$/.exec(raw);
    if (!m) { st.className = "status err"; st.textContent = ToolsHub.t("Enter digits only, like 12500.50", "صرف ہندسے لکھیں، مثلاً 12500.50"); return; }
    if (m[1].replace(/^0+(?=\d)/, "").length > 15) { st.className = "status err"; st.textContent = ToolsHub.t("Up to 15 digits are supported.", "زیادہ سے زیادہ 15 ہندسے چلتے ہیں۔"); return; }
    var ip = m[1], fp = m[2] || "", paisa = cur ? parseInt((fp + "00").slice(0, 2), 10) : 0;
    function build(sys, lang) {
      var s = toWords(ip, sys, lang);
      if (cur) {
        if (lang === "ur") return s + " روپے" + (paisa ? " اور " + UR[paisa] + " پیسے" : "") + " صرف";
        return "Rupees " + s + (paisa ? " and " + en99(paisa) + " paisa" : "") + " only";
      }
      if (fp) s += lang === "ur" ? " اعشاریہ " + digits(fp, "ur") : " point " + digits(fp, "en");
      return lang === "en" ? s : s;
    }
    var cap = function (t) { return t.charAt(0).toUpperCase() + t.slice(1); };
    $("ur").value = build("pk", "ur");
    $("en").value = cap(build("int", "en"));
    $("enpk").value = cap(build("pk", "en"));
  }

  $("num").addEventListener("input", calc); $("cur").addEventListener("change", calc);
  ["ur", "en", "enpk"].forEach(function (id) {
    $(id).addEventListener("click", function () {
      var el = $(id); if (!el.value) return; el.select();
      var done = function () { $("status").className = "status ok"; $("status").textContent = ToolsHub.t("Copied!", "کاپی ہو گیا!"); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(el.value).then(done, function () { document.execCommand("copy"); done(); });
      else { document.execCommand("copy"); done(); }
    });
  });
  calc();
})();
