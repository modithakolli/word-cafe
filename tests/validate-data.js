// Checks the game data and the rules that protect saved progress. Run with:  npm test
// Add  --update-lock  after you APPEND new levels, groups, puzzles or passages, to extend tests/ids.lock.json.
// Ids may be added at the end, but never changed, removed or reordered (that would move players' progress).
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const sandbox = { window: {} };
vm.createContext(sandbox);
const FILES = ['data.js', 'data2.js', 'data3.js', 'data4.js', 'data5.js', 'data6.js', 'data7.js', 'data8.js',
  'lab.js', 'lab2.js', 'lab3.js', 'lab4.js', 'lab5.js', 'extras.js', 'extras2.js', 'extras3.js', 'extras4.js', 'syn.js', 'syn2.js', 'syn3.js', 'var.js', 'var2.js', 'version.js'];
FILES.forEach(function (f) { vm.runInContext(fs.readFileSync(path.join(www, f), 'utf8'), sandbox, { filename: f }); });
const W = sandbox.window;

const errors = [];
function bad(msg) { errors.push(msg); }
function check(cond, msg) { if (!cond) bad(msg); }

// ---- the same lists the app builds ----
const GR = [].concat(W.WORD_CAFE.groups, W.WORD_CAFE2.groups, W.WORD_CAFE3.groups, W.WORD_CAFE4.groups, W.WORD_CAFE5.groups, W.WORD_CAFE6.groups, W.WORD_CAFE7.groups, W.WORD_CAFE8.groups);
const LVT = [].concat(W.WORD_CAFE2.levels, W.WORD_CAFE3.levels, W.WORD_CAFE5.levels, W.WORD_CAFE7.levels, W.WORD_CAFE8.levels);
const P = [].concat(W.WORD_CAFE.puzzles, W.WORD_CAFE3.puzzles, W.WORD_CAFE5.puzzles, W.WORD_CAFE7.puzzles, W.WORD_CAFE8.puzzles);
const PASS = [].concat(W.WORD_CAFE_X.passages, W.WORD_CAFE_X2.passages, W.WORD_CAFE_X4.passages);
const LAB = W.WORD_CAFE_LAB, SYN = W.WORD_CAFE_SYN, VAR = W.WORD_CAFE_VAR;
const SE = [].concat(W.WORD_CAFE_X2.se, W.WORD_CAFE_X3.se, W.WORD_CAFE_X4.se), TC = [].concat(W.WORD_CAFE_X2.tc, W.WORD_CAFE_X3.tc, W.WORD_CAFE_X4.tc), CTX = [].concat(W.WORD_CAFE_X2.ctx, W.WORD_CAFE_X3.ctx, W.WORD_CAFE_X4.ctx);

// ---- ids: present, unique, and never reordered ----
function idsOf(list, label) {
  const ids = list.map(function (x, i) { check(x && typeof x.id === 'string' && /^[A-Za-z0-9_-]{1,12}$/.test(x.id), label + ' ' + (i + 1) + ' has no valid id'); return x && x.id; });
  check(new Set(ids).size === ids.length, label + ' ids are not unique');
  return ids;
}
const current = { levels: idsOf(LVT, 'level'), groups: idsOf(GR, 'group'), puzzles: idsOf(P, 'puzzle'), passages: idsOf(PASS, 'passage') };
const lockPath = path.join(__dirname, 'ids.lock.json');
if (process.argv.indexOf('--update-lock') >= 0) {
  fs.writeFileSync(lockPath, JSON.stringify(current, null, 1) + '\n');
  console.log('ids.lock.json updated');
}
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
Object.keys(lock).forEach(function (k) {
  lock[k].forEach(function (id, i) {
    check(current[k][i] === id, 'saved-progress ids changed: ' + k + ' #' + (i + 1) + ' was "' + id + '" but is now "' + current[k][i] + '". Only add new items at the END.');
  });
});

// ---- structure ----
check(GR.length === 2 * LVT.length, 'every level needs exactly 2 groups: ' + LVT.length + ' levels but ' + GR.length + ' groups');
check(P.length === LVT.length, 'every level needs one quant puzzle: ' + LVT.length + ' levels but ' + P.length + ' puzzles');
const clusters = {};
GR.forEach(function (g, gi) {
  check(g.words && g.words.length === 5, 'group ' + g.id + ' must have 5 words');
  check(g.cluster && !clusters[g.cluster], 'group ' + g.id + ' reuses cluster "' + g.cluster + '" (also in ' + clusters[g.cluster] + ')');
  clusters[g.cluster] = g.id;
  if (g.quote) {
    check(g.quote.text && g.quote.text.indexOf('____') >= 0, g.id + ': quote text needs ____');
    check(g.words.some(function (w) { return w.w === g.quote.answer; }), g.id + ': quote answer "' + g.quote.answer + '" is not one of the 5 words');
  }
});

// ---- words ----
const WORDS = {};
const groupOf = {};
GR.forEach(function (g) {
  (g.words || []).forEach(function (w) {
    const id = g.id + ' ' + w.w;
    check(/^[a-z]{3,11}$/.test(w.w), id + ': word must be 3 to 11 lowercase letters (it must fit the wheel)');
    check(!WORDS[w.w], id + ': word is used twice');
    WORDS[w.w] = w; groupOf[w.w] = g;
    ['m', 'ex', 'tip', 's', 'why'].forEach(function (f) { check(typeof w[f] === 'string' && w[f].trim(), id + ': missing ' + f); });
    check(w.ex && new RegExp('\\b' + w.w, 'i').test(w.ex), id + ': example sentence does not use the word');
    check(w.s && w.s.indexOf('____') >= 0, id + ': fill-in sentence needs ____');
    check(Array.isArray(w.d) && w.d.length === 3 && new Set(w.d).size === 3 && w.d.indexOf(w.w) < 0, id + ': needs 3 different wrong options');
    check(LAB[w.w] && LAB[w.w].length === 3, id + ': missing Lab entry');
    check(SYN[w.w] && SYN[w.w].length === 2, id + ': missing synonym entry');
    check(VAR[w.w] && VAR[w.w].length === 3 && VAR[w.w].every(function (x) { return typeof x === 'string' && x.trim(); }), id + ': missing meaning variants (var.js)');
  });
});
Object.keys(LAB).forEach(function (w) { check(WORDS[w], 'Lab entry for unknown word: ' + w); });
Object.keys(SYN).forEach(function (w) { check(WORDS[w], 'synonym entry for unknown word: ' + w); });
Object.keys(VAR).forEach(function (w) { check(WORDS[w], 'variant entry for unknown word: ' + w); });

// ---- the question "What does this word mean?" must never show two identical options in a group ----
GR.forEach(function (g) {
  [0, 1, 2].forEach(function (vi) {
    const seen = {};
    g.words.forEach(function (w) {
      const v = [w.m, VAR[w.w] && VAR[w.w][0], VAR[w.w] && VAR[w.w][1]][vi];
      if (!v) return;
      const key = v.trim().toLowerCase().replace(/[.]$/, '');
      check(!seen[key], g.id + ': "' + w.w + '" and "' + seen[key] + '" have the same meaning wording ("' + v + '") at variant ' + vi);
      seen[key] = w.w;
    });
  });
});

// ---- puzzles, passages, special rounds ----
P.forEach(function (p) {
  check(Array.isArray(p.opts) && p.opts.length >= 2 && Number.isInteger(p.ans) && p.ans >= 0 && p.ans < p.opts.length, p.id + ': bad options or answer index');
  check(p.q && p.why, p.id + ': missing question or reason');
});
PASS.forEach(function (p) {
  const used = (p.text.match(/\{(\d)\}/g) || []).map(function (t) { return Number(t.slice(1, -1)); });
  check(used.length === p.blanks.length && used.every(function (n, i) { return n === i + 1; }), p.id + ': blanks {1}{2}... do not match the blank list');
  p.blanks.forEach(function (b, i) {
    check(WORDS[b.a], p.id + ' blank ' + (i + 1) + ': answer "' + b.a + '" is not a game word');
    check(b.o.indexOf(b.a) >= 0, p.id + ' blank ' + (i + 1) + ': answer is not in the options');
  });
});
SE.forEach(function (q, i) { q.a.forEach(function (w) { check(WORDS[w], 'sentence equivalence #' + (i + 1) + ': "' + w + '" is not a game word'); check(q.o.indexOf(w) >= 0, 'sentence equivalence #' + (i + 1) + ': answer missing from options'); }); });
TC.forEach(function (q, i) { q.blanks.forEach(function (b) { check(WORDS[b.a], 'text completion #' + (i + 1) + ': "' + b.a + '" is not a game word'); check(b.o.indexOf(b.a) >= 0, 'text completion #' + (i + 1) + ': answer missing from options'); }); });
CTX.forEach(function (q, i) { check(WORDS[q.w], 'same-word question #' + (i + 1) + ': "' + q.w + '" is not a game word'); });
W.WORD_CAFE_X.confusables.forEach(function (q, i) { check(q.o.indexOf(q.a) >= 0, 'confusable #' + (i + 1) + ': answer missing from options'); });

// ---- version file matches package.json ----
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
check(W.WORD_CAFE_VERSION === pkg.version, 'www/version.js says ' + W.WORD_CAFE_VERSION + ' but package.json says ' + pkg.version + '. Run: node scripts/write-version.js');

// ---- no network or script tricks in the app code ----
const app = fs.readFileSync(path.join(www, 'app.js'), 'utf8').replace(/^\/\*[\s\S]*?\*\//, '').split('\n').filter(function (l) { return !/^\s*\/\//.test(l); }).join('\n');
['innerHTML', 'eval(', 'document.write', 'fetch(', 'XMLHttpRequest', 'outerHTML', 'insertAdjacentHTML'].forEach(function (bannedText) {
  check(app.indexOf(bannedText) < 0, 'app.js uses ' + bannedText);
});

if (errors.length) {
  console.error('\n' + errors.length + ' problem(s):');
  errors.slice(0, 60).forEach(function (e) { console.error(' - ' + e); });
  if (errors.length > 60) console.error(' ... and ' + (errors.length - 60) + ' more');
  process.exit(1);
}
console.log('Data OK: ' + Object.keys(WORDS).length + ' words, ' + GR.length + ' groups, ' + LVT.length + ' levels, ' + P.length + ' puzzles, ' + PASS.length + ' passages.');
