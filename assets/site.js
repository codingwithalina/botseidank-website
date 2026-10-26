/* botseidank.com – gemeinsames Skript für alle Seiten
   Google Analytics 4, Google-Ads-Conversion (beides erst nach Einwilligung über das CCM19-Cookie-Banner), Cal.com-Buchung, kleine Interaktionen.
   Das CCM19-Skript steht im <head> jeder Seite; hier wird nur ausgewertet, welche Einbindungen der Besucher erlaubt hat.

   ── HIER ANPASSEN ── */
var AWA_CONFIG = {
  GA_ID: "G-2EH60LY91J",                                   // GA4-Mess-ID (Property „botseidank.com“); Platzhalter G-XXXXXXXXXX = GA4 wird nicht geladen
  ADS_ID: "AW-18114466869",                                // Google-Ads-Konto
  ADS_CONVERSION: "AW-18114466869/1fF4CN_c7accELWo071D",   // Conversion-Aktion „Termin“
  CONVERSION_ON: "click",                                  // "click" = Klick auf Termin-Buttons (wie bisher), "booking" = erst bei abgeschlossener Buchung
  CAL_LINK: "alina-nath/discovery-call"
};
(function(){
"use strict";
var C = AWA_CONFIG;
var CAL_URL = "https://cal.com/" + C.CAL_LINK;
var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var FINE = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
var IS_SPA = !!document.querySelector("[data-page]");

/* ── Einwilligung: kommt aus CCM19 ──
   CCM19 meldet erlaubte Einbindungen über window.CCM.acceptedEmbeddings und das Ereignis ccm19EmbeddingAccepted.
   Zuordnung über den Namen der Einbindung im CCM19-Backend: „…Analytics…“ = Statistik, „…Google Ads…“ = Werbemessung. */
var consent = null;
function ccmState(){
  var ccm = window.CCM;
  if (!ccm || !ccm.consent) return null;                     // noch keine Entscheidung getroffen
  var list = Array.isArray(ccm.acceptedEmbeddings) ? ccm.acceptedEmbeddings : [];
  var names = list.map(function(e){ return String((e && (e._name || e.name)) || ""); });
  return {
    stats: names.some(function(n){ return /analytics/i.test(n); }),
    ads: names.some(function(n){ return /google ads|adwords|conversion/i.test(n); })
  };
}
var lastSig = "";
function syncConsent(){
  var s = ccmState(); if (!s) return;
  var sig = (s.stats ? "1" : "0") + (s.ads ? "1" : "0");
  if (sig === lastSig) return;
  lastSig = sig; consent = s; applyConsent();
}
["ccm19WidgetLoaded", "ccm19EmbeddingAccepted", "ccm19WidgetClosed"].forEach(function(ev){
  window.addEventListener(ev, function(){ setTimeout(syncConsent, 0); });
});

/* ── Google-Tag (GA4 + Ads), lädt erst nach Zustimmung ── */
var tagLoaded = false;
function realId(id){ return id && !/X{6}/.test(id); }
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
function applyConsent(){
  if (!consent) return;
  window.gtag("consent", "update", {
    analytics_storage: consent.stats ? "granted" : "denied",
    ad_storage: consent.ads ? "granted" : "denied",
    ad_user_data: consent.ads ? "granted" : "denied",
    ad_personalization: "denied"
  });
  var useGA = consent.stats && realId(C.GA_ID), useAds = consent.ads && realId(C.ADS_ID);
  if (!useGA && !useAds) return;
  if (!tagLoaded) {
    tagLoaded = true;
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + (useGA ? C.GA_ID : C.ADS_ID);
    document.head.appendChild(s);
    window.gtag("js", new Date());
  }
  if (useGA) window.gtag("config", C.GA_ID, { send_page_view: false });
  if (useAds) window.gtag("config", C.ADS_ID);
  pageview();
}
function pageName(){ return location.pathname + (IS_SPA ? (location.hash || "#start") : ""); }
function gaOn(){ return tagLoaded && consent && consent.stats && realId(C.GA_ID); }
function pageview(){
  if (!gaOn()) return;
  window.gtag("event", "page_view", { send_to: C.GA_ID, page_location: location.href, page_path: pageName(), page_title: document.title });
}
function track(name, params){
  if (!gaOn()) return;
  params = params || {}; params.page_path = pageName(); params.send_to = C.GA_ID;
  window.gtag("event", name, params);
}
var lastConv = 0;
function conversion(){
  if (!tagLoaded || !(consent && consent.ads) || !realId(C.ADS_CONVERSION)) return;
  var now = Date.now(); if (now - lastConv < 3000) return; lastConv = now;
  window.gtag("event", "conversion", { send_to: C.ADS_CONVERSION, value: 1.0, currency: "EUR" });
}
if (IS_SPA) window.addEventListener("hashchange", function(){ setTimeout(pageview, 50); });

/* Klicks auf Termin- und Check-Buttons zählen */
document.addEventListener("click", function(ev){
  var a = ev.target.closest && ev.target.closest("a, button");
  if (!a) return;
  var href = a.getAttribute("href") || "";
  var booking = /erstgespraech|cal\.com/.test(href);
  var isCta = booking || a.classList.contains("btn-primary") || /#check|potenzial-check/.test(href) || a.hasAttribute("data-track");
  if (!isCta) return;
  track(booking ? "booking_click" : "cta_click", {
    cta_text: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
    cta_target: href || a.getAttribute("data-track") || ""
  });
  if (booking && C.CONVERSION_ON === "click") conversion();
}, true);

/* „Cookie-Einstellungen“ im Footer und in der Datenschutzerklärung öffnen das CCM19-Banner erneut */
function openBanner(){
  if (window.CCM && typeof window.CCM.openWidget === "function") window.CCM.openWidget();
}
document.addEventListener("click", function(ev){
  var t = ev.target.closest && ev.target.closest("[data-consent-open]");
  if (t) { ev.preventDefault(); openBanner(); }
});

/* ── Cal.com (Code nach Vorlage aus dem Cal.com-Dashboard) ── */
function calUrl(prefill){
  var q = []; prefill = prefill || {};
  ["name", "email", "notes"].forEach(function(k){ if (prefill[k]) q.push(k + "=" + encodeURIComponent(prefill[k])); });
  return CAL_URL + (q.length ? "?" + q.join("&") : "");
}
function bootCal(){
  if (window.Cal && window.Cal.loaded) return;
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
}
var lastBooking = 0;
function onBooked(){
  var now = Date.now(); if (now - lastBooking < 5000) return; lastBooking = now;
  track("booking_complete", { method: "cal.com" });
  if (C.CONVERSION_ON === "booking") conversion();
}
var calCount = 0;
function mountCal(el, prefill){
  if (!el || el.getAttribute("data-cal-done")) return;
  el.setAttribute("data-cal-done", "1");
  bootCal();
  calCount++;
  var ns = calCount === 1 ? "discovery-call" : "discovery-call-" + calCount;
  var id = "my-cal-inline-" + ns;
  el.innerHTML = '<div class="cal-loading">Kalender wird geladen …</div><div class="cal-target" id="' + id + '"></div>';
  var target = el.querySelector(".cal-target"), loading = el.querySelector(".cal-loading");
  var cfg = { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "dark" };
  prefill = prefill || {};
  if (prefill.name) cfg.name = prefill.name;
  if (prefill.email) cfg.email = prefill.email;
  if (prefill.notes) cfg.notes = prefill.notes;
  window.Cal("init", ns, { origin: "https://app.cal.com" });
  window.Cal.config = window.Cal.config || {};
  window.Cal.config.forwardQueryParams = true;
  window.Cal.ns[ns]("inline", { elementOrSelector: "#" + id, config: cfg, calLink: C.CAL_LINK });
  window.Cal.ns[ns]("ui", {
    theme: "dark", hideEventTypeDetails: true, layout: "month_view",
    cssVarsPerTheme: { dark: {
      "cal-brand": "#22D3EE", "cal-brand-emphasis": "#67E8F9", "cal-brand-text": "#04101C",
      "cal-bg": "#0C1626", "cal-bg-muted": "#0A1424", "cal-bg-subtle": "#101D31", "cal-bg-emphasis": "#16263D",
      "cal-border": "#1E2C40", "cal-border-subtle": "#18253A", "cal-border-booker": "#0C1626",
      "cal-text": "#E8EEF6", "cal-text-emphasis": "#FFFFFF", "cal-text-subtle": "#8D9AAD", "cal-text-muted": "#8D9AAD"
    } }
  });
  window.Cal.ns[ns]("on", { action: "bookingSuccessful", callback: onBooked });
  window.Cal.ns[ns]("on", { action: "bookingSuccessfulV2", callback: onBooked });
  /* Ladehinweis verschwindet, sobald der Kalender da ist; sonst Ausweichlink */
  var done = false;
  function ready(){ if (done) return; done = true; if (loading) loading.remove(); el.classList.add("cal-ready"); }
  window.Cal.ns[ns]("on", { action: "linkReady", callback: ready });
  var mo = new MutationObserver(function(){ var f = target.querySelector("iframe"); if (f) { f.addEventListener("load", function(){ setTimeout(ready, 400); }); mo.disconnect(); } });
  mo.observe(target, { childList: true, subtree: true });
  setTimeout(function(){
    if (done || !loading) return;
    loading.innerHTML = '<span>Der Kalender lädt gerade nicht.</span><a class="btn btn-primary" href="' + calUrl(prefill) + '" target="_blank" rel="noopener">Termin auf cal.com wählen ↗</a>';
    loading.classList.add("fail");
  }, 12000);
}
function scanCal(){
  var els = [].slice.call(document.querySelectorAll("[data-cal-embed]:not([data-cal-manual])"));
  if (!("IntersectionObserver" in window)) { els.forEach(function(el){ mountCal(el); }); return; }
  var io = new IntersectionObserver(function(en){
    en.forEach(function(x){ if (x.isIntersecting){ io.unobserve(x.target); mountCal(x.target); } });
  }, { rootMargin: "800px 0px" });
  els.forEach(function(el){ io.observe(el); });
}

/* ── Magnetische Buttons ── */
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
  function wrap(){ var w = document.createElement("span"); w.className = "w"; var i = document.createElement("span"); w.appendChild(i); out.push(i); return [w, i]; }
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
  syncConsent();                                             // falls CCM19 schon fertig war, bevor dieses Skript lief
  scanCal();
  magnetic();
}
window.AWA = { track: track, pageview: pageview, conversion: conversion, mountCal: mountCal, calUrl: calUrl, splitWords: splitWords, openConsent: openBanner };
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
