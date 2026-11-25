# NETZKLAR – Prototyp (Arbeitstitel)

Lern- und Materialplattform zu Hass und Hetze im Netz für Lehrkräfte, Schüler:innen, Eltern und Fachkräfte aus Sozialarbeit und Psychologie.
Konzept und Bauplan: [konzept.md](konzept.md) · Briefing: [briefing.md](briefing.md)

## Ansehen
- **Per Doppelklick:** `index.html` öffnen. Es braucht keinen Server.
- **Mit lokalem Server** (empfohlen, damit „Link kopieren“ zuverlässig funktioniert):
  `python3 -m http.server 8765` im Ordner `Website 1` starten, dann `http://localhost:8765` öffnen.

## Inhalte ändern
| Was | Wo |
|---|---|
| Einheiten, Material, externe Angebote, Spiele | `inhalte/daten.json` |
| Hintergrund, Tipps, Material-Inhalte und Weiterlesen-Links je Einheit | `inhalte/inhalte-einheiten.json` (Schlüssel = Einheiten-ID; `stufe` = für welche Altersstufe) |
| Rollenspiele (Szenen, Entscheidungen, Enden, Hilfelinks) | `inhalte/rollenspiele.json` |
| Angebote auf der Seite „Weiterbilden“ | `inhalte/quellen.json` |
| Rohdaten der Quellenrecherche (geprüfte Adressen, Tipps, Hilfenummern, Problemfälle) | `inhalte/recherche/recherche-a.json`, `recherche-b.json` |
| Texte der Seiten (Startseite, Wissen, Beratung …) | `vorlagen/seiten/*.html` |
| Kopf, Navigation, Fuß, Einheiten-Vorlage | `werkzeuge/bauen.py` |
| Farben, Schrift, Abstände (Design Tokens) | `assets/styles.css`, Abschnitt 1 – 8-px-Raster (`--r1` = 8 px … `--r12` = 96 px) und feste Typo-Skala (`--t-s` … `--t-5xl`) |
| Raster prüfen | eine Seite mit `?raster` öffnen, z. B. `index.html?raster` – zeigt 8-px-Linien |
| Verhalten (Konfigurator, Zeitleiste, Spiele) | `assets/app.js` |
| Hinweis unter einer Auswahl im Satz (z. B. „Die Reihe beginnt mit Stunde 2“) | Attribut `data-hinweis` an der `<option>` in `vorlagen/seiten/*.html` |
| Zeichenfeld auf der Startseite | `zeichenfeld()` in `werkzeuge/bauen.py` |

Danach im Ordner `Website 1` ausführen:

```
python3 werkzeuge/bauen.py
```

Das Skript erzeugt alle `*.html` in `Website 1` und `assets/data.js` neu.
**Diese erzeugten Dateien nicht direkt bearbeiten**, sonst gehen die Änderungen beim nächsten Lauf verloren.

## Zusatzmaterial aus der Recherche
37 Einheiten mit der ID `r-…` stammen aus der gemeinsamen Recherche (`../Recherche-2026-11/`). Sie haben `"nr": 0`, die Reihe „Zusatzmaterial · Thema“ und `"herkunft": "recherche-2026-11"` und stehen in den Übersichten hinter den nummerierten Reihen. Bitte nicht hier von Hand ändern, sondern in den Recherche-Dateien, und dann `einbau.py` ausführen (siehe LIESMICH im Hauptordner).

## Offene Stellen finden
Alle Demo-Texte und Platzhalter sind markiert:
- `TEXT PRÜFEN`: Inhalte, die fachlich oder rechtlich geprüft werden müssen
- `NAME PRÜFEN`: Arbeitstitel „NETZKLAR“
- `DATEI:`: Material-Downloads, die noch fehlen
- `BILD:`: Open-Graph-Bild
- `[eckige Klammern]`: auszufüllende Angaben in Impressum, Datenschutz und Barrierefreiheit
- Externe Links: Stand der Recherche November 2026 – vor Veröffentlichung und danach regelmäßig erneut prüfen

## Veröffentlichen

### GitHub Pages (für Nutzertests)
Die Seite ist fertig gebaut und läuft auf jedem Rechner und in jedem Unterordner. Alle Links sind relativ, alle Daten stecken in `assets/data.js`, es gibt keine externen Skripte oder Schriften. `.nojekyll` und `404.html` sind vorhanden.

1. Auf github.com ein **neues, öffentliches** Repository anlegen, z. B. `netzklar`, ohne README.
2. Den **Inhalt dieses Ordners** hochladen, also `index.html` direkt in der obersten Ebene. Die Weboberfläche nimmt nur 100 Dateien auf einmal, darum **GitHub Desktop** („Add existing repository“ → diesen Ordner → Publish) oder im Terminal:
   ```
   cd "…/Website 1"
   git init -b main
   git add .
   git commit -m "NETZKLAR für Nutzertests"
   git remote add origin https://github.com/NAME/netzklar.git
   git push -u origin main
   ```
3. Im Repository: **Settings → Pages → Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)`** → Save.
4. Nach ein bis zwei Minuten läuft die Seite unter `https://NAME.github.io/netzklar/`.

**Testbetrieb:** `TESTBETRIEB = True` in `werkzeuge/bauen.py` hält die Seite aus Suchmaschinen heraus (noindex). Für den echten Start auf `False` setzen und neu bauen.

Mit hochgeladen, aber nicht verlinkt: `inhalte/`, `vorlagen/`, `werkzeuge/`, `briefing.md`, `konzept.md`, `LIESMICH.md`. Das ist unschädlich, im öffentlichen Repository aber lesbar.

### Andere Anbieter
Netlify, Uberspace oder ein eigener Webspace: den Ordner hochladen und `404.html` als Fehlerseite einstellen.
