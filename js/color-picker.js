/* Color Picker & Converter */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var picker = $("picker"), hex = $("hex"), rgb = $("rgb"), hsl = $("hsl"), statusEl = $("status");
  var cur = [37, 99, 235]; // r,g,b

  function setStatus(m, t) { statusEl.textContent = m || ""; statusEl.className = "status" + (t ? " " + t : ""); }
  function toHex(c) { return "#" + c.map(function (v) { return ("0" + Math.round(v).toString(16)).slice(-2); }).join(""); }
  function toHsl(c) {
    var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60; if (h < 0) h += 360;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  }
  function fromHsl(h, s, l) {
    s /= 100; l /= 100;
    var k = function (n) { return (n + h / 30) % 12; }, a = s * Math.min(l, 1 - l);
    var f = function (n) { return Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))); };
    return [f(0), f(8), f(4)];
  }
  function parse(str, kind) {
    str = str.trim();
    if (kind === "hex") {
      var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(str); if (!m) return null;
      var h = m[1]; if (h.length === 3) h = h.replace(/./g, "$&$&");
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4), 16)];
    }
    var n = str.match(/-?\d+(\.\d+)?/g); if (!n || n.length < 3) return null; n = n.slice(0, 3).map(Number);
    if (kind === "rgb") return n.every(function (v) { return v >= 0 && v <= 255; }) ? n : null;
    return n[0] >= 0 && n[0] <= 360 && n[1] >= 0 && n[1] <= 100 && n[2] >= 0 && n[2] <= 100 ? fromHsl(n[0], n[1], n[2]) : null;
  }

  function update(skip) {
    var h = toHsl(cur);
    $("swatch").style.background = toHex(cur);
    picker.value = toHex(cur);
    if (skip !== "hex") hex.value = toHex(cur).toUpperCase();
    if (skip !== "rgb") rgb.value = "rgb(" + cur.join(", ") + ")";
    if (skip !== "hsl") hsl.value = "hsl(" + h[0] + ", " + h[1] + "%, " + h[2] + "%)";
    var box = $("shades"); box.innerHTML = "";
    [95, 85, 70, 55, null, 40, 28, 18, 8].forEach(function (L) {
      var c = L === null ? cur : fromHsl(h[0], h[1], L), b = document.createElement("button");
      b.type = "button"; b.style.background = toHex(c); b.title = toHex(c).toUpperCase();
      b.addEventListener("click", function () { cur = c; update(); });
      box.appendChild(b);
    });
  }

  picker.addEventListener("input", function () { cur = parse(picker.value, "hex"); setStatus(""); update(); });
  [["hex", hex], ["rgb", rgb], ["hsl", hsl]].forEach(function (p) {
    p[1].addEventListener("input", function () {
      var c = parse(p[1].value, p[0]);
      if (c) { cur = c; setStatus(""); update(p[0]); } else setStatus(ToolsHub.t("Not a valid " + p[0].toUpperCase() + " code yet.", "ابھی درست " + p[0].toUpperCase() + " کوڈ نہیں ہے۔"), "err");
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (b) {
    b.addEventListener("click", function () {
      var el = $(b.getAttribute("data-copy")), done = function () { setStatus(ToolsHub.t("Copied!", "کاپی ہو گیا!"), "ok"); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(el.value).then(done, function () { el.select(); document.execCommand("copy"); done(); });
      else { el.select(); document.execCommand("copy"); done(); }
    });
  });
  if (window.EyeDropper) {
    $("eye").hidden = false;
    $("eye").addEventListener("click", function () {
      new EyeDropper().open().then(function (r) { cur = parse(r.sRGBHex, "hex"); setStatus(""); update(); }).catch(function () {});
    });
  }
  update();
})();
