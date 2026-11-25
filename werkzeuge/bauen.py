#!/usr/bin/env python3
"""
NETZKLAR – Seitengenerator
==========================
Erzeugt alle HTML-Seiten im Projektordner aus
  - vorlagen/seiten/*.html   (Seiteninhalte)
  - inhalte/daten.json       (Einheiten, Material, externe Angebote, Spiele)

Aufruf (im Projektordner):   python3 werkzeuge/bauen.py

Die erzeugten Seiten brauchen danach keinen Build und keinen Server:
Sie laufen per Doppelklick und auf jedem Static Hosting.
Nur Python 3 (Standardbibliothek) wird benötigt.
"""
import html
import json
import math
import random
import re
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
DATEN = json.loads((WURZEL / "inhalte" / "daten.json").read_text("utf-8"))
ZG = DATEN["zielgruppen"]
EINHEITEN = DATEN["einheiten"]
EINHEIT_NACH_ID = {e["id"]: e for e in EINHEITEN}
SPIELE = DATEN["spiele"]


def _laden(name, leer):
    datei = WURZEL / "inhalte" / name
    return json.loads(datei.read_text("utf-8")) if datei.exists() else leer


INHALTE = _laden("inhalte-einheiten.json", {})      # Hintergrund, Tipps, Material, Weiterlesen je Einheit
GESCHICHTEN = _laden("rollenspiele.json", {"geschichten": []})["geschichten"]
QUELLEN = _laden("quellen.json", {"quellen": []})["quellen"]
QUELLE_NACH_ID = {q["id"]: q for q in QUELLEN}

MARKE = "NETZKLAR"  # NAME PRÜFEN: Arbeitstitel
# Testbetrieb (Nutzertests): Suchmaschinen sollen die Seite nicht aufnehmen. Für den echten Start auf False setzen.
TESTBETRIEB = True
REITER = ["lehrkraefte", "schueler", "eltern", "fachkraefte"]
NAV = [
    ("material", "material.html", "Material"),
    ("spiele", "spiele.html", "Spiele"),
    ("wissen", "wissen.html", "Wissen"),
    ("beratung", "beratung.html", "Beratung"),
    ("quellen", "quellen.html", "Weiterbilden"),
]
SPIEL_SEITE = {"moderation": "spiel-moderation.html", "einordnen": "spiel-einordnen.html", "faktencheck": "spiel-faktencheck.html"}
ROLLE_SCHEMA = {"lehrkraefte": "teacher", "eltern": "parent", "fachkraefte": "professional", "schueler": "student"}
RESSOURCEN_TYP = {
    "lehrkraefte": "Unterrichtseinheit", "eltern": "Gesprächsleitfaden",
    "fachkraefte": "Beratungsbaustein", "schueler": "Selbstlerneinheit",
}
SKALA_SCHRITT = {10: 5, 20: 5, 45: 15, 50: 10}

ICON_HILFE = ('<svg class="icon" aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" '
              'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
              '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5"/><path d="M12 17.5h.01"/></svg>')
ICON_HINWEIS = ('<svg class="icon" aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" '
                'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
                '<path d="M12 3 2 21h20L12 3z"/><path d="M12 10v5"/><path d="M12 18h.01"/></svg>')

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
           "%3Crect width='32' height='32' fill='%231E40AF'/%3E%3Cpath d='M7 8h18v13H14l-7 5z' fill='none' "
           "stroke='white' stroke-width='2.4' stroke-linejoin='round'/%3E%3Cpath d='m11.5 14.5 3 3 6-6' fill='none' "
           "stroke='%23EFF35F' stroke-width='2.4'/%3E%3C/svg%3E")

# Wortbildmarke (Platzhalter): Sprechblase mit Haken – „klare Kommunikation“  NAME PRÜFEN
LOGO = ('<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
        'stroke-linejoin="round"><path d="M3 4h18v12H10l-7 5V4z"/><path d="m8 10 2.6 2.6L16 7.4" stroke-linecap="square"/></svg>')

ICON_PFEIL = ('<svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" '
              'stroke="currentColor" stroke-width="1.6" stroke-linecap="square"><path d="M4 12h15M13 6l6 6-6 6"/></svg>')
ICONS_ZG = {
    "lehrkraefte": '<rect x="3" y="4" width="18" height="12"/><path d="M7 20h10M12 16v4M7 8h6M7 11h9"/>',
    "schueler": '<path d="M12 4 2 9l10 5 10-5-10-5z"/><path d="M6 11v5c0 1.4 2.7 3 6 3s6-1.6 6-3v-5M22 9v6"/>',
    "eltern": '<path d="M3 11 12 4l9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M12 17.5s-3-1.8-3-3.7a1.5 1.5 0 0 1 3-.6 1.5 1.5 0 0 1 3 .6c0 1.9-3 3.7-3 3.7z"/>',
    "fachkraefte": '<path d="M3 5h12v8H8l-5 4V5z"/><path d="M15 9h6v11l-4-3h-6v-4"/>',
}


def ikon(pfad_html, gross=24):
    return (f'<span class="ikon" aria-hidden="true"><svg focusable="false" width="{gross}" height="{gross}" viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">{pfad_html}</svg></span>')


def esc(text):
    return html.escape(str(text), quote=True)


def zg_label_liste(keys):
    return ", ".join(ZG[k]["label"] for k in keys)


# ---------------------------------------------------------------- Rahmen

def kopf_html(meta):
    titel = meta["title"]
    voll = titel if titel.startswith(MARKE) else f"{titel} · {MARKE}"
    ld = meta.get("ld")
    ld_html = (f'\n<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>' if ld else "")
    robots = '\n<meta name="robots" content="noindex">' if TESTBETRIEB or meta.get("noindex") else ""
    return f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(voll)}</title>
<meta name="description" content="{esc(meta['description'])}">{robots}
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B1A2E" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{MARKE}">
<meta property="og:locale" content="de_DE">
<meta property="og:title" content="{esc(voll)}">
<meta property="og:description" content="{esc(meta['description'])}">
<!-- BILD: og:image, 1200 × 630 px, Wortmarke auf neutralem Grund – nach dem Hosting mit absoluter URL ergänzen -->
<link rel="icon" href="{FAVICON}">
<link rel="stylesheet" href="assets/styles.css">
<script>document.documentElement.classList.add('js');try{{var t=localStorage.getItem('nk-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}}catch(e){{}}</script>{ld_html}
</head>"""


def header_html(meta):
    zg = meta.get("zielgruppe")
    modus = meta.get("zg_modus", "page")
    reiter = []
    for key in REITER:
        attr = ""
        if key == zg:
            attr = ' aria-current="page"' if modus == "page" else ' aria-current="true"'
        reiter.append(f'<li><a href="{ZG[key]["seite"]}" data-zg="{key}"{attr}>{esc(ZG[key]["label"])}</a></li>')
    return f"""<a class="skip" href="#inhalt">Zum Inhalt springen</a>
<header class="kopf">
  <a class="marke" href="index.html">{LOGO}<span>{MARKE}</span><!-- NAME PRÜFEN --></a>
  <div class="kopf__rechts">
    <a class="hilfe" href="beratung.html#sofort-hilfe">{ICON_HILFE}<span>Hilfe bei Hass im Netz</span></a>
    <nav class="reiter" aria-label="Zielgruppen">
      <ul>{''.join(reiter)}</ul>
    </nav>
    <button class="knopf knopf--zweit knopf--klein modus nur-js" type="button" data-modus><span aria-hidden="true">◐</span> <span class="vh">Modus: </span><span data-modus-wert>Automatisch</span></button>
  </div>
</header>"""


def seitenleiste_html(meta):
    aktiv = meta.get("nav")
    punkte = []
    for key, datei, label in NAV:
        cur = ' aria-current="page"' if key == aktiv else ""
        extra = " data-mit-zielgruppe" if key == "material" else ""
        punkte.append(f'<li><a href="{datei}"{cur}{extra}>{label}</a></li>')
    ext_cur = ' aria-current="page"' if aktiv == "externe" else ""
    return f"""<nav class="seitenleiste" aria-label="Inhalte">
    <ul>{''.join(punkte)}</ul>
    <p class="seitenleiste__titel" id="sl-schulen">Für Schulen</p>
    <ul aria-labelledby="sl-schulen"><li><a href="externe-angebote.html"{ext_cur}>Externe Angebote</a></li></ul>
  </nav>"""


def footer_html():
    return f"""<footer class="fuss">
  <p>{MARKE} – Material gegen Hass, Hetze und Fake News im Netz. Inhalte fachlich verantwortet von: [Name der Fachredaktion] <!-- TEXT PRÜFEN --></p>
  <ul>
    <li><a href="impressum.html">Impressum</a></li>
    <li><a href="datenschutz.html">Datenschutz</a></li>
    <li><a href="barrierefreiheit.html">Barrierefreiheit</a></li>
  </ul>
</footer>"""


def seite(meta, inhalt):
    return f"""{kopf_html(meta)}
<!-- Automatisch erzeugt von werkzeuge/bauen.py – Änderungen bitte in vorlagen/ oder inhalte/daten.json vornehmen. -->
<body>
{header_html(meta)}
<div class="rahmen">
  {seitenleiste_html(meta)}
  <main id="inhalt" tabindex="-1">
{inhalt}
  </main>
</div>
{footer_html()}
<script src="assets/data.js" defer></script>
<script src="assets/app.js" defer></script>
</body>
</html>
"""


# ---------------------------------------------------------------- Bausteine

def mini_leiste(einheit):
    spalten = " ".join(f'{b["min"]}fr' for b in einheit["bloecke"])
    segs = "".join(f'<span data-phase="{i + 1}"></span>' for i, _ in enumerate(einheit["bloecke"]))
    text = ", ".join(f'{b["phase"]} {b["min"]} Min.' for b in einheit["bloecke"])
    return (f'<span class="mini-leiste" style="grid-template-columns:{spalten}" aria-hidden="true">{segs}</span>'
            f'<span class="vh">Ablauf: {esc(text)}</span>')


def einheiten_sortiert(zg):
    return sorted((e for e in EINHEITEN if e["zielgruppe"] == zg), key=lambda e: (e["nr"] == 0 and e.get("herkunft") is not None, e["nr"]))


def alle_einheiten(zg):
    label = ZG[zg]["einheit"]
    zeilen = []
    for e in einheiten_sortiert(zg):
        nr = f'{label} {e["nr"]}' if e["nr"] else e["reihe"]
        zeilen.append(f"""<li class="zeile">
  <div class="zeile__haupt">
    <p class="zeile__vor">{esc(nr)} · {e["dauer"]} Min.</p>
    <h3 class="zeile__titel"><a href="einheit-{e["id"]}.html">{esc(e["titel"])}</a></h3>
    <p class="zeile__meta">{esc(e["kurz"])}</p>
    {mini_leiste(e)}
  </div>
  <span class="zeile__status" data-status-fuer="{e["id"]}"></span>
</li>""")
    return f'<ul class="zeilen">{"".join(zeilen)}</ul>'


def material_ziel(m):
    """Steht der Inhalt des Materials schon in der Einheit, wird dorthin verlinkt."""
    for i, x in enumerate(INHALTE.get(m["einheit"], {}).get("material", [])):
        if x["titel"].endswith(m["titel"]) or m["titel"] in x["titel"]:
            anker = x.get("anker") or f"m{i + 1}"
            return (f'<a class="knopf knopf--zweit knopf--klein" href="einheit-{m["einheit"]}.html#{anker}">Inhalt ansehen</a>'
                    f'<!-- DATEI: zusätzlich als {esc(m["format"])} zum Download hinterlegen -->')
    return (f'<!-- DATEI: {esc(m["titel"])} als {esc(m["format"])} hinterlegen und hier verlinken -->'
            '<span class="platzhalter-datei">Download folgt</span>')


def material_liste():
    zeilen = []
    for m in DATEN["material"]:
        e = EINHEIT_NACH_ID.get(m["einheit"])
        bezug = ""
        if e:
            nr = f'{ZG[e["zielgruppe"]]["einheit"]} {e["nr"]}: ' if e["nr"] else ""
            bezug = f'<p class="zeile__meta">Gehört zu: <a href="einheit-{e["id"]}.html">{esc(nr + e["titel"])}</a></p>'
        zeilen.append(f"""<li class="zeile" data-fuer="{' '.join(m['fuer'])}" data-typ="{esc(m['typ'])}" data-stufe="{' '.join(m['stufe'])}">
  <div class="zeile__haupt">
    <p class="zeile__vor"><span class="typ">{esc(m["typ"])}</span> · {esc(m["format"])}</p>
    <h3 class="zeile__titel">{esc(m["titel"])}</h3>
    <p class="zeile__meta">Für {esc(zg_label_liste(m["fuer"]))}</p>
    {bezug}
  </div>
  <span class="zeile__aktion">{material_ziel(m)}</span>
</li>""")
    return f'<ul class="zeilen" data-filter-liste>{"".join(zeilen)}</ul>'


def externe_liste():
    zeilen = []
    for x in DATEN["externe"]:
        zeilen.append(f"""<li class="zeile" data-fuer="{' '.join(x['fuer'])}" data-typ="{esc(x['typ'])}" data-format="{esc(x['format'])}">
  <div class="zeile__haupt">
    <p class="zeile__vor">{esc(x["format"])} · {esc(x["dauer"])} · {esc(x["region"])}</p>
    <h3 class="zeile__titel">{esc(x["titel"])}</h3>
    <p class="zeile__meta"><strong>{esc(x["anbieter"])}</strong> <!-- TEXT PRÜFEN: echten Anbieter eintragen --></p>
    <p>{esc(x["beschreibung"])}</p>
    <p class="zeile__meta">Für {esc(zg_label_liste(x["fuer"]))} · Kontakt: {esc(x["kontakt"])}</p>
  </div>
</li>""")
    return f'<ul class="zeilen" data-filter-liste>{"".join(zeilen)}</ul>'


def optionen(quelle, feld):
    werte = sorted({x[feld] for x in DATEN[quelle]})
    return "".join(f'<option value="{esc(w)}">{esc(w)}</option>' for w in werte)


def zeichenfeld(spalten=72, zeilen=26, saat=7):
    """Dekoratives Zeichenfeld: links Rauschen (#), nach rechts geordnete Ruhe – „vom Lärm zur Klarheit“."""
    rnd = random.Random(saat)
    reihen = []
    for y in range(zeilen):
        z = []
        for x in range(spalten):
            t = x / (spalten - 1)
            h = 1 - y / (zeilen - 1)
            kamm = (0.26 + 0.5 * (1 - t) ** 1.4
                    + (1 - t) * 0.12 * math.sin(x * 0.55 + 1.3)
                    + (1 - t) * 0.07 * math.sin(x * 1.7)
                    + 0.04 * math.sin(x * 0.2))
            r = rnd.random()
            chaos = max(0.0, 1 - t * 1.25) ** 1.1
            ordnung = "·" if (x % 2 == 0 and y % 2 == 0) else (":" if (x % 4 == 0 and y % 2 == 1) else " ")
            if h < kamm:
                tiefe = min(1, (kamm - h) * 2)
                if r < chaos * (0.45 + 0.5 * tiefe):
                    c = "#"
                elif r < chaos * 1.15:
                    c = ":"
                else:
                    c = ordnung if rnd.random() > chaos * .5 else " "
            else:
                nah = h - kamm
                if r < chaos * 0.25 * max(0, 1 - nah * 3.5):
                    c = "#" if r < chaos * 0.12 else ":"
                else:
                    c = " "
            z.append(c)
        reihen.append("".join(z).rstrip())
    return f'<div class="feld" aria-hidden="true"><pre data-zeichenfeld>{esc(chr(10).join(reihen))}</pre></div>'


TUER_TEXT = {
    "lehrkraefte": ("Für Lehrkräfte", "Unterrichtsstunden à 45 Minuten zu Hass im Netz und Fake News – von 1 bis 10 Stunden, mit Zeitplan und druckfertig."),
    "schueler": ("Für Schüler:innen", "Kurze Einheiten zum Selbstlernen und drei Spiele, in denen du ausprobierst, was gegen Hass und Fake News hilft."),
    "eltern": ("Für Eltern", "Gesprächsleitfäden für Zuhause – über Hass, Kettenbriefe und Gerüchte, vorbeugend oder nach einem Vorfall."),
    "fachkraefte": ("Für Sozialarbeit & Psychologie", "Beratungsbausteine für die Arbeit mit Betroffenen, Hassverbreitenden und jungen Menschen mit Verschwörungsglauben."),
}


def tueren():
    zeilen = []
    for key in REITER:
        info = ZG[key]
        es = einheiten_sortiert(key)
        n = len(es)
        dauer = es[0]["dauer"]
        wort = info["einheit"] if n == 1 else {"Stunde": "Stunden", "Gespräch": "Gespräche", "Baustein": "Bausteine", "Einheit": "Einheiten"}[info["einheit"]]
        titel, text = TUER_TEXT[key]
        zusatz = f" · {len(SPIELE)} Spiele" if key == "schueler" else ""
        zeilen.append(f"""<li class="tuer"><a href="{info["seite"]}" data-zg-link="{key}">
      <span class="tuer__titel">{esc(titel)}</span>
      <span class="tuer__text">{esc(text)}</span>
      <span class="tuer__meta">{n} {wort} · je {dauer} Min.{zusatz}</span>
      {ikon(ICONS_ZG[key])}
    </a></li>""")
    return f'<ol class="tueren__liste">{"".join(zeilen)}</ol>'


def zahlen():
    werte = [
        (len(EINHEITEN), "Einheiten mit Zeitplan"),
        (len(SPIELE), "Lernspiele"),
        (len(DATEN["material"]), "Materialien"),
        (0, "Anmeldungen nötig"),
    ]
    li = "".join(f'<li><span class="zahlen__wert">{w}</span><span class="zahlen__name">{esc(n)}</span></li>' for w, n in werte)
    return f'<ul class="zahlen__liste">{li}</ul>'


ROLLE_TEXT = {"betroffen": "Du bist betroffen", "zuschauer": "Du schaust zu"}


def rollenspiele_liste():
    zeilen = []
    for g in GESCHICHTEN:
        enden = sum(1 for s in g["szenen"].values() if s.get("ende"))
        zeilen.append(f"""<li class="zeile"><a class="zeile__link" href="rollenspiel-{g["id"]}.html">
    <span class="zeile__vor">Rollenspiel · {ROLLE_TEXT[g["rolle"]]} · {esc(g["alter"])} · etwa {g["dauer"]} Min. · {enden} mögliche Enden</span>
    <span class="zeile__titel">{esc(g["titel"])}</span>
    <span class="zeile__meta">{esc(g["kurz"])}</span>
  </a></li>""")
    return f'<ul class="zeilen zeilen--links">{"".join(zeilen)}</ul>'


def rollenspiel_seite(g):
    lernen = "".join(f"<li>{esc(x)}</li>" for x in g.get("lernpunkte", []))
    links = "".join(f"""<li class="zeile"><div class="zeile__haupt">
        <p class="zeile__vor">{esc(w.get("anbieter") or QUELLE_NACH_ID.get(w.get("quelle"), {}).get("name", ""))}</p>
        <h3 class="zeile__titel"><a href="{esc(w["url"])}" rel="noopener">{esc(w["titel"])}{EXTERN}</a></h3>
        <p class="zeile__meta">{esc(w.get("kurz", ""))}</p></div></li>""" for w in g.get("weiterlesen", []))
    inhalt = f"""<header class="bereich__kopf">
  <p class="einheit__pos">Rollenspiel · {ROLLE_TEXT[g["rolle"]]} · {esc(g["alter"])} · etwa {g["dauer"]} Minuten</p>
  <h1>{esc(g["titel"])}</h1>
  <p class="einleitung">{esc(g["kurz"])}</p>
</header>

<div class="hinweis" role="note" aria-label="Hinweis">
  {ICON_HINWEIS}
  <p><strong>Hinweis:</strong> Die Geschichte ist erfunden. Du entscheidest selbst, wie es weitergeht – es gibt kein Richtig oder Falsch beim Ausprobieren, nur Folgen. Wenn dich etwas daran an eigene Erlebnisse erinnert: <a href="beratung.html#sofort-hilfe">Hier findest du sofort Hilfe.</a></p>
</div>

<section class="geschichte" data-geschichte="{g["id"]}" aria-labelledby="gs-titel">
  <h2 id="gs-titel" class="vh">Rollenspiel</h2>
  <div data-geschichte-buehne>
    <button class="knopf knopf--gross nur-js" type="button" data-geschichte-start>Geschichte starten</button>
    <noscript><p>Für dieses Rollenspiel brauchst du JavaScript. Unten findest du, worauf es ankommt.</p></noscript>
  </div>
</section>

<section class="abschnitt" aria-labelledby="lernen-titel">
  <h2 id="lernen-titel">Worauf es ankommt</h2>
  <ul class="fakten">{lernen}</ul>
</section>

<section class="abschnitt" aria-labelledby="mehr-titel">
  <h2 id="mehr-titel">Mehr dazu</h2>
  <ul class="zeilen">{links}</ul>
</section>

<p><a href="spiele.html">Alle Spiele und Rollenspiele</a></p>
<!-- TEXT PRÜFEN: Geschichte, Enden und Hinweise fachlich prüfen lassen (inhalte/rollenspiele.json) -->"""
    meta = {
        "title": f'Rollenspiel: {g["titel"]}',
        "description": g["kurz"],
        "nav": "spiele",
    }
    return seite(meta, inhalt)


LAND = {"DE": "Deutschland", "AT": "Österreich", "CH": "Schweiz"}


def quellen_liste():
    zeilen = []
    for q in sorted(QUELLEN, key=lambda x: (["DE", "AT", "CH"].index(x["land"]), x["kategorie"], x["name"].lower())):
        artikel = "".join(f'<li><a href="{esc(a["url"])}" rel="noopener">{esc(a["titel"])}{EXTERN}</a></li>' for a in q.get("artikel", [])[:4])
        artikel_html = f'<ul class="quelle__artikel">{artikel}</ul>' if artikel else ""
        notiz = f'<p class="zeile__meta quelle__notiz">{esc(q["status_notiz"])}</p>' if q.get("status") != "ok" and q.get("status_notiz") else ""
        zeilen.append(f"""<li class="zeile" data-land="{q["land"]}" data-fuer="{" ".join(q.get("zielgruppen", []))}" data-thema="{" ".join(q.get("themen", []))}">
  <div class="zeile__haupt">
    <p class="zeile__vor">{LAND[q["land"]]} · {esc(q.get("kategorie_text", q["kategorie"]))}{(" · " + esc(q["alter"])) if q.get("alter") else ""}</p>
    <h3 class="zeile__titel">{f'<a href="{esc(q["url"])}" rel="noopener">{esc(q["name"])}{EXTERN}</a>' if q.get("url") else esc(q["name"])}</h3>
    <p class="zeile__meta">{esc(q.get("beschreibung", ""))}</p>
    {notiz}{artikel_html}
  </div>
</li>""")
    return f'<ul class="zeilen" data-filter-liste>{"".join(zeilen)}</ul>'


def platzhalter_ersetzen(text):
    def ersetzen(treffer):
        name, _, arg = treffer.group(1).partition(":")
        if name == "alle_einheiten":
            return alle_einheiten(arg)
        if name == "material_liste":
            return material_liste()
        if name == "externe_liste":
            return externe_liste()
        if name == "zeichenfeld":
            return zeichenfeld()
        if name == "tueren":
            return tueren()
        if name == "zahlen":
            return zahlen()
        if name == "rollenspiele":
            return rollenspiele_liste()
        if name == "quellen_liste":
            return quellen_liste()
        if name == "optionen":
            quelle, feld = arg.split(":")
            return optionen(quelle, feld)
        raise ValueError(f"Unbekannter Platzhalter: {treffer.group(0)}")
    return re.sub(r"\{\{([a-z_:]+)\}\}", ersetzen, text)


# ---------------------------------------------------------------- Inhalte je Einheit

EXTERN = '<span class="extern" aria-hidden="true">↗</span><span class="vh"> (externer Link)</span>'


def quelle_link(eintrag):
    """Verlinkt eine Quelle: entweder über "quelle" (ID aus quellen.json) oder direkt per "url"."""
    q = QUELLE_NACH_ID.get(eintrag.get("quelle"), {})
    name = eintrag.get("anbieter") or q.get("name", "")
    url = eintrag.get("url") or q.get("url")
    if not url:
        return esc(name)
    return f'<a href="{esc(url)}" rel="noopener">{esc(name)}{EXTERN}</a>'


def stufen_attr(eintrag):
    st = eintrag.get("stufe")
    return f' data-stufe="{" ".join(st)}"' if st else ""


def stufen_marke(eintrag, labels):
    st = eintrag.get("stufe")
    if not st:
        return ""
    return '<span class="stufen-marke">' + esc(" · ".join(labels.get(k, k) for k in st)) + "</span>"


def inhalte_html(e):
    """Hintergrund, Tipps, Material und Weiterlesen – alles aus inhalte/inhalte-einheiten.json."""
    daten = INHALTE.get(e["id"])
    if not daten:
        return "", ""
    labels = {a["key"]: a["label"] for a in e["anpassung"]}
    du = e["zielgruppe"] == "schueler"
    vorne, hinten = [], []

    if daten.get("hintergrund") or daten.get("tipps"):
        teile = []
        if daten.get("hintergrund"):
            li = "".join(f'<li>{esc(h["text"])} <span class="quelle">{quelle_link(h)}</span></li>' for h in daten["hintergrund"])
            teile.append(f'<div><h3>{"Gut zu wissen" if du else "Sachinformation"}</h3><ul class="fakten">{li}</ul></div>')
        if daten.get("tipps"):
            li = "".join(f'<li{stufen_attr(t)}>{stufen_marke(t, labels)}{esc(t["text"])} <span class="quelle">{quelle_link(t)}</span></li>'
                         for t in daten["tipps"])
            teile.append(f'<div><h3>{"Tipps für dich" if du else "Tipps und Tricks"}</h3><ul class="tipps">{li}</ul></div>')
        vorne.append(f"""<section class="teil hintergrund" id="hintergrund" aria-labelledby="hg-titel">
    <h2 id="hg-titel">{"Worum es geht" if du else "Hintergrund"}</h2>
    <div class="hintergrund__raster">{"".join(teile)}</div>
  </section>""")

    if daten.get("material"):
        karten = []
        for i, m in enumerate(daten["material"]):
            anker = m.get("anker") or f"m{i + 1}"
            if m.get("stufen"):
                varianten = "".join(
                    f'<div class="material__stufe" data-stufe="{k}"><p class="label">{esc(labels.get(k, k))}</p>{punkte_html(v)}</div>'
                    for k, v in m["stufen"].items())
            else:
                varianten = punkte_html(m.get("punkte", []))
            hinweis = f'<p class="material__hinweis">{esc(m["hinweis"])}</p>' if m.get("hinweis") else ""
            quelle = f'<p class="quelle">Grundlage: {quelle_link(m)}</p>' if (m.get("quelle") or m.get("url")) else ""
            karten.append(f"""<article class="material" id="{anker}" aria-labelledby="{anker}-t">
      <h3 id="{anker}-t">{esc(m["titel"])}</h3>
      {hinweis}{varianten}{quelle}
    </article>""")
        hinten.append(f"""<section class="teil" id="material" aria-labelledby="mat-titel">
    <h2 id="mat-titel">{"Zum Mitnehmen" if du else "Material"}</h2>
    <p class="randnotiz nur-js" data-stufen-notiz></p>
    {"".join(karten)}
  </section>""")

    if daten.get("weiterlesen"):
        zeilen = []
        for w in daten["weiterlesen"]:
            q = QUELLE_NACH_ID.get(w.get("quelle"), {})
            anbieter = w.get("anbieter") or q.get("name", "")
            zeilen.append(f"""<li class="zeile"{stufen_attr(w)}><div class="zeile__haupt">
        <p class="zeile__vor">{esc(anbieter)}{(" · " + esc(w["fuer"])) if w.get("fuer") else ""}</p>
        <h3 class="zeile__titel"><a href="{esc(w["url"])}" rel="noopener">{esc(w["titel"])}{EXTERN}</a></h3>
        <p class="zeile__meta">{esc(w.get("kurz", ""))}</p>
      </div></li>""")
        hinten.append(f"""<section class="teil" id="weiterlesen" aria-labelledby="wl-titel">
    <h2 id="wl-titel">{"Mehr dazu" if du else "Weiterlesen und weiterbilden"}</h2>
    <p class="randnotiz">{"Diese Seiten gehören nicht zu uns. Wir haben sie ausgewählt, weil sie gut erklären, worum es hier geht." if du else "Ausgewählte Angebote anderer Träger zum Vertiefen. Alle Links führen auf externe Seiten."} <!-- TEXT PRÜFEN: Links vor Veröffentlichung erneut prüfen --></p>
    <ul class="zeilen">{"".join(zeilen)}</ul>
  </section>""")
    return "\n  ".join(vorne), "\n  ".join(hinten)


def punkte_html(punkte):
    if not punkte:
        return ""
    if isinstance(punkte[0], dict):
        return '<dl class="material__karten">' + "".join(
            f'<div><dt>{esc(x["titel"])}</dt><dd>{esc(x["text"])}</dd></div>' for x in punkte) + "</dl>"
    return '<ol class="material__liste">' + "".join(f"<li>{esc(x)}</li>" for x in punkte) + "</ol>"


def stufenwahl_html(e):
    keys = [a["key"] for a in e["anpassung"]]
    if len(keys) < 2 or e["id"] not in INHALTE:
        return ""
    du = e["zielgruppe"] == "schueler"
    titel = {"fachkraefte": "Inhalte anzeigen für", "schueler": "Inhalte passend für dein Alter"}.get(e["zielgruppe"], "Inhalte anpassen für")
    knoepfe = "".join(f'<button type="button" class="stufenwahl__knopf" data-stufe-wahl="{a["key"]}" aria-pressed="false">{esc(a["label"])}</button>'
                      for a in e["anpassung"])
    return f"""<div class="stufenwahl nur-js" role="group" aria-labelledby="sw-titel">
    <p class="label" id="sw-titel">{titel}</p>
    <div class="stufenwahl__knoepfe">{knoepfe}</div>
  </div>"""


# ---------------------------------------------------------------- Einheit

def einheit_seite(e):
    zg = e["zielgruppe"]
    info = ZG[zg]
    label = info["einheit"]
    dauer = e["dauer"]
    pos = f'{label} {e["nr"]} · {e["reihe"]}' if e["nr"] else e["reihe"]

    # Stundenleiste
    spalten = " ".join(f'{b["min"]}fr' for b in e["bloecke"])
    segs = []
    zeilen = []
    bloecke = []
    start = 0
    for i, b in enumerate(e["bloecke"]):
        ende = start + b["min"]
        segs.append(f"""<li class="leiste__seg" data-phase="{i + 1}" data-seg="{i}">
        <a href="#block-{i + 1}"><span class="leiste__phase">{esc(b["phase"])}</span><span class="leiste__min">{b["min"]}<span class="leiste__einheit"> Min.</span></span><span class="vh">: <span data-seg-titel>{esc(b["titel"])}</span></span></a>
      </li>""")
        zeilen.append(f'<tr data-zeile="{i}"><td>{start}–{ende}</td><td>{esc(b["phase"])}</td>'
                      f'<td data-zeile-titel>{esc(b["titel"])}</td><td data-zeile-sozialform>{esc(b["sozialform"])}</td></tr>')

        def variante(v, art, versteckt):
            schritte = "".join(f"<li>{esc(s)}</li>" for s in v["ablauf"])
            zusatz = ' <span class="marke-alt">Alternative</span>' if art == "alt" else ""
            hidden = " hidden" if versteckt else ""
            return (f'<div class="block__variante" data-variante="{art}" data-sozialform="{esc(v["sozialform"])}"{hidden}>'
                    f'<h3 class="block__titel">{esc(v["titel"])}{zusatz}</h3>'
                    f'<ol class="schritte">{schritte}</ol></div>')

        alt_html = ""
        knopf = ""
        if b.get("alt"):
            alt_html = variante(b["alt"], "alt", True)
            knopf = (f'<button class="knopf knopf--text nur-js" type="button" data-alt-toggle aria-pressed="false" '
                     f'data-text-haupt="Alternative zeigen: {esc(b["alt"]["titel"])}" data-text-alt="Zurück zu: {esc(b["titel"])}">'
                     f'Alternative zeigen: {esc(b["alt"]["titel"])}</button>')
        material = f'<p class="block__material">Material: {esc(b["material"])}</p>' if b.get("material") else ""
        bloecke.append(f"""<li class="block" id="block-{i + 1}" data-block="{i}" data-phase="{i + 1}" tabindex="-1">
      <div class="block__inhalt">
      <p class="block__kopf"><span class="block__zeit">{start}–{ende} Min.</span><span class="vh"> · </span><strong>{esc(b["phase"])}</strong><span class="vh"> · </span><span data-sozialform-anzeige>{esc(b["sozialform"])}</span></p>
      {variante(b, "haupt", False)}
      {alt_html}
      {material}
      {knopf}
      </div>
    </li>""")
        start = ende

    schritt = SKALA_SCHRITT.get(dauer, max(1, dauer // 3))
    skala = "".join(f"<span>{m}</span>" for m in range(0, dauer + 1, schritt))

    lernziele = "".join(f"<li>{esc(z)}</li>" for z in e["lernziele"])
    material = "".join(f"<li>{esc(m)}</li>" for m in e["material"])
    anpassung = "".join(f'<li data-key="{a["key"]}"><strong>{esc(a["label"])}:</strong> {esc(a["text"])}</li>' for a in e["anpassung"])

    # Nachbarn (statisch: Grundreihe nach Nummer; JS überschreibt mit eigener Reihe)
    reihe = [x for x in einheiten_sortiert(zg) if x["nr"]]
    nachbarn = ""
    if e["nr"]:
        idx = next(i for i, x in enumerate(reihe) if x["id"] == e["id"])
        teile = []
        if idx > 0:
            v = reihe[idx - 1]
            teile.append(f'<a href="einheit-{v["id"]}.html" rel="prev">← {label} {v["nr"]}: {esc(v["titel"])}</a>')
        if idx < len(reihe) - 1:
            n = reihe[idx + 1]
            teile.append(f'<a href="einheit-{n["id"]}.html" rel="next">{label} {n["nr"]}: {esc(n["titel"])} →</a>')
        nachbarn = "".join(teile)

    spiel_html = ""
    if e.get("spiel"):
        sp = SPIELE[e["spiel"]]
        datei = SPIEL_SEITE[e["spiel"]]
        spiel_html = f'<a class="knopf knopf--zweit" href="{datei}">Spiel öffnen: {esc(sp["titel"])}</a>'
        if zg == "lehrkraefte":
            spiel_html += (f'<button class="knopf knopf--zweit nur-js" type="button" data-kopieren="{datei}">'
                           f'Spiel-Link für die Klasse kopieren</button>')

    anrede_du = zg == "schueler"
    inhalte_vorne, inhalte_hinten = inhalte_html(e)
    stufenwahl = stufenwahl_html(e)
    inhalt = f"""<article class="einheit" data-einheit="{e["id"]}" data-zielgruppe="{zg}">
  <nav class="krumen" aria-label="Brotkrumen">
    <ol>
      <li><a href="{info["seite"]}">{esc(info["label"])}</a></li>
      <li><a href="{info["seite"]}#reihe">{esc(info["reihe"])}</a></li>
      <li><span aria-current="page">{esc(e["titel"])}</span></li>
    </ol>
  </nav>
  <header class="einheit__kopf">
    <p class="einheit__pos" data-pos>{esc(pos)}</p>
    <h1>{esc(e["titel"])}</h1>
    <p class="einleitung">{esc(e["kurz"])}</p>
  </header>
  <div class="einheit__stepper nur-js" data-reihe-stepper></div>
  {stufenwahl}

  <section class="beipack" aria-labelledby="beipack-titel">
    <h2 id="beipack-titel" class="beipack__titel">Auf einen Blick</h2>
    <dl class="beipack__liste">
      <div><dt>Dauer</dt><dd>{dauer} Minuten</dd></div>
      <div><dt>Für</dt><dd>{esc(e["fuer"])}</dd></div>
      <div><dt>Vorwissen</dt><dd>{esc(e["vorwissen"])}</dd></div>
      <div><dt>Lernziele</dt><dd><ul>{lernziele}</ul></dd></div>
      <div><dt>Material</dt><dd><ul>{material}</ul></dd></div>
      <div><dt>Anpassung</dt><dd><ul class="anpassung">{anpassung}</ul></dd></div>
    </dl>
    <div class="hinweis" role="note" aria-label="Hinweis">
      {ICON_HINWEIS}
      <p><strong>Hinweis:</strong> {esc(e["hinweis"])}</p>
    </div>
  </section>

  {inhalte_vorne}

  <section class="ablauf" aria-labelledby="ablauf-titel">
    <h2 id="ablauf-titel">Ablauf</h2>
    <nav class="leiste" aria-label="Zeitleiste der {esc(label)}">
      <div class="leiste__innen">
      <ol class="leiste__liste" style="grid-template-columns:{spalten}">
      {"".join(segs)}
      </ol>
      <div class="leiste__fuss nur-js" aria-hidden="true"><span class="leiste__lauf"><span data-lauf></span></span><span class="leiste__jetzt" data-jetzt>Min. 0 von {dauer}</span></div>
      <div class="leiste__skala" aria-hidden="true">{skala}</div>
      </div>
    </nav>
    <table class="verlauf nur-druck">
      <caption>Verlaufsplan, {dauer} Minuten</caption>
      <thead><tr><th scope="col">Minute</th><th scope="col">Phase</th><th scope="col">Inhalt</th><th scope="col">Sozialform</th></tr></thead>
      <tbody>{"".join(zeilen)}</tbody>
    </table>
    <ol class="bloecke">
    {"".join(bloecke)}
    </ol>
  </section>

  {inhalte_hinten}

  <section class="einheit__aktionen" aria-label="Aktionen">
    <div class="aktionen">
      <button class="erledigt-knopf nur-js" type="button" data-erledigt><span class="erledigt-knopf__box" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="m4 12.5 5 5L20 6.5"/></svg></span><span data-erledigt-text>Als erledigt markieren</span></button>
      <button class="knopf knopf--zweit nur-js" type="button" data-drucken>Verlaufsplan drucken</button>
      {spiel_html}
    </div>
    <p class="status" data-aktion-status role="status"></p>
    <div data-weiter></div>
  </section>

  <nav class="einheit__nachbarn" aria-label="{'Weitere Einheiten' if anrede_du else 'Weitere Einheiten der Reihe'}" data-nachbarn>
    {nachbarn}
    <a href="{info["seite"]}#reihe">Zur Übersicht</a>
  </nav>
</article>
<!-- TEXT PRÜFEN: alle Inhalte dieser Einheit sind Demo-Texte und müssen fachlich geprüft werden. -->"""

    ld = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": e["titel"],
        "description": e["kurz"],
        "inLanguage": "de",
        "timeRequired": f"PT{dauer}M",
        "learningResourceType": RESSOURCEN_TYP[zg],
        "educationalLevel": e["fuer"],
        "teaches": e["lernziele"],
        "isAccessibleForFree": True,
        "audience": {"@type": "EducationalAudience", "educationalRole": ROLLE_SCHEMA[zg]},
    }
    meta = {
        "title": e["titel"],
        "description": f'{e["kurz"]} {RESSOURCEN_TYP[zg]}, {dauer} Minuten.',
        "zielgruppe": zg,
        "zg_modus": "kontext",
        "ld": ld,
    }
    return seite(meta, inhalt)


# ---------------------------------------------------------------- data.js

def data_js():
    schlank = {
        "zielgruppen": ZG,
        "einheiten": {
            e["id"]: {
                "id": e["id"], "zielgruppe": e["zielgruppe"], "nr": e["nr"], "titel": e["titel"],
                "kurz": e["kurz"], "dauer": e["dauer"],
                "bloecke": [{"phase": b["phase"], "min": b["min"]} for b in e["bloecke"]],
            } for e in EINHEITEN
        },
        "spiele": SPIELE,
        "geschichten": {g["id"]: g for g in GESCHICHTEN},
    }
    return ("/* Automatisch erzeugt von werkzeuge/bauen.py aus inhalte/daten.json – nicht direkt bearbeiten. */\n"
            f"window.NK_DATA = {json.dumps(schlank, ensure_ascii=False, indent=1)};\n")


# ---------------------------------------------------------------- Lauf

def main():
    vorlagen = sorted((WURZEL / "vorlagen" / "seiten").glob("*.html"))
    anzahl = 0
    for datei in vorlagen:
        roh = datei.read_text("utf-8")
        treffer = re.match(r"\s*<!--meta\s*(\{.*?\})\s*-->", roh, re.S)
        if not treffer:
            raise SystemExit(f"Meta-Kommentar fehlt in {datei.name}")
        meta = json.loads(treffer.group(1))
        inhalt = platzhalter_ersetzen(roh[treffer.end():].strip("\n"))
        (WURZEL / datei.name).write_text(seite(meta, inhalt), "utf-8")
        anzahl += 1
    for e in EINHEITEN:
        (WURZEL / f'einheit-{e["id"]}.html').write_text(einheit_seite(e), "utf-8")
        anzahl += 1
    for g in GESCHICHTEN:
        (WURZEL / f'rollenspiel-{g["id"]}.html').write_text(rollenspiel_seite(g), "utf-8")
        anzahl += 1
    (WURZEL / "assets").mkdir(exist_ok=True)
    (WURZEL / "assets" / "data.js").write_text(data_js(), "utf-8")
    # GitHub Pages: kein Jekyll – Dateien werden genau so ausgeliefert, wie sie hier liegen
    (WURZEL / ".nojekyll").write_text("", "utf-8")
    print(f"{anzahl} Seiten und assets/data.js erzeugt." + (" Testbetrieb (noindex)." if TESTBETRIEB else ""))


if __name__ == "__main__":
    main()
