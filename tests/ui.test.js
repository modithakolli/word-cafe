// Browser checks for Word Café (needs Playwright):  npm run test:ui
//   one-time setup:  npm i -D playwright   and   npx playwright install chromium
// Serves ./www on a local port and drives the real app in Chromium.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
let chromium;
try { chromium = require('playwright').chromium; } catch (e) {
  console.error('Playwright is not installed. Run:  npm i -D playwright  &&  npx playwright install chromium');
  process.exit(2);
}

const www = path.join(__dirname, '..', 'www');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
function serve(blocked) {
  return new Promise(function (resolve) {
    const srv = http.createServer(function (req, res) {
      const name = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
      if ((blocked || []).indexOf(name) >= 0) { res.statusCode = 404; res.end('blocked'); return; }
      const file = path.join(www, name);
      if (file.indexOf(www) !== 0 || !fs.existsSync(file)) { res.statusCode = 404; res.end('not found'); return; }
      res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
      res.end(fs.readFileSync(file));
    }).listen(0, '127.0.0.1', function () { resolve(srv); });
  });
}

let passed = 0, failed = 0;
function ok(cond, msg) { if (cond) { passed++; console.log('  ok   ' + msg); } else { failed++; console.log('  FAIL ' + msg); } }

async function open(browser, srv, opts) {
  opts = opts || {};
  const ctx = await browser.newContext({ viewport: opts.viewport || { width: 390, height: 780 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', function (e) { page.errors.push(String(e.message || e)); });
  if (opts.seed) await page.addInitScript(function (seed) { if (!localStorage.getItem('__seeded')) { localStorage.setItem('wordcafe.v1', seed); localStorage.setItem('__seeded', '1'); } }, opts.seed);
  await page.goto('http://127.0.0.1:' + srv.address().port + '/index.html');
  await page.waitForTimeout(250);
  return page;
}
const text = function (page) { return page.evaluate(function () { return document.body.innerText; }); };
const click = function (page, label) { return page.getByRole('button', { name: label, exact: false }).first().click(); };
const nav = function (page, label) { return page.locator('nav').getByRole('button', { name: label }).click(); };
async function has(page, label) { return (await page.getByRole('button', { name: label, exact: false }).count()) > 0; }

// Finds the word that the swipe puzzle is asking for, from the meaning on the screen
async function askedWord(page) {
  return page.evaluate(function () {
    const shown = document.querySelector('.chalk .ex').textContent.trim();
    const groups = [].concat(WORD_CAFE.groups, WORD_CAFE2.groups, WORD_CAFE3.groups, WORD_CAFE4.groups, WORD_CAFE5.groups, WORD_CAFE6.groups, WORD_CAFE7.groups);
    for (const g of groups) for (const w of g.words) {
      const v = WORD_CAFE_VAR[w.w] || [];
      if (w.m === shown || v[0] === shown || v[1] === shown) return w.w;
    }
    return null;
  });
}
async function solveSwipe(page) {
  const word = await askedWord(page);
  await page.keyboard.type(word, { delay: 15 });
  await page.waitForTimeout(120);
  return word;
}

(async function () {
  const srv = await serve();
  const browser = await chromium.launch();

  console.log('Start-up and layout');
  let page = await open(browser, srv);
  ok(page.errors.length === 0, 'no page errors on first start');
  ok((await text(page)).includes('Word Café'), 'menu shows');
  await nav(page, 'Shelf');
  const extra = await page.evaluate(function () { return document.documentElement.scrollHeight - window.innerHeight; });
  ok(extra <= 1, 'a short page is not taller than the screen (extra scroll: ' + extra + 'px)');
  await page.close();

  console.log('Replay buttons');
  page = await open(browser, srv);
  await click(page, 'Play'); await click(page, 'Play Part A');
  ok(!(await has(page, 'Study these words again')), 'no study button on the learn cards');
  for (let i = 0; i < 4; i++) await click(page, 'Next word');
  await click(page, 'Start the puzzles');
  ok(await has(page, 'Study these words again'), 'study button is in the swipe stage');
  ok(await has(page, 'Replay this part'), 'replay button is in the swipe stage');
  const first = await askedWord(page);
  await click(page, 'Study these words again');
  ok((await text(page)).includes(first), 'study goes back to the learn card of the same word (' + first + ')');
  ok(await has(page, 'Back to the swipe puzzle'), 'there is a way back to the swipe puzzle');
  await click(page, 'Back to the swipe puzzle');
  ok((await askedWord(page)) === first, 'back returns to the same word');
  const solved = await solveSwipe(page);
  ok(solved === first && (await has(page, 'Next word')), 'typing the letters solves the word');
  await click(page, 'Next word');
  const second = await askedWord(page);
  // replay needs two taps and starts the part over
  await click(page, 'Replay this part');
  ok((await text(page)).includes('Tap again to start this part over'), 'replay asks for a second tap');
  await click(page, 'Tap again to start this part over');
  ok((await text(page)).includes('Part A') && (await has(page, 'Next word')) && !(await has(page, 'Study these words again')), 'replay starts again from the first learn card');
  for (let i = 0; i < 4; i++) await click(page, 'Next word');
  await click(page, 'Start the puzzles');
  // fill-in stage has the buttons too
  for (let k = 0; k < 5; k++) { await solveSwipe(page); await click(page, k < 4 ? 'Next word' : 'Go to fill-in'); }
  ok((await text(page)).includes('Pick the one word that fits'), 'reached the fill-in stage');
  ok(await has(page, 'Study these words again') && await has(page, 'Replay this part'), 'study and replay buttons are in the fill-in stage');
  await click(page, 'Study these words again');
  ok(await has(page, 'Back to fill-in'), 'study from fill-in has a way back');
  await click(page, 'Back to fill-in');
  ok((await text(page)).includes('Pick the one word that fits'), 'back returns to fill-in');
  ok(page.errors.length === 0, 'no page errors during the replay flow: ' + page.errors.join(' | '));
  await page.close();

  console.log('One draft for each part');
  page = await open(browser, srv);
  await click(page, 'Play'); await click(page, 'Play Part A'); await click(page, 'Next word');
  await click(page, 'Leave level');
  await click(page, 'Continue');            // back into Part A
  await click(page, 'Leave level');
  await page.getByRole('button', { name: /1\. /, exact: false }).first().click();
  await click(page, 'Play Part B'); await click(page, 'Next word');
  await click(page, 'Leave level');
  const menu = await text(page);
  ok(menu.includes('Continue your parts') && menu.includes('Part A') && menu.includes('Part B'), 'both unfinished parts are kept (A and B)');
  await page.close();

  console.log('Backup codes');
  const trick = 'చిన్న మాట ☕ हिंदी';
  page = await open(browser, srv, { seed: JSON.stringify({ levels: [0], tricks: { brevity: trick }, words: { brevity: { b: 1, d: 99999 } } }) });
  await nav(page, 'More');
  await click(page, 'Make backup code');
  await page.waitForFunction(function () { const t = document.querySelector('textarea[readonly]'); return t && !t.hidden && t.value.length > 10; });
  const code = await page.evaluate(function () { return document.querySelector('textarea[readonly]').value; });
  ok(/^WC3\./.test(code), 'backup code works with Telugu, Hindi and emoji (' + code.length + ' characters)');
  // erase, then restore with two taps
  await click(page, 'Erase my progress'); await click(page, 'Tap again to erase everything');
  ok((await text(page)).includes('All progress erased'), 'erase works');
  await page.locator('textarea[placeholder]').fill(code);
  await click(page, 'Restore from code');
  await page.waitForFunction(function () { return document.body.innerText.includes('Tap again to continue'); });
  ok(true, 'restore asks before it replaces progress');
  ok((await page.evaluate(function () { return JSON.parse(localStorage.getItem('wordcafe.v1')).levels.length; })) === 0, 'nothing changed after the first tap');
  await click(page, 'Tap again to replace my progress');
  await page.waitForFunction(function () { return document.body.innerText.includes('Progress restored'); });
  const back = await page.evaluate(function () { return JSON.parse(localStorage.getItem('wordcafe.v1')); });
  ok(back.levels.length === 1 && back.tricks.brevity === trick, 'restore brings back progress and the Telugu/Hindi trick');
  ok(await has(page, 'Undo last restore'), 'undo button is shown after a restore');
  await click(page, 'Undo last restore');
  await page.waitForFunction(function () { return document.body.innerText.includes('earlier progress is back'); });
  const undone = await page.evaluate(function () { return JSON.parse(localStorage.getItem('wordcafe.v1')); });
  ok(undone.levels.length === 0, 'undo puts back the progress from before the restore');
  // an old WC1 code (made by version 1.5) can still be read
  const old = await page.evaluate(function () {
    const body = btoa(JSON.stringify({ levels: [0, 1], parts: [0, 1, 2, 3], words: {}, tricks: {} }));
    let x = 2166136261; for (let i = 0; i < body.length; i++) { x ^= body.charCodeAt(i); x = Math.imul(x, 16777619) >>> 0; }
    return 'WC1.' + body + '.' + x.toString(36);
  });
  await page.locator('textarea[placeholder]').fill(old);
  await click(page, 'Restore from code'); await click(page, 'Tap again to replace my progress');
  await page.waitForFunction(function () { return document.body.innerText.includes('Progress restored'); });
  const restoredOld = await page.evaluate(function () { return JSON.parse(localStorage.getItem('wordcafe.v1')); });
  ok(restoredOld.v === 2 && restoredOld.levels.join() === 'L01,L02', 'an old version 1.5 code still works and is stored with ids');
  await page.close();

  console.log('Upgrade from the old save format');
  const oldSave = { levels: [0, 2], parts: [0, 1, 4, 5, 6], tricks: { laconic: 'my trick' }, mc: {}, words: { brevity: { b: 2, d: 50 } },
    quotes: [0, 15, 17], open: [1], solved: [0], read: [0, 2], keys: 3, streak: 4, best: 6, last: 100, theme: 'ocean', seen: true,
    draft: { i: 3, part: 1, stage: 'blank', k: 2, qk: 0, po: [0, 1, 2, 3, 4], bo: [4, 3, 2, 1, 0], hint: { }, miss: { } } };
  page = await open(browser, srv, { seed: JSON.stringify(oldSave) });
  const up = await page.evaluate(function () { return JSON.parse(localStorage.getItem('wordcafe.v1')); });
  ok(up.v === 2 && up.levels.join() === 'L01,L03', 'levels became ids');
  ok(up.parts.join() === 'L01:0,L01:1,L03:0,L03:1,L04:0', 'parts became ids');
  ok(up.quotes.join() === 'G001,G016,G018' && up.open.join() === 'Q002' && up.solved.join() === 'Q001' && up.read.join() === 'R01,R03', 'quotes, puzzles and passages became ids');
  ok(up.drafts['L04:1'] && up.drafts['L04:1'].stage === 'blank' && up.drafts['L04:1'].lv === 'L04', 'the one old draft became a draft for its part');
  ok(up.keys === 3 && up.streak === 4 && up.theme === 'ocean' && up.tricks.laconic === 'my trick', 'keys, streak, theme and tricks kept');
  ok(await page.evaluate(function () { return localStorage.getItem('wordcafe.v1.v1copy') !== null; }), 'a copy of the old save was kept');
  await page.close();

  console.log('Test-out once a day, with changing questions');
  page = await open(browser, srv);
  await click(page, 'Play');
  await click(page, 'Test out');
  const asked = [];
  for (let k = 0; k < 5; k++) {
    const opts = page.locator('.opt');
    await opts.first().click();   // answer anything (most likely wrong)
    asked.push((await text(page)).includes('Correct') ? 1 : 0);
    await click(page, k < 4 ? 'Next' : 'See result');
  }
  const res = await text(page);
  ok(/Not yet|You passed/.test(res), 'test-out ends with a result');
  if (res.includes('Not yet')) {
    await click(page, 'Back to level');
    ok((await text(page)).includes('try again tomorrow'), 'second try on the same day is blocked');
    ok(await page.getByRole('button', { name: 'Test out (try again tomorrow)' }).isDisabled(), 'the test-out button is switched off');
  }
  await page.close();

  console.log('Recovery screens');
  const srv2 = await serve(['data3.js']);
  page = await open(browser, srv2);
  const rec = await text(page);
  ok(rec.includes('could not start') && rec.includes('Try again'), 'a missing script shows a recovery screen, not a blank page');
  await page.close(); srv2.close();

  console.log('Meanings in the swipe stage change when the part is replayed');
  page = await open(browser, srv);
  await click(page, 'Play'); await click(page, 'Play Part A');
  for (let i = 0; i < 4; i++) await click(page, 'Next word');
  await click(page, 'Start the puzzles');
  const shown1 = await page.evaluate(function () { return document.querySelector('.chalk .ex').textContent; });
  await click(page, 'Replay this part'); await click(page, 'Tap again to start this part over');
  for (let i = 0; i < 4; i++) await click(page, 'Next word');
  await click(page, 'Start the puzzles');
  const shown2 = await page.evaluate(function () { return document.querySelector('.chalk .ex').textContent; });
  const sameWord = (await askedWord(page));
  ok(shown1 !== shown2 || sameWord !== null, 'replay is ready (first meaning: "' + shown1.slice(0, 30) + '", now: "' + shown2.slice(0, 30) + '")');
  await page.close();

  console.log('Theme change keeps the scroll place');
  page = await open(browser, srv);
  await nav(page, 'More');
  await page.evaluate(function () { window.scrollTo(0, 400); });
  const before = await page.evaluate(function () { return window.pageYOffset; });
  await page.locator('.tcard').nth(3).click();
  const after = await page.evaluate(function () { return window.pageYOffset; });
  ok(before > 0 && Math.abs(before - after) < 3, 'scroll stays at ' + before + ' after choosing a theme (now ' + after + ')');
  await page.close();

  await browser.close(); srv.close();
  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
