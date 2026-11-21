/* Stopwatch and Countdown */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var p2 = function (n) { return (n < 10 ? "0" : "") + n; };

  // tabs
  Array.prototype.forEach.call(document.querySelectorAll("[data-tab]"), function (b) {
    b.addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll("[data-tab]"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      $("sw").hidden = b.getAttribute("data-tab") !== "sw"; $("cd").hidden = b.getAttribute("data-tab") !== "cd";
    });
  });

  // stopwatch
  var swRun = false, swStart = 0, swAcc = 0, swLast = 0, raf = 0, laps = [];
  function swNow() { return swAcc + (swRun ? performance.now() - swStart : 0); }
  function fmtSw(ms) { var cs = Math.floor(ms / 10) % 100, s = Math.floor(ms / 1000) % 60, m = Math.floor(ms / 60000); return p2(m) + ":" + p2(s) + "." + p2(cs); }
  function tick() { $("swTime").textContent = fmtSw(swNow()); if (swRun) raf = requestAnimationFrame(tick); }
  $("swGo").addEventListener("click", function () {
    if (swRun) { swAcc = swNow(); swRun = false; $("swGo").textContent = ToolsHub.t("Start", "شروع"); tick(); }
    else { swStart = performance.now(); swRun = true; $("swGo").textContent = ToolsHub.t("Stop", "روکیں"); tick(); }
  });
  $("swLap").addEventListener("click", function () {
    if (!swNow()) return;
    var t = swNow(), li = document.createElement("li");
    li.textContent = fmtSw(t) + "  (+" + fmtSw(t - swLast) + ")"; swLast = t;
    $("laps").insertBefore(li, $("laps").firstChild);
  });
  $("swReset").addEventListener("click", function () { swRun = false; swAcc = 0; swLast = 0; cancelAnimationFrame(raf); $("laps").innerHTML = ""; $("swGo").textContent = ToolsHub.t("Start", "شروع"); tick(); });

  // countdown
  var cdRun = false, cdEnd = 0, cdLeft = 0, iv = 0, ac = null;
  function inputSecs() { return (+$("ch").value || 0) * 3600 + (+$("cm").value || 0) * 60 + (+$("cs").value || 0); }
  function fmtCd(s) { return p2(Math.floor(s / 3600)) + ":" + p2(Math.floor(s / 60) % 60) + ":" + p2(s % 60); }
  function show(s) { $("cdTime").textContent = fmtCd(s); if (cdRun) document.title = fmtCd(s) + " - ToolsHub"; }
  function beep() {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      for (var i = 0; i < 4; i++) {
        var o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 880; o.connect(g); g.connect(ac.destination);
        var t0 = ac.currentTime + i * 0.4; g.gain.setValueAtTime(0.25, t0); g.gain.setValueAtTime(0, t0 + 0.2); o.start(t0); o.stop(t0 + 0.25);
      }
    } catch (e) {}
  }
  function stopCd() { cdRun = false; clearInterval(iv); $("cdGo").textContent = ToolsHub.t("Start", "شروع"); document.title = document.title.replace(/^[\d:]+ - /, ""); }
  $("cdGo").addEventListener("click", function () {
    if (cdRun) { cdLeft = Math.max(0, Math.ceil((cdEnd - Date.now()) / 1000)); stopCd(); return; }
    if (!cdLeft) cdLeft = inputSecs();
    if (!cdLeft) return;
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.resume) ac.resume(); } catch (e) {}
    cdEnd = Date.now() + cdLeft * 1000; cdRun = true; $("cdGo").textContent = ToolsHub.t("Pause", "روکیں"); show(cdLeft);
    iv = setInterval(function () {
      var s = Math.max(0, Math.ceil((cdEnd - Date.now()) / 1000)); show(s);
      if (s <= 0) { stopCd(); cdLeft = 0; $("cdTime").textContent = ToolsHub.t("Time's up!", "وقت ختم!"); beep(); }
    }, 200);
  });
  $("cdReset").addEventListener("click", function () { stopCd(); cdLeft = 0; show(inputSecs()); });
  ["ch", "cm", "cs"].forEach(function (id) { $(id).addEventListener("input", function () { if (!cdRun) { cdLeft = 0; show(inputSecs()); } }); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-set]"), function (b) {
    b.addEventListener("click", function () { var s = +b.getAttribute("data-set"); $("ch").value = Math.floor(s / 3600); $("cm").value = Math.floor(s / 60) % 60; $("cs").value = s % 60; stopCd(); cdLeft = 0; show(s); });
  });
})();
