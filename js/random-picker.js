/* Random Picker - fair wheel + random number */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var cv = $("wheel"), ctx = cv.getContext("2d"), names = [], rot = 0, spinning = false, TAU = Math.PI * 2;
  function rnd(n) { var a = new Uint32Array(1), max = Math.floor(4294967296 / n) * n; do { crypto.getRandomValues(a); } while (a[0] >= max); return a[0] % n; }

  function parse() { names = $("names").value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 40); }
  function draw() {
    var W = cv.width, R = W / 2 - 14, n = names.length;
    ctx.clearRect(0, 0, W, W); ctx.save(); ctx.translate(W / 2, W / 2);
    if (!n) { ctx.fillStyle = "rgba(255,255,255,.1)"; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); }
    var seg = TAU / (n || 1);
    names.forEach(function (nm, i) {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, rot + i * seg, rot + (i + 1) * seg); ctx.closePath();
      ctx.fillStyle = "hsl(" + Math.round(i * 360 / n) + ",70%," + (i % 2 ? 48 : 56) + "%)"; ctx.fill();
      ctx.save(); ctx.rotate(rot + (i + 0.5) * seg); ctx.fillStyle = "#fff"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.font = "600 " + Math.max(11, Math.min(20, 300 / n * 1.4)) + "px sans-serif";
      var label = nm.length > 16 ? nm.slice(0, 15) + "…" : nm; ctx.fillText(label, R - 12, 0); ctx.restore();
    });
    ctx.restore();
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 14, 2); ctx.lineTo(W / 2 + 14, 2); ctx.lineTo(W / 2, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(W / 2, W / 2, 16, 0, TAU); ctx.fill(); ctx.stroke();
  }

  $("spin").addEventListener("click", function () {
    if (spinning) return; parse();
    if (names.length < 2) { $("result").textContent = ToolsHub.t("Add at least 2 names.", "کم از کم 2 نام لکھیں۔"); return; }
    spinning = true; $("result").textContent = "";
    var n = names.length, seg = TAU / n, idx = rnd(n), off = (Math.random() - 0.5) * seg * 0.7;
    var target = -Math.PI / 2 - (idx + 0.5) * seg + off, cur = ((rot % TAU) + TAU) % TAU, base = ((target % TAU) + TAU) % TAU;
    var delta = ((base - cur) + TAU) % TAU + TAU * (5 + rnd(3)), start = rot, t0 = performance.now(), dur = 4200;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      rot = start + delta * e; draw();
      if (p < 1) requestAnimationFrame(step);
      else {
        spinning = false; $("result").textContent = "🎉 " + names[idx];
        if ($("rm").checked) { var all = $("names").value.split(/\r?\n/), k = all.findIndex(function (s) { return s.trim() === names[idx]; }); if (k >= 0) all.splice(k, 1); $("names").value = all.join("\n"); parse(); draw(); }
      }
    })(t0);
  });
  $("names").addEventListener("input", function () { if (!spinning) { parse(); draw(); } });
  $("rnd").addEventListener("click", function () {
    var a = Math.floor(+$("mn").value), b = Math.floor(+$("mx").value);
    if (isNaN(a) || isNaN(b)) return; if (a > b) { var t = a; a = b; b = t; }
    $("result").textContent = "🎲 " + (a + rnd(b - a + 1));
  });
  parse(); draw();
})();
