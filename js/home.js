/* Home page: live search, category filter, cursor spotlight + 3D tilt on tiles */
(function () {
  "use strict";

  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tool-card"));
  var chipBox = document.getElementById("chips"), cg = document.getElementById("catGrid");
  (window.TH_CATS || []).forEach(function (c) {
    var n = window.TH_TOOLS.filter(function (t) { return t[1] === c[0]; }).length;
    var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.setAttribute("data-filter", c[0]); b.setAttribute("aria-pressed", "false");
    b.setAttribute("data-en", c[1] + " " + c[2]); b.setAttribute("data-ur", c[1] + " " + c[3]); b.textContent = c[1] + " " + c[2]; chipBox.appendChild(b);
    var k = document.createElement("button"); k.type = "button"; k.className = "cat-tile"; k.setAttribute("data-filter", c[0]);
    k.innerHTML = '<span class="ci">' + c[1] + '</span><b data-en="' + c[2] + '" data-ur="' + c[3] + '">' + c[2] + '</b><small>' + n + ' <span data-en="tools" data-ur="ٹولز">tools</span></small>';
    cg.appendChild(k);
  });
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var rec = [];
  try { rec = JSON.parse(localStorage.getItem("th_recent") || "[]"); } catch (e) {}
  rec = rec.map(function (s) { return window.TH_TOOLS.filter(function (t) { return t[0] === s; })[0]; }).filter(Boolean).slice(0, 6);
  if (rec.length) {
    var rb = document.getElementById("recent"); rb.hidden = false;
    rb.innerHTML = '<h2 class="sec-h" data-en="Recently used" data-ur="حال ہی میں استعمال">Recently used</h2><div class="recent-row">' + rec.map(function (t) { return '<a href="tools/' + t[0] + '.html"><span>' + t[2] + '</span><b data-en="' + t[3].replace(/"/g, "&quot;") + '" data-ur="' + t[4].replace(/"/g, "&quot;") + '">' + t[3] + "</b></a>"; }).join("") + "</div>";
  }
  var input = document.getElementById("toolSearch");
  var emptyMsg = document.getElementById("emptyMsg");
  var category = "all";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function norm(s) {
    return (s || "").toLowerCase().trim();
  }

  function apply() {
    var words = norm(input.value).split(/\s+/).filter(Boolean);
    var shown = 0;

    tiles.forEach(function (t) {
      var okCat = category === "all" || t.getAttribute("data-cat") === category;
      var hay = norm((t.getAttribute("data-kw") || "") + " " + t.textContent);
      var okText = words.every(function (w) { return hay.indexOf(w) !== -1; });
      var show = okCat && okText;
      var wasHidden = t.hidden;
      t.hidden = !show;
      if (show) {
        shown++;
        if (wasHidden && !reduceMotion) {
          t.classList.remove("pop");
          void t.offsetWidth; // restart the animation
          t.classList.add("pop");
        }
      }
    });

    emptyMsg.hidden = shown > 0;
  }

  Array.prototype.forEach.call(document.querySelectorAll(".cat-tile"), function (k) {
    k.addEventListener("click", function () {
      var c = chips.filter(function (x) { return x.getAttribute("data-filter") === k.getAttribute("data-filter"); })[0];
      if (c) c.click();
      document.getElementById("tools").scrollIntoView({ behavior: "smooth" });
    });
  });
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      category = chip.getAttribute("data-filter");
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      apply();
    });
  });

  input.addEventListener("input", apply);
  document.addEventListener("langchange", apply);

  // Soft spotlight follows the cursor
  tiles.forEach(function (t) {
    t.addEventListener("animationend", function () { t.classList.remove("pop"); });

    t.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var r = t.getBoundingClientRect();
      t.style.setProperty("--mx", (e.clientX - r.left) + "px");
      t.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
})();
