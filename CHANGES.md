# Word Café 1.7.0

## Portfolio and security work
New: a **"What this app stores"** privacy report in More; `tests/security.test.js` (30 checks: decompression bomb, `__proto__` keys, wrong types, stored-XSS text, damaged storage, and the Content Security Policy enforced in Chromium); `docs/THREAT_MODEL.md`; `SECURITY.md`; GitHub Actions CI and Dependabot; MIT `LICENSE`; a portfolio `README.md` with screenshots (the old build guide is now `docs/BUILD.md`).

## New in 1.7.0: word batch 8 (levels 51 to 55)
50 new words in 10 groups, 5 new levels and 5 new quant puzzles, all added at the END with new ids (L51-L55, G101-G110, Q051-Q055), so nobody's saved progress moves. New files: `data8.js`, `lab5.js`, `syn3.js`, `var2.js`. The app now has 550 words and 55 levels. All words are in 3 to 6 of Vince's lists; 10 of the 14 words found in 6 lists are included (precarious, prevaricate, prodigious, reproach, salubrious, sanction, supplant, ubiquitous, puerile, umbrage). Four common words are left out because they have more than 11 letters and do not fit the swipe wheel: commensurate, intransigent, ostentatious, predilection. Also new in `extras4.js`: 12 Sentence Equivalence questions, 10 Text Completion questions, 10 "Same word, new meaning" questions (sanction, fawn, anodyne, reproach, obscure) and 4 reading passages (R11 to R14) that use the new words. Each question appears only after its answer words are learned.

# Word Café 1.6.0: what was fixed (from LAUNCH_AUDIT.md)

## Critical
- **C1 Backup crash on Telugu, Hindi, emoji**: codes are now UTF-8 and squeezed (WC3). Old WC1/WC2 codes still work. A clear message shows if it ever fails, and there is a Copy button.
- **C2 Blank screen**: `boot.js` shows "Word Café could not start" with a Try again button if a file is missing or the app cannot start. A screen that cannot be built shows "Something went wrong" with a way back. Bad or repeated word rows are skipped.
- **C3 Launch blockers**: `appId` is `com.moditha.wordcafe`; the privacy page has your name, email and date and now lives in `docs/` (not shipped in the app). Still by hand: the Android files and TalkBack on 2 real phones.

## High
- **H1 Restore**: needs a second tap, keeps a safety copy, has "Undo last restore".
- **H2 Saved by position**: progress is saved by fixed ids (`L07`, `G013`, `Q020`, `R03`) with a version number. Old saves are upgraded once, and a copy of the old save is kept. `tests/ids.lock.json` stops ids from being changed.
- **H3 Replay**: "Study these words again" (swipe and fill-in; returns to the same word) and "Replay this part" (fresh meaning wording, new random hints; also on the part-done screen and the menu).
- **H4 Part B deleting Part A**: every unfinished part keeps its own draft. The menu lists up to 3.
- **H5 Test-out**: mixed question kinds each time, and one try per part per day (counts at the first answer).
- **H6 Scroll by status bar height**: the space is now padding inside the app, so a short page does not scroll.
- **H7 TalkBack wheel**: tiles also work with a plain click (screen reader double tap) and report if they are selected. Not tested with a real TalkBack.

## Medium
- M1 theme change keeps the scroll place. M2 update script copies safely, keeps your docs and appId, installs dependencies when needed, and fails loudly. M3 Reading passages open when their words are learned; a key and "Done" need 2 right, and you can try again. M4 meaning wording only moves when a question is really shown. M5 guards for missing level titles, quote words and part-of-speech (adverb added). M6 Copy button, text-field settings. M7 two identical meanings fixed (`cupidity`, `combative`); tests check every group. M8 see "Not done". M9 docs fixed (store text, portrait, version in one place, privacy wording). M10 `npm test`, `npm run test:ui`, pinned versions.

## Low
L1 ghost hint uses theme colour (contrast 6.0 or better in all 8 themes). L2 wheel tiles are 48px or more. L3 stats have labels. L4 dead code removed. L5 hard-coded colours use theme variables. L6 wheel numbers named. L7 scripts load with `defer`. L8 two repeated cluster names renamed. L9 search waits 150 ms. L10 sprint bar is one CSS move (small steps if reduced motion). L11 Back-button guard times out. L12 `.gitignore` extended. L13 masking also hides family forms. **L14**: 22 of the 27 words that are in none of Vince's lists were replaced with words from 3 to 5 of his lists (antipathy, inveterate, obscure, undermine, reverent, painstaking, affable, licentious, assail, contentious, invidious, vitriolic, forestall, militate, panache, accretion, replete, churlish, surly, rescind, espouse, abeyance). Full entries, Lab, synonym and meaning data were written, and 4 passage or sentence answers that used the old words were changed. The other 5 (inconstant, vigilance, incredulity, contumely, meek) stay because each is the answer of a public-domain quote. Players who had learned a replaced word lose only that word's progress.

## Not done
- **M8** (35 sentences where two choices could both fit): needs a human read of the sentences.
- **L15** (Proverbs quote): left as it is; the audit said it needs no action.
- L7 full bundling/minify: needs esbuild (not installable here). `defer` was added instead.
- `package-lock.json`: run `npm install` once and commit the file (no internet here).
- Android files, TalkBack, and 2 real phones.
