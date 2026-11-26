# Threat model

Word Café is an offline Android app (a web app inside a Capacitor shell). It has no server and no account. This page lists what could go wrong, what the app does about it, and which test proves it. If a row has no test, it says so.

## What we protect
| Asset | Where it lives | Why it matters |
|---|---|---|
| Player progress (levels, words, streak, quotes) | `localStorage`, key `wordcafe.v1` | Weeks of effort. Losing it is the worst normal outcome. |
| Memory tricks the player types | same place | Can contain personal notes. |
| The page's code | the app bundle | If someone could run their own code in the page, they could read the two assets above. |

## Where outside data comes in (trust boundaries)
1. **Backup code text** that the player pastes. It may come from anywhere, so treat it as hostile.
2. **Saved storage** read at start-up. It can be damaged, edited, or written by an older or newer version of the app.
3. **Bundled data files** (`www/data*.js` and others). Written by the developer, but mistakes happen.
4. **The build chain** (npm packages, GitHub Actions).

## Threats and what is done about them
| # | Threat | What happens without a defence | Defence | Proof |
|---|---|---|---|---|
| T1 | A small backup code that expands to a huge file (decompression bomb) | The phone freezes or runs out of memory | Text longer than 200,000 characters is refused. Unzipping stops at 2 MB. | `security.test.js`: an 80 MB bomb in a 106 KB code is refused in under a second |
| T2 | A backup code that was mistyped or cut short | Wrong progress is loaded | A checksum is checked first. It catches accidents. **It is not a signature**: anyone can compute it, so it does not stop an attacker. That is why T3 to T5 exist. | `security.test.js`: wrong checksum refused |
| T3 | Keys like `__proto__` or `constructor` in the code (prototype pollution) | Every object in the app changes behaviour | Data is never copied key by key from the code. Each field is rebuilt from a list of allowed names (known words, known ids). Id lookup tables have no prototype. | `security.test.js`: `Object.prototype` is unchanged after a hostile code |
| T4 | Wrong types, huge numbers or very long text | Crash, or unlimited growth of storage | Every field is checked for type and range. Tricks are cut to 120 characters. Bad values become safe defaults. | `security.test.js`: wrong types, out-of-range numbers, long text |
| T5 | A memory trick such as `<img onerror=...>` (stored XSS) | Script runs and reads everything | The app builds every screen with `textContent`. It never uses `innerHTML`, `eval` or `document.write` (checked by `npm test`). | `security.test.js`: the text is shown as text, nothing runs |
| T6 | Any script injection or data leaving the phone | Data is stolen or code is changed | A strict Content Security Policy: `default-src 'none'`, `script-src 'self'`, `connect-src 'none'`, no inline scripts, no `unsafe-eval`, forms and `<base>` blocked. | `security.test.js`: eval, `new Function`, `fetch`, inline scripts and remote images are all blocked in Chromium |
| T7 | Damaged storage (bad JSON, wrong shape, newer format) | A blank screen or a crash loop | The saved data is validated on every start. If it is unreadable, a copy is kept in `wordcafe.v1.bad` and the app starts fresh. A start-up guard (`boot.js`) shows a recovery screen if a file is missing. | `security.test.js`: 7 kinds of damaged data; `ui.test.js`: a missing script shows the recovery screen |
| T8 | The player loses progress by mistake (restore, erase, update) | Progress is lost | Restore and erase need a second tap. A safety copy is kept before a restore, and "Undo last restore" puts it back. Erase also removes the safety copies (the player is told). | `ui.test.js`: restore, undo and erase flows |
| T9 | New content is inserted or reordered, so saved progress points at the wrong items | Everyone's progress shifts | Progress is saved by fixed ids (`L07`, `G013`, `Q020`, `R03`) with a format version. Old saves are upgraded once. | `validate-data.js` (ids lock) and `ui.test.js` (upgrade test) |
| T10 | A bad data row crashes a screen | Blank screen | Rows that are broken or repeated are skipped. A screen that cannot be built shows "Something went wrong" with a way back. | `validate-data.js` checks all data in CI |
| T11 | A bad or hijacked npm package | Malicious code in the build | The web code has **no runtime dependencies** (plain JavaScript). Capacitor versions are pinned. CI runs `npm audit`, and Dependabot opens update pull requests. | CI (`.github/workflows/ci.yml`). Needs `package-lock.json` to be committed. |
| T12 | Android settings that leak data (backup to cloud, cleartext traffic) | Data leaves the phone | The build guide says to set `android:allowBackup="false"`. | **No test.** It is a manual step in `docs/BUILD.md` because the `android/` folder is generated on the developer's machine. |

## What is not protected (accepted risks)
- **Anyone who can unlock the phone and read the app's storage can read the progress.** It is not encrypted. The data is low-risk (study progress and short notes), and Android keeps it private to the app. Players should not type secrets into memory tricks.
- **A valid but fake backup code can give a player fake progress.** The player owns the data and nothing is shared, so there is no leaderboard to cheat.
- The checksum does not prove who made a code (see T2).
- A rooted phone or a modified app is out of scope.

## Privacy by design
- No account, no ads, no analytics, no network use. The privacy policy is `docs/privacy.html`.
- The More screen has a live **"What this app stores"** report (what is kept and how big it is) and a button to delete the safety copies.
- Data minimisation: nothing is collected, so there is nothing to delete on a server.

## How to run the proofs
```
npm test             # data, ids, meanings, version, no unsafe code patterns
npm run test:ui      # real browser: replay buttons, backup, restore, upgrade, test-out
npm run test:security # real browser: hostile codes, damaged data, security policy
```
