// Copies the version from package.json into the Android project, so the Play Store and the
// About screen agree. Run after `npx cap add android`, and again before every release:
//   npm run set-version
// versionName is the version text (for example 1.2.0). versionCode is a whole number that must
// go up with every upload to Google Play. It is built as major*10000 + minor*100 + patch.
const fs = require('fs');
const path = require('path');

function compute(version) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!m) throw new Error('package.json version must look like 1.2.0, got: ' + version);
  const [maj, min, pat] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (min > 99 || pat > 99) throw new Error('minor and patch must be 99 or less');
  return { name: version, code: maj * 10000 + min * 100 + pat };
}

function patch(gradleText, v) {
  let hits = 0;
  const out = gradleText
    .replace(/versionCode(\s*=?\s*)\d+/, function (_, sp) { hits++; return 'versionCode' + sp + v.code; })
    .replace(/versionName(\s*=?\s*)["'][^"']*["']/, function (_, sp) { hits++; return 'versionName' + sp + '"' + v.name + '"'; });
  if (hits !== 2) throw new Error('Could not find versionCode and versionName in build.gradle');
  return out;
}

module.exports = { compute, patch };

if (require.main === module) {
  const root = path.join(__dirname, '..');
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const file = path.join(root, 'android', 'app', 'build.gradle');
  if (!fs.existsSync(file)) {
    console.error('android/app/build.gradle not found. Run `npx cap add android` first.');
    process.exit(1);
  }
  const v = compute(pkg.version);
  fs.writeFileSync(file, patch(fs.readFileSync(file, 'utf8'), v));
  console.log('Android version set: versionName ' + v.name + ', versionCode ' + v.code);
}
