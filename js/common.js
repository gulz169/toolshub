/* ToolsHub - common script: header, footer, Urdu/English switch */
(function () {
  "use strict";

  var SITE_NAME = "ToolsHub"; // yahan se site ka naam badlein
  var root = document.body.getAttribute("data-root") || "";

  function getLang() {
    try {
      return localStorage.getItem("lang") || "ur";
    } catch (e) {
      return "ur";
    }
  }

  function saveLang(l) {
    try {
      localStorage.setItem("lang", l);
    } catch (e) {}
  }

  function applyLang(lang) {
    document.documentElement.lang = lang === "ur" ? "ur" : "en";
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";

    var nodes = document.querySelectorAll("[data-en]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var text = lang === "ur" ? el.getAttribute("data-ur") : el.getAttribute("data-en");
      if (text) el.textContent = text;
    }

    var btn = document.getElementById("langBtn");
    var phs = document.querySelectorAll("[data-en-ph]");
    for (var k = 0; k < phs.length; k++) {
      var ph = lang === "ur" ? phs[k].getAttribute("data-ur-ph") : phs[k].getAttribute("data-en-ph");
      if (ph) phs[k].setAttribute("placeholder", ph);
    }

    if (btn) btn.textContent = lang === "ur" ? "English" : "اردو";

    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  function buildHeader() {
    var h = document.getElementById("site-header");
    if (!h) return;
    h.className = "site-header";
    h.innerHTML =
      '<div class="container">' +
      '<button class="menu-btn" id="menuBtn" type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i><i></i></button>' +
      '<a class="logo" href="' + root + 'index.html" aria-label="ToolsHub"><img class="logo-mark" src="' + root + 'icons/logo.svg" width="34" height="34" alt="">Tools<span>Hub</span></a>' +
      '<nav class="nav">' +
      '<a class="nav-all" href="' + root + 'index.html#tools" data-en="All Tools" data-ur="تمام ٹولز">All Tools</a>' +
      '<button class="lang-btn" id="installBtn" type="button" data-en="📲 Install" data-ur="📲 انسٹال">📲 Install</button>' +
      '<button class="lang-btn" id="langBtn" type="button">English</button>' +
      "</nav></div>";
  }

  // ---- Menu drawer (categories + all tools) and mobile bottom bar ----
  var regLoaded = null;
  function loadRegistry(cb) {
    if (window.TH_TOOLS) return cb();
    if (regLoaded) { regLoaded.push(cb); return; }
    regLoaded = [cb];
    var sc = document.createElement("script");
    sc.src = root + "js/registry.js";
    sc.onload = function () { regLoaded.forEach(function (f) { f(); }); regLoaded = null; };
    document.head.appendChild(sc);
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function curSlug() { var m = /\/tools\/([a-z0-9-]+)\.html/.exec(location.pathname); return m ? m[1] : ""; }
  function getRecent() { try { return JSON.parse(localStorage.getItem("th_recent") || "[]"); } catch (e) { return []; } }
  function trackRecent() {
    var s = curSlug(); if (!s) return;
    var r = getRecent().filter(function (x) { return x !== s; }); r.unshift(s);
    try { localStorage.setItem("th_recent", JSON.stringify(r.slice(0, 8))); } catch (e) {}
  }
  function toolLink(t, cur) {
    return '<a class="dr-tool' + (t[0] === cur ? " cur" : "") + '" href="' + root + "tools/" + t[0] + '.html"><span class="dr-ico">' + t[2] + '</span><span>' + esc(getLang() === "ur" ? t[4] : t[3]) + "</span></a>";
  }
  var drawerBuilt = false;
  function buildDrawer() {
    if (drawerBuilt) return; drawerBuilt = true;
    var d = document.createElement("div"); d.id = "drawer"; d.className = "drawer"; d.hidden = true;
    d.innerHTML = '<div class="dr-back" data-close></div><aside class="dr-panel" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="dr-head"><a class="logo" href="' + root + 'index.html">Tools<span>Hub</span></a><button class="dr-x" type="button" data-close aria-label="Close">✕</button></div>' +
      '<div class="dr-search"><input type="search" id="drSearch" autocomplete="off" data-en-ph="Search tools" data-ur-ph="ٹول تلاش کریں" placeholder="Search tools"></div>' +
      '<a class="dr-all" href="' + root + 'index.html#tools"><span data-en="All Tools" data-ur="تمام ٹولز">All Tools</span><b id="drCount"></b></a>' +
      '<button type="button" class="dr-install" id="drInstall" data-en="📲 Install app" data-ur="📲 ایپ انسٹال کریں">📲 Install app</button>' +
      '<div class="dr-body" id="drBody"></div></aside>';
    document.body.appendChild(d);
    d.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeDrawer();
      else if (e.target.closest("a.dr-tool,a.dr-all")) closeDrawer();
    });
    d.querySelector("#drSearch").addEventListener("input", renderDrawer);
    d.querySelector("#drInstall").addEventListener("click", function () { closeDrawer(); installApp(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
    applyLang(getLang());
  }
  function renderDrawer() {
    var body = document.getElementById("drBody"); if (!body || !window.TH_TOOLS) return;
    var q = (document.getElementById("drSearch").value || "").toLowerCase().trim(), cur = curSlug(), ur = getLang() === "ur", h = "";
    document.getElementById("drCount").textContent = window.TH_TOOLS.length;
    if (q) {
      var m = window.TH_TOOLS.filter(function (t) { return (t[0] + " " + t[3] + " " + t[4]).toLowerCase().indexOf(q) !== -1; });
      h = m.length ? m.map(function (t) { return toolLink(t, cur); }).join("") : '<p class="dr-empty">' + (ur ? "کوئی ٹول نہیں ملا" : "No tool found") + "</p>";
    } else {
      var rec = getRecent().map(function (s) { return window.TH_TOOLS.filter(function (t) { return t[0] === s; })[0]; }).filter(Boolean).slice(0, 4);
      if (rec.length) h += '<div class="dr-cat open"><div class="dr-cat-h static">🕘 ' + (ur ? "حال ہی میں استعمال" : "Recently used") + '</div><div class="dr-list">' + rec.map(function (t) { return toolLink(t, cur); }).join("") + "</div></div>";
      var curCat = (window.TH_TOOLS.filter(function (t) { return t[0] === cur; })[0] || [])[1];
      window.TH_CATS.forEach(function (c) {
        var ts = window.TH_TOOLS.filter(function (t) { return t[1] === c[0]; });
        h += '<div class="dr-cat' + (c[0] === curCat ? " open" : "") + '"><button type="button" class="dr-cat-h"><span class="dr-ci">' + c[1] + "</span><span>" + esc(ur ? c[3] : c[2]) + "</span><em>" + ts.length + '</em><i class="chev"></i></button><div class="dr-list">' + ts.map(function (t) { return toolLink(t, cur); }).join("") + "</div></div>";
      });
    }
    body.innerHTML = h;
  }
  function openDrawer(focus) {
    buildDrawer();
    loadRegistry(function () {
      renderDrawer();
      var d = document.getElementById("drawer"); d.hidden = false;
      requestAnimationFrame(function () { d.classList.add("show"); });
      document.documentElement.classList.add("no-scroll");
      var mb = document.getElementById("menuBtn"); if (mb) mb.setAttribute("aria-expanded", "true");
      if (focus) document.getElementById("drSearch").focus();
    });
  }
  function closeDrawer() {
    var d = document.getElementById("drawer"); if (!d || d.hidden) return;
    d.classList.remove("show"); document.documentElement.classList.remove("no-scroll");
    var mb = document.getElementById("menuBtn"); if (mb) mb.setAttribute("aria-expanded", "false");
    setTimeout(function () { d.hidden = true; }, 260);
  }
  function installApp() {
    var e = window.__thPrompt;
    if (e) { e.prompt(); e.userChoice.then(function () { window.__thPrompt = null; }); return; }
    var ur = getLang() === "ur", ios = /iphone|ipad|ipod/i.test(navigator.userAgent), secure = window.isSecureContext && /^https?:$/.test(location.protocol) && location.hostname !== "localhost";
    var steps = ios
      ? (ur ? "Safari میں Share (⬆️) دبائیں، پھر «Add to Home Screen» چنیں۔" : "In Safari tap Share (⬆️), then choose “Add to Home Screen”.")
      : (ur ? "Chrome کے مینو (⋮) میں «Install app» یا «Add to Home screen» چنیں۔" : "In Chrome open the menu (⋮) and choose “Install app” or “Add to Home screen”.");
    var warn = secure ? "" : '<p style="color:#fbbf24;margin-top:10px">' + (ur ? "نوٹ: انسٹال کے لیے سائٹ https پر ہوسٹ ہونی چاہیے (مثلاً Netlify یا GitHub Pages)۔ فائل سے کھولنے پر انسٹال نہیں ہوتا۔" : "Note: installing needs the site hosted on https (e.g. Netlify or GitHub Pages). It will not install when opened as a file.") + "</p>";
    var m = document.createElement("div"); m.className = "drawer show"; m.style.zIndex = 300;
    m.innerHTML = '<div class="dr-back" style="opacity:1" data-x></div><div class="inst-box"><h3>📲 ' + (ur ? "ایپ انسٹال کریں" : "Install app") + "</h3><p>" + steps + "</p>" + warn + '<button class="btn" type="button" data-x>OK</button></div>';
    m.addEventListener("click", function (ev) { if (ev.target.closest("[data-x]")) m.remove(); });
    document.body.appendChild(m);
  }
  function buildBottomBar() {
    var b = document.createElement("nav"); b.className = "bottom-bar"; b.setAttribute("aria-label", "App");
    var home = /\/index\.html$|\/$/.test(location.pathname) && !curSlug();
    b.innerHTML =
      '<a href="' + root + 'index.html" class="' + (home ? "on" : "") + '"><span>🏠</span><small data-en="Home" data-ur="ہوم">Home</small></a>' +
      '<button type="button" data-act="cats"><span>🗂️</span><small data-en="Categories" data-ur="زمرے">Categories</small></button>' +
      '<button type="button" data-act="search"><span>🔍</span><small data-en="Search" data-ur="تلاش">Search</small></button>' +
      '<button type="button" data-act="lang"><span>🌐</span><small data-en="Language" data-ur="زبان">Language</small></button>';
    document.body.appendChild(b);
    document.body.classList.add("has-bar");
    b.addEventListener("click", function (e) {
      var x = e.target.closest("button"); if (!x) return;
      var a = x.getAttribute("data-act");
      if (a === "cats") openDrawer(false); else if (a === "search") openDrawer(true);
      else if (a === "lang") { var lb = document.getElementById("langBtn"); if (lb) lb.click(); }
    });
  }

  function buildFooter() {
    var f = document.getElementById("site-footer");
    if (!f) return;
    f.className = "site-footer";
    f.innerHTML =
      '<div class="container">' +
      '<span dir="ltr">&copy; ' + new Date().getFullYear() + " " + SITE_NAME + "</span>" +
      '<span data-en="Your files stay in your browser. Nothing is uploaded." ' +
      'data-ur="آپ کی فائلیں آپ کے براؤزر میں ہی رہتی ہیں۔ کچھ اپلوڈ نہیں ہوتا۔">' +
      "Your files stay in your browser. Nothing is uploaded.</span>" +
      "</div>";
  }

  // Shared helper for tool pages
  window.ToolsHub = {
    t: function (en, ur) {
      return getLang() === "ur" ? ur : en;
    },
    formatSize: function (bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / 1048576).toFixed(2) + " MB";
    },
    copy: function (text, done) {
      var ok = function () { if (done) done(); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok, function () { fallback(); });
      } else fallback();
      function fallback() {
        var t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
        document.body.appendChild(t); t.select(); try { document.execCommand("copy"); ok(); } catch (e) {} t.remove();
      }
    },
    download: function (blob, filename) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<div class="aurora" aria-hidden="true"><i></i><i></i><i></i><i></i></div>'
    );
    buildHeader();
    buildFooter();
    buildBottomBar();
    trackRecent();
    var mbtn = document.getElementById("menuBtn");
    if (mbtn) mbtn.addEventListener("click", function () { openDrawer(false); });
    document.addEventListener("click", function (e) {
      var c = e.target.closest && e.target.closest(".dr-cat-h:not(.static)");
      if (c) c.parentNode.classList.toggle("open");
    });
    document.addEventListener("langchange", function () { if (document.getElementById("drawer") && window.TH_TOOLS) renderDrawer(); });
    var lang = getLang();
    applyLang(lang);

    var btn = document.getElementById("langBtn");
    if (btn) {
      btn.addEventListener("click", function () {
        lang = lang === "ur" ? "en" : "ur";
        saveLang(lang);
        applyLang(lang);
      });
    }
    // PWA
    var standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
    var ib = document.getElementById("installBtn");
    if (standalone && ib) ib.hidden = true;
    window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); window.__thPrompt = e; });
    window.addEventListener("appinstalled", function () { window.__thPrompt = null; if (ib) ib.hidden = true; });
    if (ib) ib.addEventListener("click", installApp);
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register(root + "sw.js").catch(function () {});
    }
  });
})();
