# botseidank.com – Website

Statische Website, keine Build-Schritte.

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite im Aurora-Look (Palette „Violett bis Mint“): Selbsttest, Beispielwoche, Rechner, Bereiche „Heute/Danach“, Angebot in drei Stufen (`#angebot`), Über mich (`#ueber-mich`), Terminbuchung (`#erstgespraech`). Alte Adressen leiten weiter: Use-Case-Adressen nach `use-cases.html`, der Rest auf die passenden Abschnitte. |
| `use-cases.html` | Frühere `index.html`. Zeigt nur noch die Use Cases (`#use-cases`, `#r-<slug>`-Detailseiten, `#speed-to-lead`) im bisherigen Look. `#start`, `#angebot`, `#erstgespraech` und `#ueber-mich` leiten auf `index.html` um. |
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

## Startseite
- Angebotsleiter: „Ein Zeitfresser weniger“ (Umsetzung), „Der größte Zeitfresser, gefunden und abgeschafft“ (8-Wochen-Programm), „Dein Vertrieb läuft von allein“ (Lead Revenue System).
- Porträt: `assets/alina-frei.webp` (freigestellt) und `assets/alina-kontur.webp` (Maske für die Kontur, Farbe kommt aus dem CSS). `assets/alina.webp` ist das Original für das kleine Bild bei der Terminbuchung.
- Die Beispielwoche ist ausgedacht und als Beispiel gekennzeichnet. Der Rechner rechnet nur mit den Eingaben des Besuchers.
- Kalender-Look: Die Startseite setzt `window.AWA_CAL_UI` (helles Design), `assets/site.js` liest das. Ohne diese Angabe bleibt der Kalender dunkel wie auf den übrigen Seiten.

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
