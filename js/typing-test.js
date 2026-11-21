/* Typing Speed Test - word based (works for English and Urdu) */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var TEXT = {
    en: ["the quick brown fox jumps over the lazy dog while the sun sets slowly behind the hills and the evening wind carries the smell of fresh rain across the quiet town",
      "good habits are built one day at a time so start small keep going and never be afraid to ask for help when a problem feels too big to solve alone",
      "reading every day improves your mind your vocabulary and your focus and it costs very little compared to the many things you will learn from a single good book",
      "a clear plan a calm mind and steady practice will take you further than talent alone so show up each morning and do the work even when you do not feel like it",
      "the market opens early in the morning and the shopkeepers arrange fruit vegetables and spices while customers walk slowly through the narrow lanes looking for the best price"],
    ur: ["علم حاصل کرنا ہر انسان کے لیے ضروری ہے کیونکہ اسی سے ترقی کے راستے کھلتے ہیں اور سوچنے سمجھنے کی صلاحیت بڑھتی ہے",
      "محنت اور ایمانداری انسان کو کامیابی تک پہنچاتی ہے اس لیے ہمیں ہر کام وقت پر اور پوری توجہ کے ساتھ کرنا چاہیے",
      "صبح سویرے اٹھنا صحت کے لیے بہت فائدہ مند ہے تازہ ہوا میں چہل قدمی کرنے سے دن بھر طبیعت ہشاش بشاش رہتی ہے",
      "کتاب سب سے اچھی دوست ہے جو ہمیں نئی باتیں سکھاتی ہے اور مشکل وقت میں ہمیشہ راستہ دکھاتی ہے",
      "وقت کی قدر کرنے والے لوگ ہمیشہ آگے بڑھتے ہیں کیونکہ گزرا ہوا وقت کبھی واپس نہیں آتا اور موقع بار بار نہیں ملتا"]
  };
  var words = [], states = [], idx = 0, started = false, left = 0, timer = null, done = false, typed = 0, correct = 0, chars = 0, t0 = 0;
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function addPassages() { shuffle(TEXT[$("lang").value].slice()).forEach(function (p) { p.split(" ").forEach(function (w) { words.push(w); states.push(""); }); }); }
  function draw() {
    var box = $("words"), from = Math.max(0, idx - 6), html = document.createDocumentFragment(); box.innerHTML = "";
    for (var i = from; i < Math.min(words.length, from + 60); i++) { var s = document.createElement("span"); s.textContent = words[i]; s.className = i === idx ? "cur" : states[i]; html.appendChild(s); html.appendChild(document.createTextNode(" ")); }
    box.appendChild(html);
  }
  function stats() {
    var mins = Math.max((Date.now() - t0) / 60000, 5 / 60), wpm = started ? Math.round(correct / mins) : 0;
    $("wpm").textContent = wpm; $("acc").textContent = (typed ? Math.round(correct / typed * 100) : 100) + "%";
  }
  function finish() {
    clearInterval(timer); done = true; $("inp").disabled = true; stats(); $("time").textContent = "0";
    $("wpm").parentNode.style.outline = "2px solid #34d399";
  }
  function reset() {
    clearInterval(timer); words = []; states = []; idx = 0; started = false; done = false; typed = correct = chars = 0;
    left = +$("dur").value; $("time").textContent = left; $("wpm").textContent = "0"; $("acc").textContent = "100%"; $("wpm").parentNode.style.outline = "";
    $("inp").disabled = false; $("inp").value = ""; addPassages(); draw(); $("inp").focus();
  }
  $("inp").addEventListener("input", function () {
    if (done) return;
    var v = $("inp").value;
    if (!started && v.trim()) {
      started = true; t0 = Date.now();
      timer = setInterval(function () { left--; $("time").textContent = Math.max(0, left); stats(); if (left <= 0) finish(); }, 1000);
    }
    if (/\s$/.test(v) && v.trim()) {
      var w = v.trim(); typed++;
      if (w === words[idx]) { states[idx] = "ok"; correct++; chars += w.length; } else states[idx] = "bad";
      idx++; if (idx > words.length - 25) addPassages(); $("inp").value = ""; draw(); stats();
    }
  });
  $("restart").addEventListener("click", reset);
  ["lang", "dur"].forEach(function (id) { $(id).addEventListener("change", reset); });
  reset();
})();
