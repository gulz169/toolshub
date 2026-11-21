/* Signature Maker - drawing pad */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var cv = $("pad"), x = cv.getContext("2d"), strokes = [], cur = null;
  function pt(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; }
  function draw(ctx, offX, offY, color, bg) {
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); }
    ctx.lineCap = ctx.lineJoin = "round";
    strokes.forEach(function (s) {
      ctx.strokeStyle = s.c; ctx.fillStyle = s.c; ctx.lineWidth = s.w;
      if (s.p.length === 1) { ctx.beginPath(); ctx.arc(s.p[0][0] - offX, s.p[0][1] - offY, s.w / 2, 0, 7); ctx.fill(); return; }
      ctx.beginPath(); s.p.forEach(function (p, i) { i ? ctx.lineTo(p[0] - offX, p[1] - offY) : ctx.moveTo(p[0] - offX, p[1] - offY); }); ctx.stroke();
    });
  }
  function render() { x.clearRect(0, 0, cv.width, cv.height); draw(x, 0, 0, null, "#fff"); }
  cv.addEventListener("pointerdown", function (e) { cur = { c: $("col").value, w: +$("w").value * 1.6, p: [pt(e)] }; strokes.push(cur); cv.setPointerCapture(e.pointerId); render(); });
  cv.addEventListener("pointermove", function (e) { if (cur) { cur.p.push(pt(e)); render(); } });
  ["pointerup", "pointercancel"].forEach(function (ev) { cv.addEventListener(ev, function () { cur = null; }); });
  $("undo").addEventListener("click", function () { strokes.pop(); render(); });
  $("clear").addEventListener("click", function () { strokes = []; render(); });
  function exportImg(bg, name, type) {
    var st = $("status");
    if (!strokes.length) { st.className = "status err"; st.textContent = ToolsHub.t("Draw your signature first.", "پہلے دستخط بنائیں۔"); return; }
    st.textContent = "";
    var x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, pad = 14;
    strokes.forEach(function (s) { s.p.forEach(function (p) { x0 = Math.min(x0, p[0] - s.w); y0 = Math.min(y0, p[1] - s.w); x1 = Math.max(x1, p[0] + s.w); y1 = Math.max(y1, p[1] + s.w); }); });
    x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(cv.width, x1 + pad); y1 = Math.min(cv.height, y1 + pad);
    var c = document.createElement("canvas"); c.width = Math.round(x1 - x0); c.height = Math.round(y1 - y0);
    draw(c.getContext("2d"), x0, y0, null, bg);
    c.toBlob(function (b) { ToolsHub.download(b, name); }, type, 0.95);
  }
  $("png").addEventListener("click", function () { exportImg(null, "signature.png", "image/png"); });
  $("jpg").addEventListener("click", function () { exportImg("#fff", "signature.jpg", "image/jpeg"); });
  render();
})();
