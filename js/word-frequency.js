/* Word Frequency Counter */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var STOP = new Set("a about all also am an and any are as at be been but by can could did do does for from had has have he her him his how i if in into is it its just me my no not of on or our she so some such than that the their them then there these they this to up us was we were what when which who will with would you your".split(" "));
  var rows = [];
  function calc() {
    var txt = $("txt").value, words = txt.match(/[\p{L}\p{M}\p{N}'’]+/gu) || [], map = {}, min = +$("min").value, skip = $("stop").checked, total = 0;
    words.forEach(function (w) {
      w = w.toLowerCase().replace(/^['’]+|['’]+$/g, ""); if (!w) return; total++;
      if (Array.from(w).length < min || (skip && STOP.has(w))) return; map[w] = (map[w] || 0) + 1;
    });
    rows = Object.keys(map).map(function (k) { return [k, map[k]]; }).sort(function (a, b) { return b[1] - a[1] || a[0].localeCompare(b[0]); });
    $("tw").textContent = total.toLocaleString(); $("uw").textContent = rows.length.toLocaleString();
    var top = rows.slice(0, +$("top").value), mx = top.length ? top[0][1] : 1, tb = $("tbl"); tb.innerHTML = "";
    top.forEach(function (r, i) {
      var tr = document.createElement("tr"), c = [i + 1, r[0], r[1]];
      c.forEach(function (v) { var td = document.createElement("td"); td.textContent = v; tr.appendChild(td); });
      var td = document.createElement("td"); td.style.width = "40%"; var b = document.createElement("div"); b.className = "bar"; b.style.width = (r[1] / mx * 100) + "%"; td.appendChild(b); tr.appendChild(td); tb.appendChild(tr);
    });
  }
  ["txt", "top", "min", "stop"].forEach(function (id) { $(id).addEventListener("input", calc); });
  $("clear").addEventListener("click", function () { $("txt").value = ""; calc(); });
  $("csv").addEventListener("click", function () {
    if (!rows.length) return;
    ToolsHub.download(new Blob(["﻿word,count\n" + rows.map(function (r) { return '"' + r[0].replace(/"/g, '""') + '",' + r[1]; }).join("\n")], { type: "text/csv;charset=utf-8" }), "word-frequency.csv");
  });
  calc();
})();
