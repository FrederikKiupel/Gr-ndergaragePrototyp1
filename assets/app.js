/* =====================================================================
   NETZKLAR – app.js
   Sparsames Vanilla-JavaScript, keine Bibliotheken, keine Netzwerkzugriffe.
   Jede Funktion verbessert eine Seite, die auch ohne JavaScript lesbar ist.
   Gespeichert wird nur lokal im Browser (localStorage), Schlüssel "nk-…".
   ===================================================================== */
(function () {
  'use strict';

  var D = window.NK_DATA || { zielgruppen: {}, einheiten: {}, spiele: {} };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (z) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[z];
    });
  }

  /* ---------- Speicher (fehlertolerant, z. B. im privaten Modus) ---- */
  var speicher = {
    get: function (key, fallback) {
      try { var v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set: function (key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignorieren */ } },
    del: function (key) { try { localStorage.removeItem(key); } catch (e) { /* ignorieren */ } }
  };
  function erledigtSet() { return new Set(speicher.get('nk-erledigt', [])); }

  var PLURAL = { Stunde: 'Stunden', 'Gespräch': 'Gespräche', Baustein: 'Bausteine', Einheit: 'Einheiten' };

  async function kopieren(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
    } catch (e) { /* Fallback unten */ }
    try {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (e) { return false; }
  }

  function melden(el, text) {
    if (!el) return;
    el.textContent = '';
    window.setTimeout(function () { el.textContent = text; }, 60);
  }

  function neuAnimieren(el, klasse) {
    klasse = klasse || 'getauscht';
    el.classList.remove(klasse);
    void el.offsetWidth; // Reflow, damit die Animation erneut startet
    el.classList.add(klasse);
  }

  /* ---------- 1. Hell / Dunkel / Automatisch ------------------------ */
  function modus() {
    var btn = $('[data-modus]');
    if (!btn) return;
    var wert = $('[data-modus-wert]', btn);
    var namen = { system: 'Automatisch', light: 'Hell', dark: 'Dunkel' };
    var folge = { system: 'light', light: 'dark', dark: 'system' };
    var aktuell = document.documentElement.dataset.theme || 'system';
    wert.textContent = namen[aktuell];
    btn.addEventListener('click', function () {
      aktuell = folge[aktuell];
      try {
        if (aktuell === 'system') { delete document.documentElement.dataset.theme; localStorage.removeItem('nk-theme'); }
        else { document.documentElement.dataset.theme = aktuell; localStorage.setItem('nk-theme', aktuell); }
      } catch (e) {
        if (aktuell === 'system') delete document.documentElement.dataset.theme;
        else document.documentElement.dataset.theme = aktuell;
      }
      wert.textContent = namen[aktuell];
    });
  }

  /* ---------- 2. Zielgruppe als Kontext ----------------------------- */
  function zielgruppe() {
    $$('.reiter a[data-zg], [data-zg-link]').forEach(function (a) {
      a.addEventListener('click', function () { speicher.set('nk-zielgruppe', a.dataset.zg || a.dataset.zgLink); });
    });
    var aktiv = $('.reiter a[aria-current="page"]');
    if (aktiv) speicher.set('nk-zielgruppe', aktiv.dataset.zg);
    var zg = speicher.get('nk-zielgruppe', null);
    if (!zg || !D.zielgruppen[zg]) return;
    if (!$('.reiter a[aria-current]')) {
      var tab = $('.reiter a[data-zg="' + zg + '"]');
      if (tab) tab.setAttribute('aria-current', 'true');
    }
    var mat = $('a[data-mit-zielgruppe]');
    if (mat) mat.href = 'material.html?fuer=' + encodeURIComponent(zg);
  }

  /* ---------- 3. Reihen-Logik pro Zielgruppe ------------------------ */
  // Alter in Jahren → Anpassungsstufe der Einheiten (u / m / o)
  function stufeAus(alter, grenzeU, grenzeM) {
    var j = parseInt(alter, 10);
    if (isNaN(j)) return 'm';
    return j <= grenzeU ? 'u' : (j <= grenzeM ? 'm' : 'o');
  }
  var STUFE_SCHULE = { u: 'Schüler:innen bis 12 Jahre', m: '13- bis 15-Jährige', o: 'Schüler:innen ab 16 Jahren' };

  var REIHEN = {
    lehrkraefte: function (p) {
      var HASS = ['lk-1', 'lk-2', 'lk-3', 'lk-4', 'lk-5', 'lk-6', 'lk-7', 'lk-8'];
      var FAKE = ['lk-9', 'lk-10', 'lk-11', 'lk-12'];
      var NAME = { hass: 'Hass im Netz verstehen und handeln', fake: 'Fake News erkennen' };
      var thema = { hass: 1, fake: 1, beides: 1 }[p.thema] ? p.thema : 'hass';
      var n = Math.min(10, Math.max(1, parseInt(p.umfang, 10) || 1));
      var startH = { keins: 0, etwas: 1, viel: 3 }[p.vorwissen] || 0;
      var startF = { keins: 0, etwas: 1, viel: 2 }[p.vorwissen] || 0;
      var notizen = [];
      var haupt, ersatz;
      if (thema === 'fake') { haupt = FAKE.slice(startF); ersatz = HASS.slice(startH); }
      else if (thema === 'beides') {
        var h = HASS.slice(startH), f = FAKE.slice(startF);
        haupt = [];
        for (var i = 0; i < Math.max(h.length, f.length); i++) { if (h[i]) haupt.push(h[i]); if (f[i]) haupt.push(f[i]); }
        ersatz = [];
        notizen.push('Die Stunden zu Hass im Netz und zu Fake News wechseln sich ab.');
      } else { haupt = HASS.slice(startH); ersatz = FAKE.slice(startF); }
      if (startH > 0) {
        notizen.push('Weil die Klasse ' + (p.vorwissen === 'viel' ? 'schon viel' : 'etwas') + ' Vorwissen hat, entfallen die ersten Grundlagenstunden.');
      }
      var ids = haupt.slice();
      if (p.anlass === 'vorfall') {
        ids.unshift('lk-vorfall');
        notizen.push('Wegen des Vorfalls beginnt die Reihe mit einer Stunde, die ihn behutsam aufgreift. Bitte lesen Sie dort zuerst den Hinweis.');
      }
      if (ids.length < n && ersatz.length) {
        var dazu = ersatz.slice(0, n - ids.length);
        ids = ids.concat(dazu);
        notizen.push('Die Reihe „' + NAME[thema] + '“ hat ' + haupt.length + ' Stunden. Für ' + n + ' Stunden ' +
          (dazu.length === 1 ? 'kommt eine Stunde' : 'kommen ' + dazu.length + ' Stunden') + ' aus der Reihe „' + NAME[thema === 'fake' ? 'hass' : 'fake'] + '“ dazu.');
      }
      ids = ids.slice(0, n);
      if (p.anlass === 'projekt' && n > 1) {
        var ziel = thema === 'fake' ? 'lk-12' : 'lk-8';
        // Die Ergebnis-Stunde steht immer am Ende
        ids = ids.filter(function (x) { return x !== ziel; }).slice(0, n - 1).concat([ziel]);
        notizen.push(ziel === 'lk-8' ? 'Für die Projektwoche endet die Reihe mit eigenen Klassenchat-Regeln als Ergebnis.' : 'Für die Projektwoche endet die Reihe mit einer gemeinsamen Regel: „Erst prüfen, dann teilen.“');
      }
      if (ids.length < n) notizen.push('Mit diesen Angaben gibt es ' + ids.length + ' passende Stunden.');
      var anpassung = stufeAus(p.alter, 12, 15);
      notizen.push('In jeder Stunde ist unter „Anpassung“ der Hinweis für ' + STUFE_SCHULE[anpassung] + ' markiert (' + (parseInt(p.alter, 10) || 13) + ' Jahre).');
      return { ids: ids, notizen: notizen, anpassung: anpassung };
    },
    eltern: function (p) {
      var folgen = {
        praevention: ['el-1', 'el-2', 'el-3', 'el-4', 'el-5'],
        vorfall: ['el-3', 'el-2', 'el-1', 'el-4', 'el-5'],
        fake: ['el-5', 'el-1', 'el-2', 'el-3', 'el-4']
      };
      var seq = folgen[p.anlass] || folgen.praevention;
      var notizen = [];
      if (p.anlass === 'vorfall') notizen.push('Weil schon etwas passiert ist, beginnt die Reihe mit dem Gespräch „Wenn es passiert ist“.');
      if (p.anlass === 'fake') notizen.push('Die Reihe beginnt mit dem Gespräch über Kettenbriefe, Gerüchte und Fake News.');
      var alter = parseInt(p.kind, 10);
      notizen.push('In jedem Gespräch ist unter „Anpassung“ der Hinweis für das Alter Ihres Kindes markiert' + (isNaN(alter) ? '' : ' (' + alter + ' Jahre)') + '.');
      var n = p.umfang === 'alle' ? seq.length : (parseInt(p.umfang, 10) || 1);
      return { ids: seq.slice(0, n), notizen: notizen, anpassung: stufeAus(p.kind, 9, 13) };
    },
    fachkraefte: function (p) {
      var seq = { ausuebende: ['fk-4'], verschwoerung: ['fk-5'] }[p.thema] || ['fk-1', 'fk-2', 'fk-3'];
      var notizen = [];
      if (p.thema === 'ausuebende') notizen.push('Für die Arbeit mit Hassverbreitenden gibt es bisher einen Baustein.');
      if (p.thema === 'verschwoerung') notizen.push('Für die Arbeit mit Verschwörungsglauben gibt es bisher einen Baustein.');
      notizen.push('In jedem Baustein ist der Hinweis für ' + (p.setting === 'gruppe' ? 'die Gruppenarbeit' : 'die Einzelberatung') + ' markiert.');
      return { ids: p.umfang === '1' ? seq.slice(0, 1) : seq, notizen: notizen, anpassung: p.setting };
    },
    schueler: function (p) {
      var alle = ['sc-1', 'sc-2', 'sc-3', 'sc-4'];
      var zuerst = { wissen: 'sc-1', betroffen: 'sc-2', helfen: 'sc-3', fake: 'sc-4' }[p.thema] || 'sc-1';
      var ids = [zuerst].concat(alle.filter(function (id) { return id !== zuerst; }));
      var notizen = ['Fang mit der ersten Einheit an. Die anderen passen gut dazu.'];
      if (p.thema === 'betroffen') notizen.unshift('Wenn es dich gerade selbst trifft: Oben findest du jederzeit „Hilfe bei Hass im Netz“.');
      return { ids: ids, notizen: notizen, anpassung: stufeAus(p.alter, 12, 15) };
    }
  };

  /* ---------- Bausteine: Leisten, Fortschritt, Zustände ------------- */
  var BEWEGUNG = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ZUSTAND = {
    fertig: { sym: '✓', wort: 'Erledigt' },
    jetzt:  { sym: '→', wort: 'Als Nächstes' },
    offen:  { sym: '○', wort: 'Offen' }
  };
  function zwei(n) { return (n < 10 ? '0' : '') + n; }
  function mehrzahl(info, n) { return n === 1 ? info.einheit : (PLURAL[info.einheit] || info.einheit); }

  function stand(ids) {
    var erledigt = erledigtSet();
    var fertig = ids.filter(function (id) { return erledigt.has(id); });
    var jetzt = null;
    for (var i = 0; i < ids.length; i++) { if (!erledigt.has(ids[i])) { jetzt = ids[i]; break; } }
    var minGesamt = 0, minFertig = 0;
    ids.forEach(function (id) {
      var e = D.einheiten[id];
      if (!e) return;
      minGesamt += e.dauer;
      if (erledigt.has(id)) minFertig += e.dauer;
    });
    return {
      erledigt: erledigt, fertig: fertig.length, gesamt: ids.length, jetzt: jetzt,
      minFertig: minFertig, minGesamt: minGesamt,
      zustand: function (id) { return erledigt.has(id) ? 'fertig' : (id === jetzt ? 'jetzt' : 'offen'); }
    };
  }

  function miniLeiste(e) {
    var spalten = e.bloecke.map(function (b) { return b.min + 'fr'; }).join(' ');
    var segs = e.bloecke.map(function (b, i) { return '<span data-phase="' + (i + 1) + '"></span>'; }).join('');
    var text = e.bloecke.map(function (b) { return b.phase + ' ' + b.min + ' Min.'; }).join(', ');
    return '<span class="mini-leiste" style="grid-template-columns:' + spalten + '" aria-hidden="true">' + segs + '</span>' +
      '<span class="vh">Ablauf: ' + esc(text) + '</span>';
  }

  /* Segmentbalken einer Reihe: Breite = Minuten, Zustand = Füllung + Symbol + Text */
  function balkenHtml(zg, ids, opt) {
    opt = opt || {};
    var info = D.zielgruppen[zg];
    var st = stand(ids);
    var klassen = 'balken' + (opt.klein ? ' balken--klein' : '') + (opt.mini ? ' balken--mini' : '');
    return '<ol class="' + klassen + '"' + (opt.links === false ? ' aria-hidden="true"' : '') + '>' + ids.map(function (id, i) {
      var e = D.einheiten[id];
      if (!e) return '';
      var z = st.zustand(id);
      var cls = 'ist-' + z + (id === opt.hier ? ' ist-hier' : '') + (id === opt.neu ? ' ist-neu' : '');
      var sicht = '<span class="balken__sym" aria-hidden="true">' + (z === 'fertig' ? '✓' : (z === 'jetzt' ? '→' : '')) + '</span>' +
        (opt.mini ? '' : '<span class="balken__name" aria-hidden="true">' + (i + 1) + (opt.titel ? ' ' + esc(e.titel) : '') + '</span>');
      var vh = '<span class="vh">' + esc(info.einheit + ' ' + (i + 1) + ': ' + e.titel + ' – ' + ZUSTAND[z].wort) +
        (id === opt.hier ? ' (diese Seite)' : '') + '</span>';
      var innen = opt.links === false
        ? '<span class="balken__seg ' + cls + '">' + sicht + '</span>'
        : '<a class="' + cls + '" href="einheit-' + id + '.html"' + (id === opt.hier ? ' aria-current="page"' : '') + '>' + sicht + vh + '</a>';
      return '<li style="flex:' + e.dauer + ' 1 0">' + innen + '</li>';
    }).join('') + '</ol>';
  }

  function legendeHtml() {
    return '<ul class="fortschritt__legende" aria-hidden="true">' +
      '<li><i class="l-fertig"></i>Erledigt</li><li><i class="l-jetzt"></i>Als Nächstes</li><li><i class="l-offen"></i>Offen</li></ul>';
  }

  function fortschrittHtml(zg, ids, opt) {
    var info = D.zielgruppen[zg];
    var st = stand(ids);
    var text = st.minFertig + ' von ' + st.minGesamt + ' Minuten' +
      (st.jetzt && st.fertig ? ' · als Nächstes: ' + esc(D.einheiten[st.jetzt].titel) : '') +
      (!st.jetzt && st.gesamt ? ' · alles geschafft' : '');
    return '<div class="fortschritt">' +
      '<div><p class="fortschritt__zahl">' + st.fertig + ' von ' + st.gesamt + ' ' + esc(mehrzahl(info, st.gesamt)) + ' erledigt</p>' +
      '<p class="fortschritt__text">' + text + '</p></div>' +
      balkenHtml(zg, ids, { titel: true, neu: opt && opt.neu }) + legendeHtml() + '</div>';
  }

  function reiheHtml(zg, ergebnis, opt) {
    opt = opt || {};
    var info = D.zielgruppen[zg];
    var st = stand(ergebnis.ids);
    var eintraege = ergebnis.ids.map(function (id, i) {
      var e = D.einheiten[id];
      if (!e) return '';
      var z = st.zustand(id);
      return '<li class="reihe__eintrag ist-' + z + '" style="--i:' + i + '">' +
        '<span class="reihe__knoten" aria-hidden="true">' + (z === 'fertig' ? '✓' : (i + 1)) + '</span>' +
        '<div class="reihe__inhalt"><p class="zeile__vor">' + esc(info.einheit) + ' ' + (i + 1) + ' · ' + e.dauer + ' Min.</p>' +
        '<h3><a href="einheit-' + id + '.html">' + esc(e.titel) + '</a></h3>' +
        '<p>' + esc(e.kurz) + '</p>' + miniLeiste(e) + '</div>' +
        '<div class="reihe__seite"><span class="plakette plakette--' + z + '"><span aria-hidden="true">' + ZUSTAND[z].sym + '</span>' + ZUSTAND[z].wort + '</span>' +
        '<button class="abhaken" type="button" data-abhaken="' + id + '" aria-pressed="' + (z === 'fertig') + '">' +
        'Abhaken<span class="vh">: ' + esc(e.titel) + '</span></button></div></li>';
    }).join('');
    var notizen = ergebnis.notizen.map(function (t) { return '<li class="reihe__notiz">' + esc(t) + '</li>'; }).join('');
    return '<div class="reihe__kopf"><p class="label label--gedimmt">' + st.gesamt + ' ' + esc(mehrzahl(info, st.gesamt)) +
      ' · zusammen ' + st.minGesamt + ' Minuten</p></div>' +
      fortschrittHtml(zg, ergebnis.ids, { neu: opt.neu }) +
      '<ul class="reihe__notizen">' + notizen + '</ul>' +
      '<ol class="reihe__liste' + (opt.ruhig ? ' ohne-anim' : '') + '">' + eintraege + '</ol>' +
      '<div class="aktionen">' +
      '<button class="knopf knopf--zweit" type="button" data-reihe-kopieren>Link zu dieser Auswahl kopieren</button>' +
      '<button class="knopf knopf--text" type="button" data-reihe-zuruecksetzen>Auswahl zurücksetzen</button>' +
      '</div><p class="status" role="status" data-reihe-status></p>';
  }

  /* Zustand in den Listen „Alle Einheiten im Überblick“ */
  function listenStatus() {
    var marken = $$('[data-status-fuer]');
    if (!marken.length) return;
    var erledigt = erledigtSet();
    var naechste = {};
    Object.keys(D.zielgruppen).forEach(function (zg) {
      var r = speicher.get('nk-reihe-' + zg, null);
      if (r && r.ids) { var st = stand(r.ids); if (st.jetzt) naechste[st.jetzt] = true; }
    });
    marken.forEach(function (el) {
      var id = el.dataset.statusFuer;
      var z = erledigt.has(id) ? 'fertig' : (naechste[id] ? 'jetzt' : null);
      el.innerHTML = z ? '<span class="plakette plakette--' + z + '"><span aria-hidden="true">' + ZUSTAND[z].sym + '</span>' + ZUSTAND[z].wort + '</span>' : '';
    });
  }

  function erledigtUmschalten(id) {
    var set = erledigtSet();
    var fertig = !set.has(id);
    if (fertig) set.add(id); else set.delete(id);
    speicher.set('nk-erledigt', Array.from(set));
    return fertig;
  }

  /* ---------- 4. Auswahl-Chips: Select → Chip + Auswahlfeld --------- */
  var offen = null;

  function schliessen(fokus) {
    if (!offen) return;
    var o = offen;
    offen = null;
    o.panel.remove();
    o.schleier.remove();
    o.chip.setAttribute('aria-expanded', 'false');
    window.removeEventListener('resize', o.beiResize);
    if (fokus) o.chip.focus();
  }

  function fussText(o) { return o.textContent + (o.dataset.hinweis ? ' · ' + o.dataset.hinweis : ''); }

  function chip(select) {
    var huelle = select.parentElement;
    if (!huelle || huelle.classList.contains('ist-verbessert')) return;
    huelle.classList.add('ist-verbessert');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    var label = select.id ? $('label[for="' + select.id + '"]') : null;
    var name = label ? label.textContent.trim() : select.name;
    var knopf = document.createElement('button');
    knopf.type = 'button';
    knopf.className = 'chip';
    knopf.id = 'chip-' + (select.id || select.name);
    knopf.setAttribute('aria-haspopup', 'dialog');
    knopf.setAttribute('aria-expanded', 'false');
    knopf.innerHTML = '<span class="chip__wert"></span><span class="chip__pfeil" aria-hidden="true"></span>';
    select.insertAdjacentElement('afterend', knopf);
    if (label) label.htmlFor = knopf.id;
    var wert = $('.chip__wert', knopf);

    function sync(animieren) {
      var o = select.options[select.selectedIndex];
      var text = o ? o.textContent : '';
      var alt = wert.textContent;
      wert.textContent = text;
      knopf.setAttribute('aria-label', name + ': ' + text);
      if (animieren && alt !== text) neuAnimieren(knopf, 'ist-neu');
    }
    select._chipSync = sync;
    sync(false);

    function anwenden(i) {
      if (i === select.selectedIndex) return;
      select.selectedIndex = i;
      sync(true);
      select.dispatchEvent(new Event('change', { bubbles: true }));
      if (offen) {
        var fuss = $('[data-wf-fuss]', offen.panel);
        if (fuss) fuss.textContent = fussText(select.options[i]);
      }
    }

    function oeffnen() {
      schliessen(false);
      var opts = Array.prototype.slice.call(select.options);
      var kacheln = opts.length > 5 && opts.every(function (o) { return /\d/.test(o.textContent); });
      var gruppe = 'wf-' + knopf.id;
      var panel = document.createElement('div');
      panel.className = 'wahlfeld' + (kacheln ? ' wahlfeld--kacheln' : '');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-labelledby', gruppe + '-t');
      panel.innerHTML = '<div class="wahlfeld__kopf"><p class="label" id="' + gruppe + '-t">' + esc(name) + '</p>' +
        '<button class="wahlfeld__zu" type="button" aria-label="Schließen">×</button></div>' +
        '<fieldset><legend class="vh">' + esc(name) + '</legend><div class="wahlfeld__liste">' +
        opts.map(function (o, i) {
          var kurz = kacheln ? (o.textContent.match(/\d+/) || [o.textContent])[0] : o.textContent;
          return '<label class="wahl-opt"><input type="radio" name="' + gruppe + '" value="' + i + '"' +
            (i === select.selectedIndex ? ' checked' : '') + (kacheln ? ' aria-label="' + esc(fussText(o)) + '"' : '') + '>' +
            '<span class="wahl-opt__inhalt"><span class="wahl-opt__nr" aria-hidden="true">' + (i + 1) + '</span>' +
            '<span class="wahl-opt__text">' + esc(kurz) +
            (o.dataset.hinweis ? '<span class="wahl-opt__hinweis">' + esc(o.dataset.hinweis) + '</span>' : '') + '</span>' +
            '<span class="wahl-opt__haken" aria-hidden="true"></span></span></label>';
        }).join('') + '</div></fieldset>' +
        (kacheln ? '<p class="wahlfeld__fuss" data-wf-fuss aria-hidden="true">' + esc(fussText(select.options[select.selectedIndex])) + '</p>' : '');
      var schleier = document.createElement('div');
      schleier.className = 'wahlfeld-schleier';
      document.body.appendChild(schleier);
      document.body.appendChild(panel);

      function platzieren() {
        if (window.matchMedia('(max-width: 35.99em)').matches) return;
        var r = knopf.getBoundingClientRect();
        var b = panel.offsetWidth, h = panel.offsetHeight;
        var links = Math.min(Math.max(8, r.left), document.documentElement.clientWidth - b - 8);
        var oben = r.bottom + 8;
        if (oben + h > window.innerHeight - 8 && r.top - h - 8 > 8) oben = r.top - h - 8;
        panel.style.left = (links + window.scrollX) + 'px';
        panel.style.top = (oben + window.scrollY) + 'px';
      }
      platzieren();
      var beiResize = function () { schliessen(false); };
      window.addEventListener('resize', beiResize);
      offen = { panel: panel, schleier: schleier, chip: knopf, beiResize: beiResize };
      knopf.setAttribute('aria-expanded', 'true');

      panel.addEventListener('change', function (ev) {
        if (ev.target.name === gruppe) anwenden(parseInt(ev.target.value, 10));
      });
      // Maus/Touch: Auswahl übernimmt und schließt. Pfeiltasten wechseln nur (click mit detail 0).
      panel.addEventListener('click', function (ev) {
        var opt = ev.target.closest('.wahl-opt');
        if (!opt || ev.target.tagName !== 'INPUT' || ev.detail === 0) return;
        anwenden(parseInt(ev.target.value, 10));
        window.setTimeout(function () { schliessen(true); }, BEWEGUNG ? 140 : 0);
      });
      panel.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape') { ev.preventDefault(); schliessen(true); }
        else if (ev.key === 'Enter' && ev.target.tagName === 'INPUT') { ev.preventDefault(); schliessen(true); }
        else if (ev.key === 'Tab') {
          // Fokus bleibt im Feld: Schließen-Knopf ↔ Auswahl
          var ziele = [$('.wahlfeld__zu', panel), $('input:checked', panel) || $('input', panel)];
          var i = ziele.indexOf(document.activeElement);
          ev.preventDefault();
          ziele[(i + (ev.shiftKey ? ziele.length - 1 : 1)) % ziele.length].focus();
        }
      });
      $('.wahlfeld__zu', panel).addEventListener('click', function () { schliessen(true); });
      schleier.addEventListener('click', function () { schliessen(true); });
      ($('input:checked', panel) || $('input', panel)).focus({ preventScroll: true });
    }

    knopf.addEventListener('click', function () {
      if (offen && offen.chip === knopf) schliessen(true); else oeffnen();
    });
    knopf.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); oeffnen(); }
    });
  }

  function chips() {
    $$('.wahl select, .filter select').forEach(chip);
    $$('form').forEach(function (f) {
      f.addEventListener('reset', function () { window.setTimeout(function () { chipsSync(f, true); }, 0); });
    });
  }
  function chipsSync(root, animieren) {
    $$('select', root).forEach(function (s) { if (s._chipSync) s._chipSync(animieren); });
  }

  /* ---------- 5. Satz-Konfigurator im Bereich (live) ---------------- */
  function konfigurator() {
    var form = $('[data-konfigurator]');
    if (!form) return;
    var zg = form.dataset.konfigurator;
    var ausgabe = $('[data-reihe-ausgabe]');
    var felder = $$('select[name]', form);
    var url = new URLSearchParams(location.search);
    var hatUrl = felder.some(function (el) { return url.has(el.name); });
    var gespeichert = speicher.get('nk-reihe-' + zg, null);
    var quelle = null;
    if (hatUrl) { quelle = {}; url.forEach(function (v, k) { quelle[k] = v; }); }
    else if (gespeichert && gespeichert.params) quelle = gespeichert.params;

    if (quelle) {
      felder.forEach(function (el) {
        var v = quelle[el.name];
        if (v != null && Array.prototype.some.call(el.options, function (o) { return o.value === v; })) el.value = v;
      });
    }

    // Lehrkräfte: Das Alter folgt der Klassenstufe, bis es von Hand geändert wird.
    if (zg === 'lehrkraefte') {
      var klasse = form.elements.klasse;
      var alter = form.elements.alter;
      var manuell = !!(quelle && quelle.alter);
      var angleichen = function () {
        alter.value = String(Math.min(19, Math.max(10, parseInt(klasse.value, 10) + 5)));
        if (alter._chipSync) alter._chipSync(true);
      };
      if (!manuell) angleichen();
      alter.addEventListener('change', function () { manuell = true; });
      klasse.addEventListener('change', function () { if (!manuell) angleichen(); });
      form.addEventListener('reset', function () { manuell = false; window.setTimeout(angleichen, 0); });
    }

    var letzte = null;
    function erstellen(opt) {
      opt = opt || {};
      var params = {};
      felder.forEach(function (el) { params[el.name] = el.value; });
      var ergebnis = REIHEN[zg](params);
      if (opt.speichern) {
        speicher.set('nk-reihe-' + zg, { params: params, ids: ergebnis.ids, anpassung: ergebnis.anpassung });
        speicher.set('nk-zielgruppe', zg);
        history.replaceState(null, '', location.pathname + '?' + new URLSearchParams(params).toString());
      }
      ausgabe.innerHTML = reiheHtml(zg, ergebnis, { ruhig: opt.ruhig, neu: opt.neu });
      letzte = ergebnis;
      verdrahten();
      weiterHinweis();
      listenStatus();
      if (opt.fokussieren) {
        var sektion = $('#reihe');
        sektion.focus({ preventScroll: true });
        sektion.scrollIntoView({ block: 'start' });
      }
    }

    function verdrahten() {
      var status = $('[data-reihe-status]', ausgabe);
      $('[data-reihe-kopieren]', ausgabe).addEventListener('click', function () {
        erstellen({ speichern: true, ruhig: true });
        kopieren(location.href.split('#')[0]).then(function (ok) {
          melden($('[data-reihe-status]', ausgabe), ok ? 'Link kopiert. Wer ihn öffnet, bekommt dieselbe Auswahl.' : 'Kopieren war nicht möglich. Kopieren Sie die Adresse aus der Adresszeile.');
        });
      });
      $('[data-reihe-zuruecksetzen]', ausgabe).addEventListener('click', function () {
        speicher.del('nk-reihe-' + zg);
        history.replaceState(null, '', location.pathname);
        form.reset();
        window.setTimeout(function () {
          erstellen({});
          melden($('[data-reihe-status]', ausgabe), 'Auswahl zurückgesetzt. Unten sehen Sie wieder die Vorschau.');
          var c = $('.chip', form);
          if (c) c.focus();
        }, 10);
      });
      $$('[data-abhaken]', ausgabe).forEach(function (b) {
        b.addEventListener('click', function () {
          var id = b.dataset.abhaken;
          var fertig = erledigtUmschalten(id);
          erstellen({ speichern: true, ruhig: true, neu: fertig ? id : null });
          var neu = $('[data-abhaken="' + id + '"]', ausgabe);
          if (neu) neu.focus();
          melden($('[data-reihe-status]', ausgabe), fertig ? 'Als erledigt gespeichert – auf diesem Gerät.' : 'Wieder als offen markiert.');
        });
      });
    }

    // Jede Änderung im Satz baut die Reihe sofort neu
    form.addEventListener('change', function () {
      speicher.del('nk-stufe-' + zg); // neue Angaben im Satz gelten wieder für die Inhalte der Einheiten
      erstellen({ speichern: true });
    });
    form.addEventListener('submit', function (ev) { ev.preventDefault(); erstellen({ speichern: true, fokussieren: true, ruhig: true }); });
    // Ohne gespeicherte Angaben: Vorschau mit den Standardwerten, noch nichts speichern
    erstellen({ speichern: !!quelle });
  }

  /* ---------- 6. Satz auf der Startseite ---------------------------- */
  var START = {
    lehrkraefte: {
      seite: 'lehrkraefte.html',
      was: { name: 'umfang', std: '4', optionen: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return [String(n), n + (n === 1 ? ' Stunde' : ' Stunden'), (n * 45) + ' Minuten']; }) },
      fuer: { name: 'klasse', std: '8', optionen: [5, 6, 7, 8, 9, 10, 11, 12, 13].map(function (k) { return [String(k), 'die ' + k + '. Klasse']; }) },
      params: function (was, fuer) { return { klasse: fuer, alter: String(parseInt(fuer, 10) + 5), vorwissen: 'keins', thema: 'hass', anlass: 'praevention', umfang: was }; }
    },
    schueler: {
      seite: 'schueler.html',
      was: { name: 'thema', std: 'wissen', optionen: [['wissen', 'Infos zu Hate Speech', 'Verstehen, worum es geht'], ['betroffen', 'Hilfe für mich', 'Wenn es dich selbst trifft'], ['helfen', 'Tipps, um zu helfen', 'Wie du dich gut einmischst'], ['fake', 'Tipps gegen Fake News', 'Prüfen, bevor du etwas teilst']] },
      fuer: { name: 'alter', std: '13', optionen: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(function (j) { return [String(j), 'mich, ' + j + ' Jahre']; }) },
      params: function (was, fuer) { return { thema: was, alter: fuer }; }
    },
    eltern: {
      seite: 'eltern.html',
      was: { name: 'umfang', std: '1', optionen: [['1', 'ein erstes Gespräch', '20 Minuten'], ['alle', 'alle 5 Gespräche', '100 Minuten']] },
      fuer: { name: 'kind', std: '11', optionen: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(function (j) { return [String(j), 'mein Kind, ' + j + ' Jahre']; }) },
      params: function (was, fuer) { return { umfang: was, kind: fuer, anlass: 'praevention' }; }
    },
    fachkraefte: {
      seite: 'fachkraefte.html',
      was: { name: 'thema', std: 'betroffene', optionen: [['betroffene', 'Material für Betroffene', '3 Bausteine zur Begleitung'], ['ausuebende', 'Material zur Täterarbeit', '1 Baustein'], ['verschwoerung', 'Material zu Verschwörungsglauben', '1 Baustein']] },
      fuer: { name: 'setting', std: 'einzel', optionen: [['einzel', 'die Einzelberatung'], ['gruppe', 'die Gruppenarbeit']] },
      params: function (was, fuer) { return { thema: was, setting: fuer, umfang: 'alle' }; }
    }
  };

  function startsatz() {
    var form = $('[data-startsatz]');
    if (!form) return;
    var rolle = $('[data-feld="rolle"]', form);
    var was = $('[data-feld="was"]', form);
    var fuer = $('[data-feld="fuer"]', form);
    var vorschau = $('[data-vorschau]', form);

    function fuellen(select, def) {
      select.name = def.name;
      select.innerHTML = def.optionen.map(function (o) {
        return '<option value="' + esc(o[0]) + '"' + (o[0] === def.std ? ' selected' : '') +
          (o[2] ? ' data-hinweis="' + esc(o[2]) + '"' : '') + '>' + esc(o[1]) + '</option>';
      }).join('');
    }
    function zeigen() {
      var zg = rolle.value;
      var cfg = START[zg];
      var info = D.zielgruppen[zg];
      var r = REIHEN[zg](cfg.params(was.value, fuer.value));
      var st = stand(r.ids);
      var erste = D.einheiten[r.ids[0]];
      vorschau.innerHTML = '<p class="label label--gedimmt">Das bekommst du</p>' +
        balkenHtml(zg, r.ids, { klein: true, titel: true, links: false }) +
        '<p class="vorschau__text"><strong>' + st.gesamt + ' ' + esc(mehrzahl(info, st.gesamt)) + '</strong> · ' + st.minGesamt +
        ' Min. · beginnt mit „' + esc(erste ? erste.titel : '') + '“</p>';
    }
    function anwenden(animieren) {
      var cfg = START[rolle.value];
      form.action = cfg.seite;
      fuellen(was, cfg.was);
      fuellen(fuer, cfg.fuer);
      chipsSync(form, animieren);
      zeigen();
    }
    var zg = speicher.get('nk-zielgruppe', null);
    if (zg && START[zg]) rolle.value = zg;
    anwenden(false); // Optionen inkl. Hinweisen aus START, passend zur Rolle
    rolle.addEventListener('change', function () { anwenden(true); });
    was.addEventListener('change', zeigen);
    fuer.addEventListener('change', zeigen);
    form.addEventListener('submit', function () { speicher.set('nk-zielgruppe', rolle.value); });
  }

  /* ---------- 7. „Weitermachen“-Karte -------------------------------- */
  function weiterHinweis() {
    $$('[data-weiter-hinweis]').forEach(function (el) {
      var nur = el.dataset.zielgruppe;
      var folge = nur ? [nur] : [speicher.get('nk-zielgruppe', null)].concat(Object.keys(D.zielgruppen));
      var gesehen = {};
      for (var k = 0; k < folge.length; k++) {
        var zg = folge[k];
        if (!zg || gesehen[zg] || !D.zielgruppen[zg]) continue;
        gesehen[zg] = true;
        var r = speicher.get('nk-reihe-' + zg, null);
        if (!r || !r.ids || !r.ids.length) continue;
        var st = stand(r.ids);
        if (!st.jetzt) continue;
        var idx = r.ids.indexOf(st.jetzt);
        if (nur && idx === 0) continue; // im Bereich steht die Reihe ohnehin direkt darunter
        var info = D.zielgruppen[zg];
        var e = D.einheiten[st.jetzt];
        if (!e) continue;
        el.innerHTML = '<p class="label">' + (idx > 0 ? 'Weitermachen' : (zg === 'schueler' ? 'Deine' : 'Ihre') + ' gespeicherte Auswahl') +
          (nur ? '' : ' · ' + esc(info.label)) + '</p>' +
          '<p class="weiter-hinweis__titel"><a href="einheit-' + e.id + '.html">' + esc(info.einheit) + ' ' + (idx + 1) + ': ' + esc(e.titel) + '</a></p>' +
          balkenHtml(zg, r.ids, { klein: true }) +
          '<p class="zeile__meta">' + st.fertig + ' von ' + st.gesamt + ' erledigt · auf diesem Gerät gespeichert</p>';
        el.hidden = false;
        return;
      }
      el.hidden = true;
      el.innerHTML = '';
    });
  }

  /* ---------- 8. Einheit: Reihe, Leiste, Alternativen, Erledigt ----- */
  function einheit() {
    var art = $('[data-einheit]');
    if (!art) return;
    var id = art.dataset.einheit;
    var zg = art.dataset.zielgruppe;
    var info = D.zielgruppen[zg];
    var du = zg === 'schueler';
    var status = $('[data-aktion-status]', art);
    var r = speicher.get('nk-reihe-' + zg, null);
    var idx = r && r.ids ? r.ids.indexOf(id) : -1;
    var stepper = $('[data-reihe-stepper]', art);

    function stepperZeigen(neu) {
      if (idx < 0) { stepper.innerHTML = ''; return; }
      var st = stand(r.ids);
      stepper.innerHTML = '<p class="fortschritt__text"><strong>' + st.fertig + ' von ' + st.gesamt + '</strong> ' +
        esc(mehrzahl(info, st.gesamt)) + ' ' + (du ? 'deiner Auswahl' : 'Ihrer Reihe') + ' erledigt</p>' +
        balkenHtml(zg, r.ids, { klein: true, hier: id, neu: neu });
    }

    if (idx > -1) {
      $('[data-pos]', art).textContent = info.einheit + ' ' + (idx + 1) + ' von ' + r.ids.length + ' · ' + info.reihe;
      var teile = [];
      if (idx > 0) {
        var v = D.einheiten[r.ids[idx - 1]];
        teile.push('<a href="einheit-' + v.id + '.html" rel="prev">← ' + esc(info.einheit) + ' ' + idx + ': ' + esc(v.titel) + '</a>');
      }
      if (idx < r.ids.length - 1) {
        var n = D.einheiten[r.ids[idx + 1]];
        teile.push('<a href="einheit-' + n.id + '.html" rel="next">' + esc(info.einheit) + ' ' + (idx + 2) + ': ' + esc(n.titel) + ' →</a>');
      }
      teile.push('<a href="' + info.seite + '#reihe">Zur Übersicht</a>');
      $('[data-nachbarn]').innerHTML = teile.join('');
      if (r.anpassung) {
        var li = $('.anpassung li[data-key="' + r.anpassung + '"]', art);
        if (li) {
          li.classList.add('ist-aktiv');
          var jahre = r.params && parseInt(r.params.alter || r.params.kind, 10);
          li.insertAdjacentHTML('beforeend', ' <span class="plakette plakette--jetzt">' + (du ? 'Deine' : 'Ihre') + ' Auswahl' + (jahre ? ' · ' + jahre + ' Jahre' : '') + '</span>');
        }
      }
    }
    stepperZeigen(null);

    // Alternativen gleicher Länge – die Zeitleiste bleibt bei voller Dauer
    var altStand = speicher.get('nk-alt', {});
    var gewaehlt = new Set(altStand[id] || []);
    $$('.block', art).forEach(function (block) {
      var i = parseInt(block.dataset.block, 10);
      var btn = $('[data-alt-toggle]', block);
      if (!btn) return;
      btn.removeAttribute('aria-pressed');
      var haupt = $('[data-variante="haupt"]', block);
      var alt = $('[data-variante="alt"]', block);
      function setzen(nimmAlt, animieren) {
        haupt.hidden = nimmAlt;
        alt.hidden = !nimmAlt;
        var aktiv = nimmAlt ? alt : haupt;
        var titel = $('.block__titel', aktiv).firstChild.textContent.trim();
        var sozial = aktiv.dataset.sozialform;
        $('[data-sozialform-anzeige]', block).textContent = sozial;
        var seg = $('.leiste__seg[data-seg="' + i + '"]', art);
        if (seg) { $('[data-seg-titel]', seg).textContent = titel; if (animieren) neuAnimieren(seg); }
        var zeile = $('tr[data-zeile="' + i + '"]', art);
        if (zeile) {
          $('[data-zeile-titel]', zeile).textContent = titel;
          $('[data-zeile-sozialform]', zeile).textContent = sozial;
        }
        if (animieren) neuAnimieren(aktiv);
        btn.textContent = nimmAlt ? btn.dataset.textAlt : btn.dataset.textHaupt;
      }
      if (gewaehlt.has(i)) setzen(true, false);
      btn.addEventListener('click', function () {
        var nimmAlt = !gewaehlt.has(i);
        if (nimmAlt) gewaehlt.add(i); else gewaehlt.delete(i);
        altStand[id] = Array.from(gewaehlt);
        speicher.set('nk-alt', altStand);
        setzen(nimmAlt, true);
        melden(status, nimmAlt ? 'Alternative eingesetzt. Zeitleiste und Druckansicht sind aktualisiert.' : 'Ursprünglicher Block wieder eingesetzt.');
      });
    });

    // Leiste: aktiver Block + Lesefortschritt in Minuten
    var e = D.einheiten[id];
    var bloecke = $$('.block', art);
    var segs = $$('.leiste__seg', art);
    var leiste = $('.leiste', art);
    var lauf = $('[data-lauf]', art);
    var jetztText = $('[data-jetzt]', art);
    if (e && bloecke.length && leiste && lauf) {
      var starts = [], s0 = 0;
      e.bloecke.forEach(function (b) { starts.push(s0); s0 += b.min; });
      var geplant = false;
      var letzterAktiv = -2;
      var messen = function () {
        geplant = false;
        var linie = leiste.getBoundingClientRect().bottom + 48;
        var aktiv = -1, anteil = 0;
        bloecke.forEach(function (b, i) {
          var rr = b.getBoundingClientRect();
          if (rr.top <= linie) { aktiv = i; anteil = Math.min(1, Math.max(0, (linie - rr.top) / rr.height)); }
        });
        // Am Ende der Seite erreicht der letzte Block die Leselinie nie – dann gilt er als erreicht
        var letzter = bloecke[bloecke.length - 1].getBoundingClientRect();
        if (aktiv > -1 && letzter.bottom <= window.innerHeight) { aktiv = bloecke.length - 1; anteil = 1; }
        var min = aktiv < 0 ? 0 : starts[aktiv] + anteil * e.bloecke[aktiv].min;
        lauf.style.setProperty('--p', (min / e.dauer).toFixed(4));
        jetztText.textContent = aktiv < 0 ? 'Min. 0 von ' + e.dauer : 'Min. ' + Math.round(min) + ' von ' + e.dauer + ' · ' + e.bloecke[aktiv].phase;
        if (aktiv !== letzterAktiv) {
          letzterAktiv = aktiv;
          segs.forEach(function (sg, i) { sg.classList.toggle('ist-aktiv', i === aktiv); });
          bloecke.forEach(function (b, i) { b.classList.toggle('ist-aktiv', i === aktiv); });
        }
      };
      var planen = function () { if (!geplant) { geplant = true; requestAnimationFrame(messen); } };
      window.addEventListener('scroll', planen, { passive: true });
      window.addEventListener('resize', planen);
      messen();
    }

    // Erledigt
    var btnErledigt = $('[data-erledigt]', art);
    var textErledigt = $('[data-erledigt-text]', btnErledigt) || btnErledigt;
    var weiter = $('[data-weiter]', art);
    function zeigeErledigt() {
      var fertig = erledigtSet().has(id);
      textErledigt.textContent = fertig ? (du ? 'Erledigt – wieder öffnen' : 'Erledigt – wieder als offen markieren') : 'Als erledigt markieren';
      btnErledigt.classList.toggle('ist-fertig', fertig);
      if (fertig && idx > -1) {
        var st = stand(r.ids);
        if (st.jetzt) {
          var n = D.einheiten[st.jetzt];
          var nIdx = r.ids.indexOf(st.jetzt);
          weiter.innerHTML = '<a class="weiter-karte" href="einheit-' + n.id + '.html"><span class="label">' +
            (nIdx > idx ? 'Als Nächstes' : 'Noch offen') + ' · ' + esc(info.einheit) + ' ' + (nIdx + 1) + ' von ' + r.ids.length + '</span>' +
            '<span class="weiter-karte__titel">' + esc(n.titel) + '</span><span class="weiter-karte__pfeil" aria-hidden="true">→</span></a>';
        } else {
          weiter.innerHTML = '<a class="weiter-karte weiter-karte--fertig" href="' + info.seite + '#reihe"><span class="label">' +
            (du ? 'Geschafft' : 'Reihe abgeschlossen') + ' · ' + r.ids.length + ' von ' + r.ids.length + '</span>' +
            '<span class="weiter-karte__titel">' + (du ? 'Du hast alles geschafft. Zur Übersicht' : 'Alle ' + esc(mehrzahl(info, r.ids.length)) + ' erledigt. Zur Übersicht') +
            '</span><span class="weiter-karte__pfeil" aria-hidden="true">→</span></a>';
        }
      } else {
        weiter.innerHTML = '';
      }
    }
    zeigeErledigt();
    btnErledigt.addEventListener('click', function () {
      var fertig = erledigtUmschalten(id);
      zeigeErledigt();
      stepperZeigen(fertig ? id : null);
      melden(status, fertig ? 'Als erledigt gespeichert – auf diesem Gerät.' : 'Wieder als offen markiert.');
    });

    var btnDruck = $('[data-drucken]', art);
    if (btnDruck) btnDruck.addEventListener('click', function () { window.print(); });

    $$('[data-kopieren]', art).forEach(function (b) {
      b.addEventListener('click', function () {
        var link = new URL(b.dataset.kopieren, location.href).href;
        kopieren(link).then(function (ok) {
          melden(status, ok ? 'Link kopiert: ' + link : 'Kopieren war nicht möglich. Der Link lautet: ' + link);
        });
      });
    });
  }

  /* ---------- Einheit: Inhalte nach Alter / Setting umschalten ------ */
  function stufen() {
    var art = $('[data-einheit]');
    if (!art) return;
    var knoepfe = $$('[data-stufe-wahl]', art);
    if (!knoepfe.length) return;
    var zg = art.dataset.zielgruppe;
    var keys = knoepfe.map(function (b) { return b.dataset.stufeWahl; });
    var r = speicher.get('nk-reihe-' + zg, null);
    var start = speicher.get('nk-stufe-' + zg, null);
    if (keys.indexOf(start) < 0) {
      start = r && keys.indexOf(r.anpassung) > -1 ? r.anpassung : (keys.indexOf('m') > -1 ? 'm' : keys[0]);
    }
    function setzen(k, merken) {
      var name = '';
      knoepfe.forEach(function (b) {
        var an = b.dataset.stufeWahl === k;
        b.setAttribute('aria-pressed', String(an));
        if (an) name = b.textContent;
      });
      $$('.anpassung li', art).forEach(function (li) { li.classList.toggle('ist-aktiv', li.dataset.key === k); });
      $$('[data-stufe]', art).forEach(function (el) {
        var passt = el.dataset.stufe.split(' ').indexOf(k) > -1;
        el.classList.toggle('ist-anders', !passt);
        el.classList.toggle('ist-passend', passt);
      });
      var notiz = $('[data-stufen-notiz]', art);
      if (zg === 'schueler' && notiz) notiz.textContent = 'Angezeigt wird die Fassung „' + name + '“. Oben kannst du umschalten.';
      else if (notiz) notiz.textContent = 'Angezeigt wird die Fassung „' + name + '“. Oben können Sie umschalten.';
      if (merken) speicher.set('nk-stufe-' + zg, k);
    }
    knoepfe.forEach(function (b) {
      b.addEventListener('click', function () {
        setzen(b.dataset.stufeWahl, true);
        melden($('[data-aktion-status]', art), 'Inhalte für „' + b.textContent + '“ werden angezeigt.');
      });
    });
    setzen(start, false);
  }

  /* ---------- Rollenspiele: selbst entscheiden, wie es weitergeht --- */
  var ENDE = { gut: ['✓', 'Gutes Ende'], teils: ['◐', 'Gemischtes Ende'], schwer: ['!', 'Schwieriges Ende'] };

  function geschichte() {
    var sek = $('[data-geschichte]');
    if (!sek) return;
    var g = D.geschichten && D.geschichten[sek.dataset.geschichte];
    var buehne = $('[data-geschichte-buehne]', sek);
    if (!g || !buehne) return;
    var weg = [];

    function alleEnden() { return Object.keys(g.szenen).filter(function (k) { return g.szenen[k].ende; }); }
    function gefunden() { var a = speicher.get('nk-enden', {}); return a[g.id] || []; }
    function merken(id) {
      var a = speicher.get('nk-enden', {});
      var l = a[g.id] || [];
      if (l.indexOf(id) < 0) l.push(id);
      a[g.id] = l;
      speicher.set('nk-enden', a);
    }
    function absaetze(liste) { return (liste || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join(''); }
    function chatHtml(chat) {
      return '<ol class="chat" aria-label="Nachrichten">' + chat.map(function (m) {
        return '<li class="chat__msg' + (m.ich ? ' chat__msg--ich' : '') + '"><span class="chat__von">' + esc(m.ich ? 'Du' : m.von) +
          '<span class="vh"> schreibt:</span></span><p>' + esc(m.text) + '</p></li>';
      }).join('') + '</ol>';
    }
    function wegHtml() {
      if (!weg.length) return '';
      return '<div class="geschichte__weg"><p class="label">Deine Entscheidungen</p><ol>' +
        weg.map(function (w) { return '<li>' + esc(w.wahl) + '</li>'; }).join('') + '</ol></div>';
    }

    function zeigen(id) {
      var s = g.szenen[id];
      if (!s) return;
      var letzte = weg[weg.length - 1];
      var html = '<div class="geschichte__karte' + (s.ende ? ' ende--' + s.ende.art : '') + '">';
      html += '<p class="geschichte__schritt">' + (s.ende ? 'Ende' : 'Szene ' + (weg.length + 1)) + (s.zeit ? ' · ' + esc(s.zeit) : '') + '</p>';
      if (s.ende) {
        var E = ENDE[s.ende.art] || ENDE.teils;
        html += '<p class="ende__marke"><span aria-hidden="true">' + E[0] + '</span>' + E[1] + '</p>';
        html += '<h3 class="geschichte__ort" tabindex="-1">' + esc(s.ende.titel) + '</h3>';
      } else {
        html += '<h3 class="geschichte__ort" tabindex="-1">' + esc(s.ort || g.titel) + '</h3>';
      }
      if (letzte && letzte.folge) html += '<p class="geschichte__folge">' + esc(letzte.folge) + '</p>';
      html += '<div class="geschichte__text">' + absaetze(s.text) + '</div>';
      if (s.chat) html += chatHtml(s.chat);
      if (s.ende) {
        html += absaetze(s.ende.text);
        if (s.ende.lernen && s.ende.lernen.length) {
          html += '<div class="ende__lernen"><h3>Was hier den Unterschied macht</h3><ul>' +
            s.ende.lernen.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
        }
        if (s.ende.hilfe && s.ende.hilfe.length) {
          html += '<p><strong>Hilfe und mehr Infos:</strong> ' + s.ende.hilfe.map(function (h) {
            return '<a href="' + esc(h.url) + '" rel="noopener">' + esc(h.titel) + '<span class="vh"> (externer Link)</span></a>';
          }).join(' · ') + '</p>';
        }
        merken(id);
        var gef = gefunden().length, alle = alleEnden().length;
        html += '<p class="ende__fund">Du hast ' + gef + ' von ' + alle + ' Enden entdeckt.' +
          (gef < alle ? ' Probier aus, was passiert, wenn du dich anders entscheidest.' : ' Du kennst jetzt alle Wege.') + '</p>';
        html += '<div class="aktionen"><button class="knopf" type="button" data-neu>Noch einmal von vorn</button>' +
          (weg.length ? '<button class="knopf knopf--zweit" type="button" data-zurueck>Letzte Entscheidung ändern</button>' : '') +
          '<a class="knopf knopf--text" href="spiele.html">Andere Rollenspiele</a></div>';
      } else {
        html += '<p class="geschichte__frage" id="gf-' + esc(id) + '">' + esc(s.frage || 'Was machst du?') + '</p>';
        html += '<ul class="geschichte__wahl" aria-labelledby="gf-' + esc(id) + '">' + s.wahl.map(function (w, i) {
          return '<li><button class="wahl-knopf" type="button" data-wahl="' + i + '">' + esc(w.text) + '</button></li>';
        }).join('') + '</ul>';
        if (weg.length) html += '<button class="knopf knopf--text" type="button" data-zurueck>Einen Schritt zurück</button>';
      }
      html += wegHtml() + '</div>';
      buehne.innerHTML = html;

      $$('[data-wahl]', buehne).forEach(function (b) {
        b.addEventListener('click', function () {
          var w = s.wahl[parseInt(b.dataset.wahl, 10)];
          weg.push({ szene: id, wahl: w.text, folge: w.folge });
          zeigen(w.ziel);
        });
      });
      var zurueck = $('[data-zurueck]', buehne);
      if (zurueck) zurueck.addEventListener('click', function () { var w = weg.pop(); zeigen(w.szene); });
      var neu = $('[data-neu]', buehne);
      if (neu) neu.addEventListener('click', function () { weg = []; zeigen(g.start); });
      var h = $('.geschichte__ort', buehne);
      h.focus({ preventScroll: true });
      sek.scrollIntoView({ block: 'start' });
    }

    var start = $('[data-geschichte-start]', sek);
    if (start) start.addEventListener('click', function () { weg = []; zeigen(g.start); });
  }

  /* ---------- Zeichenfeld auf der Startseite: leises Flackern ------- */
  function zeichenfeld() {
    var pre = $('[data-zeichenfeld]');
    if (!pre || !BEWEGUNG) return;
    var zeilen = pre.textContent.split('\n').map(function (z) { return z.split(''); });
    var orte = [];
    zeilen.forEach(function (z, y) { z.forEach(function (c, x) { if (c === '#' || c === ':') orte.push([y, x]); }); });
    if (!orte.length) return;
    var sichtbar = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (eintr) { sichtbar = eintr[0].isIntersecting; }).observe(pre);
    }
    window.setInterval(function () {
      if (!sichtbar || document.hidden) return;
      for (var k = 0; k < 10; k++) {
        var o = orte[Math.floor(Math.random() * orte.length)];
        zeilen[o[0]][o[1]] = zeilen[o[0]][o[1]] === '#' ? ':' : '#';
      }
      pre.textContent = zeilen.map(function (z) { return z.join(''); }).join('\n');
    }, 160);
  }

  /* ---------- 9. Filterlisten (Material, externe Angebote) ---------- */
  function filter() {
    var form = $('[data-filter]');
    if (!form) return;
    var liste = $('[data-filter-liste]');
    var eintraege = Array.prototype.slice.call(liste.children);
    var anzahl = $('[data-filter-anzahl]');
    var leer = $('[data-filter-leer]');
    var felder = $$('select[name]', form);
    var url = new URLSearchParams(location.search);
    var zg = speicher.get('nk-zielgruppe', null);

    felder.forEach(function (el) {
      var v = url.get(el.name);
      if (v == null && el.name === 'fuer' && form.dataset.filter === 'kontext') v = zg;
      if (v != null && Array.prototype.some.call(el.options, function (o) { return o.value === v; })) el.value = v;
    });

    function anwenden() {
      var werte = {};
      felder.forEach(function (el) { if (el.value) werte[el.name] = el.value; });
      var treffer = 0;
      eintraege.forEach(function (li) {
        var passt = Object.keys(werte).every(function (k) {
          var feld = k, wert = werte[k];
          if (k === 'alter') { feld = 'stufe'; wert = stufeAus(wert, 12, 15); }
          var d = (li.dataset[feld] || '').split(' ').filter(Boolean);
          return d.length === 0 || d.indexOf(wert) > -1;
        });
        li.hidden = !passt;
        if (passt) treffer++;
      });
      anzahl.textContent = treffer === eintraege.length
        ? eintraege.length + ' Einträge'
        : treffer + ' von ' + eintraege.length + ' Einträgen';
      leer.hidden = treffer > 0;
      var q = new URLSearchParams(werte).toString();
      history.replaceState(null, '', location.pathname + (q ? '?' + q : ''));
    }
    form.addEventListener('change', anwenden);
    form.addEventListener('reset', function () { window.setTimeout(anwenden, 0); });
    form.addEventListener('submit', function (ev) { ev.preventDefault(); });
    anwenden();
  }

  /* ---------- 10. Spiele --------------------------------------------- */
  function spiel() {
    var sektion = $('[data-spiel]');
    if (!sektion) return;
    var name = sektion.dataset.spiel;
    var sp = D.spiele[name];
    var buehne = $('[data-spiel-buehne]', sektion);
    if (!sp || !buehne) return;
    var i = 0;
    var ergebnisse = [];
    var STUFEN = { 2: ['✓', 'Passt gut'], 1: ['◐', 'Teilweise'], 0: ['✕', 'Eher nicht'] };

    function zeigen() {
      var it = sp.items[i];
      var optionen = sp.optionen.map(function (o) {
        return '<label class="option"><input type="radio" name="wahl" value="' + esc(o.wert) + '"><span>' + esc(o.label) + '</span></label>';
      }).join('');
      buehne.innerHTML = '<div class="spiel__karte">' +
        '<h3 class="spiel__fortschritt" tabindex="-1">' + esc(sp.einheit) + ' ' + (i + 1) + ' von ' + sp.items.length + '</h3>' +
        '<ol class="balken balken--mini spiel__balken" aria-hidden="true">' + sp.items.map(function (_, k) {
          return '<li style="flex:1 1 0"><span class="balken__seg ist-' + (k < i ? 'fertig' : (k === i ? 'jetzt' : 'offen')) + '"></span></li>';
        }).join('') + '</ol>' +
        (it.kontext ? '<p class="spiel__kontext">' + esc(it.kontext) + '</p>' : '') +
        '<blockquote class="spiel__kommentar">' +
        (it.autor ? '<p class="spiel__autor">' + esc(it.autor) + '<span class="vh"> schreibt:</span></p>' : '') +
        '<p class="spiel__text">' + esc(it.text) + '</p></blockquote>' +
        '<form data-spiel-form novalidate><fieldset><legend>' + esc(sp.frage) + '</legend>' + optionen + '</fieldset>' +
        '<button class="knopf knopf--pfeil" type="submit">Entscheiden</button>' +
        '<p class="status" data-spiel-fehler role="alert"></p></form>' +
        '<div class="rueckmeldung" data-rueckmeldung tabindex="-1" hidden></div></div>';
      var form = $('[data-spiel-form]', buehne);
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var gewaehlt = form.querySelector('input:checked');
        if (!gewaehlt) {
          $('[data-spiel-fehler]', buehne).textContent = 'Bitte wähle zuerst eine Antwort.';
          form.querySelector('input').focus();
          return;
        }
        auswerten(gewaehlt.value, form);
      });
      $('h3', buehne).focus();
    }

    function auswerten(wert, form) {
      var it = sp.items[i];
      var punkte = it.bewertung[wert] || 0;
      ergebnisse.push(punkte);
      $$('input', form).forEach(function (x) { x.disabled = true; });
      form.querySelector('button').hidden = true;
      $('[data-spiel-fehler]', buehne).textContent = '';
      var beste = sp.optionen.filter(function (o) { return it.bewertung[o.wert] === 2; })
        .map(function (o) { return o.label; }).join(' oder ');
      var letzte = i === sp.items.length - 1;
      var rm = $('[data-rueckmeldung]', buehne);
      rm.innerHTML = '<p class="bewertung bewertung--' + punkte + '"><span class="bewertung__symbol" aria-hidden="true">' +
        STUFEN[punkte][0] + '</span>' + STUFEN[punkte][1] + '</p>' +
        '<p>' + esc(it.erklaerung) + '</p>' +
        (punkte < 2 ? '<p class="zeile__meta">Am besten passt hier: ' + esc(beste) + '.</p>' : '') +
        '<button class="knopf knopf--pfeil" type="button" data-spiel-weiter>' + (letzte ? 'Zur Auswertung' : 'Weiter') + '</button>';
      rm.hidden = false;
      rm.focus();
      $('[data-spiel-weiter]', rm).addEventListener('click', function () {
        i++;
        if (letzte) ende(); else zeigen();
      });
    }

    function ende() {
      var zahl = function (p) { return ergebnisse.filter(function (x) { return x === p; }).length; };
      var gut = zahl(2);
      var text = gut >= Math.ceil(sp.items.length * 0.75)
        ? 'Du erkennst gut, was in welcher Situation hilft.'
        : 'Manche Situationen sind schwer einzuschätzen – genau dafür ist das Spiel da. Lies dir die Erklärungen ruhig noch einmal durch.';
      var andere = 'spiele.html';
      buehne.innerHTML = '<div class="spiel__karte"><h3 tabindex="-1">Auswertung</h3>' +
        '<ul class="auswertung"><li><strong>' + gut + '</strong> passt gut</li><li><strong>' + zahl(1) +
        '</strong> teilweise</li><li><strong>' + zahl(0) + '</strong> eher nicht</li></ul>' +
        '<p>' + text + '</p><p>Im echten Netz musst du nicht alles allein lösen. Hilfe zu holen ist immer richtig.</p>' +
        '<div class="aktionen"><button class="knopf" type="button" data-spiel-nochmal>Noch einmal spielen</button>' +
        '<a class="knopf knopf--zweit" href="' + andere + '">Andere Spiele</a>' +
        '<a class="knopf knopf--text" href="beratung.html">Hilfe und Beratung</a></div></div>';
      $('h3', buehne).focus();
      $('[data-spiel-nochmal]', buehne).addEventListener('click', function () { i = 0; ergebnisse = []; zeigen(); });
    }

    var start = $('[data-spiel-start]', sektion);
    if (start) start.addEventListener('click', function () { i = 0; ergebnisse = []; zeigen(); });
  }

  /* ---------- 11. Gespeicherte Angaben löschen ---------------------- */
  function speicherLoeschen() {
    var btn = $('[data-speicher-loeschen]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      try {
        Object.keys(localStorage).forEach(function (k) { if (k.indexOf('nk-') === 0) localStorage.removeItem(k); });
      } catch (e) { /* ignorieren */ }
      delete document.documentElement.dataset.theme;
      var wert = $('[data-modus-wert]');
      if (wert) wert.textContent = 'Automatisch';
      $$('.reiter a[aria-current="true"]').forEach(function (a) { a.removeAttribute('aria-current'); });
      melden($('[data-speicher-status]'), 'Alle gespeicherten Angaben auf diesem Gerät wurden gelöscht.');
    });
  }

  if (/[?&]raster\b/.test(location.search)) document.documentElement.classList.add('raster-an');
  modus();
  zielgruppe();
  startsatz();
  konfigurator();
  weiterHinweis();
  einheit();
  filter();
  spiel();
  speicherLoeschen();
  chips();
  listenStatus();
  zeichenfeld();
  stufen();
  geschichte();
})();
