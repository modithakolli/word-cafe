// Updates this project from a newer copy of Word Café, without touching your Android project.
//
//   1. Unzip the new version anywhere (for example C:\Downloads\word-cafe-v1.6).
//   2. In THIS project folder run:   npm run update -- "C:\Downloads\word-cafe-v1.6\word-cafe"
//   3. In Android Studio press the green Run button (or run: npx cap run android)
//
// What it does, in this order:
//   - copies the game files to www.new first, and swaps them in only when the copy worked (a failed copy
//     never leaves you without a game)
//   - copies the icons (resources), the scripts, the tests and the notes (your old README and STORE_LISTING
//     are saved as .bak files)
//   - copies docs/ files only if you do not have them yet, so your filled-in privacy policy is never replaced
//   - keeps YOUR capacitor.config.json (so your appId stays) and your android folder
//   - runs `npm install` when the dependencies changed, sets the Android version, and runs `npx cap sync android`
// If anything fails it says so and stops with an error. It never prints "Updated" for something that failed.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { compute, patch } = require('./set-android-version.js');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const noSync = args.indexOf('--no-sync') >= 0;     // for testing: skip npm install and `cap sync`
const first = args.filter(function (a) { return a.indexOf('--') !== 0; })[0];
const from = first ? path.resolve(first) : '';
const problems = [];

function fail(msg) { console.error('\n' + msg + '\n'); process.exit(1); }
function problem(msg) { problems.push(msg); console.error('PROBLEM: ' + msg); }
if (!from) fail('Tell me where the new version is. Example:\n  npm run update -- "C:\\Downloads\\word-cafe-v1.6\\word-cafe"');
if (from === root) fail('That is this same folder. Give the path of the NEW unzipped copy.');
if (!fs.existsSync(path.join(from, 'www', 'index.html')) || !fs.existsSync(path.join(from, 'package.json'))) {
  fail('I could not find www/index.html and package.json in:\n  ' + from + '\nOpen the unzipped folder until you see "www" and "package.json" inside it, and give that path.');
}

function rmDir(p) { fs.rmSync(p, { recursive: true, force: true }); }
function copyDir(a, b) { fs.cpSync(a, b, { recursive: true }); }
const run = function (what, fn) { try { fn(); return true; } catch (e) { problem(what + ': ' + e.message); return false; } };

// 1. Game files: build the new folder next to the old one, then swap
const www = path.join(root, 'www'), wwwNew = path.join(root, 'www.new'), wwwOld = path.join(root, 'www.old');
rmDir(wwwNew); rmDir(wwwOld);
let swapped = false;
if (run('copy of www', function () {
  copyDir(path.join(from, 'www'), wwwNew);
  if (!fs.existsSync(path.join(wwwNew, 'index.html')) || !fs.existsSync(path.join(wwwNew, 'app.js'))) throw new Error('the copy is missing index.html or app.js');
})) {
  swapped = run('swap of www', function () {
    if (fs.existsSync(www)) fs.renameSync(www, wwwOld);
    try { fs.renameSync(wwwNew, www); }
    catch (e) { if (fs.existsSync(wwwOld)) fs.renameSync(wwwOld, www); throw e; }   // put the old game back
    rmDir(wwwOld);
  });
  if (swapped) console.log('Updated: www');
} else { rmDir(wwwNew); console.error('Your old www folder was not touched.'); }

if (!swapped) {
  console.error('\nStopped. Nothing else was changed, so your project still matches the game files it has.');
  problems.forEach(function (p) { console.error(' - ' + p); });
  process.exit(1);
}

// 2. Other project files, file by file (the running script is replaced like any other file)
['resources', 'scripts', 'tests', '.github'].forEach(function (d) {
  if (!fs.existsSync(path.join(from, d))) return;
  fs.mkdirSync(path.join(root, d), { recursive: true });
  let n = 0, bad = 0;
  fs.readdirSync(path.join(from, d)).forEach(function (f) {
    if (run(d + '/' + f, function () { fs.cpSync(path.join(from, d, f), path.join(root, d, f), { recursive: true }); })) n++; else bad++;
  });
  if (!bad) console.log('Updated: ' + d + ' (' + n + ' files)');
});
// docs: only files you do not have yet (your privacy policy has your name and email in it)
if (fs.existsSync(path.join(from, 'docs'))) {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.readdirSync(path.join(from, 'docs')).forEach(function (f) {
    const dest = path.join(root, 'docs', f);
    if (fs.existsSync(dest)) { console.log('Kept your docs/' + f + ' (new copy not used)'); return; }
    run('docs/' + f, function () { fs.cpSync(path.join(from, 'docs', f), dest, { recursive: true }); console.log('Added: docs/' + f); });
  });
}
// Files with your own details in them (license, security contact): added only if you do not have them yet
['LICENSE', 'SECURITY.md'].forEach(function (f) {
  if (!fs.existsSync(path.join(from, f)) || fs.existsSync(path.join(root, f))) return;
  run(f, function () { fs.copyFileSync(path.join(from, f), path.join(root, f)); console.log('Added: ' + f); });
});
['README.md', 'STORE_LISTING.md'].forEach(function (f) {
  if (!fs.existsSync(path.join(from, f))) return;
  run(f, function () {
    if (fs.existsSync(path.join(root, f))) fs.copyFileSync(path.join(root, f), path.join(root, f + '.bak'));
    fs.copyFileSync(path.join(from, f), path.join(root, f));
    console.log('Updated: ' + f + ' (old copy saved as ' + f + '.bak)');
  });
});

// 3. package.json: take the new version, scripts and dependencies, keep everything else you changed
let depsChanged = false, merged = null;
run('package.json', function () {
  const mine = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const theirs = JSON.parse(fs.readFileSync(path.join(from, 'package.json'), 'utf8'));
  depsChanged = JSON.stringify([mine.dependencies, mine.devDependencies]) !== JSON.stringify([theirs.dependencies, theirs.devDependencies]);
  merged = Object.assign({}, mine, { version: theirs.version, scripts: theirs.scripts, dependencies: theirs.dependencies, devDependencies: theirs.devDependencies, engines: theirs.engines || mine.engines });
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(merged, null, 2) + '\n');
  console.log('Updated: package.json (version ' + merged.version + ')');
});
console.log('Kept: capacitor.config.json and the android folder');

// 4. Version file for the app, and the Android version number
if (merged) {
  run('www/version.js', function () { spawnSync(process.execPath, [path.join(root, 'scripts', 'write-version.js')], { cwd: root, stdio: 'inherit' }); });
  const gradle = path.join(root, 'android', 'app', 'build.gradle');
  if (fs.existsSync(gradle)) {
    run('Android version', function () {
      const v = compute(merged.version);
      fs.writeFileSync(gradle, patch(fs.readFileSync(gradle, 'utf8'), v));
      console.log('Android version set: versionName ' + v.name + ', versionCode ' + v.code);
    });
  } else console.log('No android folder yet. Run: npx cap add android');
}

// 5. Install new dependencies, then sync the web files into the Android project
if (!noSync) {
  const isWin = process.platform === 'win32';
  const npx = isWin ? 'npx.cmd' : 'npx', npm = isWin ? 'npm.cmd' : 'npm';
  if (depsChanged) {
    console.log('The dependencies changed. Running npm install ...');
    const r = spawnSync(npm, ['install'], { cwd: root, stdio: 'inherit' });
    if (r.status !== 0) problem('"npm install" did not finish. Run it yourself and then run "npx cap sync android".');
  }
  if (fs.existsSync(path.join(root, 'android'))) {
    const r = spawnSync(npx, ['cap', 'sync', 'android'], { cwd: root, stdio: 'inherit' });
    if (r.status !== 0) problem('"npx cap sync android" did not finish. Run "npm install" and try again.');
  }
}

if (problems.length) {
  console.error('\nThe update finished with ' + problems.length + ' problem(s). Fix them, then run the update again:');
  problems.forEach(function (p) { console.error(' - ' + p); });
  process.exit(1);
}
console.log('\nDone. Now press the green Run button in Android Studio, or run:  npx cap run android');
