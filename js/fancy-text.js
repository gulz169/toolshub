/* Fancy Text Generator - Unicode styles */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", a = "abcdefghijklmnopqrstuvwxyz", D = "0123456789";
  function range(upStart, lowStart, digStart, ex) {
    return function (ch) {
      if (ex && ex[ch]) return ex[ch]; var cp = ch.codePointAt(0);
      if (A.indexOf(ch) >= 0 && upStart) return String.fromCodePoint(upStart + cp - 65);
      if (a.indexOf(ch) >= 0 && lowStart) return String.fromCodePoint(lowStart + cp - 97);
      if (D.indexOf(ch) >= 0 && digStart) return String.fromCodePoint(digStart + cp - 48);
      return ch;
    };
  }
  function fromStr(up, low) { return function (ch) { var i = A.indexOf(ch); if (i >= 0) return Array.from(up)[i]; i = a.indexOf(ch); if (i >= 0) return Array.from(low)[i]; return ch; }; }
  var SC = "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ", FLIP = { a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z", A: "∀", B: "𐐒", C: "Ɔ", D: "◖", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I", J: "ſ", K: "⋊", L: "⅂", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Ό", R: "ᴚ", S: "S", T: "⊥", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6", "0": "0", ".": "˙", ",": "'", "?": "¿", "!": "¡" };
  var STYLES = [
    ["Bold", range(0x1D400, 0x1D41A, 0x1D7CE)], ["Italic", range(0x1D434, 0x1D44E, 0, { h: "ℎ" })], ["Bold Italic", range(0x1D468, 0x1D482, 0x1D7CE)],
    ["Script", range(0x1D49C, 0x1D4B6, 0, { B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ", e: "ℯ", g: "ℊ", o: "ℴ" })], ["Bold Script", range(0x1D4D0, 0x1D4EA, 0x1D7CE)],
    ["Fraktur", range(0x1D504, 0x1D51E, 0, { C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ" })], ["Bold Fraktur", range(0x1D56C, 0x1D586, 0x1D7CE)],
    ["Double-struck", range(0x1D538, 0x1D552, 0x1D7D8, { C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ" })],
    ["Sans", range(0x1D5A0, 0x1D5BA, 0x1D7E2)], ["Sans Bold", range(0x1D5D4, 0x1D5EE, 0x1D7EC)], ["Sans Italic", range(0x1D608, 0x1D622, 0x1D7E2)], ["Monospace", range(0x1D670, 0x1D68A, 0x1D7F6)],
    ["Circled", function (c) { if (A.indexOf(c) >= 0) return String.fromCodePoint(0x24B6 + c.charCodeAt(0) - 65); if (a.indexOf(c) >= 0) return String.fromCodePoint(0x24D0 + c.charCodeAt(0) - 97); if (c >= "1" && c <= "9") return String.fromCodePoint(0x2460 + c.charCodeAt(0) - 49); if (c === "0") return "⓪"; return c; }],
    ["Black Circled", function (c) { if (A.indexOf(c) >= 0) return String.fromCodePoint(0x1F150 + c.charCodeAt(0) - 65); if (a.indexOf(c) >= 0) return String.fromCodePoint(0x1F150 + c.charCodeAt(0) - 97); return c; }],
    ["Squared", function (c) { if (A.indexOf(c) >= 0) return String.fromCodePoint(0x1F130 + c.charCodeAt(0) - 65); if (a.indexOf(c) >= 0) return String.fromCodePoint(0x1F130 + c.charCodeAt(0) - 97); return c; }],
    ["Wide", function (c) { return c === " " ? "　" : (c > " " && c <= "~") ? String.fromCodePoint(c.charCodeAt(0) + 0xFEE0) : c; }],
    ["Small Caps", function (c) { var i = a.indexOf(c); if (i >= 0) return Array.from(SC)[i]; return c; }],
    ["Upside Down", function (c) { return FLIP[c] || c; }, true],
    ["Strikethrough", function (c) { return c + "̶"; }], ["Underline", function (c) { return c + "̲"; }], ["Slash", function (c) { return c + "̸"; }]
  ];
  function build() {
    var t = $("txt").value, box = $("out"); box.innerHTML = "";
    STYLES.forEach(function (s) {
      var chars = Array.from(t), r = chars.map(s[1]); if (s[2]) r.reverse(); r = r.join("");
      var d = document.createElement("div"); d.className = "row"; var sm = document.createElement("small"); sm.textContent = s[0]; var sp = document.createElement("span"); sp.textContent = r || " ";
      d.append(sm, sp); d.addEventListener("click", function () { ToolsHub.copy(r, function () { $("status").className = "status ok"; $("status").textContent = s[0] + ToolsHub.t(" copied", " کاپی ہو گیا"); }); }); box.appendChild(d);
    });
  }
  $("txt").addEventListener("input", build); build();
})();
