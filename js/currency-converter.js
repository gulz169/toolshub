/* Currency Converter - open.er-api.com (daily rates), cached for 6 hours */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var CUR = { PKR: "Pakistani Rupee", USD: "US Dollar", SAR: "Saudi Riyal", AED: "UAE Dirham", GBP: "British Pound", EUR: "Euro", INR: "Indian Rupee", CAD: "Canadian Dollar", AUD: "Australian Dollar", CNY: "Chinese Yuan", JPY: "Japanese Yen", TRY: "Turkish Lira", MYR: "Malaysian Ringgit", QAR: "Qatari Riyal", KWD: "Kuwaiti Dinar", BHD: "Bahraini Dinar", OMR: "Omani Rial", CHF: "Swiss Franc", SGD: "Singapore Dollar", BDT: "Bangladeshi Taka", KRW: "South Korean Won", NZD: "New Zealand Dollar", SEK: "Swedish Krona", NOK: "Norwegian Krone", DKK: "Danish Krone", ZAR: "South African Rand", EGP: "Egyptian Pound", IDR: "Indonesian Rupiah", THB: "Thai Baht", RUB: "Russian Ruble" };
  var rates = null, stamp = "", KEY = "th_fx_v1";
  Object.keys(CUR).forEach(function (c) { [$("from"), $("to")].forEach(function (s) { var o = document.createElement("option"); o.value = c; o.textContent = c + " - " + CUR[c]; s.appendChild(o); }); });
  $("from").value = "USD"; $("to").value = "PKR";

  function calc() {
    if (!rates) return;
    var a = +$("amt").value, f = rates[$("from").value], t = rates[$("to").value];
    if (!f || !t) { $("res").textContent = "-"; return; }
    var r = t / f, v = a * r;
    $("res").textContent = v.toLocaleString("en-US", { maximumFractionDigits: v < 1 ? 6 : 2 }) + " " + $("to").value;
    $("rate").textContent = "1 " + $("from").value + " = " + r.toLocaleString("en-US", { maximumFractionDigits: 6 }) + " " + $("to").value;
  }
  function note(old) { $("upd").textContent = (old ? ToolsHub.t("Offline - showing saved rates. ", "آف لائن - محفوظ شدہ ریٹس دکھائے جا رہے ہیں۔ ") : "") + (stamp ? ToolsHub.t("Rates updated: ", "ریٹس کی تازہ کاری: ") + stamp : ""); }
  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  async function init() {
    var c = read();
    if (c && Date.now() - c.at < 6 * 3600 * 1000) { rates = c.rates; stamp = c.stamp; note(false); calc(); return; }
    try {
      var r = await fetch("https://open.er-api.com/v6/latest/USD"), j = await r.json();
      if (j.result !== "success") throw new Error("bad");
      rates = j.rates; stamp = (j.time_last_update_utc || "").replace(/ \+0000$/, " UTC"); save({ at: Date.now(), rates: rates, stamp: stamp }); note(false); calc();
    } catch (e) {
      if (c) { rates = c.rates; stamp = c.stamp; note(true); calc(); }
      else { $("status").className = "status err"; $("status").textContent = ToolsHub.t("Could not load exchange rates. Check your internet and refresh.", "ایکسچینج ریٹس لوڈ نہیں ہوئے۔ انٹرنیٹ چیک کریں اور ریفریش کریں۔"); }
    }
  }
  ["amt", "from", "to"].forEach(function (id) { $(id).addEventListener("input", calc); });
  $("swap").addEventListener("click", function () { var f = $("from").value; $("from").value = $("to").value; $("to").value = f; calc(); });
  document.addEventListener("langchange", function () { note(false); });
  init();
})();
