/* Emoji Picker */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n, d) { return isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 2 : d }) : "-"; };
  var t = function (a, b) { return window.ToolsHub.t(a, b); };
var E = "😀😃😄😁😆😅😂🤣😊😇🙂😉😍🥰😘😋😎🤩🥳😏😒😞😔😢😭😤😠🤯😱🤔🤫🤗🙄😴🤒🤕🥶🥵😷👍👎👏🙌🙏💪👋✌️🤝👌🤞👀🧠❤️🧡💛💚💙💜🖤💔💯🔥✨⭐🌟🎉🎊🎁🏆⚽🏏🎮🎵🍕🍔🍟🍗🍎🍉🍰☕🥤🍫🌹🌸🌞🌙☁️🌈⚡❄️🌍🚗✈️🏠📱💻📷💡📌✅❌⚠️❓❗➕➖🕌☪️📿🤲🕋🇵🇰".match(/(\p{Extended_Pictographic}(\uFE0F|\u200D\p{Extended_Pictographic})*|\p{Regional_Indicator}{2})/gu);
  E.forEach(function (e) { var b = document.createElement("button"); b.type = "button"; b.textContent = e; b.style.cssText = "font-size:1.6rem;padding:4px 8px;border-radius:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);cursor:pointer"; b.onclick = function () { $("o").value += e; }; $("g").appendChild(b); });
  $("clr").onclick = function () { $("o").value = ""; }; $("cp").onclick = function () { window.ToolsHub.copy($("o").value, function () { $("status").className = "status ok"; $("status").textContent = t("Copied", "کاپی ہو گیا"); }); };
})();
