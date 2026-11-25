# PIXEL & PROTOCOL – Antwort 1: Denken & Fusionieren
**Projekt:** Lern- und Materialplattform „Hass & Hetze im Netz“ · Arbeitstitel **NETZKLAR** <!-- NAME PRÜFEN -->
Grundlage: [briefing.md](briefing.md) · Stand: 06.11.2026

---

## Phase 0 – Briefing-Dekodierung

🎯 **MARA:** Wir bauen eine Plattform für vier Zielgruppen. Lehrkräfte, Schüler:innen, Eltern und Fachkräfte finden dort fachlich fundiertes Material zu Hass und Hetze im Netz. Das Herzstück ist ein Konfigurator: Er macht aus wenigen Angaben fertige 45-Minuten-Stunden aus Materialblöcken, die sich zu Reihen verbinden lassen. Die Gestaltung ist bewusst nüchtern. Die Seite soll wirken wie ein gutes Werkzeug, nicht wie ein Prospekt.

🧭 **JONAS – Leitfrage:**
> **Nach 10 Sekunden** soll man denken: *„Das ist seriös, und hier gibt es etwas für genau mich.“*
> **Nach 2 Minuten** hat man *eine konkrete Einheit vor sich, mit der man morgen arbeiten kann*. Die Lehrkraft hat ihre Stunde, das Elternteil den Gesprächsleitfaden, die Schülerin ein gestartetes Spiel.

**Harte Rahmenbedingungen (aus dem Diktat):**
- Zielgruppen-Reiter oben rechts: Lehrkräfte · Schüler:innen · Eltern · Sozialarbeitende & Psycholog:innen
- Inhaltsarten links, senkrecht gestapelt: Material · Spiele · Sonstiges · Beratungsangebote, dazu ein Bereich „Externe Schulungsangebote“
- Schnellauswahl in der Mitte der Startseite
- Konfigurator für Lehrkräfte (Klasse, Alter, Vorwissen) → 45-Minuten-Einheiten aus Materialblöcken, Reihen mit mehreren Einheiten, später wieder abrufbar
- Ähnliche Einheitensysteme für Eltern und Fachkräfte, Selbstlernen und Mini-Games für Schüler:innen
- Minimalistisches UI ohne Schmuck, Farbschema sicher bei Farbsehschwächen, Dark Mode

**Weiche Annahmen (markiert, aus dem Briefing übernommen):**
- Kein Login in Version 1. Gemerkt wird per teilbarem Link und im Browser.
- Demo-Inhalte, die das Team realistisch textet. Echtes Material folgt.
- Statischer Prototyp ohne Backend
- Mut visuell 3/10, strukturell 6/10

**Rückfragen:** stehen schon in `briefing.md`. Wir arbeiten mit den markierten Annahmen weiter.

---

## Phase 1 – Divergenz

🎯 **MARA**
- **I1 – Satz statt Kachelwand.** Die Schnellauswahl ist keine Gitterfläche aus Kacheln, sondern ein Satz zum Ausfüllen: *„Ich bin [Lehrkraft] und brauche [eine Unterrichtsstunde] zum Thema [Hate Speech erkennen].“* Ein Satz ist die nüchternste Form, die es gibt, und trotzdem persönlich.
- **I2 – Vier Türen, eine Grammatik.** Alle vier Bereiche folgen demselben Muster: *Fragen → Einheiten → Blöcke*. Nur Fragen, Tonalität und Inhalte unterscheiden sich. Wer einen Bereich verstanden hat, versteht alle.

🧭 **JONAS**
- **I3 – Persona „Sonntag, 21 Uhr“.** Frau K. unterrichtet Deutsch und Politik. Im Klassenchat der 8b gab es einen Vorfall, morgen ist die 3. Stunde. Sie braucht in unter 60 Sekunden eine belastbare Stunde. Daraus folgen: höchstens vier Fragen, sinnvolle Voreinstellungen, sofort druckbar.
- **I4 – Einstieg über den Anlass.** Viele kommen nicht präventiv, sondern weil gerade etwas passiert ist. Darum wird der Anlass zur Frage im Konfigurator (*präventiv · nach einem Vorfall · Projektwoche*), und „Nach einem Vorfall“ steht prominent in der Schnellauswahl.
- **I5 – Schüler:innen kommen über die Lehrkraft.** Die meisten Jugendlichen landen nicht über Google hier, sondern weil die Lehrkraft einen Link oder QR-Code teilt. Jede Einheit bekommt deshalb einen „Für die Klasse teilen“-Link direkt zum passenden Spiel.

🗺️ **LINA**
- **I6 – Die Navigationsmatrix auflösen.** Oben steht *„Wer bin ich?“* und setzt den Kontext. Links steht *„Was suche ich?“* und filtert innerhalb dieses Kontexts. Die gewählte Zielgruppe bleibt sichtbar als aktiver Reiter. „Material“ zeigt dann nur Material für Eltern, wenn Eltern gewählt sind. Und **„Sonstiges“ wird „Wissen“** (Glossar, Rechtslage, Hintergrund), denn unter „Sonstiges“ sucht niemand etwas.
- **I7 – Die Reihe als Mappe.** Eine Reihe hat eine eigene Übersicht: *Stunde 3 von 8 · erledigt · offen*. Wer zurückkommt, sieht oben genau einen Satz: **„Weiter mit Stunde 4: Was ist strafbar?“**
- **I8 – Mobil ohne Burger-Labyrinth.** Unter 900 px wird die Seitenleiste zur waagerecht scrollbaren Leiste unter dem Header, und die Zielgruppen-Reiter werden zu einem Auswahlschalter. Alles bleibt mit einem Tipp erreichbar.

🎨 **YUKI**
- **I9 – Amtsblatt, aber gut gesetzt.** Typografischer Minimalismus nach Schweizer Vorbild: eine Grotesk, zwei Schriftschnitte, ein strenges Raster, Linien statt Schatten. Die Gestaltung entsteht aus Typografie und Weißraum, nicht aus Dekoration.
- **I10 – Blau/Orange statt Rot/Grün.** Die Palette baut auf der Blau-Orange-Achse auf, die bei allen gängigen Farbsehschwächen unterscheidbar bleibt (angelehnt an Okabe-Ito). Farbe ist *nie* der einzige Träger einer Information: Es gibt immer auch Text, Symbol oder Helligkeitsunterschied.
- **I11 – Graustufen plus ein Signalblau.** Die Oberfläche ist monochrom, Blau heißt ausschließlich „klickbar/aktiv“. So bekommt Farbe eine Bedeutung und bleibt kein Schmuck.

✨ **NOVA**
- **I12 – Die Stunde als Zeitleiste.** Jede Einheit wird als waagerechter Balken dargestellt, dessen Segmente proportional zur Zeit sind: Einstieg 5 · Erarbeitung 20 · Sicherung 15 · Abschluss 5. Man sieht die Stunde, bevor man sie liest. Klickt man ein Segment, springt die Seite zum Block. Für einen Block lässt sich eine Alternative gleicher Länge einsetzen, und der Balken bleibt bei 45.
- **I13 – „Moderationsschicht“.** Ein Mini-Game: Die Spielerin moderiert für eine fiktive Plattform einen Kommentar-Feed und entscheidet: *melden · Gegenrede · ignorieren · Hilfe holen*. Danach kommt eine Erklärung statt Punkten.
- **I14 – (regelbrechend, fast zu viel) Die Startseite antwortet.** Auf der Startseite steht ein leeres Kommentarfeld: *„Schreib, was du im Netz gelesen hast.“* Die Seite analysiert den Text live und zeigt, was er rechtlich und menschlich bedeutet.

💻 **ANTON**
- **I15 – Konfigurator als echtes Formular.** Native `<select>`- und Radio-Elemente in `<fieldset>`s, ausgewertet mit wenig JavaScript. Die Auswahl steht in der URL (`?klasse=8&vorwissen=wenig&anlass=vorfall&umfang=8`). Dadurch ist sie teilbar, als Lesezeichen speicherbar, und der Zurück-Button funktioniert.
- **I16 – Dark Mode mit `light-dark()`.** Tokens werden einmal definiert, der Modus folgt dem System und lässt sich umschalten. Ein kurzes Inline-Skript im `<head>` verhindert das weiße Aufblitzen beim Laden.
- **I17 – Druck ist ein Feature.** Lehrkräfte drucken. Ein eigenes Druck-Stylesheet macht aus jeder Einheit einen sauberen A4-Verlaufsplan ohne Navigation, mit Zeitleiste als Tabelle.

🗄️ **IDA**
- **I18 – Ein Inhaltsmodell für alles.** `Einheit {id, zielgruppe, titel, dauer, stufe, vorwissen, lernziele, hinweis, bloecke[]}` und `Block {phase, minuten, sozialform, ablauf, material, alternative?}`. Heute liegt das in einer Datei, später in einem Headless-CMS, in dem Fachleute ohne Code pflegen.
- **I19 – Kein Login, keine Datenbank.** Version 1 merkt sich Fortschritt über URL und `localStorage`. Echte Konten (etwa mit Schul-Login) sind eine eigene Ausbaustufe mit eigenem Datenschutzkonzept.
- **I20 – Externe Angebote als Verzeichnis.** Eine schlichte filterbare Liste (Anbieter-Typ, Format, Region, Zielgruppe). Kontakt läuft direkt zum Anbieter, ohne eigenes Formular-Backend.

📈 **FELIX**
- **I21 – Kontrast AAA im Fließtext.** Fließtext mit mindestens 7:1 statt der AA-Pflicht von 4,5:1, in beiden Modi. Bei einer schlichten Oberfläche kostet das nichts und hilft allen.
- **I22 – Jede Einheit eine eigene, auffindbare Seite.** Lehrkräfte googeln „Unterricht Hate Speech Klasse 8“. Strukturierte Daten vom Typ `LearningResource` (`educationalLevel`, `timeRequired: PT45M`) machen die Einheiten auffindbar.
- **I23 – Null Drittanbieter.** Keine Google Fonts, keine CDNs, kein Tracking, schon gar nicht im Bereich für Minderjährige. Die Spiele laufen komplett lokal im Browser.

😈 **VIKTOR**
- **I24 – Hilfe vor Werbung.** Auf diese Seite kommen auch Betroffene. Ein dauerhaft sichtbarer Link **„Hilfe bei Hass im Netz“** im Header ist wichtiger als jede Schnellauswahl.
- **I25 – „Steril“ ist für Zwölfjährige ein Risiko.** Wenn die Seite wirkt wie ein Behördenformular, ist die Schülerin nach 8 Sekunden weg. Wärme muss über Sprache kommen (du-Ansprache, kurze Sätze) und nicht über Deko.

---

## Phase 2 – Kollision & Mutation

✨ **NOVA:** I14 ist mein Liebling. Die Startseite, die auf Hass reagiert. Das hat niemand.

😈 **VIKTOR:** Weil es eine schlechte Idee ist. Du forderst Leute auf, Hass in ein Feld zu tippen, und dann brauchst du eine Analyse, die nie danebenliegen darf. Ein Fehlurteil auf einer Präventionsseite ist ein Glaubwürdigkeitsschaden. Und das Feld zieht genau die an, die es zum Spaß befüllen.

🧭 **JONAS:** Außerdem steht Frau K. am Sonntagabend nicht in einem Kunstprojekt. Sie will ihre Stunde.

🎯 **MARA:** Der Kern von I14 ist aber richtig: *Erleben statt Lesen.* Dreh es um. Nicht der Besucher schreibt Hass, er **beurteilt** vorbereitete, entschärfte Beispiele. Dann sind wir bei I13.

→ **H1 – „Moderationsschicht“ (I13 + I14, umgekehrt):** Das Spiel übernimmt die Wucht von I14, aber mit kuratierten, fiktiven, sprachlich entschärften Kommentaren. Es gibt kein freies Eingabefeld und keine Live-Analyse. Jede Entscheidung bekommt eine fachliche Rückmeldung.

🗺️ **LINA:** I1 und I15 passen zusammen. Der Satz von der Startseite *ist* der Konfigurator. Er steht dort nur in Kurzform.

💻 **ANTON:** Technisch ist das ein Formular, dessen `<label>`s Satzteile sind. Ein Screenreader liest: *„Ich unterrichte eine, Klassenstufe, Auswahl, 8. Klasse.“* Damit das sauber klingt, braucht jedes Select ein verstecktes, vollständiges Label.

🎨 **YUKI:** Und typografisch ist das der einzige große Moment der Startseite: ein Satz in großer Schrift, die Auswahlfelder blau unterstrichen. Mehr braucht es nicht.

→ **H2 – Satz-Konfigurator (I1 + I4 + I15):** Ein einziger Satz, je nach Zielgruppe mit 3–4 Auswahlfeldern, als echtes Formular. Die Werte landen in der URL. Auf der Startseite steht die Kurzform, im Bereich die volle.

✨ **NOVA:** Wenn wir schon so reduziert sind, braucht es *eine* Sache, die nur im Web geht. Meine Zeitleiste aus I12. Da tauscht man einen Block, und die Stunde baut sich vor einem neu.

😈 **VIKTOR:** Ist das nicht ein Dribbble-Shot? Ein hübscher Balken.

💻 **ANTON:** Nicht, wenn er funktional ist. Der Balken ist gleichzeitig Inhaltsverzeichnis (Sprung zum Block), Zeitplanung (Minuten) und Druckvorlage (Verlaufsplan). Ohne JavaScript ist er eine geordnete Liste mit Minutenangaben.

📈 **FELIX:** Bedingung: Die Segmente unterscheiden sich durch Helligkeit *und* Beschriftung, nicht durch Farbtöne. Dann funktioniert er auch bei Achromatopsie und im Graustufendruck.

→ **H3 – Stundenleiste (I12 + I17 + I7):** Jede Einheit hat oben einen 45-Minuten-Balken. Er dient als Navigation, zeigt Alternativen und wird gedruckt zur Verlaufsplan-Tabelle. In der Reihenübersicht steht jede Stunde als Mini-Balken untereinander, wie ein Fahrplan.

🗄️ **IDA:** I2 und I6 sind eigentlich eine Idee. Die Grammatik ist immer gleich, die Zielgruppe ist ein Kontext und keine eigene Welt.

→ **H4 – Vier Türen, eine Grammatik (I2 + I6 + I18):** Oben die Zielgruppe als Kontext, links die Inhaltsart als Filter. Alle vier Bereiche teilen ein Inhaltsmodell und eine Seitenstruktur: *Satz-Konfigurator → Reihenübersicht → Einheit mit Stundenleiste.* Sie unterscheiden sich nur in Fragen, Dauer (Unterricht 45 Min., Elterngespräch 20 Min., Beratungssitzung 50 Min., Selbstlernen 10 Min.) und Tonalität.

🧭 **JONAS:** Übertragung aus einer fremden Branche: der **Beipackzettel**. Medikamente sagen vorher, für wen sie sind, wie lange sie wirken und was man beachten muss. Unsere Einheiten haben echte Nebenwirkungen: In jeder Klasse kann jemand sitzen, der selbst betroffen ist.

→ **H5 – Beipackzettel (Übertragung Pharma → Unterricht):** Jede Einheit beginnt mit einem knappen Datenblock: *Dauer · Klassenstufe · Vorwissen · Lernziele · Material* und einem orange markierten **Hinweis** (Symbol + Text) zu sensiblen Inhalten mit Tipps, wie man mit betroffenen Schüler:innen umgeht. Das ist nüchtern, ehrlich und fachlich ernst gemeint.

😈 **VIKTOR:** Und I24 ist nicht verhandelbar. Hilfe gehört in den Header, nicht in den Footer.

→ **H6 – Hilfe als feste Konstante (I24 + I25):** Rechts im Header steht vor den Reitern immer der Link „Hilfe bei Hass im Netz“. Er führt zur Beratungsseite, ganz oben mit Sofort-Kontakten. Im Schülerbereich wird die Sprache wärmer: du-Ansprache, kurze Sätze.

---

## Phase 3 – Realitätscheck

| Kandidat | Machbarkeit (Anton) | Pflege & Kosten (Ida) | Performance / SEO / A11y (Felix) | Klischee & Risiko (Viktor) |
|---|---|---|---|---|
| **H2 Satz-Konfigurator** | gering: natives Formular + ~60 Zeilen JS | Fragen kommen aus dem Datenmodell | gut, wenn jedes Select ein volles Label hat; umbrechen ab 320 px testen | frisch, solange es *ein* Satz bleibt und kein Roman |
| **H3 Stundenleiste** | mittel: CSS Grid mit `fr`-Spalten = Minuten; Tausch per JS | Alternativen müssen redaktionell gleich lang sein | ohne JS geordnete Liste, Segmente über Helligkeit + Text | Signature mit echter Funktion, kein Shot |
| **H4 Eine Grammatik** | reduziert Aufwand: 1 Template, 4 Konfigurationen | ein Modell, ein CMS-Schema | konsistente Überschriftenstruktur überall | schützt vor Frankenstein |
| **H5 Beipackzettel** | gering | Pflichtfelder im Modell, sonst fehlt er | `<dl>` semantisch ideal | gefährlich nur, wenn Hinweise floskelhaft werden |
| **H1 Moderationsschicht** | mittel: Zustandsautomat, 8–10 Runden, lokal | Kommentare fachlich prüfen lassen | per Tastatur spielbar, kein Zeitdruck (WCAG 2.2.1) | stark, wenn Beispiele realistisch, aber entschärft sind |
| **I14 Hass-Eingabefeld** | hoch: Klassifikation unzuverlässig | Moderation nötig | Datenschutz: Freitext von Minderjährigen | **verwerfen**: Risiko > Wirkung |
| **I22 Einheit als eigene Seite** | im statischen Prototyp nur eine Vorlage mit Parametern | ab dem CMS-Ausbau echte URLs | Prototyp: begrenzt indexierbar → im Bauplan als Ausbaustufe markiert | – |
| **I19 Kein Login** | sehr gering | keine Datenbank, keine Kosten | keine personenbezogenen Daten | ehrlich kommunizieren: „gespeichert auf diesem Gerät“ |

---

## Phase 4 – Fusion zur Idealversion

### Rückgrat
🎯 **MARA:** Das Fundament ist **H4 – Vier Türen, eine Grammatik.** Jede Tür führt in einem Satz zu einer fertigen Einheit. Alles andere muss dieses Versprechen schneller, klarer oder vertrauenswürdiger machen:
- **H2** ist der Eingang.
- **H3** zeigt die Einheit.
- **H5** macht sie vertrauenswürdig.
- **H6** stellt sicher, dass niemand allein gelassen wird.
- **H1** ist das, was Schüler:innen mitnehmen.

### Signature Moment
✨ **NOVA (setzt sich durch):** **Die Stundenleiste.** Die Einheit ist als Balken aus Minuten sichtbar. Ein Klick auf „Alternative“ tauscht einen Block aus, und das Segment überblendet in 200 ms. Fallbacks:
- ohne JavaScript: geordnete Liste mit Minuten
- `prefers-reduced-motion`: Wechsel ohne Animation
- Screenreader: Liste mit Phase, Minuten und Titel
- Druck: Verlaufsplan-Tabelle

### Frankenstein-Check
😈 **VIKTOR:** Was fliegt raus?
- I14 (Risiko)
- farbcodierte Zielgruppen (wären Schmuck und Barrierefreiheitsfalle)
- eine animierte Startseite jeder Art

Was bleibt, gehorcht derselben Logik aus Satz, Einheit und Block. Das wirkt als Ganzes. ✅

### Umsetzbarkeit
💻 **ANTON** + 🗄️ **IDA:** Alles ist als statischer Prototyp mit HTML, CSS und Vanilla JS baubar, ohne Build-Schritt. Er läuft per Doppelklick lokal und auf jedem Static Hosting. Die Inhalte liegen in einer `data.js`. Die Struktur ist so geschnitten, dass sie 1:1 in Astro + CMS übertragbar ist. ✅

---

### Fusionsmatrix

| # | Idee / Hybrid | Status | Begründung |
|---|---|---|---|
| I1 | Satz statt Kachelwand | übernommen (in H2) | Persönlich und nüchtern zugleich, ersetzt das Template-Kachelraster. |
| I2 | Vier Türen, eine Grammatik | übernommen (in H4) | Ist das Rückgrat. |
| I3 | Persona „Sonntag, 21 Uhr“ | übernommen | Leitet das Kriterium „Einheit in unter 60 Sekunden“ ab. |
| I4 | Einstieg über den Anlass | übernommen | Wird zum Feld „Anlass“ und zum ersten Eintrag der Schnellauswahl. |
| I5 | Schüler:innen über Lehrkraft-Link | angepasst | Kein QR-Generator in V1, aber ein Link „Für die Klasse“ in jeder Einheit. |
| I6 | Navigationsmatrix auflösen + „Wissen“ | übernommen | Klärt das Zusammenspiel der beiden Navigationen; „Sonstiges“ wird „Wissen“. |
| I7 | Reihe als Mappe + „Weiter mit …“ | übernommen (in H3) | Erfüllt die Anforderung „später wieder draufgehen“. |
| I8 | Mobil ohne Burger | übernommen | Alle Navigationspunkte bleiben mit einem Tipp erreichbar. |
| I9 | Amtsblatt, gut gesetzt | übernommen | Ist die Umsetzung von „simpel, nüchtern, steril“. |
| I10 | Blau/Orange statt Rot/Grün | übernommen | Erfüllt die Farbsehschwäche-Anforderung systematisch. |
| I11 | Graustufen + ein Signalblau | übernommen | Farbe bekommt eine einzige Bedeutung: interaktiv. |
| I12 | Stunde als Zeitleiste | übernommen (in H3) | Signature Moment. |
| I13 | Moderationsschicht | übernommen (in H1) | Stärkstes Lernspiel, passt zum Thema. |
| I14 | Startseite antwortet auf Hass | verworfen | Fehlurteile und Missbrauch wären ein Glaubwürdigkeitsrisiko. |
| I15 | Konfigurator als natives Formular + URL | übernommen | Barrierefrei, teilbar, zurück-fähig. |
| I16 | Dark Mode mit `light-dark()` | übernommen | Ein Token-Satz, kein Aufblitzen. |
| I17 | Druck als Feature | übernommen | Lehrkräfte arbeiten auf Papier. |
| I18 | Ein Inhaltsmodell | übernommen | Grundlage für alle vier Bereiche und das spätere CMS. |
| I19 | Kein Login | übernommen | Keine Kosten, keine personenbezogenen Daten in V1. |
| I20 | Externe Angebote als Verzeichnis | übernommen | Einfach zu pflegen, ohne eigenes Backend. |
| I21 | Fließtext-Kontrast 7:1 | übernommen | Kostet bei dieser Gestaltung nichts. |
| I22 | Einheit als eigene Seite + LearningResource | angepasst | Strukturierte Daten schon jetzt, echte Einzel-URLs erst mit CMS (Ausbaustufe). |
| I23 | Null Drittanbieter | übernommen | Datenschutz bei Minderjährigen, null Ladezeitrisiko. |
| I24 | Hilfe vor Werbung | übernommen (in H6) | Betroffene müssen Hilfe sofort finden. |
| I25 | Wärme über Sprache | übernommen (in H6) | Gegengewicht zu „steril“ ohne Deko. |
| H1 | Moderationsschicht (entschärft) | übernommen | Erleben statt Lesen, ohne Freitext-Risiko. |
| H2 | Satz-Konfigurator | übernommen | Eingang in jede Tür. |
| H3 | Stundenleiste | übernommen | Signature Moment mit dreifacher Funktion. |
| H4 | Vier Türen, eine Grammatik | **Rückgrat** | Verhindert vier verschiedene Mini-Websites. |
| H5 | Beipackzettel | übernommen | Fachliche Ernsthaftigkeit, schützt betroffene Schüler:innen. |
| H6 | Hilfe als Konstante + Sprachwärme | übernommen | Verantwortung des Themas. |

---

### Weggabelungen
*(kippbar mit `/umentscheiden W1` … `W4`)*

| | Gewählt | Verworfen | Begründung |
|---|---|---|---|
| **W1 – Wie merkt sich die Seite Reihen?** | Teilbarer Link + Speicher im Browser, kein Login | Nutzerkonten mit Login | V1 bleibt ohne Datenbank, ohne Kosten und ohne personenbezogene Daten. Der Nachteil: Ein Gerätewechsel funktioniert nur über den Link. |
| **W2 – Form des Konfigurators** | Ein Satz mit Auswahlfeldern auf einer Seite | Mehrschritt-Assistent (Schritt 1 von 4 …) | Der Satz zeigt alle Angaben gleichzeitig und ist in Sekunden änderbar. Ein Assistent ist bei mehr als 6 Fragen besser. |
| **W3 – Schrift** | Systemschrift (San Francisco, Segoe UI, Roboto …) | Atkinson Hyperlegible, selbst gehostet | Null Ladezeit, kein Layout-Shift, kein Datenschutzthema. Atkinson wäre lesefreundlicher bei Sehschwäche und ist eine gute Ausbaustufe. |
| **W4 – Farbe der Zielgruppen** | Keine eigene Farbe pro Zielgruppe, nur ein Akzentblau | Vier Farbcodes (je Zielgruppe eine Farbe) | Vier Farben wären Schmuck und für Farbsehschwache nicht verlässlich unterscheidbar. Die Zielgruppe zeigt sich über den aktiven Reiter und die Überschrift. |

---

## BAUPLAN der Idealversion

### Name & Leitidee
**NETZKLAR** (Arbeitstitel) – *Ein Werkzeug, kein Prospekt: Jede Tür führt in einem Satz zu einer fertigen Einheit.*

### Erlebnis – ein Besuch (Frau K., Lehrkraft)
1. Die Seite lädt sofort: keine Bilder, Systemschrift, Modus wie im Betriebssystem eingestellt.
2. Sie liest den großen Satz in der Mitte: *„Ich bin [Lehrkraft] und brauche [eine Unterrichtsstunde] für [Klasse 8].“* Darunter steht die Schnellauswahl, ganz oben *„Nach einem Vorfall in der Klasse“*.
3. Sie klickt auf **Los** und landet im Bereich Lehrkräfte. Der volle Satz ist schon vorausgefüllt, sie ergänzt Vorwissen „wenig“, Anlass „Vorfall“, Umfang „Reihe mit 4 Stunden“.
4. Die Reihenübersicht erscheint: 4 Stunden als Mini-Stundenleisten untereinander.
5. Sie öffnet Stunde 1. Oben steht der Beipackzettel mit orangem Hinweis zu betroffenen Schüler:innen, darunter die große Stundenleiste, darunter die vier Blöcke mit Ablauf und Material.
6. Sie tauscht den Einstieg gegen die Alternative, druckt die Stunde und kopiert den Link „Für die Klasse“.
7. Eine Woche später öffnet sie die Seite wieder und liest oben: **„Weiter mit Stunde 2: Was Hass mit Menschen macht“**.

### Sitemap
```
/                         Startseite (Satz-Kurzform + Schnellauswahl)
├── lehrkraefte.html      Bereich Lehrkräfte  (Satz-Konfigurator → Reihe)
├── schueler.html         Bereich Schüler:innen (Selbstlernen + Spiele)
├── eltern.html           Bereich Eltern       (Satz-Konfigurator → Reihe)
├── fachkraefte.html      Bereich Sozialarbeit & Psychologie (Konfigurator → Reihe)
├── einheit.html?id=…     Einheit (Beipackzettel + Stundenleiste + Blöcke) – eine Vorlage für alle
├── material.html         Materialbibliothek, gefiltert nach Zielgruppe
├── spiele.html           Spieleübersicht
│   ├── spiel-moderation.html   Mini-Game „Moderationsschicht“
│   └── spiel-einordnen.html    Mini-Game „Meinung oder Hetze?“
├── wissen.html           Wissen (ehem. „Sonstiges“): Glossar, Rechtslage, Mechanismen
├── beratung.html         Beratungsangebote, oben „Sofort-Hilfe“
├── externe-angebote.html Externe Schulungs- und Präventionsangebote (Verzeichnis)
├── impressum.html        Gerüst
├── datenschutz.html      Gerüst
└── barrierefreiheit.html Gerüst
```

**Nutzerflüsse**
- **Lehrkraft:** Start → Satz → Lehrkräfte (Satz vervollständigen) → Reihe → Einheit → Drucken / Link / „Erledigt“ → später: „Weiter mit …“
- **Schüler:in:** Lehrkraft-Link → Spiel *oder* Schüler-Bereich → Alter + Thema → Selbstlern-Einheit (10 Min.) → passendes Spiel
- **Eltern:** Start → Reiter Eltern → Satz (Alter des Kindes, Anlass) → Gesprächseinheit (20 Min.)
- **Fachkraft:** Reiter Fachkräfte → Satz (Setting, Alter, Thema) → Beratungsbaustein (50 Min.)
- **Betroffene:r:** „Hilfe bei Hass im Netz“ (überall) → Beratung, Sofort-Kontakte

**Navigationslogik:** Der Zielgruppen-Reiter setzt den Kontext (gespeichert, als `aria-current` markiert). Die linke Navigation zeigt dieselben Punkte, filtert aber nach diesem Kontext, z. B. `material.html?fuer=eltern`.

### Abschnitt für Abschnitt

**Globale Elemente (alle Seiten)**
- **Header:** Wortmarke links. Rechts der Link „Hilfe bei Hass im Netz“ (Text + Symbol), die Zielgruppen-Reiter (4) und der Modus-Schalter (Hell/Dunkel/System). Höhe 64 px, unten eine 1-px-Linie.
- **Seitenleiste links** (≥ 900 px, fixiert, 220 px): Material · Spiele · Wissen · Beratung, darunter durch eine Linie getrennt: *Externe Angebote*. Aktiver Punkt mit 3 px blauer Linie links und fetter Schrift. Unter 900 px wird sie zur waagerecht scrollbaren Leiste unter dem Header.
- **Footer:** Impressum · Datenschutz · Barrierefreiheit · „Inhalte fachlich verantwortet von …“ <!-- TEXT PRÜFEN -->
- **Skip-Link** „Zum Inhalt springen“

**Startseite**
1. **H1** (klein, gedämpft): *„Material gegen Hass und Hetze im Netz – für Unterricht, Zuhause und Beratung.“*
2. **Satz-Kurzform** (groß, Schritt 3): *„Ich bin [Lehrkraft ▾] und brauche [eine Unterrichtsstunde ▾] für [Klasse 8 ▾].“* Das Auswahlfeld in der Mitte ändert sich je nach Zielgruppe. Primärbutton **Los** führt zum Bereich mit Parametern.
3. **Weiter-Hinweis** (nur wenn gespeichert): Zeile mit Linie oben und unten: *„Weiter mit Stunde 2 von 4: …“*
4. **Schnellauswahl** als Liste, nicht als Kacheln: 6 Zeilen, jede mit Titel, einer Zeile Kontext und Pfeil. Beispiele: Nach einem Vorfall · Erste Stunde: Was ist Hate Speech? · Reihe: 8 Stunden Medienkompetenz · Spiel: Moderationsschicht · Gespräch mit meinem Kind · Baustein für die Einzelberatung.
5. **Drei Fakten** in einer Zeile, nur Text: *„45-Minuten-Einheiten · fachlich geprüft · kostenlos, ohne Anmeldung“* <!-- TEXT PRÜFEN -->

**Bereichsseiten (Lehrkräfte / Eltern / Fachkräfte)** – dieselbe Vorlage
1. H1 + ein Satz zur Zielgruppe
2. **Satz-Konfigurator** (volle Form, 4 Felder)
   - Lehrkräfte: Klasse · Alter (aus der Klasse vorausgefüllt) · Vorwissen · Anlass · Umfang
   - Eltern: Alter des Kindes · Anlass · Umfang
   - Fachkräfte: Setting · Alter · Thema · Umfang
3. **Reihenübersicht:** Liste der Einheiten, je mit Nummer, Titel, Mini-Stundenleiste, Status (offen/erledigt als Text + Symbol) und Link
4. Aktionen: „Link zu dieser Reihe kopieren“ · „Reihe zurücksetzen“

**Einheit**
1. Brotkrumen: Bereich › Reihe › Stunde n
2. H1 Titel, darunter „Stunde n von m“
3. **Beipackzettel** (`<dl>`): Dauer · Für · Vorwissen · Lernziele · Material. **Hinweis-Box** orange mit Symbol und dem Wort „Hinweis“.
4. **Stundenleiste** (Signature), darunter Legende mit Minuten
5. **Blöcke:** pro Block Phase, Minuten, Sozialform, Ablauf (nummerierte Schritte), Material (Download-Platzhalter) und gegebenenfalls „Alternative zeigen“
6. Aktionen: Drucken · Link kopieren · Für die Klasse (Link zum Spiel) · **Als erledigt markieren → Weiter mit Stunde n+1**

**Schüler:innen**
- Satz: *„Ich bin [13] Jahre alt und will wissen, [was ich tun kann, wenn mich jemand angreift ▾].“*
- Ergebnis: 2–3 Selbstlern-Einheiten (10 Min., gleiche Vorlage mit Stundenleiste) plus passendes Spiel
- Sprache: du, kurze Sätze, Hilfe-Hinweis besonders sichtbar

**Spiele**
- *Moderationsschicht:* 8 fiktive, entschärfte Kommentare. Entscheidung aus 4 Optionen, dann eine Rückmeldung (richtig/teilweise per Text + Symbol, nie nur Farbe). Am Ende eine Auswertung ohne Highscore. Kein Zeitlimit.
- *Meinung oder Hetze?:* 10 Aussagen einordnen (Meinung · Grenzfall · Hetze), mit Begründung.

**Material** – filterbare Liste (Zielgruppe, Typ, Klassenstufe), Filter als native Selects, Ergebnisse als Zeilen
**Wissen** – Glossar (`<dl>`), Rechtslage (ohne Rechtsberatung), Mechanismen, als Inhaltsverzeichnis mit Ankern
**Beratung** – ganz oben **Sofort-Hilfe** (Kontakte), darunter Beratungsangebote nach Zielgruppe <!-- TEXT PRÜFEN: alle Kontakte verifizieren -->
**Externe Angebote** – Verzeichnis mit Filtern (Anbieter-Typ: Polizei/Verein/Behörde · Format: Workshop/Vortrag/Projekttag · Zielgruppe), jeder Eintrag mit Anbieter, Format, Dauer, Kontakt-Link

### Signature Moment – Stundenleiste
- **Was man sieht:** ein 48 px hoher Balken über die volle Inhaltsbreite. CSS Grid mit `grid-template-columns` in `fr` = Minuten (5fr 20fr 15fr 5fr). Jedes Segment zeigt Phase und Minuten. Die Segmente unterscheiden sich durch **Helligkeitsstufen** einer Blau-Grau-Skala plus 2-px-Trennlinien, nicht durch Farbtöne. Darunter eine Minuten-Skala (0 · 15 · 30 · 45).
- **Interaktion:** Klick oder Enter auf ein Segment scrollt zum Block. „Alternative zeigen“ tauscht den Block gegen eine Variante gleicher Länge, das Segment überblendet in 200 ms, die Auswahl wird gespeichert. Hover und Fokus heben das Segment mit einer Umrandung hervor.
- **Fallback:** Semantisch ist die Leiste eine `<ol>` mit Links, das Grid ist reine Darstellung. Ohne JS ist es eine funktionierende Liste. Mit `prefers-reduced-motion` gibt es keine Überblendung. Im Druck wird daraus eine Tabelle *Minute · Phase · Inhalt · Sozialform*. Bei sehr schmalen Bildschirmen (< 360 px) werden Segmentbeschriftungen unter 10 Minuten nur als Zahl gezeigt, der volle Text steht in der Legende.

### Design Tokens

**Farben – Hell**
| Token | Hex | Verwendung |
|---|---|---|
| `--c-bg` | `#F6F7F8` | Seitenhintergrund |
| `--c-surface` | `#FFFFFF` | Flächen, Formulare |
| `--c-text` | `#14171A` | Fließtext (≈ 17:1) |
| `--c-text-muted` | `#4A5058` | Sekundärtext (≈ 8:1) |
| `--c-line` | `#D2D6DB` | Linien, Rahmen |
| `--c-accent` | `#0A58CA` | Links, Buttons, aktiv (≈ 6,4:1) |
| `--c-accent-hover` | `#08479F` | Hover |
| `--c-on-accent` | `#FFFFFF` | Text auf Akzent |
| `--c-note` | `#8A4B00` | Hinweis-Text/Symbol (≈ 6,8:1) |
| `--c-note-bg` | `#FFF3E3` | Hinweis-Fläche |
| `--c-phase-1…4` | `#DCE6F5` `#B9CDEB` `#8FAEDC` `#5E86C2` | Stundenleiste (Helligkeitsstufen) |

**Farben – Dunkel**
| Token | Hex |
|---|---|
| `--c-bg` | `#0F1113` |
| `--c-surface` | `#171A1E` |
| `--c-text` | `#ECEEF0` |
| `--c-text-muted` | `#A8AEB6` |
| `--c-line` | `#2D3238` |
| `--c-accent` | `#8AB4FF` |
| `--c-accent-hover` | `#B0CCFF` |
| `--c-on-accent` | `#0A1324` |
| `--c-note` | `#FFB866` |
| `--c-note-bg` | `#2B1F0F` |
| `--c-phase-1…4` | `#1E2836` `#2A3A52` `#3A5378` `#5374A6` |

Regel: Rot und Grün kommen nicht vor. Status (erledigt, richtig, falsch) wird immer **Symbol + Wort** angezeigt.

**Typografie**
- Schrift: `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Zahlen tabellarisch (`font-variant-numeric: tabular-nums`) in Leiste und Tabellen.
- Schnitte: 400 und 600, sonst nichts.
- Fluid-Skala (`clamp`, 320 → 1280 px):
  `--step--1` 0.875→0.9375rem · `--step-0` 1→1.125rem · `--step-1` 1.2→1.375rem · `--step-2` 1.44→1.75rem · `--step-3` 1.73→2.5rem
- Zeilenhöhe 1.55 (Text), 1.2 (Überschriften) · max. Zeilenlänge 68ch

**Abstände** – 4-px-Basis: `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-6` 24 · `--s-8` 32 · `--s-12` 48 · `--s-16` 64 px
**Radien** – `--r-s` 4 px (Inputs, Buttons) · `--r-m` 6 px (Boxen). **Keine Schatten**, nur Linien.
**Fokus** – 3 px Outline `--c-accent`, 2 px Abstand, überall gleich
**Motion** – `--t-fast` 120 ms · `--t-base` 200 ms · Easing `cubic-bezier(.2,0,0,1)`. Nur für Zustandswechsel, keine Scroll-Animationen. `prefers-reduced-motion: reduce` → alle Dauern 0.

### Komponenten
SkipLink · SiteHeader · HelpLink · AudienceTabs · ThemeSwitch · SideNav · Breadcrumb · **SentenceForm** · ResumeLine · QuickList · SeriesList (mit MiniTimeline) · **Stundenleiste** · FactSheet (Beipackzettel) · Notice (Hinweis) · BlockItem · AlternativeToggle · Button (primär / sekundär / Text) · FilterBar · DirectoryItem · Glossary · GameShell (Frage, Optionen, Rückmeldung, Auswertung) · SiteFooter · PrintLayout

### Tech-Stack & Umsetzungsformat
- **Statische Dateien:** HTML-Seiten + `assets/styles.css` + `assets/app.js` + `assets/data.js` (Inhalte als JS-Objekt, damit alles auch per Doppelklick über `file://` läuft, wo `fetch` blockiert wäre).
- **Kein Framework, kein Build, keine Bibliothek, keine externen Requests.**
- **Warum:** Es ist sofort lauffähig und prüfbar, es ist auf jedem Static Hosting veröffentlichbar, und die Struktur (Datenmodell, Komponenten, Tokens) lässt sich direkt nach **Astro + Git-basiertem CMS** übertragen (siehe Ausbaustufen).
- **Ehrlich benannt:** Header und Navigation stehen in jeder HTML-Datei einmal (Duplikat). Das ist im Prototyp akzeptabel und wird in Astro zu einer Komponente.

### Inhalte
| Quelle | Inhalte |
|---|---|
| **Aus dem Briefing** | Struktur, Zielgruppen, Navigation, Konfigurator-Fragen, 45-Minuten-Logik, Reihenprinzip, Spiele-Idee, Gestaltungsprinzipien |
| **Textet das Team** (markiert `<!-- TEXT PRÜFEN -->`) | Alle Demo-Einheiten. Lehrkräfte: Reihe mit 8 Stunden (1 Was ist Hass im Netz? · 2 Was Hass mit Menschen macht · 3 Meinung oder Hetze? · 4 Wie Hass sich verbreitet · 5 Was ist strafbar? · 6 Gegenrede · 7 Melden, sichern, Hilfe holen · 8 Unsere Regeln für den Klassenchat) plus Einheit „Nach einem Vorfall“. Eltern: 4 Gesprächseinheiten à 20 Min. Fachkräfte: 4 Bausteine à 50 Min. Schüler:innen: 3 Selbstlern-Einheiten à 10 Min. Dazu Spieltexte, Glossar, Microcopy, Beispieleinträge externer Anbieter. |
| **Muss der Kunde liefern** | Plattformname + Logo · echtes, fachlich geprüftes Material · Namen der fachlich Verantwortlichen · verifizierte Beratungskontakte · echte Partner für externe Angebote · Impressum/Datenschutz (Rechtstexte) · Hosting-Entscheidung |

Logik des Konfigurators (Lehrkräfte):
- Das **Vorwissen** setzt den Startpunkt der Reihe (keins → Stunde 1, etwas → ab Stunde 2, viel → ab Stunde 4).
- Der **Umfang** begrenzt die Anzahl.
- Der **Anlass „Vorfall“** stellt die Einheit „Nach einem Vorfall“ an Position 1.
- Das **Alter** (5–7 / 8–10 / 11–13) wählt die Textvariante der Arbeitsaufträge.

### Akzeptanzkriterien
1. **Tastatur:** Alle Seiten, der Konfigurator, die Stundenleiste und beide Spiele sind vollständig per Tastatur bedienbar, mit sichtbarem Fokus (3 px) auf jedem interaktiven Element.
2. **Kontrast:** Fließtext ≥ 7:1, alle übrigen Texte und UI-Elemente ≥ 4,5:1 bzw. 3:1, jeweils im hellen **und** dunklen Modus.
3. **Farbe nie allein:** Status, Spielrückmeldung und Stundenleiste bleiben in Graustufen und bei Deuteranopie/Protanopie eindeutig, weil immer Text oder Symbol dabei ist.
4. **60 Sekunden:** Von der Startseite zu einer fertigen Einheit sind es höchstens 4 Eingaben und 2 Klicks.
5. **Teilbarkeit:** Die URL einer Reihe erzeugt in einem frischen Browser exakt dieselbe Reihe.
6. **Wiederkehr:** Nach dem Markieren von Stunde 1 als erledigt und einem Neuladen zeigen Startseite und Bereich „Weiter mit Stunde 2“.
7. **Druck:** Eine Einheit druckt als A4 ohne Navigation, mit Stundenleiste als Tabelle.
8. **Dark Mode:** Er folgt der Systemeinstellung, ist manuell umschaltbar, bleibt gespeichert, und beim Laden blitzt nichts weiß auf.
9. **Null Drittanbieter:** Im Netzwerk-Tab erscheinen keine externen Requests, und kein Layout-Shift entsteht durch Schriften.
10. **Responsiv & bewegungsarm:** Ab 320 px gibt es kein horizontales Scrollen. Alle Navigationspunkte sind auf Mobil erreichbar, und mit `prefers-reduced-motion` gibt es keine Animationen.

---

### Hinweis zum Studio-Kontext
🎯 **MARA:** Der Studio-Kontext ist leer. Am meisten würde uns **echtes Material** helfen, auch nur eine reale Unterrichtsstunde. Dann eicht das Team das Inhaltsmodell und den Beipackzettel an der Wirklichkeit statt an unseren Annahmen. Danach folgt deine **Gestaltungs-DNA**, damit „nüchtern“ nach dir aussieht und nicht nach uns.
