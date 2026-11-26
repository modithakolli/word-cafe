# Word Café: build and release guide

A cozy retro GRE vocabulary game. Swipe letters to spell words from their meanings, unlock
famous quotes, and open quant puzzles. Works offline. No account, no ads, no tracking.

Contents: 550 words in 55 levels (each level has Part A and Part B of 5 words, with "Study these words again" and "Replay this part" buttons), 24 public-domain quotes, 50 quant puzzles, 20 look-alike (confusable) questions, 10 reading passages, 26 Sentence Equivalence questions, 19 Text Completion questions (2 and 3 blanks), 45 same-word-different-meaning questions, synonyms and antonyms for every word, a Word Lab (tone, part of speech, word forms), a word of the day, a 10-word sprint, your own memory tricks, test-out for each part, and 8 themes with wallpapers, random hints in the swipe puzzle (tone, synonyms, root, GRE clue and more), and a fresh wording of every meaning each time a word comes back.

## 1. Try it on your computer
Open `www/index.html` in Chrome. 

## 2. Add more words
Words live in `www/data.js` to `data8.js`. **Every level, group, quant puzzle and reading passage has a fixed `id`** (like `L07`, `G013`, `Q020`, `R03`). Saved progress uses these ids, so ids must never change or be reordered. Only add new items at the END with new ids, then run `node tests/validate-data.js --update-lock`. Levels 1-15 pair data.js with data2.js, levels 16-30 pair data3.js with data4.js, levels 31-45 pair data5.js with data6.js, levels 46-50 are all in data7.js and levels 51-55 are all in data8.js (group j pairs with group 5+j; add a block in BLOCKS in app.js for each new batch). Words can have at most 11 letters (the wheel). Each new batch also needs `labN.js`, `synN.js` and `varN.js` files and script tags in index.html. Each new batch also needs entries in a `lab` file and a `syn` file. Word Lab info is in `www/lab.js`, `lab2.js` and `lab3.js`. Confusables and the first 6 reading passages are in `www/extras.js`. `www/extras2.js` holds Sentence Equivalence, Text Completion, same-word-different-meaning questions and 4 more passages. `www/extras3.js` adds more of the same questions for the words in levels 46-50. `www/syn.js` and `syn2.js` hold synonyms and antonyms (one line per word). `www/var.js` holds two reworded meanings and one GRE-context note for every word. Themes are in `www/style.css` under `[data-theme="name"]`; the list of names is `THEMES` in `www/app.js`. Copy a group block and change the text. Each group needs 5 words (each with a memory trick, a tricky fill-in sentence, 3 close wrong options and a reason),
one quote and a `cluster`. The rules are written at the top of the file. Quotes must be
public domain (old works), and the quote answer must be one of the 5 words in the group.

## 3. Build the Android app
You need: Node.js 22 or newer (Capacitor 8 requires it) and Android Studio.

```
npm install
npx cap add android
npx cap sync android
npx cap open android
```

`capacitor.config.json` has `appId` set to `com.moditha.wordcafe`. Change it now if you want another one. You cannot change it after you publish, and never change `server.androidScheme` either: both change where the saved progress lives, so every player would lose it.

### Security settings (do these in Android Studio)
1. `android/app/src/main/AndroidManifest.xml`
   - Delete the line `<uses-permission android:name="android.permission.INTERNET" />`
     (the game never needs the internet). Run the app on a phone to confirm it still loads.
     If it does not load, put the line back; the app's content policy still blocks all network calls.
   - In the `<application ...>` tag add: `android:allowBackup="false"`
     (this keeps progress off Google backups, but a new phone then starts empty unless the player
     made a backup code. Use `true` if you prefer easy phone changes over this extra privacy.)
   - In the `<activity ...>` tag add: `android:screenOrientation="portrait"`. The swipe wheel needs a
     tall screen. Android 16 ignores this on tablets and foldables, where there is room anyway.
     (So the app is portrait only. There is no rotated screen to test on phones.)
2. Do not add any plugins. Fewer parts means fewer things that can break.
3. Keep `www/index.html` Content-Security-Policy as it is.
4. Keep `capacitor.config.json` as it is. Its `SystemBars` setting gives the app the real size of the
   status bar and gesture bar (Android 16 draws apps behind them). The CSS already uses it.

### Set the version number
Play needs a bigger `versionCode` for every upload. Change `version` in `package.json`, then run:

```
npm run set-version
```

It writes `versionName` and `versionCode` into `android/app/build.gradle` (1.6.0 becomes code 10600), and writes `www/version.js`, which the About screen reads. So the version only lives in `package.json`.
Run it again before every release. `npm run sync` also writes `www/version.js`.

### Icon and splash screen
Ready-made art is in `resources/`. After `npx cap add android`, run `npx @capacitor/assets generate --android` to create all the icon and splash sizes. See also `STORE_LISTING.md` for store text and the Data safety answers.

### Make the release file
Build > Generate Signed Bundle / APK > Android App Bundle (.aab).
Create a keystore and **back it up in two places**. Never put it on GitHub (`.gitignore` already blocks it).
Use "Play App Signing" when Google asks.

## 4. Google Play steps
1. Create a Play Console developer account (one-time fee, about $25).
2. Host `docs/privacy.html` somewhere public (GitHub Pages is free). It is filled in with the developer name, email and date. Check them, and change the date when you change the policy. Use its link as your Privacy Policy URL. (It is not inside `www/`, so it is not shipped in the app.)
3. Create the app, upload the .aab, and fill in the store listing: 512x512 icon, a
   1024x500 feature image, and at least 2 phone screenshots.
4. Data safety form: answer that the app **collects no data** and **shares no data**.
   This stays true as long as you add no plugins or SDKs that collect data.
5. Content rating questionnaire: no violence, no purchases, no user content.
   Also fill in the other "App content" items: **App access** (all features work without a login),
   **Ads** (no ads) and **Advertising ID** (the app does not use it). Add a contact email.
6. Target audience: choose adults or 13 and older, not children. This avoids the stricter Families rules.
7. New personal developer accounts (created after 13 Nov 2023) must run a closed test with at least
   12 testers, opted in for 14 days in a row, before they can apply for production. Start this early.
   Organization accounts are exempt. Check the current rules in Play Console.
8. New apps must target Android 16 (API level 36). Capacitor 8 (pinned in package.json) does this by default;
   after `npx cap add android`, confirm `targetSdkVersion = 36` in `android/variables.gradle`.

## 5. Tests
```
npm test          # checks all the data and that saved-progress ids never change (no install needed beyond Node)
npm run test:ui   # drives the real app in Chromium. First: npm i -D playwright && npx playwright install chromium
```
Run `npm install` once and commit the `package-lock.json` file it creates, so every build uses the same versions. The Capacitor versions in `package.json` are pinned for the same reason.

Still to do by hand (cannot be tested from this folder): the `android/` files, TalkBack on the swipe wheel, system-bar icon colours, and the Play pre-launch report. Test on 2 real phones, one with TalkBack.

## 6. What "secure" means here
- No server, no login, no data sent anywhere, so there is nothing online to hack or leak.
- Strict Content-Security-Policy: only the app's own files can run. No inline code, no network.
- The code never builds HTML from text (no `innerHTML`), so pasted text cannot run as code.
- Saved progress and backup codes are checked before use. Wrong or edited data is rejected.
- Honest limits: no app is 100% unbreakable. Someone with a rooted phone can edit their own
  progress. That only affects their own game. A backup code has a checksum to catch copy
  mistakes, but it is not a lock.

## Updating the app on your phone later
After the first build you do not need to repeat the setup. When you get a new zip:
1. Unzip it anywhere.
2. In your project folder run: `npm run update -- "C:\path\to\unzipped\word-cafe"`
   (it keeps your `appId`, your `android` folder and your `docs/privacy.html`, copies the new game files safely, sets the version number, runs `npm install` if the dependencies changed, and runs `cap sync`. If anything fails it says so.)
3. Press the green Run button in Android Studio, or run `npx cap run android`.

The very first time (if your project does not have `scripts/update-from-folder.js` yet), copy the new `www` folder, the new `scripts` folder and the new `package.json` into your project by hand, then run `npx cap sync android` and press Run. Do not copy over `capacitor.config.json` or `android`.
