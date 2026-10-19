/* aiwithalina – gemeinsames Skript für alle Seiten
   Einwilligung (Cookie-Banner), Google Analytics 4, Cal.com-Buchung, kleine Interaktionen.

   ── HIER ANPASSEN ──
   GA_ID:    Ihre GA4-Mess-ID (Format G-XXXXXXXXXX). Solange der Platzhalter drinsteht, wird nichts geladen.
   CAL_LINK: Cal.com-Termin (Nutzer/Event). */
(function(){
"use strict";
var GA_ID = "G-XXXXXXXXXX";
var CAL_LINK = "alina-nath/discovery-call";
var CAL_URL = "https://cal.com/" + CAL_LINK;
var KEY = "awa-consent-v1";

var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var FINE = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
var IS_SPA = !!document.querySelector("[data-page]");

/* ── Einwilligung ── */
var consent = null;
try { consent = JSON.parse(localStorage.getItem(KEY) || "null"); } catch(e) {}
function saveConsent(c){
  consent = { stats: !!c.stats, external: !!c.external, ts: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(consent)); } catch(e) {}
  apply();
}
function apply(){
  if (consent && consent.stats) loadGA();
  if (consent && consent.external) mountWaiting();
}

/* ── Google Analytics 4 (lädt erst nach Zustimmung) ── */
var gaLoaded = false;
function gaReady(){ return GA_ID && !/X{6}/.test(GA_ID); }
function loadGA(){
  if (gaLoaded || !gaReady()) return;
  gaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
  var s = document.createElement("script");
  s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  pageview();
}
function pageName(){ return location.pathname + (IS_SPA ? (location.hash || "#start") : ""); }
function pageview(){
  if (!gaLoaded) return;
  window.gtag("event", "page_view", { page_location: location.href, page_path: pageName(), page_title: document.title });
}
function track(name, params){
  if (!gaLoaded) return;
  params = params || {}; params.page_path = pageName();
  window.gtag("event", name, params);
}
if (IS_SPA) window.addEventListener("hashchange", function(){ setTimeout(pageview, 50); });

/* Klicks auf Handlungsaufforderungen automatisch zählen */
document.addEventListener("click", function(ev){
  var a = ev.target.closest && ev.target.closest("a, button");
  if (!a) return;
  var href = a.getAttribute("href") || "";
  var isCta = a.classList.contains("btn-primary") || /erstgespraech|#check|cal\.com|potenzial-check/.test(href) || a.hasAttribute("data-track");
  if (!isCta) return;
  track(/cal\.com/.test(href) ? "booking_link_click" : "cta_click", {
    cta_text: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
    cta_target: href || a.getAttribute("data-track") || ""
  });
}, true);

/* ── Banner ── */
var banner;
function buildBanner(){
  if (banner) return banner;
  banner = document.createElement("div");
  banner.className = "cc"; banner.setAttribute("role", "dialog"); banner.setAttribute("aria-label", "Cookie-Einstellungen");
  banner.innerHTML =
    '<div class="cc-in">' +
      '<p class="cc-t">Darf ich Statistik und den Terminkalender laden?</p>' +
      '<p class="cc-d">Mit Ihrer Zustimmung nutze ich Google Analytics, um zu sehen, welche Seiten hilfreich sind, und lade den Buchungskalender von Cal.com. Beides können Sie jederzeit im Footer unter „Cookie-Einstellungen“ ändern. Mehr in der <a href="https://aiwithalina.com/datenschutz" target="_blank" rel="noopener">Datenschutzerklärung</a>.</p>' +
      '<div class="cc-opts" hidden>' +
        '<label class="cc-o"><input type="checkbox" checked disabled><span><b>Notwendig</b>Speichert nur Ihre Auswahl.</span></label>' +
        '<label class="cc-o" for="cc-stats"><input type="checkbox" id="cc-stats"><span><b>Statistik</b>Google Analytics 4, anonyme Nutzungsauswertung.</span></label>' +
        '<label class="cc-o" for="cc-ext"><input type="checkbox" id="cc-ext"><span><b>Terminkalender</b>Cal.com, lädt den Buchungskalender direkt auf der Seite.</span></label>' +
      '</div>' +
      '<div class="cc-b">' +
        '<button type="button" class="cc-btn cc-ghost" data-cc="min">Nur notwendige</button>' +
        '<button type="button" class="cc-btn cc-ghost" data-cc="more">Auswählen</button>' +
        '<button type="button" class="cc-btn cc-pri" data-cc="all">Alle akzeptieren</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(banner);
  banner.addEventListener("click", function(ev){
    var b = ev.target.closest("[data-cc]"); if (!b) return;
    var k = b.getAttribute("data-cc");
    if (k === "all") { saveConsent({ stats: true, external: true }); closeBanner(); }
    else if (k === "min") { saveConsent({ stats: false, external: false }); closeBanner(); }
    else if (k === "more") {
      var o = banner.querySelector(".cc-opts");
      if (o.hidden) { o.hidden = false; b.textContent = "Auswahl speichern"; }
      else { saveConsent({ stats: banner.querySelector("#cc-stats").checked, external: banner.querySelector("#cc-ext").checked }); closeBanner(); }
    }
  });
  return banner;
}
function openBanner(){
  var b = buildBanner();
  b.querySelector("#cc-stats").checked = !!(consent && consent.stats);
  b.querySelector("#cc-ext").checked = !!(consent && consent.external);
  b.hidden = false;
  requestAnimationFrame(function(){ b.classList.add("show"); });
}
function closeBanner(){ if (banner){ banner.classList.remove("show"); setTimeout(function(){ banner.hidden = true; }, 350); } }
document.addEventListener("click", function(ev){
  var t = ev.target.closest && ev.target.closest("[data-consent-open]");
  if (t) { ev.preventDefault(); openBanner(); }
});

/* ── Cal.com ── */
function calUrl(prefill){
  var q = [];
  prefill = prefill || {};
  ["name", "email", "notes"].forEach(function(k){ if (prefill[k]) q.push(k + "=" + encodeURIComponent(prefill[k])); });
  return CAL_URL + (q.length ? "?" + q.join("&") : "");
}
var calBooted = false;
function bootCal(){
  if (calBooted) return; calBooted = true;
  (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
}
var lastBooking = 0;
function onBooked(){
  var now = Date.now(); if (now - lastBooking < 5000) return; lastBooking = now;
  track("booking_complete", { method: "cal.com" });
}
var waiting = [];
function renderGate(el, prefill){
  el.innerHTML =
    '<div class="cal-gate">' +
      '<p class="cal-gate-t">Termin direkt hier auswählen</p>' +
      '<p class="cal-gate-d">Der Kalender wird von Cal.com geladen. Dabei werden Daten an Cal.com übertragen.</p>' +
      '<div class="cal-gate-b"><button type="button" class="cc-btn cc-pri" data-cal-allow>Kalender laden</button>' +
      '<a class="cal-gate-l" href="' + calUrl(prefill) + '" target="_blank" rel="noopener">Oder auf cal.com öffnen ↗</a></div>' +
    '</div>';
  el.querySelector("[data-cal-allow]").addEventListener("click", function(){
    saveConsent({ stats: !!(consent && consent.stats), external: true });
  });
}
var nsCount = 0;
function inline(el, prefill){
  if (el.getAttribute("data-cal-done")) return;
  el.setAttribute("data-cal-done", "1");
  bootCal();
  var ns = "awa" + (++nsCount);
  el.innerHTML = '<div class="cal-loading">Kalender wird geladen …</div>';
  var target = document.createElement("div"); target.className = "cal-target"; el.appendChild(target);
  var cfg = { layout: "month_view", theme: "dark" };
  prefill = prefill || {};
  if (prefill.name) cfg.name = prefill.name;
  if (prefill.email) cfg.email = prefill.email;
  if (prefill.notes) cfg.notes = prefill.notes;
  window.Cal("init", ns, { origin: "https://cal.com" });
  window.Cal.ns[ns]("inline", { elementOrSelector: target, calLink: CAL_LINK, config: cfg });
  window.Cal.ns[ns]("ui", { theme: "dark", cssVarsPerTheme: { dark: { "cal-brand": "#22D3EE" } }, hideEventTypeDetails: false, layout: "month_view" });
  window.Cal.ns[ns]("on", { action: "linkReady", callback: function(){ var l = el.querySelector(".cal-loading"); if (l) l.remove(); } });
  window.Cal.ns[ns]("on", { action: "bookingSuccessful", callback: onBooked });
  window.Cal.ns[ns]("on", { action: "bookingSuccessfulV2", callback: onBooked });
  setTimeout(function(){ var l = el.querySelector(".cal-loading"); if (l) l.innerHTML = 'Lädt der Kalender nicht? <a href="' + calUrl(prefill) + '" target="_blank" rel="noopener">Auf cal.com buchen ↗</a>'; }, 9000);
}
function mountCal(el, prefill){
  if (!el) return;
  if (consent && consent.external) inline(el, prefill);
  else { renderGate(el, prefill); waiting.push([el, prefill]); }
}
function mountWaiting(){
  var w = waiting; waiting = [];
  w.forEach(function(x){ inline(x[0], x[1]); });
}
/* Kalender automatisch laden, sobald der Bereich in die Nähe kommt */
function scanCal(){
  var els = [].slice.call(document.querySelectorAll("[data-cal-embed]:not([data-cal-manual])"));
  if (!("IntersectionObserver" in window)) { els.forEach(function(el){ mountCal(el); }); return; }
  var io = new IntersectionObserver(function(en){
    en.forEach(function(x){ if (x.isIntersecting){ io.unobserve(x.target); mountCal(x.target); } });
  }, { rootMargin: "600px 0px" });
  els.forEach(function(el){ io.observe(el); });
}

/* ── Interaktionen: magnetische Buttons ── */
function magnetic(){
  if (RM || !FINE) return;
  document.addEventListener("pointermove", function(ev){
    var b = ev.target.closest && ev.target.closest(".btn-primary");
    document.querySelectorAll(".btn-primary.mag").forEach(function(x){ if (x !== b){ x.classList.remove("mag"); x.style.transform = ""; } });
    if (!b) return;
    var r = b.getBoundingClientRect();
    var dx = (ev.clientX - (r.left + r.width / 2)) / r.width, dy = (ev.clientY - (r.top + r.height / 2)) / r.height;
    b.classList.add("mag");
    b.style.transform = "translate(" + (dx * 10).toFixed(1) + "px," + (dy * 8 - 2).toFixed(1) + "px)";
  }, { passive: true });
}

/* Wörter für Überschriften-Animationen in Spans legen */
function splitWords(el){
  if (!el) return [];
  if (el.getAttribute("data-split")) return [].slice.call(el.querySelectorAll(".w > span"));
  el.setAttribute("data-split", "1");
  var out = [];
  function wrap(node){
    var w = document.createElement("span"); w.className = "w";
    var i = document.createElement("span"); w.appendChild(i);
    out.push(i); return [w, i];
  }
  [].slice.call(el.childNodes).forEach(function(n){
    if (n.nodeType === 3) {
      var parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
      parts.forEach(function(p){
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var wi = wrap(); wi[1].textContent = p; frag.appendChild(wi[0]);
      });
      n.parentNode.replaceChild(frag, n);
    } else if (n.nodeType === 1 && n.tagName !== "BR") {
      if (n.classList.contains("l") || n.classList.contains("tail")) return;
      var wi = wrap(); n.parentNode.replaceChild(wi[0], n); wi[1].appendChild(n);
    }
  });
  out.forEach(function(s, k){ s.style.setProperty("--i", k); });
  return out;
}

function start(){
  if (consent) apply(); else setTimeout(openBanner, 900);
  scanCal();
  magnetic();
}
window.AWA = { track: track, pageview: pageview, mountCal: mountCal, calUrl: calUrl, splitWords: splitWords, openConsent: openBanner };
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
