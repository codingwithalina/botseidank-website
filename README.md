# botseidank.com – Website

Statische Website, keine Build-Schritte.

| Datei | Inhalt |
|---|---|
| `index.html` | Hauptseite mit mehreren Unterseiten in einer Datei: `#start`, `#angebot`, `#use-cases` (mit `#r-<slug>`-Detailseiten und `#speed-to-lead`), `#erstgespraech`. Alte Adressen (`#angebote`, `#repertoire`, `#ki-automatisierung`, `#potenzial-check`) leiten weiter. |
| `ablauf-sprint.html` | 8-Wochen-Programm „Zeitfresser finden und abschaffen“ (6.000 €, zwei Raten nach Ergebnis) |
| `lead-revenue-system.html` | Paket aus drei Systemen (9.900 € + 1.790 €/Monat) |
| `leadblitz-60.html` | System: KI-Rückruf in 60 Sekunden (4.900 € + 790 €/Monat) |
| `anrufwaechter.html` | System: KI-Telefonassistent (3.900 € + 590 €/Monat) |
| `reaktivierung.html` | System: ReaktivierungsBlitz (2.900 € + optional 490 €/Monat) |
| `followup.html` | System: FollowUpHero (3.900 € + 690 €/Monat) |
| `befund-brief.html` | System: Befund-Brief, Warteliste (4.900 € + 990 €/Monat) |

## Angebotslogik
- **Schon eine Idee?** Umsetzung: Festpreis 2.900–4.900 € je nach Umfang, 7–14 Tage bis live. Alle Ideen und fertigen Systeme unter `#use-cases`.
- **Noch keine Idee?** 8-Wochen-Programm: 6.000 € in zwei Raten.
- **Danach:** Betreuung 490–990 €/Monat, monatlich kündbar.
- **Versprechen (überall gleich):** 0 € vorab, erste Hälfte bei Go-Live, zweite Hälfte nach bestandenem Test mit echten Fällen, bei verfehlter Kennzahl Nacharbeit ohne Mehrkosten.

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
