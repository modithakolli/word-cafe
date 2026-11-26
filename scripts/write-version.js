// Writes www/version.js from the version in package.json, so the About text and the Play version
// always agree. Runs automatically before `npm run sync` and `npm run set-version`.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) throw new Error('package.json version must look like 1.2.0, got: ' + pkg.version);
const text = '/* Written by scripts/write-version.js from package.json. Do not edit by hand. */\n' +
  'window.WORD_CAFE_VERSION = ' + JSON.stringify(pkg.version) + ';\n';
fs.writeFileSync(path.join(root, 'www', 'version.js'), text);
console.log('www/version.js written: ' + pkg.version);
