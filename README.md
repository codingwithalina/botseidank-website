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
- `assets/site.js` oben: `GA_ID` (Google Analytics 4, Format `G-…`) und `CAL_LINK` (Cal.com, aktuell `alina-nath/discovery-call`).
- In jeder Landingpage oben im `<script>`: `WEBHOOK_URL` (n8n) für den Eignungscheck.
- Google Analytics und der Cal.com-Kalender laden erst nach Zustimmung im Cookie-Banner. Beide gehören in die Datenschutzerklärung.

## Gemessene Ereignisse (GA4)
`page_view` (auch Unterseiten der Hauptseite), `cta_click`, `booking_link_click`, `generate_lead`, `join_waitlist`, `booking_complete`.
