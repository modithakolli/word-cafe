// Security tests for Word Café (needs Playwright):  npm run test:security
// They attack the parts that read outside data: the backup code reader, saved storage, and the page's security policy.
// What each test proves is written in docs/THREAT_MODEL.md.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
let chromium;
try { chromium = require('playwright').chromium; } catch (e) {
  console.error('Playwright is not installed. Run:  npm i -D playwright  &&  npx playwright install chromium');
  process.exit(2);
}
const www = path.join(__dirname, '..', 'www');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
function serve() {
  return new Promise(function (resolve) {
    const srv = http.createServer(function (req, res) {
      const name = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
      if (name === '__probe.js') { // a script from the app's own origin, used to test eval from real page code
        res.setHeader('Content-Type', 'text/javascript');
        res.end("window.__probe = {}; try { eval('1+1'); window.__probe.eval = 'ran'; } catch (e) { window.__probe.eval = 'blocked'; } try { new Function('return 1'); window.__probe.fn = 'ran'; } catch (e) { window.__probe.fn = 'blocked'; }");
        return;
      }
      const file = path.join(www, name);
      if (file.indexOf(www) !== 0 || !fs.existsSync(file)) { res.statusCode = 404; res.end('not found'); return; }
      res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
      res.end(fs.readFileSync(file));
    }).listen(0, '127.0.0.1', function () { resolve(srv); });
  });
}
let passed = 0, failed = 0;
function ok(cond, msg) { if (cond) { passed++; console.log('  ok   ' + msg); } else { failed++; console.log('  FAIL ' + msg); } }

// Same checksum as the app's backup code
function checksum(str) { let x = 2166136261; for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619) >>> 0; } return x.toString(36); }
function code(kind, bytes) { const body = Buffer.from(bytes).toString('base64'); return kind + '.' + body + '.' + checksum(body); }
const wc3 = function (obj) { return code('WC3', zlib.gzipSync(Buffer.from(typeof obj === 'string' ? obj : JSON.stringify(obj)))); };

async function open(browser, srv, seed) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', function (e) { page.errors.push(String(e.message || e)); });
  if (seed) await page.addInitScript(function (s) { if (!localStorage.getItem('__seeded')) { localStorage.setItem('wordcafe.v1', s); localStorage.setItem('__seeded', '1'); } }, seed);
  await page.goto('http://127.0.0.1:' + srv.address().port + '/index.html');
  await page.waitForTimeout(250);
  return page;
}
const nav = function (page, label) { return page.locator('nav').getByRole('button', { name: label }).click(); };
const stored = function (page) { return page.evaluate(function () { return localStorage.getItem('wordcafe.v1'); }); };

// Pastes a code into Restore and taps twice. Returns what the screen said and whether the saved progress changed.
async function tryRestore(page, text) {
  await nav(page, 'More');
  const before = await stored(page);
  await page.locator('textarea[placeholder]').fill(text);
  await page.getByRole('button', { name: 'Restore from code' }).click();
  await page.waitForTimeout(400);
  const first = await page.evaluate(function () { return document.querySelector('main').innerText; });
  if (/Tap again to continue/.test(first)) {
    await page.getByRole('button', { name: 'Tap again to replace my progress' }).click();
    await page.waitForTimeout(400);
  }
  const after = await stored(page);
  const said = await page.evaluate(function () { return document.querySelector('main').innerText; });
  return { said, changed: before !== after, after };
}

(async function () {
  const srv = await serve();
  const browser = await chromium.launch();

  console.log('The security policy in index.html');
  const html = fs.readFileSync(path.join(www, 'index.html'), 'utf8');
  const csp = (html.match(/Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
  ok(/default-src 'none'/.test(csp), "default-src is 'none'");
  ok(/connect-src 'none'/.test(csp), "connect-src is 'none' (no network at all)");
  ok(/script-src 'self'(;|$)/.test(csp) && !/unsafe-inline|unsafe-eval|https?:/.test(csp), 'scripts only from the app itself: no unsafe-inline, no unsafe-eval, no web addresses');
  ok(/form-action 'none'/.test(csp) && /base-uri 'none'/.test(csp), 'forms and <base> are blocked');
  ok(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html), 'there are no inline scripts in index.html');
  ok(!/\son[a-z]+\s*=/i.test(html), 'there are no inline event handlers in index.html');

  console.log('The policy is enforced in a real browser');
  let page = await open(browser, srv);
  const blocked = await page.evaluate(async function () {
    const out = {};
    const violations = [];
    document.addEventListener('securitypolicyviolation', function (e) { violations.push(e.violatedDirective); });
    // eval is tested by a script that the page itself loads (code run from the inspector is allowed to use eval, so it would prove nothing)
    await new Promise(function (resolve) { const p = document.createElement('script'); p.src = '/__probe.js'; p.onload = resolve; p.onerror = resolve; document.body.appendChild(p); });
    out.eval = window.__probe.eval; out.fn = window.__probe.fn;
    try { await fetch('https://example.com/'); out.fetch = 'sent'; } catch (e) { out.fetch = 'blocked'; }
    window.__ran = 0;
    const s = document.createElement('script'); s.textContent = 'window.__ran = 1'; document.body.appendChild(s);
    const img = document.createElement('img'); img.src = 'https://example.com/x.png'; document.body.appendChild(img);
    await new Promise(function (r) { setTimeout(r, 300); });
    out.inline = window.__ran ? 'ran' : 'blocked';
    out.violations = violations;
    return out;
  });
  ok(blocked.eval === 'blocked' && blocked.fn === 'blocked', 'eval and new Function are blocked');
  ok(blocked.fetch === 'blocked', 'a network request is blocked');
  ok(blocked.inline === 'blocked', 'an inline script is blocked');
  ok(blocked.violations.length >= 3, 'the browser reports the violations (' + blocked.violations.join(', ') + ')');
  await page.close();

  console.log('Hostile backup codes');
  const seed = JSON.stringify({ v: 2, levels: ['L01'], keys: 7, tricks: { laconic: 'my own trick' } });
  page = await open(browser, srv, seed);
  const base = await stored(page);

  // 1. A small file that expands to a huge one (decompression bomb)
  const bomb = wc3(Buffer.alloc(80 * 1024 * 1024, 0x20).toString('latin1'));
  const t0 = Date.now();
  let r = await tryRestore(page, bomb);
  ok(!r.changed && /not valid/.test(r.said), 'a decompression bomb (' + Math.round(bomb.length / 1024) + ' KB that expands to 80 MB) is refused, progress unchanged');
  ok(Date.now() - t0 < 8000, 'and it is refused quickly (' + (Date.now() - t0) + ' ms)');

  // 2. Changed after it was made (bad checksum)
  const good = wc3({ v: 2, levels: ['L02'] });
  const parts = good.split('.');
  r = await tryRestore(page, parts[0] + '.' + parts[1] + '.zzzz');
  ok(!r.changed && /not valid/.test(r.said), 'a code with a wrong checksum is refused');

  // 3. Too large to be a real code, a newer format, and an unknown format
  r = await tryRestore(page, 'WC3.' + 'A'.repeat(250000) + '.x');
  ok(!r.changed && /not valid/.test(r.said), 'text longer than 200,000 characters is refused');
  r = await tryRestore(page, wc3({ v: 3, levels: ['L02'] }));
  ok(!r.changed && /not valid/.test(r.said), 'a code from a newer app version (v: 3) is refused instead of misread');
  r = await tryRestore(page, code('WC9', Buffer.from('{}')));
  ok(!r.changed && /not valid/.test(r.said), 'an unknown code type is refused');
  r = await tryRestore(page, 'not a code at all');
  ok(!r.changed && /not valid/.test(r.said), 'random text is refused');

  // 4. Prototype pollution and strange keys
  const pollute = '{"v":2,"levels":["L01"],"tricks":{"__proto__":{"polluted":"yes"},"constructor":"x","laconic":"ok"},"mc":{"__proto__":1,"toString":5},"words":{"__proto__":{"b":1,"d":1},"constructor":{"b":1,"d":1}},"drafts":{"__proto__":{"lv":"L01"},"L01:0":{"__proto__":{"polluted":"yes"},"lv":"L01","part":0,"stage":"learn","k":0,"po":[0,1,2,3,4],"bo":[0,1,2,3,4]}},"tests":{"__proto__":5,"L01:0":5},"theme":"__proto__"}';
  r = await tryRestore(page, wc3(pollute));
  const clean = await page.evaluate(function () { return ({}).polluted === undefined && Object.prototype.polluted === undefined && typeof ({}).toString === 'function'; });
  ok(clean, 'strange keys like __proto__ and constructor do not change Object.prototype');
  ok(page.errors.length === 0, 'and the app did not crash: ' + page.errors.join(' | '));
  const kept = JSON.parse(r.after);
  ok(kept.tricks && kept.tricks.laconic === 'ok' && Object.keys(kept.tricks).length === 1, 'only real words are kept from the code (' + Object.keys(kept.tricks || {}).join(',') + ')');
  ok(kept.theme === 'dark', 'an invalid theme falls back to the default');

  // 5. Wrong types everywhere
  r = await tryRestore(page, wc3({ v: 2, levels: 'abc', parts: { a: 1 }, tricks: [1, 2], mc: 'x', words: [], quotes: 5, open: null, solved: [{}], read: ['R01', 7, null], keys: '9', streak: -4, best: 1e99, last: 'now', theme: {}, drafts: 'no', tests: [] }));
  const s5 = JSON.parse(r.after);
  ok(page.errors.length === 0 && s5.v === 2 && s5.keys === 0 && s5.streak === 0 && s5.levels.length === 0 && s5.read.join() === 'R01', 'values of the wrong type are replaced by safe defaults, and only valid ids are kept');

  // 6. Out-of-range numbers and long text
  const huge = 'x'.repeat(5000);
  r = await tryRestore(page, wc3({ v: 2, tricks: { laconic: huge }, keys: 100, streak: 10000, mc: { laconic: 999 }, words: { laconic: { b: 9, d: -1 } } }));
  const s6 = JSON.parse(r.after);
  ok(s6.tricks.laconic.length === 120 && s6.keys === 0 && s6.streak === 0 && !s6.mc.laconic && !s6.words.laconic, 'long text is cut to 120 characters, and out-of-range numbers are dropped');
  ok(page.errors.length === 0, 'no errors were thrown by any hostile code: ' + page.errors.join(' | '));
  await page.close();

  console.log('Hostile text is never run as code');
  const xss = '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>';
  const first = await (async function () { const p = await open(browser, srv); const w = await p.evaluate(function () { return WORD_CAFE.groups[0].words[0].w; }); await p.close(); return w; })();
  const tricks = {}; tricks[first] = xss;
  page = await open(browser, srv, JSON.stringify({ v: 2, tricks: tricks, seen: true }));
  await page.getByRole('button', { name: /Play/ }).first().click();
  await page.getByRole('button', { name: /Play Part A/ }).click();
  await page.waitForTimeout(300);
  const dom = await page.evaluate(function () { return { xss: window.__xss, imgs: document.querySelectorAll('img[src="x"]').length, scripts: document.querySelectorAll('main script').length, text: document.querySelector('main').innerText }; });
  ok(dom.xss === undefined && dom.imgs === 0 && dom.scripts === 0, 'a memory trick that contains <img onerror> and <script> is not run and creates no elements');
  ok(dom.text.indexOf('<img') >= 0, 'it is shown as plain text instead');
  await page.close();

  console.log('Damaged or tampered saved data');
  const garbage = ['{not json', '[]', 'null', '"text"', JSON.stringify({ v: 2, levels: new Array(5000).fill('L01') }), '{"v":2,"__proto__":{"polluted":1},"levels":["L01"]}', JSON.stringify({ v: 99 })];
  let allStarted = true, note = '';
  for (const g of garbage) {
    const p = await open(browser, srv, g);
    const hasMenu = await p.evaluate(function () { return document.body.innerText.indexOf('Word Café') >= 0 && document.querySelectorAll('nav button').length === 6; });
    const polluted = await p.evaluate(function () { return ({}).polluted !== undefined; });
    if (!hasMenu || polluted || p.errors.length) { allStarted = false; note += ' [' + g.slice(0, 20) + ']'; }
    await p.close();
  }
  ok(allStarted, 'the app starts normally with ' + garbage.length + ' kinds of damaged saved data' + note);
  page = await open(browser, srv, '{not json');
  ok(await page.evaluate(function () { return localStorage.getItem('wordcafe.v1.bad') === '{not json'; }), 'damaged data is kept as a copy, not silently thrown away');
  await page.close();

  console.log('The privacy report');
  page = await open(browser, srv, JSON.stringify({ v: 2, levels: ['L01'], seen: true }));
  await nav(page, 'More');
  const rep = await page.evaluate(function () { return document.querySelector('#privacy-report').innerText; });
  ok(/Your progress: [\d.]+ (bytes|KB)/.test(rep) && /blocks every connection/.test(rep), 'the More screen lists what is stored and how big it is');
  await page.evaluate(function () { localStorage.setItem('wordcafe.v1.prev', '{}'); });
  await nav(page, 'Menu'); await nav(page, 'More');
  await page.getByRole('button', { name: 'Delete the safety copies only' }).click();
  await page.waitForTimeout(200);
  ok(await page.evaluate(function () { return localStorage.getItem('wordcafe.v1.prev') === null && localStorage.getItem('wordcafe.v1') !== null; }), 'safety copies can be deleted without touching progress');
  await page.close();

  await browser.close(); srv.close();
  console.log('\n' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
