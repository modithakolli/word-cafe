# Play Store listing notes for Word Café

## Title (30 characters max)
Word Café: GRE Vocabulary

## Short description (80 characters max)
Swipe letters, learn GRE words with memory tricks. Offline. No ads, no account.

## Full description
Word Café is a cozy, retro-style vocabulary game for students preparing for the GRE and other exams.

How it works
- Every level has two parts of 5 words, each with a root-word or everyday memory trick. Write your own tricks too. Already know a part? Test out of it.
- Swipe the letters on the wheel to spell each word from its meaning.
- Pick the word that fits tricky sentences where several options look close. After each answer you see exactly why it is right.
- Unlock famous quotes and earn keys that open GRE-style quant puzzles.

What you get
- 550 GRE words in 55 levels, with word families, tone and word forms in the Word Lab.
- Daily review that brings back the words you miss after 1, 3, 7 and 14 days.
- 8 colour themes with wallpapers. Random hints in the swipe puzzle: tone, synonyms, root, a GRE clue and more. Every meaning comes back in a fresh wording.
- Synonym and antonym rounds, same-word-different-meaning questions, GRE-style Sentence Equivalence and Text Completion, confusables, reading passages and a 10-word timed sprint.

Private by design
- No account. No ads. No tracking. No internet needed.
- Your progress stays on your phone. You can make a backup code yourself.

Word Café is an independent study game. It is not affiliated with or endorsed by ETS. GRE is a registered trademark of ETS.

## Data safety form (Play Console)
- Does your app collect or share any of the required user data types? **No.**
- Is all of the user data collected by your app encrypted in transit? Not applicable (no data leaves the device).
- Do you provide a way for users to request that their data is deleted? Not applicable (no data is collected). Users can erase local progress in More > Erase.
- This stays true as long as you add no plugins or SDKs that collect data (see README).

## Other forms
- Privacy policy URL: host `docs/privacy.html` (it is filled in; check the details and the date).
- Content rating: no violence, no user-generated content, no purchases. Expect an "Everyone" rating.
- Target audience: 13 and older (or 18+). Do not select children, to avoid the Families policy.
- App category: Education.
- Ads: No ads.
- App access: all functionality is available without a login.
- Advertising ID: the app does not use it.
- Contact email: required on the store listing.

## Graphics
- App icon 512 x 512: export from `resources/icon.png`.
- Feature graphic 1024 x 500: `resources/feature-graphic-1024x500.png`.
- Phone screenshots (at least 2): take them from the app on a phone. Good ones: Menu, swipe puzzle, fill-in with the explanation, Lab, quote shelf.

## Before you publish
1. Check the developer name, email and date in `docs/privacy.html`, and host it.
2. Check `appId` in `capacitor.config.json` (you cannot change it after the first upload).
   Then set the version with `npm run set-version` (see README).
3. Test on 2 real phones (one with TalkBack): resume a level, replay a part, make and restore a backup code, switch theme. The app is portrait only.
4. New personal Play accounts (created after 13 Nov 2023) must run a closed test with at least 12 testers, opted in for 14 days in a row, before applying for production. Start this first. An organization account is exempt. Check the current rules in Play Console.
