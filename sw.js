/* ToolsHub service worker - offline support */
var VERSION = "toolshub-faq-d6aa9b29";
var CORE = ["./", "css/style.css", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/favicon.ico", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "index.html", "js/age-calculator.js", "js/aspect-ratio.js", "js/average-calculator.js", "js/background-remover.js", "js/barcode-generator.js", "js/base64.js", "js/bill-splitter.js", "js/bmi-calculator.js", "js/box-shadow.js", "js/calorie-calculator.js", "js/circle-crop.js", "js/code-minifier.js", "js/color-palette.js", "js/color-picker.js", "js/common.js", "js/compound-interest.js", "js/contrast-checker.js", "js/countdown-timer.js", "js/css-gradient.js", "js/csv-json.js", "js/currency-converter.js", "js/data-arranger.js", "js/date-add.js", "js/date-converter.js", "js/date-difference.js", "js/day-of-week.js", "js/dice-coin.js", "js/discount-gst.js", "js/electricity-cost.js", "js/emi-calculator.js", "js/emoji-picker.js", "js/fancy-text.js", "js/favicon-maker.js", "js/fileio.js", "js/find-replace.js", "js/fuel-cost.js", "js/gold-calculator.js", "js/gpa-calculator.js", "js/hash-generator.js", "js/home.js", "js/html-entities.js", "js/image-blur.js", "js/image-border.js", "js/image-collage.js", "js/image-color-picker.js", "js/image-compressor.js", "js/image-converter.js", "js/image-cropper.js", "js/image-filters.js", "js/image-info.js", "js/image-rotate.js", "js/image-size-reducer.js", "js/image-splitter.js", "js/image-to-base64.js", "js/image-to-pdf.js", "js/image-to-text.js", "js/json-formatter.js", "js/jwt-decoder.js", "js/line-tools.js", "js/lorem-ipsum.js", "js/markdown-preview.js", "js/meta-tag-generator.js", "js/number-base.js", "js/number-to-words.js", "js/passport-photo.js", "js/password-generator.js", "js/pdf-compress.js", "js/pdf-crop.js", "js/pdf-grayscale.js", "js/pdf-info.js", "js/pdf-merge.js", "js/pdf-metadata.js", "js/pdf-n-up.js", "js/pdf-organize.js", "js/pdf-page-numbers.js", "js/pdf-pages.js", "js/pdf-resize.js", "js/pdf-sign.js", "js/pdf-split.js", "js/pdf-to-images.js", "js/pdf-to-text.js", "js/percentage-calculator.js", "js/profit-margin.js", "js/px-rem-converter.js", "js/qr-generator.js", "js/random-number.js", "js/random-picker.js", "js/reading-time.js", "js/regex-tester.js", "js/registry.js", "js/remove-metadata.js", "js/reverse-text.js", "js/robots-txt.js", "js/roman-numerals.js", "js/salary-converter.js", "js/signature-maker.js", "js/slug-generator.js", "js/social-resizer.js", "js/speed-distance-time.js", "js/svg-to-png.js", "js/text-case.js", "js/text-compare.js", "js/text-encoder.js", "js/text-on-image.js", "js/text-repeater.js", "js/text-to-speech.js", "js/time-zone-converter.js", "js/timer.js", "js/timestamp-converter.js", "js/typing-test.js", "js/unit-converter.js", "js/url-encoder.js", "js/url-parser.js", "js/uuid-generator.js", "js/voice-to-text.js", "js/watermark.js", "js/whatsapp-link.js", "js/word-counter.js", "js/word-frequency.js", "js/zakat-calculator.js", "manifest.json", "tools/age-calculator.html", "tools/aspect-ratio.html", "tools/average-calculator.html", "tools/background-remover.html", "tools/barcode-generator.html", "tools/base64.html", "tools/bill-splitter.html", "tools/bmi-calculator.html", "tools/box-shadow.html", "tools/calorie-calculator.html", "tools/circle-crop.html", "tools/code-minifier.html", "tools/color-palette.html", "tools/color-picker.html", "tools/compound-interest.html", "tools/contrast-checker.html", "tools/countdown-timer.html", "tools/css-gradient.html", "tools/csv-json.html", "tools/currency-converter.html", "tools/data-arranger.html", "tools/date-add.html", "tools/date-converter.html", "tools/date-difference.html", "tools/day-of-week.html", "tools/dice-coin.html", "tools/discount-gst.html", "tools/electricity-cost.html", "tools/emi-calculator.html", "tools/emoji-picker.html", "tools/fancy-text.html", "tools/favicon-maker.html", "tools/find-replace.html", "tools/fuel-cost.html", "tools/gold-calculator.html", "tools/gpa-calculator.html", "tools/hash-generator.html", "tools/html-entities.html", "tools/image-blur.html", "tools/image-border.html", "tools/image-collage.html", "tools/image-color-picker.html", "tools/image-compressor.html", "tools/image-converter.html", "tools/image-cropper.html", "tools/image-filters.html", "tools/image-info.html", "tools/image-rotate.html", "tools/image-size-reducer.html", "tools/image-splitter.html", "tools/image-to-base64.html", "tools/image-to-pdf.html", "tools/image-to-text.html", "tools/json-formatter.html", "tools/jwt-decoder.html", "tools/line-tools.html", "tools/lorem-ipsum.html", "tools/markdown-preview.html", "tools/meta-tag-generator.html", "tools/number-base.html", "tools/number-to-words.html", "tools/passport-photo.html", "tools/password-generator.html", "tools/pdf-compress.html", "tools/pdf-crop.html", "tools/pdf-grayscale.html", "tools/pdf-info.html", "tools/pdf-merge.html", "tools/pdf-metadata.html", "tools/pdf-n-up.html", "tools/pdf-organize.html", "tools/pdf-page-numbers.html", "tools/pdf-pages.html", "tools/pdf-resize.html", "tools/pdf-sign.html", "tools/pdf-split.html", "tools/pdf-to-images.html", "tools/pdf-to-text.html", "tools/percentage-calculator.html", "tools/profit-margin.html", "tools/px-rem-converter.html", "tools/qr-generator.html", "tools/random-number.html", "tools/random-picker.html", "tools/reading-time.html", "tools/regex-tester.html", "tools/remove-metadata.html", "tools/reverse-text.html", "tools/robots-txt.html", "tools/roman-numerals.html", "tools/salary-converter.html", "tools/signature-maker.html", "tools/slug-generator.html", "tools/social-resizer.html", "tools/speed-distance-time.html", "tools/svg-to-png.html", "tools/text-case.html", "tools/text-compare.html", "tools/text-encoder.html", "tools/text-on-image.html", "tools/text-repeater.html", "tools/text-to-speech.html", "tools/time-zone-converter.html", "tools/timer.html", "tools/timestamp-converter.html", "tools/typing-test.html", "tools/unit-converter.html", "tools/url-encoder.html", "tools/url-parser.html", "tools/uuid-generator.html", "tools/voice-to-text.html", "tools/watermark.html", "tools/whatsapp-link.html", "tools/word-counter.html", "tools/word-frequency.html", "tools/zakat-calculator.html"];
var CDN = /^(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com)$/;

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function put(req, res) {
  if (res && (res.ok || res.type === "opaque")) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
  return res;
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  // libraries and fonts from CDNs: cache first (versions are fixed)
  if (CDN.test(url.hostname)) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) { return put(req, res); });
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  // big model file: cache first
  if (/\.(onnx|wasm|gz)$/.test(url.pathname)) {
    e.respondWith(caches.match(req).then(function (hit) { return hit || fetch(req).then(function (res) { return put(req, res); }); }));
    return;
  }

  // pages, scripts, styles: network first, fall back to cache (works offline)
  e.respondWith(fetch(req).then(function (res) { return put(req, res); }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (hit) {
      return hit || (req.mode === "navigate" ? caches.match("index.html") : Response.error());
    });
  }));
});
