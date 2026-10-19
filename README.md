# aiwithalina.com – Website

Statische Website, keine Build-Schritte.

| Datei | Inhalt |
|---|---|
| `index.html` | Hauptseite (Start, KI-Automatisierung, Repertoire, Angebote, Potenzial-Check, Erstgespräch) |
| `lead-revenue-system.html` | Landingpage Hauptangebot |
| `leadblitz-60.html` | Landingpage KI-Rückruf in 60 Sekunden |
| `anrufwaechter.html` | Landingpage KI-Telefonassistent |
| `reaktivierung.html` | Landingpage ReaktivierungsBlitz |
| `followup.html` | Landingpage FollowUpHero |
| `befund-brief.html` | Landingpage Befund-Brief (Warteliste) |
| `ALINA-NATH_Inspiration-Multipage_v3_2026-10-16.html` | Ursprüngliche Gestaltungsstudie |

## Einstellungen
- `assets/site.js` ganz oben (`AWA_CONFIG`): `GA_ID` (GA4, Format `G-…`), `ADS_ID` und `ADS_CONVERSION` (Google Ads), `CONVERSION_ON` (`click` oder `booking`), `CAL_LINK`.
- In jeder Landingpage oben im `<script>`: `WEBHOOK_URL` (n8n) für den Eignungscheck.
- Rechtstexte: in `impressum.html`, `datenschutz.html`, `agb.html` den Bereich zwischen `eRecht24-START` und `eRecht24-ENDE` durch den HTML-Text aus eRecht24 ersetzen.

## Datenschutz-Technik
- Google Analytics und Google Ads laden erst nach Zustimmung im Cookie-Banner (Consent Mode v2).
- Schriften, GSAP und Lenis liegen lokal in `assets/` – keine Verbindung zu Google Fonts oder CDNs.
- Der Cal.com-Kalender ist direkt eingebettet und gehört in die Datenschutzerklärung.

## Gemessene Ereignisse
GA4: `page_view`, `cta_click`, `booking_click`, `generate_lead`, `join_waitlist`, `booking_complete`.
Google Ads: `conversion` (AW-18114466869/1fF4CN_c7accELWo071D) beim Klick auf Termin-Buttons.
