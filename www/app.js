/* Word Café: game logic.
   Safety notes:
   - No innerHTML anywhere. All text is added as text nodes.
   - No network calls, no eval, no external files.
   - Everything read from storage or from a backup code is checked before use. */
(function () {
  'use strict';

  var D = window.WORD_CAFE, D2 = window.WORD_CAFE2, D3 = window.WORD_CAFE3, D4 = window.WORD_CAFE4;
  var D5 = window.WORD_CAFE5, D6 = window.WORD_CAFE6, D7 = window.WORD_CAFE7, D8 = window.WORD_CAFE8;
  var LAB = window.WORD_CAFE_LAB, X = window.WORD_CAFE_X, X2 = window.WORD_CAFE_X2, SYN = window.WORD_CAFE_SYN;
  var X3 = window.WORD_CAFE_X3; // questions for the words in levels 46-50
  var X4 = window.WORD_CAFE_X4; // questions and passages for the words in levels 51-55
  X.passages = X.passages.concat(X2.passages, X4.passages); // new passages are added after the first 6 (ids R07 and up)
  X2.se = X2.se.concat(X3.se, X4.se); X2.tc = X2.tc.concat(X3.tc, X4.tc); X2.ctx = X2.ctx.concat(X3.ctx, X4.ctx);
  var VAR = window.WORD_CAFE_VAR || {}; // [paraphrase 1, paraphrase 2, GRE context note] for every word
  var VERSION = window.WORD_CAFE_VERSION || '';
  // Themes: colours and wallpapers live in style.css under [data-theme="id"].
  var THEMES = [
    { id: 'dark', name: 'Night café', icon: '🌙', bar: '#2a1a16' },
    { id: 'light', name: 'Day café', icon: '☀️', bar: '#f1e5cb' },
    { id: 'forest', name: 'Forest', icon: '🌲', bar: '#12251b' },
    { id: 'ocean', name: 'Ocean', icon: '🌊', bar: '#0f2236' },
    { id: 'sakura', name: 'Sakura', icon: '🌸', bar: '#fdeef1' },
    { id: 'sunset', name: 'Sunset', icon: '🌇', bar: '#2b1230' },
    { id: 'starry', name: 'Starry night', icon: '✨', bar: '#0e1230' },
    { id: 'mint', name: 'Mint paper', icon: '🍃', bar: '#eaf5ee' }
  ];
  function themeIndex(id) { for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return i; return 0; }
  var P = D.puzzles.concat(D3.puzzles, D5.puzzles, D7.puzzles, D8.puzzles);
  var NS = 'http://www.w3.org/2000/svg';
  var KEY = 'wordcafe.v1';
  var INT = [1, 1, 3, 7, 14]; // days until next review, by box
  var SPRINT_SECS = 12;

  // ---------- levels and words ----------
  // Groups of 5 words, in blocks of 15: data.js (0-14), data2.js (15-29), data3.js (30-44),
  // data4.js (45-59), data5.js (60-74), data6.js (75-89), data7.js (90-99).
  // Level 1-15 pairs group i with 15+i. Level 16-30 pairs 30+i with 45+i. Level 31-45 pairs 60+i with 75+i.
  // Level 46-50 pairs 90+i with 95+i, and level 51-55 pairs 100+i with 105+i (blocks of 5).
  var GR = D.groups.concat(D2.groups, D3.groups, D4.groups, D5.groups, D6.groups, D7.groups, D8.groups);
  // A word row that is broken or repeated is skipped (the first copy wins), so one data mistake cannot crash the app.
  (function () {
    var seen = {};
    GR = GR.map(function (g) {
      return Object.assign({}, g, { words: (g.words || []).filter(function (w) {
        if (!w || typeof w.w !== 'string' || seen[w.w]) return false;
        seen[w.w] = true; return true;
      }) });
    });
  })();
  var BLOCKS = [{ n: 15, g: 0 }, { n: 15, g: 30 }, { n: 15, g: 60 }, { n: 5, g: 90 }, { n: 5, g: 100 }]; // n levels, first group
  var LVT = D2.levels.concat(D3.levels, D5.levels, D7.levels, D8.levels);
  var LV = [];
  BLOCKS.forEach(function (blk) {
    for (var j = 0; j < blk.n; j++) {
      var a = blk.g + j, b = blk.g + blk.n + j, t = LVT[LV.length] || { id: 'L' + (LV.length + 1), title: 'Level ' + (LV.length + 1), blurb: '' };
      LV.push({
        id: t.id, title: t.title, blurb: t.blurb, gis: [a, b],
        words: GR[a].words.concat(GR[b].words),
        quotes: [a, b].filter(function (g) { return GR[g].quote; })
      });
    }
  });
  function lvOf(gi) {
    var first = 0;
    for (var k = 0; k < BLOCKS.length; k++) {
      var blk = BLOCKS[k];
      if (gi >= blk.g && gi < blk.g + 2 * blk.n) return first + ((gi - blk.g) % blk.n);
      first += blk.n;
    }
    return 0;
  }
  var ALL = new Map();
  GR.forEach(function (g, gi) {
    g.words.forEach(function (w) { ALL.set(w.w, Object.assign({ gi: gi, lv: lvOf(gi), cl: g.cluster }, w)); });
  });
  var WORDS = Array.from(ALL.keys()).sort();
  // Saved progress uses stable ids (not list positions), so content can be added or moved safely.
  function idMap(list) {
    var m = Object.create(null);
    list.forEach(function (x, i) { if (x && typeof x.id === 'string') m[x.id] = i; });
    return m;
  }
  var LVI = idMap(LV), GRI = idMap(GR), PI = idMap(P), RI = idMap(X.passages);
  function pkey(i, p) { return LV[i].id + ':' + p; }          // one key per part, like "L07:1"
  function partIdx(key) {                                      // "L07:1" -> 2 * level index + part, or -1
    var m = /^([A-Za-z0-9_-]{1,12}):([01])$/.exec(String(key));
    return m && m[1] in LVI ? 2 * LVI[m[1]] + Number(m[2]) : -1;
  }
  var TOTAL_QUOTES = GR.filter(function (g) { return g.quote; }).length;
  var POSN = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb' };
  var TONE = { '+': 'positive', '-': 'negative', '0': 'neutral' };

  // ---------- tiny DOM helpers ----------
  function add(e, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); return; }
    e.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  function h(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'class') e.className = v;
        else if (k === 'on') Object.keys(v).forEach(function (ev) { e.addEventListener(ev, v[ev]); });
        else e.setAttribute(k, v === true ? '' : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }
  function btn(label, cls, fn) {
    return h('button', { class: 'btn ' + (cls || ''), type: 'button', on: { click: fn } }, label);
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

  // ---------- saved progress (checked every time it is loaded) ----------
  // In memory, progress uses list positions (fast and simple). On disk and in backup codes it uses
  // stable ids and a version number (v: 2), so adding or moving content never shifts anyone's progress.
  function fresh() {
    return { levels: [], parts: [], tricks: {}, mc: {}, words: {}, quotes: [], open: [], solved: [], read: [], keys: 0, streak: 0, best: 0, last: 0, theme: 'dark', seen: false, drafts: {}, tests: {} };
  }
  function int(n, lo, hi) { return Number.isInteger(n) && n >= lo && n <= hi; }
  var STAGES = ['learn', 'puzzle', 'blank', 'quote'];
  function partDone(i, p) { return S.levels.indexOf(i) >= 0 || S.parts.indexOf(2 * i + p) >= 0; }
  function validDraft(d, v2) {
    if (!d || typeof d !== 'object') return null;
    var i = v2 ? (typeof d.lv === 'string' && d.lv in LVI ? LVI[d.lv] : -1) : (int(d.i, 0, LV.length - 1) ? d.i : -1);
    if (i < 0 || STAGES.indexOf(d.stage) < 0 || !int(d.part, 0, 1)) return null;
    var n = 5;
    function perm(a) {
      if (!Array.isArray(a) || a.length !== n) return null;
      var seen = {}, ok = true;
      a.forEach(function (x) { if (!int(x, 0, n - 1) || seen[x]) ok = false; seen[x] = true; });
      return ok ? a.slice() : null;
    }
    var po = perm(d.po), bo = perm(d.bo);
    if (!po || !bo || !int(d.k, 0, n - 1)) return null;
    var names = LV[i].words.slice(5 * d.part, 5 * d.part + 5).map(function (w) { return w.w; });
    function flags(o) {
      var out = {};
      if (o && typeof o === 'object') names.forEach(function (w) { if (o[w] === true) out[w] = true; });
      return out;
    }
    var back = null;
    if (d.back && typeof d.back === 'object' && (d.back.stage === 'puzzle' || d.back.stage === 'blank') && int(d.back.k, 0, n - 1)) {
      back = { stage: d.back.stage, k: d.back.k };
    }
    return { i: i, part: d.part, stage: d.stage, k: d.k, po: po, bo: bo, hint: flags(d.hint), miss: flags(d.miss), back: back, ts: int(d.ts, 0, 8.64e15) ? d.ts : 0 };
  }
  function validate(o) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
    if (o.v != null && o.v !== 1 && o.v !== 2) return null; // saved by a newer version of the app
    var v2 = o.v === 2, s = fresh();
    // v2 lists hold ids; the old format (no v) holds list positions. Both end up as positions.
    function toIdx(a, map, max) {
      var out = [];
      if (!Array.isArray(a)) return out;
      a.forEach(function (x) {
        var n = v2 ? (typeof x === 'string' && x in map ? map[x] : -1) : (int(x, 0, max - 1) ? x : -1);
        if (n >= 0 && out.indexOf(n) < 0) out.push(n);
      });
      return out;
    }
    s.levels = toIdx(o.levels, LVI, LV.length);
    if (Array.isArray(o.parts)) {
      o.parts.forEach(function (x) {
        var n = v2 ? (typeof x === 'string' ? partIdx(x) : -1) : (int(x, 0, 2 * LV.length - 1) ? x : -1);
        if (n >= 0 && s.parts.indexOf(n) < 0) s.parts.push(n);
      });
    }
    s.levels.forEach(function (i) { [2 * i, 2 * i + 1].forEach(function (k) { if (s.parts.indexOf(k) < 0) s.parts.push(k); }); });
    if (o.tricks && typeof o.tricks === 'object' && !Array.isArray(o.tricks)) {
      Object.keys(o.tricks).forEach(function (k) {
        var v = o.tricks[k];
        if (ALL.has(k) && typeof v === 'string' && v.trim()) s.tricks[k] = v.trim().slice(0, 120);
      });
    }
    if (o.mc && typeof o.mc === 'object' && !Array.isArray(o.mc)) {
      Object.keys(o.mc).forEach(function (k) { if (ALL.has(k) && int(o.mc[k], 0, 998)) s.mc[k] = o.mc[k]; });
    }
    s.quotes = toIdx(o.quotes, GRI, GR.length);
    s.open = toIdx(o.open, PI, P.length);
    s.solved = toIdx(o.solved, PI, P.length);
    s.read = toIdx(o.read, RI, X.passages.length);
    s.open = s.open.filter(function (n) { return s.solved.indexOf(n) < 0; });
    if (o.words && typeof o.words === 'object') {
      Object.keys(o.words).forEach(function (k) {
        var v = o.words[k];
        if (ALL.has(k) && v && int(v.b, 0, 4) && int(v.d, 0, 1000000)) s.words[k] = { b: v.b, d: v.d };
      });
    }
    if (int(o.keys, 0, 99)) s.keys = o.keys;
    if (int(o.streak, 0, 9999)) s.streak = o.streak;
    if (int(o.best, 0, 9999)) s.best = o.best;
    if (int(o.last, 0, 1000000)) s.last = o.last;
    if (THEMES.some(function (t) { return t.id === o.theme; })) s.theme = o.theme;
    // Unfinished parts: old saves had one draft, new saves keep one draft per part.
    var dr = [];
    if (v2 && o.drafts && typeof o.drafts === 'object' && !Array.isArray(o.drafts)) {
      Object.keys(o.drafts).slice(0, 200).forEach(function (k) { dr.push(validDraft(o.drafts[k], true)); });
    } else if (!v2 && o.draft) dr.push(validDraft(o.draft, false));
    dr.forEach(function (d) { if (d) s.drafts[pkey(d.i, d.part)] = d; });
    // Test-out: the day of the last attempt for each part
    if (v2 && o.tests && typeof o.tests === 'object' && !Array.isArray(o.tests)) {
      Object.keys(o.tests).slice(0, 200).forEach(function (k) {
        if (partIdx(k) >= 0 && int(o.tests[k], 0, 1000000)) s.tests[k] = o.tests[k];
      });
    }
    s.seen = o.seen === true || s.levels.length > 0 || Object.keys(s.words).length > 0;
    return s;
  }
  function pack(s) {
    var drafts = {};
    Object.keys(s.drafts).forEach(function (k) {
      var d = s.drafts[k];
      drafts[k] = { lv: LV[d.i].id, part: d.part, stage: d.stage, k: d.k, po: d.po, bo: d.bo, hint: d.hint, miss: d.miss, back: d.back || null, ts: d.ts || 0 };
    });
    return {
      v: 2,
      levels: s.levels.map(function (i) { return LV[i].id; }),
      parts: s.parts.map(function (k) { return LV[k >> 1].id + ':' + (k & 1); }),
      tricks: s.tricks, mc: s.mc, words: s.words,
      quotes: s.quotes.map(function (i) { return GR[i].id; }),
      open: s.open.map(function (i) { return P[i].id; }),
      solved: s.solved.map(function (i) { return P[i].id; }),
      read: s.read.map(function (i) { return X.passages[i].id; }),
      keys: s.keys, streak: s.streak, best: s.best, last: s.last, theme: s.theme, seen: s.seen,
      drafts: drafts, tests: s.tests
    };
  }
  // Extra copies kept on this phone only: one before the old save format is upgraded, one of damaged data,
  // and one before a restore. "Erase my progress" removes all of them.
  var EXTRA = ['.v1copy', '.bad', '.prev'];
  function keepCopy(suffix, raw) { try { localStorage.setItem(KEY + suffix, raw); } catch (e) { /* storage full: skip the copy */ } }
  function wipeExtras() { EXTRA.forEach(function (x) { try { localStorage.removeItem(KEY + x); } catch (e) { /* ignore */ } }); }
  var upgraded = false; // true when an old save was read and must be written again in the new format
  // For the "What this app stores" screen: every item the app keeps on this phone, and its size.
  var STORE_NAMES = { '': 'Your progress', '.v1copy': 'Copy from before the last upgrade', '.bad': 'Copy of damaged data', '.prev': 'Safety copy from before a restore' };
  function storageReport() {
    var rows = [];
    Object.keys(STORE_NAMES).forEach(function (suffix) {
      var v = null;
      try { v = localStorage.getItem(KEY + suffix); } catch (e) { /* blocked */ }
      if (v !== null) rows.push({ name: STORE_NAMES[suffix], suffix: suffix, bytes: v.length * 2 }); // text is stored as 2 bytes per character
    });
    return rows;
  }
  function load() {
    var r = null;
    try {
      r = localStorage.getItem(KEY);
      if (r) {
        var o = JSON.parse(r), st = validate(o);
        if (st) { if (o.v !== 2) { keepCopy('.v1copy', r); upgraded = true; } return st; }
        keepCopy('.bad', r);
      }
    } catch (e) { if (r) keepCopy('.bad', r); /* storage blocked or damaged: start fresh */ }
    return fresh();
  }
  var S = load();
  var storageOK = true;
  try { localStorage.setItem('wc.test', '1'); localStorage.removeItem('wc.test'); } catch (e) { storageOK = false; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(pack(S))); } catch (e) { storageOK = false; } }
  if (upgraded) save(); // write the upgraded save at once, so it can never be read against a later content order
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', S.theme);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', THEMES[themeIndex(S.theme)].bar);
  }

  // ---------- backup code (text you keep yourself) ----------
  // WC3 = progress as UTF-8 text, squeezed (gzip) and written as base64. WC2 = the same without gzip (used if
  // the phone cannot squeeze). WC1 = the first version (Latin letters only). All three can still be read.
  function checksum(str) {
    var x = 2166136261;
    for (var i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619) >>> 0; }
    return x.toString(36);
  }
  function bytesToB64(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    return btoa(bin);
  }
  function b64ToBytes(b64) {
    var bin = atob(b64), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  function gzip(bytes) {
    return new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()
      .then(function (b) { return new Uint8Array(b); });
  }
  function gunzip(bytes, cap) { // stops if the result is larger than cap bytes (protects against huge pasted data)
    var reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
    var parts = [], total = 0;
    function pump() {
      return reader.read().then(function (r) {
        if (r.done) {
          var out = new Uint8Array(total), at = 0;
          parts.forEach(function (p) { out.set(p, at); at += p.length; });
          return out;
        }
        total += r.value.length;
        if (total > cap) { reader.cancel(); throw new Error('too big'); }
        parts.push(r.value);
        return pump();
      });
    }
    return pump();
  }
  function makeCode() { // returns a promise of the code text
    return Promise.resolve().then(function () {
      var bytes = new TextEncoder().encode(JSON.stringify(pack(S)));
      function plain() { var body = bytesToB64(bytes); return 'WC2.' + body + '.' + checksum(body); }
      if (typeof CompressionStream !== 'function' || typeof Blob !== 'function' || typeof Response !== 'function') return plain();
      return gzip(bytes).then(function (z) { var body = bytesToB64(z); return 'WC3.' + body + '.' + checksum(body); }, plain);
    });
  }
  function readCode(text) { // returns a promise of the progress, or null if the code is not valid
    return Promise.resolve().then(function () {
      text = String(text || '').replace(/\s+/g, '');
      if (text.length > 200000) return null;
      var p = text.split('.');
      if (p.length !== 3 || ['WC1', 'WC2', 'WC3'].indexOf(p[0]) < 0 || checksum(p[1]) !== p[2]) return null;
      if (p[0] === 'WC1') return validate(JSON.parse(atob(p[1])));
      var bytes = b64ToBytes(p[1]);
      if (p[0] === 'WC2') return validate(JSON.parse(new TextDecoder().decode(bytes)));
      return gunzip(bytes, 2000000).then(function (u) { return validate(JSON.parse(new TextDecoder().decode(u))); });
    }).catch(function () { return null; });
  }
  // One safety copy so that "Restore" can be undone
  function savePrev() { keepCopy('.prev', JSON.stringify(pack(S))); }
  function readPrev() {
    try { var r = localStorage.getItem(KEY + '.prev'); return r ? validate(JSON.parse(r)) : null; } catch (e) { return null; }
  }

  // ---------- days, streak, spaced review ----------
  function today() {
    var n = new Date();
    return Math.floor((n.getTime() - n.getTimezoneOffset() * 60000) / 864e5);
  }
  function curStreak() { return S.last >= today() - 1 ? S.streak : 0; }
  function touch() {
    var t = today();
    if (S.last === t) return;
    S.streak = S.last === t - 1 ? S.streak + 1 : 1;
    S.last = t;
    S.best = Math.max(S.best, S.streak);
  }
  function rec(word, ok) {
    var t = today();
    var cur = S.words[word] || { b: 0, d: t };
    var nb = ok ? Math.min(cur.b + 1, 4) : 0;
    S.words[word] = { b: nb, d: t + INT[nb] };
  }
  function recAt(word, box) { S.words[word] = { b: box, d: today() + INT[box] }; }
  function state(word) {
    var s = S.words[word];
    if (!s) return 'New';
    return s.b >= 4 ? 'Mastered' : s.b >= 2 ? 'Known' : 'Learning';
  }
  function dueList() {
    var t = today();
    return Object.keys(S.words).filter(function (w) { return S.words[w].d <= t; })
      .sort(function (a, b) { return S.words[a].d - S.words[b].d; });
  }
  function weakList() { return Object.keys(S.words).filter(function (w) { return S.words[w].b === 0; }); }
  function knownCount(words) {
    return words.filter(function (w) { return S.words[w.w] && S.words[w.w].b >= 2; }).length;
  }

  // ---------- café rewards ----------
  var ITEMS = [
    ['☕', 'Coffee cup', 'Always here', function () { return true; }],
    ['🪴', 'Plant', 'Finish 1 level', function () { return S.levels.length >= 1; }],
    ['📚', 'Book stack', 'Finish 3 levels', function () { return S.levels.length >= 3; }],
    ['🐈', 'Café cat', 'Reach a 3-day streak', function () { return S.best >= 3; }],
    ['📻', 'Radio', 'Reach a 7-day streak', function () { return S.best >= 7; }],
    ['🕯️', 'Candle', 'Finish 8 levels', function () { return S.levels.length >= 8; }],
    ['🖼️', 'Picture', 'Finish 15 levels', function () { return S.levels.length >= 15; }],
    ['🎷', 'Jukebox', 'Finish 22 levels', function () { return S.levels.length >= 22; }],
    ['🪩', 'Disco ball', 'Finish 35 levels', function () { return S.levels.length >= 35; }],
    ['🏆', 'Trophy', 'Finish all ' + LV.length + ' levels', function () { return S.levels.length >= LV.length; }]
  ];

  // ---------- question helpers ----------
  function others(word, n) {
    var t = ALL.get(word), pool = Array.from(ALL.values());
    if (t) pool = pool.filter(function (x) { return x.cl !== t.cl; });
    return shuffle(pool).slice(0, n);
  }
  function mark(sentence, word) {
    var m = sentence.match(new RegExp('\\b' + word + '\\b', 'i'));
    if (!m) return sentence;
    return [sentence.slice(0, m.index), h('strong', null, m[0]), sentence.slice(m.index + m[0].length)];
  }
  function fillNode(sentence, word) {
    var i = sentence.indexOf('____');
    if (i < 0) return sentence;
    return [sentence.slice(0, i), h('strong', null, word), sentence.slice(i + 4)];
  }
  function quoteNode(q, filled) {
    var i = q.text.indexOf('____');
    var kids;
    if (!filled) kids = ['“' + q.text + '”'];
    else {
      var ans = i === 0 ? cap(q.answer) : q.answer;
      kids = ['“' + q.text.slice(0, i), h('strong', null, ans), q.text.slice(i + 4) + '”'];
    }
    return h('blockquote', { class: 'quote' }, kids, h('footer', null, '— ' + q.by),
      filled ? h('p', { class: 'plain' }, 'In simple words: ' + q.plain) : null);
  }
  function progress(n, total) {
    var i = h('i');
    i.style.width = Math.round(100 * n / total) + '%';
    return h('div', { class: 'bar', role: 'img', 'aria-label': 'Step ' + n + ' of ' + total }, i);
  }

  // Players can write their own memory trick for any word (saved only on this phone).
  function trickBox(word) {
    var box = h('div', { class: 'mytrick' });
    function paint(editing) {
      box.textContent = '';
      var cur = S.tricks[word];
      if (!editing) {
        if (cur) box.append(h('p', { class: 'trick' }, 'My trick: ' + cur));
        box.append(btn(cur ? 'Edit my trick' : 'Write my own trick', 'alt', function () { paint(true); }));
        return;
      }
      var inp = h('textarea', { maxlength: '120', 'aria-label': 'Your own memory trick for ' + word, placeholder: 'A picture, a rhyme, someone you know...' });
      inp.value = cur || '';
      box.append(inp, h('div', { class: 'row' },
        btn('Save', '', function () {
          var v = inp.value.trim().slice(0, 120);
          if (v) S.tricks[word] = v; else delete S.tricks[word];
          save(); paint(false);
        }),
        btn('Cancel', 'alt', function () { paint(false); }),
        cur ? btn('Remove', 'alt', function () { delete S.tricks[word]; save(); paint(false); }) : null));
    }
    paint(false);
    return box;
  }

  // ---------- Meaning variants and hints ----------
  // Each time a word's meaning is used as a question, the next wording is shown (2nd, 3rd, 1st, 2nd ...),
  // so players learn the idea and not one fixed sentence.
  function variants(word) {
    var v = VAR[word] || [], list = [ALL.get(word).m];
    if (v[0]) list.push(v[0]);
    if (v[1]) list.push(v[1]);
    return list;
  }
  // The counter only moves when a question is really shown, never while a batch of questions is being built.
  function peekIndex(word) { return (S.mc[word] || 0) + 1; }
  function bumpIndex(word) { S.mc[word] = ((S.mc[word] || 0) + 1) % 999; }
  function pickIndex(word) { var c = S.mc[word] || 0; bumpIndex(word); return c + 1; }
  function useQ(q) { if (q.vw && !q.used) { q.used = true; bumpIndex(q.vw); } }
  function meaningAt(word, i) { var l = variants(word); return l[i % l.length]; }
  function greNote(word) { return (VAR[word] && VAR[word][2]) || ''; }
  // Hide the word (and words that start like it) inside a clue
  // Also hides the word's listed family forms (fam), which can start differently from the word.
  function maskWord(text, word, fam) {
    var stem = word.slice(0, Math.max(4, Math.min(5, word.length - 1))).toLowerCase();
    var forms = (fam || '').toLowerCase().split(/[\s,]+/).filter(function (f) { return f.length > 2; });
    return text.replace(/[A-Za-z][A-Za-z-]*/g, function (t) {
      var low = t.replace(/-/g, '').toLowerCase();
      return low.indexOf(stem) >= 0 || forms.indexOf(low) >= 0 ? '____' : t;
    });
  }
  function hintList(w, shownMeaning) {
    var word = w.w, out = [], info = labInfo(word), syn = SYN[word];
    if (info) {
      out.push('Tone: ' + TONE[info.tone] + (info.tone === '+' ? ' (it sounds good or approving).' : info.tone === '-' ? ' (it sounds critical, unpleasant or bad).' : ' (neither praise nor blame).'));
      out.push('It is ' + (/^[aeiou]/.test(info.posText) ? 'an ' : 'a ') + info.posText + '.');
    }
    if (syn && syn[0]) out.push('Close in meaning: ' + maskWord(shuffle(syn[0].split(',')).slice(0, 2).join(', '), word, w.fam) + '.');
    if (syn && syn[1]) out.push('Opposite: ' + maskWord(shuffle(syn[1].split(',')).slice(0, 2).join(', '), word, w.fam) + '.');
    var etym = /\b(Latin|Greek|French|Old English|Old Italian|root)\b/.test(w.tip);
    out.push((etym ? 'Root clue: ' : 'Memory clue: ') + maskWord(w.tip, word, w.fam));
    var senses = [];
    X2.ctx.forEach(function (q) { if (q.w === word && q.q === 'syn' && senses.indexOf(q.a) < 0) senses.push(q.a); });
    if (senses.length > 1) out.push('This word has more than one meaning, for example: ' + senses.slice(0, 3).join(', ') + '.');
    var alt = variants(word).filter(function (m) { return m !== shownMeaning; });
    if (alt.length) out.push('Another way to say it: ' + shuffle(alt)[0]);
    if (greNote(word)) out.push('GRE clue: ' + maskWord(greNote(word), word, w.fam));
    out.push('Sentence clue: ' + w.s);
    out.push('It has ' + word.length + ' letters.');
    var list = shuffle(out).map(function (t) { return { t: t }; });
    list.push({ t: 'It starts with “' + word.charAt(0) + '”.', first: true });
    return list;
  }

  // Multiple choice. retry=true lets the person try again after a wrong answer.
  function Choices(opts, answer, retry, onPick) {
    var wrap = h('div', { class: 'opts', role: 'group' });
    var locked = false, btns = [];
    function lockAll() {
      locked = true;
      btns.forEach(function (x) { x.disabled = true; if (x.textContent === answer) x.classList.add('ok'); });
    }
    opts.forEach(function (o) {
      var b = h('button', { class: 'opt', type: 'button' }, o);
      b.addEventListener('click', function () {
        if (locked) return;
        var good = o === answer;
        if (good) { b.classList.add('ok'); lockAll(); }
        else {
          b.classList.add('bad');
          if (retry) b.disabled = true;
          else { lockAll(); b.classList.add('bad'); }
        }
        onPick(good, o, locked);
      });
      btns.push(b);
      wrap.append(b);
    });
    wrap.lock = lockAll;
    return wrap;
  }

  // ---------- the swipe wheel ----------
  function Wheel(word, hooks) {
    var order = shuffle(word.split('')), tries = 0;
    while (order.join('') === word && tries++ < 6) order = shuffle(order);
    var n = order.length;
    var el = h('div', { class: 'wheel', role: 'group', 'aria-label': 'Letter wheel. Swipe across the letters, or tap them one by one in order.' });
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'trail');
    svg.setAttribute('aria-hidden', 'true');
    var line = document.createElementNS(NS, 'polyline');
    svg.append(line);
    el.append(h('div', { class: 'plate' }), svg);

    var pos = order.map(function (_, i) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n;
      return [50 + 36 * Math.cos(a), 50 + 36 * Math.sin(a)];
    });
    var tiles = order.map(function (ch, i) {
      var t = h('button', { class: 'tile', type: 'button', 'data-i': i, 'aria-label': ch }, ch);
      t.style.left = pos[i][0] + '%';
      t.style.top = pos[i][1] + '%';
      el.append(t);
      return t;
    });

    var path = [], active = false, gest = 0, done = false;
    function guess() { return path.map(function (i) { return order[i]; }).join(''); }
    function sync() {
      tiles.forEach(function (t, i) { var on = path.indexOf(i) >= 0; t.classList.toggle('on', on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      line.setAttribute('points', path.map(function (i) { return pos[i][0] + ',' + pos[i][1]; }).join(' '));
      hooks.change(guess());
    }
    function check() {
      if (guess() === word) {
        done = true;
        el.classList.add('win');
        hooks.solve();
      } else {
        el.classList.add('shake');
        setTimeout(function () { el.classList.remove('shake'); }, 360);
        path = [];
        sync();
      }
    }
    function tileAt(x, y) {
      var e = document.elementFromPoint(x, y);
      var t = e && e.closest ? e.closest('.tile') : null;
      return t && el.contains(t) ? Number(t.getAttribute('data-i')) : -1;
    }
    function addTile(i) {
      if (i < 0 || done) return;
      if (path.length > 1 && path[path.length - 2] === i) { path.pop(); sync(); return; }
      if (path.indexOf(i) < 0) { path.push(i); gest++; sync(); }
    }
    var lastTouch = 0; // time of the last pointer or key action, so the click that follows it is not counted twice
    el.addEventListener('pointerdown', function (e) {
      if (done) return;
      var i = tileAt(e.clientX, e.clientY);
      if (i < 0) return;
      e.preventDefault();
      lastTouch = Date.now();
      active = true; gest = 0;
      try { el.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
      addTile(i);
    });
    el.addEventListener('pointermove', function (e) {
      if (active) addTile(tileAt(e.clientX, e.clientY));
    });
    function end() {
      if (!active) return;
      active = false;
      if (done) return;
      if (path.length === n || gest >= 2) check();
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);

    tiles.forEach(function (t, i) {
      t.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          lastTouch = Date.now();
          addTile(i);
          if (path.length === n) check();
        }
      });
      // A screen reader's double tap sends only a click. Use it when no pointer or key action just happened.
      t.addEventListener('click', function () {
        if (done || active || Date.now() - lastTouch < 700) return;
        addTile(i);
        if (path.length === n) check();
      });
    });
    function onKey(e) {
      if (done || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target && e.target.closest && e.target.closest('button')) return;
      if (e.key === 'Backspace') { path.pop(); sync(); }
      else if (e.key === 'Enter') { if (path.length) check(); }
      else if (/^[a-z]$/i.test(e.key)) {
        var ch = e.key.toLowerCase();
        var k = -1;
        order.forEach(function (c, j) { if (k < 0 && c === ch && path.indexOf(j) < 0) k = j; });
        if (k >= 0) { path.push(k); sync(); if (path.length === n) check(); }
      }
    }
    document.addEventListener('keydown', onKey);

    return {
      el: el,
      clear: function () { path = []; sync(); },
      reshuffle: function () {
        order = shuffle(order);
        tiles.forEach(function (t, i) { t.textContent = order[i]; t.setAttribute('aria-label', order[i]); });
        path = []; sync();
      },
      destroy: function () { document.removeEventListener('keydown', onKey); }
    };
  }

  // ---------- app state ----------
  var app = document.getElementById('app');
  var view = { tab: 'menu' };
  var L = null;   // current level
  var M = null;   // current special mode (confusables, reading, sprint)
  var RV = null;  // current review
  var LQ = null;  // current lab quiz
  var PV = null;  // current drawer puzzle
  var cleanups = [];
  var msg = '';

  // Android back button / gesture: one history entry while we are inside a level, round, puzzle or
  // another tab. Back returns to the menu. On the menu itself back leaves the app as normal.
  var pushed = false, ignorePop = 0, ignoreTimer = 0;
  function isInner() { return !!(L || M || RV || LQ) || PV != null || view.tab !== 'menu'; }
  function syncHistory() {
    try {
      if (isInner() && !pushed) { history.pushState({ wc: 1 }, ''); pushed = true; }
      else if (!isInner() && pushed) {
        pushed = false; ignorePop++; history.back();
        // If the browser never reports that step, do not swallow the next real Back press.
        clearTimeout(ignoreTimer);
        ignoreTimer = setTimeout(function () { ignorePop = 0; }, 800);
      }
    } catch (e) { /* history not available: ignore */ }
  }
  window.addEventListener('popstate', function () {
    if (ignorePop > 0) { ignorePop--; if (!ignorePop) clearTimeout(ignoreTimer); return; }
    if (!pushed) return;
    pushed = false;
    L = null; M = null; RV = null; LQ = null; PV = null;
    go({ tab: 'menu' });
  });

  // Each unfinished part keeps its own draft, so starting one part never deletes another.
  function saveDraft() {
    S.drafts[pkey(L.i, L.part)] = { i: L.i, part: L.part, stage: L.stage, k: L.k, po: L.po, bo: L.bo, hint: L.hint, miss: L.miss, back: L.back || null, ts: Date.now() };
    save();
  }
  function go(v, keepScroll) {
    var y = window.pageYOffset || 0;
    cleanups.forEach(function (f) { f(); });
    cleanups = [];
    view = v;
    if (L && L.part != null && STAGES.indexOf(L.stage) >= 0) saveDraft();
    syncHistory();
    render();
    window.scrollTo(0, keepScroll ? y : 0);
    var m = document.getElementById('main');
    if (m && m.focus) m.focus({ preventScroll: true });
  }
  function render() {
    app.textContent = '';
    try {
      // On short phones the menu bar is hidden during the swipe puzzle, so the wheel and its buttons fit.
      document.body.classList.toggle('focus', !!(L && !M && view.tab === 'menu' && L.stage === 'puzzle'));
      app.append(topBar(), h('main', { id: 'main', tabindex: '-1' }, screen()), navBar());
    } catch (e) { fatalScreen(); }
  }
  // If a screen cannot be built (for example from a bad data row), show this instead of a blank page.
  function fatalScreen() {
    app.textContent = '';
    document.body.classList.remove('focus');
    var back = btn('Back to the menu', '', function () {
      L = null; M = null; RV = null; LQ = null; PV = null; msg = '';
      try { go({ tab: 'menu' }); } catch (e) { location.reload(); }
    });
    app.append(h('main', { id: 'main', tabindex: '-1' },
      h('section', { class: 'panel' }, h('h2', null, 'Something went wrong'),
        h('p', null, 'This screen could not open. Your saved progress has not been changed.'),
        back, ' ', btn('Restart', 'alt', function () { location.reload(); }))));
  }
  function screen() {
    if (view.tab === 'menu') return M ? modeScreen() : L ? levelScreen() : menuScreen();
    if (view.tab === 'review') return reviewScreen();
    if (view.tab === 'lab') return labScreen();
    if (view.tab === 'shelf') return shelfScreen();
    if (view.tab === 'drawer') return PV != null ? puzzleScreen() : drawerScreen();
    return moreScreen();
  }

  function topBar() {
    var ti = themeIndex(S.theme);
    var tb = h('button', {
      class: 'theme', type: 'button', 'aria-label': 'Change theme. Now: ' + THEMES[ti].name,
      on: {
        click: function () {
          var n = THEMES[(themeIndex(S.theme) + 1) % THEMES.length];
          S.theme = n.id;
          save(); applyTheme();
          tb.textContent = n.icon;
          tb.setAttribute('aria-label', 'Change theme. Now: ' + n.name);
        }
      }
    }, THEMES[ti].icon);
    return h('header', { class: 'top' },
      h('h1', null, 'Word Café'),
      h('div', { class: 'stats' },
        h('span', { role: 'img', 'aria-label': 'Streak: ' + curStreak() + ' days' }, '🔥 ' + curStreak()),
        h('span', { role: 'img', 'aria-label': 'Keys: ' + S.keys }, '🗝️ ' + S.keys),
        tb));
  }
  var TABS = [['menu', '🍽️', 'Menu'], ['review', '🔁', 'Review'], ['lab', '🧪', 'Lab'], ['shelf', '📚', 'Shelf'], ['drawer', '🗄️', 'Drawer'], ['more', '⚙️', 'More']];
  function navBar() {
    return h('nav', { 'aria-label': 'Main' }, TABS.map(function (t) {
      return h('button', {
        type: 'button', 'aria-current': view.tab === t[0] ? 'page' : null,
        on: { click: function () { L = null; M = null; RV = null; LQ = null; PV = null; msg = ''; go({ tab: t[0] }); } }
      }, h('span', { class: 'ico', 'aria-hidden': 'true' }, t[1]), h('span', null, t[2]));
    }));
  }

  // ---------- Menu ----------
  function wotdCard() {
    var w = ALL.get(WORDS[(today() * 53) % WORDS.length]);
    var info = labInfo(w.w);
    return h('article', { class: 'chalk' },
      h('p', { class: 'label' }, 'Word of the day'),
      h('p', { class: 'big' }, w.w),
      info ? h('p', { class: 'label' }, info.posText + ', ' + info.toneText) : null,
      h('p', null, w.m),
      h('p', { class: 'ex' }, mark(w.ex, w.w)),
      h('p', { class: 'trick' }, 'Memory trick: ' + w.tip));
  }
  function menuScreen() {
    var due = dueList().length, learned = Object.keys(S.words).length;
    var next = ITEMS.filter(function (x) { return !x[3](); })[0];
    var review;
    if (!learned) review = h('p', null, 'Finish your first level to start daily reviews.');
    else if (due) review = [h('p', null, due + (due === 1 ? ' word is' : ' words are') + ' ready to review.'),
      btn('Start review', '', function () { startReview(false); go({ tab: 'review' }); })];
    else review = h('p', null, 'No words are due today. Nice work.');

    var firstRun = S.seen ? null : h('section', { class: 'panel' },
      h('h2', null, 'How to play'),
      h('p', null, '1. Each level has two parts of 5 words. Learn them with a memory trick. Know them already? Try the test-out.'),
      h('p', null, '2. Swipe the letters to spell each word from its meaning.'),
      h('p', null, '3. Pick the word that fits tricky sentences. A reason is shown for each.'),
      h('p', null, '4. Unlock a quote and earn a key for a quant puzzle.'),
      h('p', { class: 'hint' }, 'Missed words come back in Review. You can leave a level and continue later.'),
      btn('Got it', '', function () { S.seen = true; save(); go(view, true); }));
    var warn = storageOK ? null : h('section', { class: 'panel' }, h('h2', null, 'Progress cannot be saved'),
      h('p', null, 'This device is blocking storage, so your progress will be lost when you close the app.'));
    var nextIdx = 0;
    while (nextIdx < LV.length && S.levels.indexOf(nextIdx) >= 0) nextIdx++;
    var resume;
    var drafts = Object.keys(S.drafts).map(function (k) { return S.drafts[k]; })
      .sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
    if (drafts.length) {
      resume = h('section', { class: 'panel' }, h('h2', null, drafts.length > 1 ? 'Continue your parts' : 'Continue your level'),
        drafts.slice(0, 3).map(function (d) {
          return h('div', { class: 'draftrow' },
            h('p', null, (d.i + 1) + '. ' + LV[d.i].title + ', Part ' + 'AB'.charAt(d.part) + ' (' + d.stage + ' stage)'),
            h('div', { class: 'row' },
              btn('Continue', '', function () { resumeDraft(d); }),
              btn('Replay this part', 'alt', function () { startPart(d.i, d.part); })));
        }),
        drafts.length > 3 ? h('p', { class: 'hint' }, 'More unfinished parts are inside their levels.') : null);
    } else if (nextIdx < LV.length) {
      resume = h('section', { class: 'panel' }, h('h2', null, 'Up next'),
        h('p', null, (nextIdx + 1) + '. ' + LV[nextIdx].title), btn('Play', '', function () { startLevel(nextIdx); }));
    }
    var modes = [
      ['conf', 'Confusables', 'Look-alike words. Pick the right one.', S.levels.length >= 1, 'Finish 1 level to unlock'],
      ['read', 'Reading', 'Fill the blanks in short passages.', S.levels.length >= 2, 'Finish 2 levels to unlock'],
      ['sprint', '10-word sprint', '10 words, ' + SPRINT_SECS + ' seconds each.', learned >= 10, 'Learn 10 words to unlock'],
      ['syn', 'Synonyms and antonyms', 'Closest and opposite meanings.', synWords().length >= 5, 'Learn 5 words to unlock'],
      ['ctx', 'Same word, new meaning', 'Pick the meaning that fits the sentence.', ctxPool().length >= 3, 'Learn words like novel, subtle or absolute to unlock'],
      ['se', 'Sentence equivalence', 'Pick the 2 words that mean the same.', sePool().length >= 1, 'Learn more words to unlock'],
      ['tc', 'Text completion', 'Fill 2 or 3 blanks in one text.', tcPool().length >= 1, 'Learn more words to unlock']
    ];
    return h('div', null,
      h('section', { class: 'cafe', 'aria-label': 'Your café' },
        h('div', { class: 'items' }, ITEMS.map(function (x) {
          return h('span', { class: 'item' + (x[3]() ? '' : ' lock'), title: x[1] + ': ' + x[2] }, x[0]);
        })),
        h('div', { class: 'floor' })),
      h('p', { class: 'hint center' }, next ? 'Next for your café: ' + next[0] + ' ' + next[1] + '. ' + next[2] + '.' : 'Your café is complete.'),
      firstRun, warn, resume,
      wotdCard(),
      h('section', { class: 'panel' }, h('h2', null, 'Daily review'), review),
      h('h2', { class: 'lhead' }, 'Special rounds'),
      modes.map(function (m) {
        return h('button', {
          class: 'lvl' + (m[3] ? '' : ' locked'), type: 'button', disabled: !m[3],
          on: { click: function () { startMode(m[0]); } }
        }, h('strong', null, m[1]), h('span', { class: 'sub' }, m[2]), h('span', { class: 'tag' }, m[3] ? 'Ready to play' : m[4]));
      }),
      h('h2', { class: 'lhead' }, 'Levels'),
      LV.map(function (lv, i) {
        var done = S.levels.indexOf(i) >= 0, open = i === 0 || S.levels.indexOf(i - 1) >= 0;
        return h('button', {
          class: 'lvl' + (open ? '' : ' locked') + (done ? ' done' : ''), type: 'button', disabled: !open,
          on: { click: function () { startLevel(i); } }
        },
          h('strong', null, (i + 1) + '. ' + lv.title), h('span', { class: 'sub' }, lv.blurb),
          h('span', { class: 'tag' }, done ? 'Done. ' + knownCount(lv.words) + ' of ' + lv.words.length + ' words known.' : open ? (partDone(i, 0) ? 'Part A done. Part B next.' : partDone(i, 1) ? 'Part B done. Part A next.' : 'Ready to play. Two parts of 5 words.') : 'Finish the level before this one'));
      }));
  }

  // ---------- Level ----------
  function startLevel(i) { L = { i: i, stage: 'hub' }; go({ tab: 'menu' }); }
  function startPart(i, part) {
    var nat = [], n = 5;
    for (var k = 0; k < n; k++) nat.push(k);
    var po = shuffle(nat), bo = shuffle(nat), t = 0;
    while (t++ < 20 && (bo.join() === po.join() || po.join() === nat.join() || bo.join() === nat.join())) {
      po = shuffle(nat); bo = shuffle(nat);
    }
    // New order, no hints, no misses. The meanings and hints are picked again when each word is shown,
    // so a replay uses a fresh wording of each meaning and new random hints.
    L = { i: i, part: part, stage: 'learn', k: 0, hint: {}, miss: {}, po: po, bo: bo, back: null };
    go({ tab: 'menu' });
  }
  function resumeDraft(d) {
    L = Object.assign({}, d, { hint: Object.assign({}, d.hint), miss: Object.assign({}, d.miss) });
    go({ tab: 'menu' });
  }
  // "Study these words again": go to the learn cards, starting at the word being asked, and come back to the same word.
  function studyAgain() {
    var cur = L.stage === 'puzzle' ? L.po[L.k] : L.stage === 'blank' ? L.bo[L.k] : 0;
    L.back = { stage: L.stage, k: L.k };
    L.stage = 'learn'; L.k = cur;
    go(view);
  }
  function backFromStudy() {
    var b = L.back;
    L.back = null; L.stage = b.stage; L.k = b.k;
    go(view);
  }
  // Buttons under the stages: study again, and replay this part (needs a second tap, because it starts the part over).
  function partTools(withStudy) {
    var armed = false, rb;
    rb = btn('Replay this part', 'alt', function () {
      if (!armed) {
        armed = true; rb.textContent = 'Tap again to start this part over';
        setTimeout(function () { armed = false; rb.textContent = 'Replay this part'; }, 5000);
        return;
      }
      startPart(L.i, L.part);
    });
    return h('div', { class: 'row parttools' }, withStudy ? btn('Study these words again', 'alt', studyAgain) : null, rb);
  }
  function stepBar(n) {
    return h('div', { class: 'steps' }, ['Learn', 'Swipe', 'Fill in', 'Quote'].map(function (t, i) {
      if (i === 0 && (n === 1 || n === 2)) {
        return h('button', { class: 'step', type: 'button', 'aria-label': 'Study these words again', on: { click: studyAgain } }, 'Learn ↺');
      }
      return h('span', { class: i === n ? 'on' : '' }, t);
    }));
  }
  function levelScreen() {
    var lv = LV[L.i], body;
    if (L.stage === 'hub') body = hubStage(lv);
    else if (L.stage === 'test') body = testStage(lv);
    else if (L.stage === 'testres') body = testResStage(lv);
    else if (L.stage === 'partdone') body = partDoneStage(lv);
    else if (L.stage === 'learn') body = learnStage(lv);
    else if (L.stage === 'puzzle') body = puzzleStage(lv);
    else if (L.stage === 'blank') body = blankStage(lv);
    else if (L.stage === 'quote') body = quoteStage(lv);
    else body = doneStage(lv);
    return h('div', null,
      h('div', { class: 'lhead' },
        h('button', { class: 'link', type: 'button', on: { click: function () { L = null; go({ tab: 'menu' }); } } }, '‹ Leave level'),
        h('h2', null, lv.title + (L.part != null && L.stage !== 'hub' && L.stage !== 'done' ? ', Part ' + 'AB'.charAt(L.part) : ''))),
      body);
  }

  function learnStage(lv) {
    var ws = pw(), n = ws.length, w = ws[L.k];
    return h('div', null, stepBar(0), progress(L.k + 1, n),
      h('article', { class: 'chalk' },
        h('p', { class: 'big' }, w.w),
        h('p', null, w.m),
        h('p', { class: 'ex' }, mark(w.ex, w.w)),
        h('p', { class: 'trick' }, 'Memory trick: ' + w.tip),
        w.fam ? h('p', { class: 'ex' }, 'Word family: ' + w.fam) : null,
        greNote(w.w) ? h('p', { class: 'gre' }, 'GRE context: ' + greNote(w.w)) : null),
      trickBox(w.w),
      L.back ? h('div', { class: 'row' }, btn(L.back.stage === 'puzzle' ? 'Back to the swipe puzzle' : 'Back to fill-in', '', backFromStudy)) : null,
      h('div', { class: 'row' },
        L.k > 0 ? btn('Back', 'alt', function () { L.k--; go(view); }) : null,
        L.back && L.k >= n - 1 ? null : btn(L.k < n - 1 ? 'Next word' : 'Start the puzzles', L.back ? 'alt' : '', function () {
          if (L.k < n - 1) L.k++; else { L.stage = 'puzzle'; L.k = 0; }
          go(view);
        })));
  }

  function puzzleStage(lv) {
    var ws = pw(), n = ws.length;
    var w = ws[L.po[L.k]], word = w.w, cur = '';
    L.mv = L.mv || {}; L.hl = L.hl || {}; L.hn = L.hn || {}; L.hf = L.hf || {};
    if (!L.mv[word]) L.mv[word] = meaningAt(word, pickIndex(word));
    var shown = L.mv[word];
    var hints = L.hl[word] || (L.hl[word] = hintList(w, shown));
    var slotEls = word.split('').map(function () { return h('span', { class: 'slot' }); });
    var slots = h('div', { class: 'slots', 'aria-live': 'polite' }, slotEls);
    function paint(s) {
      cur = s;
      var hint = !!L.hf[word];
      slotEls.forEach(function (el, i) {
        var c = s.charAt(i);
        el.textContent = c || (hint && i === 0 ? word.charAt(0) : '');
        el.classList.toggle('ghost', !c && hint && i === 0);
      });
    }
    var hintBox = h('div', { class: 'hint center hintbox', 'aria-live': 'polite' });
    var finish = h('div', { hidden: true },
      h('article', { class: 'chalk' }, h('p', { class: 'ex' }, mark(w.ex, w.w)), h('p', { class: 'trick' }, 'Memory trick: ' + w.tip),
        greNote(w.w) ? h('p', { class: 'gre' }, 'GRE context: ' + greNote(w.w)) : null),
      trickBox(w.w),
      h('div', { class: 'row' }, btn(L.k < n - 1 ? 'Next word' : 'Go to fill-in', '', function () {
        if (L.k < n - 1) L.k++; else { L.stage = 'blank'; L.k = 0; }
        go(view);
      })));
    var tools;
    var wheel = Wheel(word, {
      change: paint,
      solve: function () { paint(word); tools.hidden = true; hintBox.textContent = ''; finish.hidden = false; }
    });
    cleanups.push(wheel.destroy);
    var hintBtn;
    function showHints() {
      hintBox.textContent = '';
      var n = L.hn[word] || 0;
      for (var i = n - 1; i >= 0; i--) hintBox.append(h('p', null, hints[i].t)); // newest first, right under the button
      var left = hints.length - n;
      hintBtn.textContent = left ? (n ? 'Another hint (' + left + ')' : 'Hint (' + left + ')') : 'No more hints';
      hintBtn.disabled = !left;
    }
    hintBtn = btn('Hint', 'alt', function () {
      var n = L.hn[word] || 0;
      if (n >= hints.length) return;
      L.hint[word] = true; // using a hint means the word is not counted as known at first try
      L.hn[word] = n + 1;
      if (hints[n].first) L.hf[word] = true;
      showHints(); paint(cur);
    });
    showHints();
    tools = h('div', { class: 'row tools3' },
      btn('Shuffle', 'alt', function () { wheel.reshuffle(); }),
      btn('Clear', 'alt', function () { wheel.clear(); }),
      hintBtn);

    return h('div', null, stepBar(1), progress(L.k + 1, n),
      h('article', { class: 'chalk' }, h('p', { class: 'label' }, 'Swipe the letters to spell the word that means:'), h('p', { class: shown.length > 58 ? 'ex longdef' : 'ex' }, shown)),
      slots, wheel.el, tools, hintBox, finish, partTools(true));
  }

  function blankStage(lv) {
    var ws = pw(), n = ws.length;
    var w = ws[L.bo[L.k]], word = w.w;
    var opts = shuffle([word].concat(w.d));
    var sentence = h('p', { class: 'big3' }, w.s);
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var why = h('p', { class: 'ex' });
    var whyCard = h('article', { class: 'chalk', hidden: true }, why);
    var next = btn(L.k < n - 1 ? 'Next' : 'Last step', '', function () {
      if (L.k < n - 1) L.k++;
      else {
        ws.forEach(function (x) { rec(x.w, !(L.hint[x.w] || L.miss[x.w])); });
        save();
        L.stage = 'quote'; L.k = 0;
        if (!GR[lv.gis[L.part]].quote) { finishPart(); return; }
      }
      go(view);
    });
    var nextRow = h('div', { class: 'row', hidden: true }, next);
    var choices = Choices(opts, word, true, function (good) {
      if (good) {
        sentence.textContent = '';
        add(sentence, fillNode(w.s, word));
        fb.textContent = 'Correct.';
        why.textContent = 'Why: ' + w.why;
        whyCard.hidden = false;
        nextRow.hidden = false;
        if (whyCard.scrollIntoView) whyCard.scrollIntoView({ block: 'nearest' });
      } else {
        L.miss[word] = true;
        fb.textContent = 'Not quite. Read the clue words in the sentence again.';
      }
    });
    return h('div', null, stepBar(2), progress(L.k + 1, n),
      h('article', { class: 'chalk' }, h('p', { class: 'label' }, 'Pick the one word that fits. Some options look close, but only one is right:'), sentence),
      choices, fb, whyCard, nextRow, partTools(true));
  }

  function quoteStage(lv) {
    var q = GR[lv.gis[L.part]].quote;
    var opts = shuffle([q.answer].concat(others(q.answer, 3).map(function (x) { return x.w; })));
    var holder = h('div', null, quoteNode(q, false));
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var nextRow = h('div', { class: 'row', hidden: true }, btn('Add to my shelf', '', function () { finishPart(); }));
    var choices = Choices(opts, q.answer, true, function (good) {
      if (good) {
        holder.textContent = '';
        holder.append(quoteNode(q, true));
        fb.textContent = 'You unlocked a quote.';
        nextRow.hidden = false;
      } else fb.textContent = 'Not quite. Think about the meaning.';
    });
    return h('div', null, stepBar(3),
      h('p', { class: 'hint center' }, 'Fill the blank to unlock this quote.'),
      holder, choices, fb, nextRow, partTools(false));
  }

  function pw() { return LV[L.i].words.slice(5 * L.part, 5 * L.part + 5); }
  function finishPart() {
    var i = L.i, p = L.part, gi = LV[i].gis[p];
    var before = ITEMS.filter(function (x) { return x[3](); }).map(function (x) { return x[0]; });
    if (GR[gi].quote && S.quotes.indexOf(gi) < 0) S.quotes.push(gi);
    if (S.parts.indexOf(2 * i + p) < 0) S.parts.push(2 * i + p);
    delete S.drafts[pkey(i, p)];
    var both = partDone(i, 0) && partDone(i, 1), first = false;
    if (both && S.levels.indexOf(i) < 0) { S.levels.push(i); S.keys = Math.min(S.keys + 1, 99); first = true; }
    touch();
    save();
    L.first = first;
    L.newItems = ITEMS.filter(function (x) { return x[3]() && before.indexOf(x[0]) < 0; });
    L.stage = both ? 'done' : 'partdone';
    go(view);
  }

  // Level hub: two half-levels (Part A and Part B), each can be played or tested out of.
  function hubStage(lv) {
    function partCard(p) {
      var done = partDone(L.i, p), name = 'Part ' + 'AB'.charAt(p);
      var dr = S.drafts[pkey(L.i, p)], locked = S.tests[pkey(L.i, p)] === today();
      return h('section', { class: 'panel' },
        h('h2', null, name + (done ? ' (done)' : '')),
        h('p', null, '5 words, ' + (GR[lv.gis[p]].quote ? 'with a quote to unlock.' : 'no quote in this part.')),
        h('div', { class: 'row' },
          dr ? btn('Continue', '', function () { resumeDraft(dr); }) : null,
          btn(done ? 'Play again' : dr ? 'Replay this part' : 'Play ' + name, dr ? 'alt' : '', function () { startPart(L.i, p); }),
          done ? null : locked
            ? h('button', { class: 'btn alt', type: 'button', disabled: true }, 'Test out (try again tomorrow)')
            : btn('Test out (5 questions)', 'alt', function () { startTest(L.i, p); })),
        !done && locked ? h('p', { class: 'hint' }, 'You can try the test-out once a day for each part. Learn the part now, or try again tomorrow.') : null);
    }
    return h('div', null,
      h('p', { class: 'hint hubnote' }, lv.blurb + ' Play the two parts in any order. Already know a part? Test out: get 4 of 5 right on mixed questions to skip the lessons. You can try once a day for each part.'),
      partCard(0), partCard(1));
  }

  // Test-out: one question per word, 4 of 5 right passes the part. Each word gets a random kind of question
  // (fill-in sentence, "which word means this", or "what does this word mean"), so the questions change every time.
  // A part can be tested out of once a day. The try counts as soon as the first answer is given.
  function startTest(i, p) {
    if (S.tests[pkey(i, p)] === today()) { L = { i: i, stage: 'hub' }; go(view); return; }
    var ws = LV[i].words.slice(5 * p, 5 * p + 5);
    L = { i: i, part: p, stage: 'test', t: { qs: shuffle(ws).map(function (w) { return makeQ(w.w); }), k: 0, right: 0, miss: [], started: false } };
    go({ tab: 'menu' });
  }
  function testStage(lv) {
    var t = L.t, q = t.qs[t.k], n = t.qs.length;
    useQ(q);
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var nextRow = h('div', { class: 'row', hidden: true }, btn(t.k < n - 1 ? 'Next' : 'See result', '', function () {
      t.k++;
      if (t.k >= n) {
        t.pass = t.right >= 4;
        if (t.pass) {
          t.qs.forEach(function (x) { recAt(x.word, t.miss.indexOf(x.word) < 0 ? 2 : 0); });
          save();
        }
        L.stage = 'testres';
      }
      go(view);
    }));
    var choices = Choices(q.opts, q.ans, false, function (good) {
      if (!t.started) { t.started = true; S.tests[pkey(L.i, L.part)] = today(); }
      if (good) t.right++; else t.miss.push(q.word);
      save();
      fb.textContent = feedback(q, good);
      nextRow.hidden = false;
    });
    return h('div', null, progress(t.k + 1, n), qCard(q), choices, fb, nextRow);
  }
  function testResStage(lv) {
    var t = L.t, hasQuote = !!GR[lv.gis[L.part]].quote;
    if (t.pass) {
      return h('div', null,
        h('section', { class: 'panel' }, h('h2', null, 'You passed: ' + t.right + ' of 5'),
          h('p', null, 'These words are marked as known and will come back in Review.'),
          t.miss.length ? h('p', null, 'You missed: ' + t.miss.join(', ') + '. These will come back in Review tomorrow.') : null),
        h('div', { class: 'row' }, btn(hasQuote ? 'Unlock the quote' : 'Finish this part', '', function () {
          L.stage = 'quote'; L.k = 0; L.hint = {}; L.miss = {};
          if (!hasQuote) { finishPart(); return; }
          go(view);
        })));
    }
    return h('div', null,
      h('section', { class: 'panel' }, h('h2', null, 'Not yet: ' + t.right + ' of 5'),
        h('p', null, 'You need 4 right to test out. Nothing was changed in your progress.'),
        h('p', null, 'Words to learn: ' + t.miss.join(', ') + '.'),
        h('p', { class: 'hint' }, 'You can test out of this part again tomorrow, with different questions.')),
      h('div', { class: 'row' },
        btn('Learn this part', '', function () { startPart(L.i, L.part); }),
        btn('Back to level', 'alt', function () { L = { i: L.i, stage: 'hub' }; go(view); })));
  }
  function partDoneStage(lv) {
    var other = 1 - L.part, gi = lv.gis[L.part];
    return h('div', null,
      h('section', { class: 'panel' },
        h('h2', null, 'Part ' + 'AB'.charAt(L.part) + ' complete'),
        GR[gi].quote ? h('p', null, 'Your quote is on the shelf.') : null,
        h('p', null, 'Finish Part ' + 'AB'.charAt(other) + ' to complete the level and earn the key.'),
        L.newItems.length ? h('p', null, 'New in your café: ' + L.newItems.map(function (x) { return x[0] + ' ' + x[1]; }).join(', ') + '.') : null),
      h('div', { class: 'row' },
        btn('Back to level', '', function () { L = { i: L.i, stage: 'hub' }; go(view); }),
        btn('Replay this part', 'alt', function () { startPart(L.i, L.part); }),
        btn('Back to menu', 'alt', function () { L = null; go({ tab: 'menu' }); })));
  }

  function doneStage(lv) {
    return h('div', null,
      h('section', { class: 'panel' },
        h('h2', null, 'Level complete'),
        lv.quotes.length ? h('p', null, lv.quotes.length === 1 ? 'Your quote is on the shelf.' : 'Your ' + lv.quotes.length + ' quotes are on the shelf.') : null,
        h('p', null, 'Both parts are done.'),
        L.first ? h('p', null, '🗝️ You earned a key. Use it in the Drawer to open a quant puzzle.') : h('p', null, 'You already earned the key for this level.'),
        L.newItems.length ? h('p', null, 'New in your café: ' + L.newItems.map(function (x) { return x[0] + ' ' + x[1]; }).join(', ') + '.') : null,
        h('p', { class: 'hint' }, 'Your words will come back in Review so they stay in your memory.')),
      h('div', { class: 'row' },
        btn('Back to menu', '', function () { L = null; go({ tab: 'menu' }); }),
        S.keys > 0 ? btn('Open the drawer', 'alt', function () { L = null; go({ tab: 'drawer' }); }) : null));
  }

  // ---------- Questions for review and sprint ----------
  function makeQ(word) {
    var e = ALL.get(word);
    var r = Math.random();
    if (r < 0.34) {
      return { word: word, type: 'blank', prompt: e.s, ans: word, why: e.why, opts: shuffle([word].concat(e.d)) };
    }
    if (r < 0.67) {
      var sib = GR[e.gi].words.filter(function (x) { return x.w !== word; }).map(function (x) { return x.w; });
      return { word: word, type: 'rev', vw: word, prompt: meaningAt(word, peekIndex(word)), ans: word, why: '', opts: shuffle([word].concat(shuffle(sib).slice(0, 3))) };
    }
    var vi = peekIndex(word);
    var same = GR[e.gi].words.filter(function (x) { return x.w !== word; }).map(function (x) { return meaningAt(x.w, vi); });
    var right = meaningAt(word, vi);
    return { word: word, type: 'meaning', vw: word, prompt: word, ans: right, why: '', opts: shuffle([right].concat(shuffle(same).slice(0, 3))) };
  }
  function qCard(q) {
    return h('article', { class: 'chalk' },
      q.type === 'meaning'
        ? [h('p', { class: 'label' }, 'What does this word mean?'), h('p', { class: 'big' }, q.prompt)]
        : q.type === 'rev'
          ? [h('p', { class: 'label' }, 'Which word means this?'), h('p', { class: 'big3' }, q.prompt)]
          : [h('p', { class: 'label' }, 'Pick the word that fits the sentence:'), h('p', { class: 'big3' }, q.prompt)]);
  }
  function feedback(q, good) {
    var e = ALL.get(q.word);
    return (good ? 'Correct. ' : 'Not this time. ') + (q.why ? q.why + ' ' : '') + q.word + ' means: ' + e.m + ' Trick: ' + e.tip + (S.tricks[q.word] ? ' My trick: ' + S.tricks[q.word] : '') + (greNote(q.word) ? ' GRE context: ' + greNote(q.word) : '');
  }

  // ---------- Review ----------
  function startReview(practice) {
    var list = practice ? shuffle(Object.keys(S.words)).slice(0, 10) : dueList().slice(0, 10);
    RV = { practice: practice, qs: list.map(makeQ), k: 0, right: 0, end: false };
  }
  function reviewScreen() {
    var learned = Object.keys(S.words);
    if (!RV) {
      var due = dueList().length, weak = weakList();
      return h('div', null,
        h('section', { class: 'panel' },
          h('h2', null, 'Review'),
          learned.length ? h('p', null, due + ' due now. ' + learned.length + ' words learned. ' +
            learned.filter(function (w) { return state(w) === 'Known'; }).length + ' known, ' +
            learned.filter(function (w) { return state(w) === 'Mastered'; }).length + ' mastered.')
            : h('p', null, 'You have not learned any words yet. Finish a level first.'),
          h('p', { class: 'hint' }, 'New words come back after 1 day. Each time you get one right, the wait grows: 3, 7, then 14 days. A miss starts it over.'),
          due ? btn('Start review', '', function () { startReview(false); go(view); }) : null,
          !due && learned.length ? btn('Practice 10 words', '', function () { startReview(true); go(view); }) : null),
        weak.length ? h('section', { class: 'panel' }, h('h2', null, 'Words to watch'),
          h('div', { class: 'chips' }, weak.map(function (w) { return h('span', { class: 'chip' }, w); }))) : null);
    }
    if (RV.end) {
      return h('section', { class: 'panel' },
        h('h2', null, 'Review finished'),
        h('p', null, 'You got ' + RV.right + ' of ' + RV.qs.length + ' right.'),
        RV.practice ? h('p', { class: 'hint' }, 'This was extra practice. It does not change your review dates.') : h('p', { class: 'hint' }, 'Your next review dates are set.'),
        btn('Done', '', function () { RV = null; go({ tab: 'menu' }); }));
    }
    var q = RV.qs[RV.k];
    useQ(q);
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var nextRow = h('div', { class: 'row', hidden: true }, btn(RV.k < RV.qs.length - 1 ? 'Next' : 'Finish', '', function () {
      RV.k++;
      if (RV.k >= RV.qs.length) { RV.end = true; if (!RV.practice) touch(); save(); }
      go(view);
    }));
    var choices = Choices(q.opts, q.ans, false, function (good) {
      if (!RV.practice) rec(q.word, good);
      if (good) RV.right++;
      save();
      fb.textContent = feedback(q, good);
      nextRow.hidden = false;
    });
    return h('div', null, progress(RV.k + 1, RV.qs.length), qCard(q), choices, fb, nextRow);
  }

  // ---------- Special rounds ----------
  function startMode(type) {
    if (type === 'conf') M = { type: 'conf', qs: shuffle(X.confusables).slice(0, 8), k: 0, right: 0, end: false };
    else if (type === 'read') M = { type: 'read', pi: null };
    else if (type === 'syn') M = { type: 'syn', qs: buildSynQs(10), k: 0, right: 0, end: false };
    else if (type === 'ctx') M = { type: 'ctx', qs: shuffle(ctxPool()).slice(0, 8).map(ctxQ), k: 0, right: 0, end: false };
    else if (type === 'se') M = { type: 'se', qs: shuffle(sePool()).slice(0, 6), k: 0, right: 0, end: false };
    else if (type === 'tc') M = { type: 'tc', qs: shuffle(tcPool()).slice(0, 5), k: 0, right: 0, end: false };
    else {
      var learned = Object.keys(S.words);
      var order = uniq(dueList().concat(weakList(), shuffle(learned)));
      M = { type: 'sprint', started: false, qs: order.slice(0, 10).map(makeQ), k: 0, right: 0, end: false, miss: [] };
    }
    go({ tab: 'menu' });
  }
  function modeHead(title) {
    return h('div', { class: 'lhead' },
      h('button', { class: 'link', type: 'button', on: { click: function () { M = null; go({ tab: 'menu' }); } } }, '‹ Leave'),
      h('h2', null, title));
  }
  function modeScreen() {
    if (M.type === 'conf') return confScreen();
    if (M.type === 'read') return readScreen();
    if (M.type === 'syn') return qaScreen('Synonyms and antonyms');
    if (M.type === 'ctx') return qaScreen('Same word, new meaning');
    if (M.type === 'se') return seScreen();
    if (M.type === 'tc') return tcScreen();
    return sprintScreen();
  }

  function confScreen() {
    if (M.end) {
      return h('div', null, modeHead('Confusables'),
        h('section', { class: 'panel' }, h('h2', null, 'Round finished'),
          h('p', null, 'You got ' + M.right + ' of ' + M.qs.length + ' right.'),
          btn('Play again', '', function () { startMode('conf'); }),
          ' ', btn('Back to menu', 'alt', function () { M = null; go({ tab: 'menu' }); })));
    }
    var q = M.qs[M.k];
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var whyCard = h('article', { class: 'chalk', hidden: true }, h('p', { class: 'ex' }, q.why));
    var nextRow = h('div', { class: 'row', hidden: true }, btn(M.k < M.qs.length - 1 ? 'Next' : 'Finish', '', function () {
      M.k++; if (M.k >= M.qs.length) { M.end = true; touch(); save(); }
      go(view);
    }));
    var choices = Choices(shuffle(q.o), q.a, false, function (good) {
      if (good) M.right++;
      fb.textContent = good ? 'Correct.' : 'Not this time. The answer is ' + q.a + '.';
      whyCard.hidden = false; nextRow.hidden = false;
    });
    return h('div', null, modeHead('Confusables'), progress(M.k + 1, M.qs.length),
      h('article', { class: 'chalk' }, h('p', { class: 'label' }, 'Two words look alike. Pick the one that fits:'), h('p', { class: 'big3' }, q.s)),
      choices, fb, whyCard, nextRow);
  }

  // A passage opens when every word it uses has been learned (same rule as the other rounds).
  function passMissing(p) {
    return uniq(p.blanks.map(function (b) { return b.a; })).filter(function (w) { return ALL.has(w) && !S.words[w]; }).length;
  }
  function passText(p, k, upTo) {
    var parts = p.text.split(/\{(\d)\}/);
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      if (i % 2 === 0) out.push(parts[i]);
      else {
        var j = Number(parts[i]) - 1;
        if (upTo || j < k) out.push(h('strong', null, p.blanks[j].a));
        else if (j === k) out.push(h('strong', null, '_____'));
        else out.push('(' + (j + 1) + ')');
      }
    }
    return out;
  }
  function readScreen() {
    if (M.pi == null) {
      return h('div', null, modeHead('Reading'),
        h('section', { class: 'panel' }, h('h2', null, 'Choose a passage'),
          h('p', { class: 'hint' }, 'Passages use words you have already learned. Get 2 or more right to finish a passage and earn a key. You can try again.')),
        X.passages.map(function (p, i) {
          var miss = passMissing(p), ok = miss === 0;
          return h('button', {
            class: 'lvl' + (ok ? '' : ' locked') + (S.read.indexOf(i) >= 0 ? ' done' : ''), type: 'button', disabled: !ok,
            on: { click: function () { M.pi = i; M.k = 0; M.right = 0; M.end = false; go(view); } }
          }, h('strong', null, p.title),
            h('span', { class: 'tag' }, S.read.indexOf(i) >= 0 ? 'Done' : ok ? 'Ready to play' : 'Learn ' + miss + (miss === 1 ? ' more word' : ' more words') + ' to unlock'));
        }));
    }
    var p = X.passages[M.pi];
    if (M.end) {
      return h('div', null, modeHead(p.title),
        h('div', { class: 'passage' }, passText(p, 0, true)),
        h('section', { class: 'panel' }, h('h2', null, 'You got ' + M.right + ' of ' + p.blanks.length + ' right.'),
          M.gain ? h('p', null, '🗝️ You earned a key.') : null,
          M.right < 2 ? h('p', { class: 'hint' }, 'You need 2 right to finish this passage. Study the words and try again.') : null,
          M.right < 2 ? btn('Try again', '', function () { M.k = 0; M.right = 0; M.end = false; go(view); }) : null,
          M.right < 2 ? ' ' : null,
          btn('More passages', M.right < 2 ? 'alt' : '', function () { M.pi = null; go(view); })));
    }
    var b = p.blanks[M.k];
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var whyCard = h('article', { class: 'chalk', hidden: true }, h('p', { class: 'ex' }, b.why));
    var nextRow = h('div', { class: 'row', hidden: true }, btn(M.k < p.blanks.length - 1 ? 'Next blank' : 'Finish', '', function () {
      M.k++;
      if (M.k >= p.blanks.length) {
        M.end = true; M.gain = false;
        // The passage is finished (and a key given) only on a pass, so a bad first try does not lose the key.
        if (M.right >= 2 && S.read.indexOf(M.pi) < 0) { S.read.push(M.pi); S.keys = Math.min(S.keys + 1, 99); M.gain = true; }
        touch(); save();
      }
      go(view);
    }));
    var choices = Choices(shuffle(b.o), b.a, false, function (good) {
      if (good) M.right++;
      fb.textContent = good ? 'Correct.' : 'Not this time. The answer is ' + b.a + '.';
      whyCard.hidden = false; nextRow.hidden = false;
    });
    return h('div', null, modeHead(p.title), progress(M.k + 1, p.blanks.length),
      h('div', { class: 'passage' }, passText(p, M.k, false)),
      h('p', { class: 'hint center' }, 'Blank ' + (M.k + 1) + ' of ' + p.blanks.length), choices, fb, whyCard, nextRow);
  }

  function sprintScreen() {
    if (!M.started) {
      return h('div', null, modeHead('10-word sprint'),
        h('section', { class: 'panel' }, h('h2', null, 'Ready?'),
          h('p', null, '10 quick questions, ' + SPRINT_SECS + ' seconds each. Due and weak words come first.'),
          h('p', { class: 'hint' }, 'Your answers update your review dates.'),
          btn('Start (' + SPRINT_SECS + ' seconds each)', '', function () { M.started = true; M.relaxed = false; go(view); }),
          h('p', null, ' '),
          btn('Relaxed: no timer', 'alt', function () { M.started = true; M.relaxed = true; go(view); })));
    }
    if (M.end) {
      var secs = M.qs.length;
      return h('div', null, modeHead('10-word sprint'),
        h('section', { class: 'panel' }, h('h2', null, 'Sprint finished'),
          h('p', null, 'You got ' + M.right + ' of ' + secs + ' right.'),
          M.miss.length ? h('p', null, 'Words to look at again:') : h('p', null, 'No misses. Great run.'),
          M.miss.length ? h('div', { class: 'chips' }, M.miss.map(function (w) { return h('span', { class: 'chip' }, w + ': ' + ALL.get(w).m); })) : null,
          h('p', null, ' '),
          btn('Back to menu', '', function () { M = null; go({ tab: 'menu' }); })));
    }
    var q = M.qs[M.k], over = false;
    useQ(q);
    var fill = h('i'); fill.style.width = '100%';
    var timer = h('div', { class: 'timer', role: 'img', 'aria-label': 'Time left', hidden: !!M.relaxed }, fill);
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var iv, to, tt;
    function finish(good, timedOut) {
      if (over) return; over = true;
      clearInterval(iv);
      fill.style.width = fill.getBoundingClientRect().width + 'px'; // stop the bar where it is
      clearTimeout(tt);
      if (!timedOut) rec(q.word, good); // running out of time does not reset a word's review date
      if (good) M.right++; else M.miss.push(q.word);
      save();
      fb.textContent = good ? 'Correct.' : 'The answer: ' + (q.type === 'meaning' ? ALL.get(q.word).m : q.word);
      to = setTimeout(function () {
        M.k++;
        if (M.k >= M.qs.length) { M.end = true; touch(); save(); }
        go(view);
      }, 1300);
    }
    var choices = Choices(q.opts, q.ans, false, function (good) { finish(good); });
    if (!M.relaxed) {
      // One smooth CSS move for the whole time, instead of writing to the page ten times a second.
      // People who asked for less motion get one small step per second instead.
      var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (still) {
        var left = SPRINT_SECS;
        iv = setInterval(function () { left--; fill.style.width = Math.max(0, 100 * left / SPRINT_SECS) + '%'; }, 1000);
      } else {
        fill.style.transition = 'width ' + SPRINT_SECS + 's linear';
        requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.width = '0%'; }); });
      }
      tt = setTimeout(function () { choices.lock(); finish(false, true); }, SPRINT_SECS * 1000);
    }
    cleanups.push(function () { clearInterval(iv); clearTimeout(to); clearTimeout(tt); });
    return h('div', null, modeHead('10-word sprint'), progress(M.k + 1, M.qs.length), timer, qCard(q), choices, fb);
  }

  // ---------- GRE-style rounds ----------
  function learnedHas(w) { return !!S.words[w]; }
  function sePool() { return X2.se.filter(function (q) { return q.a.every(learnedHas); }); }
  function tcPool() { return X2.tc.filter(function (q) { return q.blanks.every(function (b) { return learnedHas(b.a); }); }); }
  function ctxPool() { return X2.ctx.filter(function (q) { return learnedHas(q.w); }); }
  function synWords() { return Object.keys(S.words).filter(function (w) { return SYN[w]; }); }

  // Synonym and antonym questions. Wrong options come from words in other clusters and are
  // never within two steps of the target word in the synonym/antonym web.
  var ADJ = null, SYNPOOL = [], ANTPOOL = [];
  function words(str) { return str ? str.split(',') : []; }
  function buildWeb() {
    ADJ = {};
    function link(a, b) { (ADJ[a] = ADJ[a] || {})[b] = true; (ADJ[b] = ADJ[b] || {})[a] = true; }
    Object.keys(SYN).forEach(function (w) {
      words(SYN[w][0]).concat(words(SYN[w][1])).forEach(function (t) { link(w, t); });
      SYNPOOL.push.apply(SYNPOOL, words(SYN[w][0]).map(function (t) { return [t, w]; }));
      ANTPOOL.push.apply(ANTPOOL, words(SYN[w][1]).map(function (t) { return [t, w]; }));
    });
  }
  function near(w) {
    var out = {};
    out[w] = true;
    Object.keys(ADJ[w] || {}).forEach(function (a) {
      out[a] = true;
      Object.keys(ADJ[a] || {}).forEach(function (b) { out[b] = true; });
    });
    return out;
  }
  function makeSynQ(word, kind) {
    if (!ADJ) buildWeb();
    var e = ALL.get(word), mine = near(word);
    var good = words(SYN[word][kind === 'syn' ? 0 : 1]);
    var trap = words(SYN[word][kind === 'syn' ? 1 : 0]);
    var pool = kind === 'syn' ? SYNPOOL : ANTPOOL;
    var ans = shuffle(good)[0], opts = [ans], seen = {};
    seen[ans] = true;
    if (trap.length) { var t = shuffle(trap)[0]; opts.push(t); seen[t] = true; }
    shuffle(pool).forEach(function (pr) {
      if (opts.length >= 4) return;
      var t = pr[0], owner = ALL.get(pr[1]);
      if (seen[t] || mine[t] || good.indexOf(t) >= 0 || trap.indexOf(t) >= 0 || owner.cl === e.cl) return;
      opts.push(t); seen[t] = true;
    });
    var label = kind === 'syn' ? 'Which word is closest in meaning to' : 'Which word is most nearly the opposite of';
    return {
      label: label, big: word, opts: shuffle(opts), ans: ans,
      why: word + ' means: ' + e.m + ' Close in meaning: ' + SYN[word][0].split(',').join(', ') + '.' +
        (SYN[word][1] ? ' Opposites: ' + SYN[word][1].split(',').join(', ') + '.' : '')
    };
  }
  function buildSynQs(n) {
    var order = uniq(dueList().concat(weakList(), shuffle(Object.keys(S.words)))).filter(function (w) { return SYN[w]; });
    return order.slice(0, n).map(function (w) {
      var kind = SYN[w][1] && Math.random() < 0.5 ? 'ant' : 'syn';
      return makeSynQ(w, kind);
    });
  }
  function ctxQ(q) {
    return {
      label: q.q === 'syn' ? 'In this sentence, which word is closest in meaning to “' + q.w + '”?' : 'In this sentence, which word is most nearly the opposite of “' + q.w + '”?',
      sentence: q.s, mark: q.w, opts: shuffle([q.a].concat(q.d)), ans: q.a, why: q.why
    };
  }
  function endPanel(title) {
    return h('div', null, modeHead(title),
      h('section', { class: 'panel' }, h('h2', null, 'Round finished'),
        h('p', null, 'You got ' + M.right + ' of ' + M.qs.length + ' right.'),
        btn('Play again', '', function () { startMode(M.type); }),
        ' ', btn('Back to menu', 'alt', function () { M = null; go({ tab: 'menu' }); })));
  }
  // One question at a time with 4 options (used by the synonym and contextual rounds).
  function qaScreen(title) {
    if (M.end) return endPanel(title);
    var q = M.qs[M.k];
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var whyCard = h('article', { class: 'chalk', hidden: true }, h('p', { class: 'ex' }, q.why));
    var nextRow = h('div', { class: 'row', hidden: true }, btn(M.k < M.qs.length - 1 ? 'Next' : 'Finish', '', function () {
      M.k++; if (M.k >= M.qs.length) { M.end = true; touch(); save(); }
      go(view);
    }));
    var choices = Choices(q.opts, q.ans, false, function (good) {
      if (good) M.right++;
      fb.textContent = good ? 'Correct.' : 'Not this time. The answer is ' + q.ans + '.';
      whyCard.hidden = false; nextRow.hidden = false;
    });
    return h('div', null, modeHead(title), progress(M.k + 1, M.qs.length),
      h('article', { class: 'chalk' }, h('p', { class: 'label' }, q.label),
        q.sentence ? h('p', { class: 'big3' }, mark(q.sentence, q.mark)) : h('p', { class: 'big' }, q.big)),
      choices, fb, whyCard, nextRow);
  }

  // Sentence Equivalence: pick 2 of 6. Both must be right for a point.
  function seScreen() {
    if (M.end) return endPanel('Sentence equivalence');
    var q = M.qs[M.k], picked = [], done = false, btns = [];
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var whyCard = h('article', { class: 'chalk', hidden: true }, h('p', { class: 'ex' }, q.why));
    var nextRow = h('div', { class: 'row', hidden: true }, btn(M.k < M.qs.length - 1 ? 'Next' : 'Finish', '', function () {
      M.k++; if (M.k >= M.qs.length) { M.end = true; touch(); save(); }
      go(view);
    }));
    var check = btn('Check my 2 words', '', function () {
      if (done || picked.length !== 2) return;
      done = true;
      var good = picked.every(function (o) { return q.a.indexOf(o) >= 0; });
      btns.forEach(function (b) {
        b.disabled = true;
        if (q.a.indexOf(b.textContent) >= 0) b.classList.add('ok');
        else if (picked.indexOf(b.textContent) >= 0) b.classList.add('bad');
      });
      if (good) M.right++;
      fb.textContent = good ? 'Correct. Both words give the same meaning.' : 'Not this time. The pair is ' + q.a[0] + ' and ' + q.a[1] + '.';
      check.hidden = true; whyCard.hidden = false; nextRow.hidden = false;
    });
    check.hidden = true;
    var wrap = h('div', { class: 'opts', role: 'group', 'aria-label': 'Choose two words' });
    shuffle(q.o).forEach(function (o) {
      var b = h('button', { class: 'opt', type: 'button', 'aria-pressed': 'false' }, o);
      b.addEventListener('click', function () {
        if (done) return;
        var i = picked.indexOf(o);
        if (i >= 0) picked.splice(i, 1);
        else if (picked.length < 2) picked.push(o);
        else return;
        b.classList.toggle('sel', picked.indexOf(o) >= 0);
        b.setAttribute('aria-pressed', picked.indexOf(o) >= 0 ? 'true' : 'false');
        check.hidden = picked.length !== 2;
      });
      btns.push(b); wrap.append(b);
    });
    return h('div', null, modeHead('Sentence equivalence'), progress(M.k + 1, M.qs.length),
      h('article', { class: 'chalk' },
        h('p', { class: 'label' }, 'Pick the TWO words that fill the blank and give sentences with the same meaning:'),
        h('p', { class: 'big3' }, q.s)),
      wrap, h('div', { class: 'row' }, check), fb, whyCard, nextRow);
  }

  // Text Completion: 2 or 3 blanks, 3 options each. All blanks must be right for a point.
  function tcScreen() {
    if (M.end) return endPanel('Text completion');
    var q = M.qs[M.k], n = q.blanks.length, picks = [], done = false;
    var textBox = h('p', { class: 'big3' });
    function paintText() {
      textBox.textContent = '';
      var parts = q.text.split(/\{(\d)\}/);
      parts.forEach(function (t, i) {
        if (i % 2 === 0) textBox.append(t);
        else {
          var j = Number(t) - 1;
          textBox.append(h('strong', null, picks[j] ? picks[j] : '(' + (j + 1) + ') _____'));
        }
      });
    }
    paintText();
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var whyCard = h('article', { class: 'chalk', hidden: true });
    var nextRow = h('div', { class: 'row', hidden: true }, btn(M.k < M.qs.length - 1 ? 'Next' : 'Finish', '', function () {
      M.k++; if (M.k >= M.qs.length) { M.end = true; touch(); save(); }
      go(view);
    }));
    var groups = [];
    var check = btn('Check my answers', '', function () {
      if (done) return;
      done = true;
      var all = true;
      q.blanks.forEach(function (b, j) {
        if (picks[j] !== b.a) all = false;
        groups[j].forEach(function (x) {
          x.disabled = true;
          if (x.textContent === b.a) x.classList.add('ok');
          else if (x.textContent === picks[j]) x.classList.add('bad');
        });
        whyCard.append(h('p', { class: 'ex' }, 'Blank ' + (j + 1) + ': ' + b.a + '. ' + b.why));
      });
      picks = q.blanks.map(function (b) { return b.a; }); paintText();
      if (all) M.right++;
      fb.textContent = all ? 'Correct. All blanks are right.' : 'Not this time. The right words are shown in green.';
      check.hidden = true; whyCard.hidden = false; nextRow.hidden = false;
    });
    check.hidden = true;
    var blocks = q.blanks.map(function (b, j) {
      var wrap = h('div', { class: 'opts', role: 'group', 'aria-label': 'Blank ' + (j + 1) }), list = [];
      shuffle(b.o).forEach(function (o) {
        var bt = h('button', { class: 'opt', type: 'button', 'aria-pressed': 'false' }, o);
        bt.addEventListener('click', function () {
          if (done) return;
          picks[j] = o;
          list.forEach(function (x) { x.classList.toggle('sel', x === bt); x.setAttribute('aria-pressed', x === bt ? 'true' : 'false'); });
          paintText();
          check.hidden = !q.blanks.every(function (_, k) { return picks[k]; });
        });
        list.push(bt); wrap.append(bt);
      });
      groups.push(list);
      return [h('p', { class: 'label center' }, 'Blank ' + (j + 1)), wrap];
    });
    return h('div', null, modeHead('Text completion'), progress(M.k + 1, M.qs.length),
      h('article', { class: 'chalk' },
        h('p', { class: 'label' }, 'Choose one word for each blank so the whole text makes sense (' + n + ' blanks):'),
        textBox),
      blocks, h('div', { class: 'row' }, check), fb, whyCard, nextRow);
  }

  // ---------- Lab ----------
  function labInfo(word) {
    var r = LAB[word];
    if (!r) return null;
    var pos = r[0].split('/');
    var forms = r[2] ? r[2].split(',').map(function (x) {
      var p = x.split(':'), opp = p[0].charAt(p[0].length - 1) === '-';
      return { p: opp ? p[0].slice(0, -1) : p[0], f: p[1], opp: opp };
    }) : [];
    return {
      pos: pos, tone: r[1], forms: forms,
      posText: pos.map(function (x) { return POSN[x]; }).join(' / '),
      toneText: TONE[r[1]] + ' tone'
    };
  }
  function labPool(p, not) {
    var out = [];
    Object.keys(LAB).forEach(function (w) {
      var i = labInfo(w);
      i.forms.forEach(function (f) { if (!f.opp && f.p === p && f.f !== not) out.push(f.f); });
    });
    return out;
  }
  function labOppPool(not) {
    var out = [];
    Object.keys(LAB).forEach(function (w) {
      labInfo(w).forms.forEach(function (f) { if (f.opp && f.f !== not) out.push(f.f); });
    });
    return out;
  }
  function makeLabQ(word) {
    var e = ALL.get(word), info = labInfo(word), types = ['tone'];
    if (info.pos.length === 1) types.push('pos');
    var fw = info.forms.filter(function (f) { return !f.opp; });
    var ow = info.forms.filter(function (f) { return f.opp; });
    if (fw.length) types.push('form');
    if (ow.length) types.push('opp');
    var t = types[Math.floor(Math.random() * types.length)];
    if (t === 'pos') {
      return { word: word, prompt: 'What part of speech is “' + word + '”?', opts: ['noun', 'verb', 'adjective', 'adverb'], ans: POSN[info.pos[0]],
        why: word + ' is a ' + POSN[info.pos[0]] + '. It means: ' + e.m };
    }
    if (t === 'tone') {
      return { word: word, prompt: 'Does “' + word + '” sound positive, negative or neutral?', opts: ['positive', 'negative', 'neutral'], ans: TONE[info.tone],
        why: word + ' has a ' + TONE[info.tone] + ' tone. It means: ' + e.m };
    }
    if (t === 'form') {
      var f = fw[Math.floor(Math.random() * fw.length)];
      var d = shuffle(uniq(labPool(f.p, f.f))).slice(0, 3);
      return { word: word, prompt: 'Which word is the ' + POSN[f.p] + ' form of “' + word + '”?', opts: shuffle([f.f].concat(d)), ans: f.f,
        why: f.f + ' is the ' + POSN[f.p] + ' form of ' + word + '.' };
    }
    var o = ow[Math.floor(Math.random() * ow.length)];
    var d2 = shuffle(uniq(labOppPool(o.f))).slice(0, 3);
    return { word: word, prompt: 'Which word is the opposite form of “' + word + '” (the ' + POSN[o.p] + ' that means "not ' + word + '")?', opts: shuffle([o.f].concat(d2)), ans: o.f,
      why: o.f + ' is the opposite ' + POSN[o.p] + ' of ' + word + '.' };
  }
  function labScreen() {
    var learned = Object.keys(S.words).filter(function (w) { return LAB[w]; }).sort();
    if (view.word) return labDetail(view.word);
    if (LQ) return labQuiz();
    return h('div', null,
      h('section', { class: 'panel' }, h('h2', null, 'Word Lab'),
        h('p', null, 'See the tone, part of speech and word forms of the words you have learned.'),
        learned.length < 3 ? h('p', { class: 'hint' }, 'Finish a level to fill the Lab.') : btn('Forms quiz (10 questions)', '', function () {
          LQ = { qs: shuffle(learned).slice(0, 10).map(makeLabQ), k: 0, right: 0, end: false };
          go(view);
        })),
      learned.length ? h('section', { class: 'panel' }, h('h2', null, learned.length + ' words'),
        searchBox(learned)) : null);
  }
  function searchBox(learned) {
    var chips = h('div', { class: 'chips' });
    function fill(q) {
      chips.textContent = '';
      learned.filter(function (w) { return w.indexOf(q) === 0 || (q.length > 1 && w.indexOf(q) >= 0); }).forEach(function (w) {
        chips.append(h('button', { class: 'chip tap', type: 'button', on: { click: function () { go({ tab: 'lab', word: w }); } } }, w));
      });
      if (!chips.childNodes.length) chips.append(h('p', { class: 'hint' }, 'No learned word matches.'));
    }
    var inp = h('input', { class: 'search', type: 'search', 'aria-label': 'Search your learned words', placeholder: 'Search words' });
    var wait = 0;
    inp.addEventListener('input', function () {
      clearTimeout(wait);
      wait = setTimeout(function () { fill(inp.value.trim().toLowerCase().slice(0, 20)); }, 150);
    });
    cleanups.push(function () { clearTimeout(wait); });
    fill('');
    return h('div', null, inp, chips);
  }
  function labDetail(w) {
    var e = ALL.get(w), info = labInfo(w);
    function line(label, text) { return h('p', null, h('span', { class: 'label' }, label + ': '), text); }
    return h('div', null,
      h('div', { class: 'lhead' }, h('button', { class: 'link', type: 'button', on: { click: function () { go({ tab: 'lab' }); } } }, '‹ Back to the Lab')),
      h('article', { class: 'chalk' },
        h('p', { class: 'big' }, w),
        h('p', null, e.m),
        line('Part of speech', info.posText),
        line('Tone', info.tone === '+' ? 'positive' : info.tone === '-' ? 'negative' : 'neutral'),
        info.forms.length ? h('div', null, h('p', { class: 'label' }, 'Word forms:'),
          h('ul', null, info.forms.map(function (f) {
            return h('li', null, f.f + ' (' + POSN[f.p] + (f.opp ? ', opposite' : '') + ')');
          }))) : h('p', { class: 'label' }, 'No common extra forms.'),
        e.fam ? line('Family', e.fam) : null,
        h('p', { class: 'ex' }, mark(e.ex, w)),
        h('p', { class: 'trick' }, 'Memory trick: ' + e.tip),
        greNote(w) ? h('p', { class: 'gre' }, 'GRE context: ' + greNote(w)) : null,
        trickBox(w)));
  }
  function labQuiz() {
    if (LQ.end) {
      return h('section', { class: 'panel' }, h('h2', null, 'Lab quiz finished'),
        h('p', null, 'You got ' + LQ.right + ' of ' + LQ.qs.length + ' right.'),
        btn('Back to the Lab', '', function () { LQ = null; go({ tab: 'lab' }); }));
    }
    var q = LQ.qs[LQ.k];
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' });
    var nextRow = h('div', { class: 'row', hidden: true }, btn(LQ.k < LQ.qs.length - 1 ? 'Next' : 'Finish', '', function () {
      LQ.k++; if (LQ.k >= LQ.qs.length) { LQ.end = true; touch(); save(); }
      go(view);
    }));
    var choices = Choices(q.opts, q.ans, false, function (good) {
      if (good) LQ.right++;
      fb.textContent = (good ? 'Correct. ' : 'Not this time. ') + q.why;
      nextRow.hidden = false;
    });
    return h('div', null, progress(LQ.k + 1, LQ.qs.length),
      h('article', { class: 'chalk' }, h('p', { class: 'big3' }, q.prompt)), choices, fb, nextRow);
  }

  // ---------- Shelf ----------
  function shelfScreen() {
    var got = GR.map(function (g, i) { return i; }).filter(function (i) { return S.quotes.indexOf(i) >= 0; });
    return h('div', null,
      h('section', { class: 'panel' }, h('h2', null, 'Quote shelf'),
        h('p', null, got.length + ' of ' + TOTAL_QUOTES + ' quotes unlocked.'),
        got.length ? null : h('p', { class: 'hint' }, 'Finish a level and fill in the blank to unlock your first quote.')),
      got.map(function (i) { return quoteNode(GR[i].quote, true); }));
  }

  // ---------- Drawer ----------
  function drawerScreen() {
    return h('div', null,
      h('section', { class: 'panel' }, h('h2', null, 'Puzzle drawer'),
        h('p', null, 'Each level gives you a key. A key opens one quant puzzle in the style of the GRE.'),
        h('p', { class: 'hint' }, 'Keys: ' + S.keys + '. Solved: ' + S.solved.length + ' of ' + P.length + '.'),
        msg ? h('p', { class: 'msg' }, msg) : null),
      P.map(function (p, i) {
        var solved = S.solved.indexOf(i) >= 0, open = S.open.indexOf(i) >= 0;
        return h('button', {
          class: 'lvl' + (solved ? ' done' : (!open && S.keys < 1 ? ' locked' : '')), type: 'button',
          on: { click: function () { openPuzzle(i); } }
        },
          h('strong', null, 'Puzzle ' + (i + 1) + ': ' + p.cat),
          h('span', { class: 'tag' }, solved ? 'Solved' : open ? 'Open. Tap to solve' : 'Locked. Uses 1 key'));
      }));
  }
  function openPuzzle(i) {
    var solved = S.solved.indexOf(i) >= 0, open = S.open.indexOf(i) >= 0;
    if (!solved && !open) {
      if (S.keys < 1) { msg = 'You need a key. Finish a level to earn one.'; go(view); return; }
      S.keys--; S.open.push(i); save();
    }
    msg = ''; PV = i; go(view);
  }
  function puzzleScreen() {
    var p = P[PV], solved = S.solved.indexOf(PV) >= 0;
    var why = h('p', { class: 'ex' }, solved ? p.why : '');
    var fb = h('p', { class: 'fb', 'aria-live': 'polite' }, solved ? 'You solved this one.' : '');
    var choices = Choices(p.opts, p.opts[p.ans], true, function (good) {
      if (good) {
        if (S.solved.indexOf(PV) < 0) S.solved.push(PV);
        S.open = S.open.filter(function (n) { return n !== PV; });
        touch(); save();
        fb.textContent = 'Correct!';
        why.textContent = p.why;
      } else fb.textContent = 'Not yet. Try again.';
    });
    var block = h('div', null,
      h('article', { class: 'chalk' }, h('p', { class: 'label' }, p.cat), h('p', { class: 'big3' }, p.q), why),
      choices, fb);
    if (solved) {
      Array.prototype.forEach.call(block.querySelectorAll('.opt'), function (b) {
        b.disabled = true; if (b.textContent === p.opts[p.ans]) b.classList.add('ok');
      });
    }
    return h('div', null,
      h('div', { class: 'lhead' }, h('button', { class: 'link', type: 'button', on: { click: function () { PV = null; go(view); } } }, '‹ Back to drawer')),
      block);
  }

  // ---------- More ----------
  // A plain-language report of what the app keeps, and what protects it. Everything here is checked by tests/security.test.js.
  function privacyReport() {
    var rows = storageReport(), extras = rows.filter(function (r) { return r.suffix; });
    function kb(b) { return b < 1024 ? b + ' bytes' : (b / 1024).toFixed(1) + ' KB'; }
    return h('section', { class: 'panel', id: 'privacy-report' }, h('h2', null, 'What this app stores'),
      h('ul', { class: 'plain' }, rows.length
        ? rows.map(function (r) { return h('li', null, r.name + ': ' + kb(r.bytes)); })
        : [h('li', null, 'Nothing yet. Progress is saved after your first answer.')]),
      h('p', { class: 'hint' }, 'It is all text in this app\'s private storage on this phone. Nothing is sent anywhere.'),
      h('ul', { class: 'plain' },
        h('li', null, 'Network: the app\'s security policy blocks every connection (connect-src \'none\').'),
        h('li', null, 'Code: no remote scripts, no inline scripts, no eval.'),
        h('li', null, 'Backup codes: checked for size, format and a checksum before anything is used, and nothing in them is ever run as code.')),
      extras.length ? btn('Delete the safety copies only', 'alt', function () {
        wipeExtras(); msg = 'Safety copies deleted. Your progress was not changed.'; go({ tab: 'more' }, true);
      }) : null);
  }

  function moreScreen() {
    var out = h('textarea', { readonly: true, 'aria-label': 'Your backup code', hidden: true, autocomplete: 'off', spellcheck: 'false' });
    var inp = h('textarea', { 'aria-label': 'Paste a backup code here', placeholder: 'Paste your backup code here', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' });
    var note = h('p', { class: 'msg', 'aria-live': 'polite' }, msg);
    msg = '';
    function clearRuntime() { L = null; M = null; RV = null; LQ = null; PV = null; }
    function arm(b, label, armedLabel) { // two taps: the second one must come within a few seconds
      var on = false, tm;
      return {
        tapped: function () {
          if (on) { on = false; clearTimeout(tm); b.textContent = label; return true; }
          on = true; b.textContent = armedLabel;
          tm = setTimeout(function () { on = false; b.textContent = label; }, 6000);
          return false;
        },
        reset: function () { on = false; clearTimeout(tm); b.textContent = label; }
      };
    }

    var resetBtn, resetArm;
    resetBtn = btn('Erase my progress', 'alt', function () {
      if (!resetArm.tapped()) return;
      var theme = S.theme;
      S = fresh(); S.theme = theme; wipeExtras(); save(); msg = 'All progress erased.'; clearRuntime();
      go({ tab: 'more' });
    });
    resetArm = arm(resetBtn, 'Erase my progress', 'Tap again to erase everything');

    var copyBtn = btn('Copy the code', 'alt', function () {
      function fallback() {
        try { out.select(); note.textContent = document.execCommand('copy') ? 'Copied.' : 'Could not copy. Select the text and copy it.'; }
        catch (e) { note.textContent = 'Could not copy. Select the text and copy it.'; }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(out.value).then(function () { note.textContent = 'Copied.'; }, fallback);
      else fallback();
    });
    copyBtn.hidden = true;
    var makeBtn = btn('Make backup code', '', function () {
      note.textContent = 'Making the code...';
      makeCode().then(function (c) {
        out.value = c; out.hidden = false; copyBtn.hidden = false;
        note.textContent = 'Copy this code and keep it safe.';
      }, function (e) {
        note.textContent = 'Could not make the code. ' + (e && e.message ? e.message : 'Please try again.');
      });
    });

    var restoreBtn, restoreArm;
    restoreBtn = btn('Restore from code', 'alt', function () {
      readCode(inp.value).then(function (st) {
        if (!st) { restoreArm.reset(); note.textContent = 'That code is not valid. Check that you copied all of it.'; return; }
        if (!restoreArm.tapped()) { note.textContent = 'This replaces your current progress. Tap again to continue. You can undo it afterwards.'; return; }
        savePrev();
        S = st; save(); applyTheme(); clearRuntime();
        msg = 'Progress restored. If this was a mistake, tap "Undo last restore".'; go({ tab: 'more' });
      });
    });
    restoreArm = arm(restoreBtn, 'Restore from code', 'Tap again to replace my progress');
    var undoBtn = readPrev() ? btn('Undo last restore', 'alt', function () {
      var prev = readPrev();
      if (!prev) { note.textContent = 'There is nothing to undo.'; return; }
      S = prev; save(); applyTheme(); clearRuntime();
      try { localStorage.removeItem(KEY + '.prev'); } catch (e) { /* ignore */ }
      msg = 'Your earlier progress is back.'; go({ tab: 'more' });
    }) : null;

    var learned = Object.keys(S.words);
    return h('div', null,
      h('section', { class: 'panel' }, h('h2', null, 'Your progress'),
        h('p', null, S.levels.length + ' of ' + LV.length + ' levels. ' + learned.length + ' of ' + ALL.size + ' words learned. ' +
          learned.filter(function (w) { return state(w) === 'Mastered'; }).length + ' mastered.'),
        h('p', null, 'Best streak: ' + S.best + ' days.'),
        h('p', null, 'Choose a theme below, or tap the round button at the top to go through them.')),
      h('section', { class: 'panel' }, h('h2', null, 'Themes'),
        h('div', { class: 'tgrid' }, THEMES.map(function (t) {
          return h('button', {
            class: 'tcard' + (t.id === S.theme ? ' on' : ''), type: 'button', 'data-theme': t.id,
            'aria-pressed': t.id === S.theme ? 'true' : 'false',
            on: { click: function () { S.theme = t.id; save(); applyTheme(); go(view, true); } }
          }, h('span', { class: 'tname' }, t.icon + ' ' + t.name + (t.id === S.theme ? ' ✓' : '')),
            h('span', { class: 'tsw' }, h('i', { class: 's1' }), h('i', { class: 's2' }), h('i', { class: 's3' })));
        }))),
      h('section', { class: 'panel' }, h('h2', null, 'Your privacy'),
        h('p', null, 'No account. No ads. No tracking. No internet needed.'),
        h('p', null, 'Your progress is saved only on this phone. If you uninstall the app, it is deleted.'),
        h('p', { class: 'hint' }, 'Nothing is ever sent anywhere, so there is nothing to leak or hack online.')),
      privacyReport(),
      h('section', { class: 'panel' }, h('h2', null, 'Backup'),
        h('p', null, 'A backup code is plain text. Keep it in a note or email it to yourself. Paste it on a new phone to continue.'),
        makeBtn, ' ', copyBtn,
        out,
        h('p', null, ' '),
        inp,
        restoreBtn, ' ', undoBtn,
        h('p', { class: 'hint' }, 'Restoring replaces your current progress. The app keeps one safety copy on this phone so you can undo it.'),
        note),
      h('section', { class: 'panel' }, h('h2', null, 'Erase'), resetBtn,
        h('p', { class: 'hint' }, 'This also removes the safety copies.')),
      h('section', { class: 'panel' }, h('h2', null, 'About'),
        h('p', { class: 'hint' }, 'Word Café is an independent study game. It is not affiliated with or endorsed by ETS. GRE is a registered trademark of ETS.'),
        h('p', { class: 'hint' }, 'Word Café ' + VERSION + '. ' + ALL.size + ' words, ' + TOTAL_QUOTES + ' quotes, ' + P.length + ' quant puzzles. Quotes are from works in the public domain.')));
  }

  try { applyTheme(); render(); } catch (e) { fatalScreen(); }
})();
